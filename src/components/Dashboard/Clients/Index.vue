<template>
    <main>
        <div class="my-container px-0 mx-0">
            <div class="d-flex justify-content-md-end justify-content-center mb-3">
                <div class="currency d-flex align-items-center">
                    <div class="currency__price mr-3">1USD = 95500 UZS</div>
                    <div class="currency__changing">+0,3020</div>
                </div>
            </div>

            <form action="" class="my-form">
                <div class="mb-3 searching">
                    <input class="my-form__input" type="text" v-model="search" @input="SearchInput" :placeholder="$t('clients.search')">
                    <button><i class="far fa-search"></i></button>
                </div>
            </form>

            <div class="table-responsive">
                <table class="table table-borderless my-table my-table-third">
                    <thead>
                    <tr>
                        <th class="text-center"><i class="fas fa-sort"></i> {{ $t('clients.number') }}</th>
                        <th>{{ $t('clients.fio') }}</th>
                        <th>{{ $t('clients.phone') }}</th>
                        <th>{{ $t('clients.amount') }}</th>
                        <th>{{ $t('clients.apartment') }}</th>
                        <th>{{ $t('clients.date') }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>

                        <tr v-if="getLoading">
                            <td colspan="7" style="">
                                <div class="d-flex justify-content-center w-100">
                                    <div class="lds-ellipsis">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="getClients.length === 0 && !getLoading">
                            <td colspan="7">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>

                        <tr v-for="(client, index) in getClients" :key="index" :class="[client.status === 'booking' ? 'table-warning' : '', client.status === 'cancelled' ? 'table-danger' : '']">
                            <td class="text-center">
                                {{ client.contract_number }}
                            </td>
                            <td>
                                {{ client.first_name }} {{ client.last_name }} {{ client.second_name }}
                            </td>
                            <td>
                                +{{ client.phone }}
                            </td>
                            <td>
                                <span v-if="client.price_apartment">
                                    {{ client.price_apartment | number('0,0', { thousandsSeparator: ' ' }) }} {{ $t('ye') }}
                                </span>
                            </td>

                            <td>
                                <span v-if="client.apartment_id">
                                    {{ client.apartment.number }}
                                </span>
                            </td>
                            <td>
                                <small v-if="client.status == 'cancelled'">{{ client.status | getStatus('', '')  }}</small>
                                <small v-else>{{ client.status | getStatus($moment(client.buyed_date).format('DD.MM.YYYY'), $moment(client.apartment.booking_date).format('DD.MM.YYYY'))  }}</small>
                            </td>
                            <td>
                                <div class="dropdown my-dropdown dropleft">
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>
                                    <div class="dropdown-menu">

                                        <b-link v-if="client.status === 'booking' && client.manager_id === getMe.id || getMe.role.id === 1 && client.status === 'booking'" @click="ReserveInfo(client)" v-b-modal.modal-view-client class="dropdown-item dropdown-item--inside" >
                                            <i class="far fa-eye"></i> {{ $t('apartments.list.view_client') }}
                                        </b-link>

                                        <router-link :to="{ name: 'apartments-view', params: { id: client.apartment.id }  }" :class="'dropdown-item dropdown-item--inside'" v-if="client.status == 'booking'">
                                            <i class="far fa-ballot-check"></i> {{ $t('apartments.list.confirm') }}
                                        </router-link>

                                        <a class="dropdown-item dropdown-item--inside" href="product-item.html" v-if="client.status === 'buy'">
                                            <i class="far fa-eye"></i> {{ $t('apartments.list.more') }}
                                        </a>

                                        <a class="dropdown-item dropdown-item--inside" href="product-item.html" v-if="client.status === 'buy'">
                                            <i class="fas fa-download"></i> {{ $t('apartments.list.download_contract') }}
                                        </a>

                                        <b-button class="dropdown-item dropdown-item--inside" @click="CancelContract(client.id)" v-if="client.status === 'buy' && getPermission.clients.cancel_contract || client.status === 'buy' && getMe.role.id === 1">
                                            <i class="fas fa-eraser"></i> {{ $t('apartments.list.cancel_contract') }}
                                        </b-button>

    <!--                                    <a class="dropdown-item dropdown-item&#45;&#45;inside" href="javascript:void(0)"-->
    <!--                                       data-target="#client_edit" data-toggle="modal"><i class="fas fa-pen"></i>-->
    <!--                                        Редактировать-->
    <!--                                    </a>-->

                                        <b-button v-if="getPermission.clients.delete" class="dropdown-item dropdown-item--inside" @click="DeleteClient(client.id)"><i
                                                class="far fa-trash"></i> {{ $t('delete') }}
                                        </b-button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <paginate
                        :pageCount="getClientsPaginate.pageCount"
                        :clickHandler="PageCallBack"
                        :prevText="'Prev'"
                        :nextText="'Next'"
                        :container-class="'pagination'"
                        :page-class="'page-item'"
                        :page-link-class="'page-link'"
                        :next-class="'page-item'"
                        :prev-class="'page-item'"
                        :prev-link-class="'page-link'"
                        :next-link-class="'page-link'">
                </paginate>
            </div>
        </div>

        <view-client v-if="info_reserve" @CancelReserve="CloseReserveInfo" :apartment-data="apartment_preview"  :client-id="client_id"></view-client>

    </main>
</template>

<script>
    import { mapActions, mapGetters} from 'vuex';
    import ViewClient from '../Objects/Manager/ViewClient';

    export default {
        components: {
            'view-client': ViewClient
        },

        data: () => ({
            info_reserve: false,
            apartment_preview: {},
            client_id: 0,

            page: 1,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            },

            search: ''
        }),

        computed: mapGetters(['getClients', 'getMe', 'getPermission', 'getClientsPaginate', 'getLoading']),

        mounted() {
            this.fetchClients(this);
        },

        methods: {
            ...mapActions(['fetchClients', 'fetchReserveClient', 'fetchClientsSearch']),

            ReserveInfo(client) {
                this.info_reserve = true;
                this.apartment_preview = {
                    id: client.apartment_id,
                    booking_date: client.apartment.booking_date
                };
                this.client_id = client.id;

                this.fetchReserveClient(this);
                // this.$bvModal.show('modal-view-client');
            },

            PageCallBack(pageNum) {
                this.page = pageNum;

                if (this.search.length > 0) {
                    this.fetchClientsSearch(this);
                } else {
                    this.fetchClients(this);
                }
            },

            CancelContract(client_id) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text_cancel_contract'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes_cancel_contract')
                }).then((result) => {
                    if (result.value) {
                        this.axios.post(process.env.VUE_APP_URL + '/api/clients/terminate/' + client_id, {}, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');

                            if (this.search.length > 0) {
                                this.fetchClientsSearch(this);
                            } else {
                                this.fetchClients(this);
                            }

                            this.$swal(
                                this.$t('sweetAlert.canceled_contract'),
                                '',
                                'success'
                            );

                        }).catch((error) => {
                            if (! error.response) {
                                this.toasted('Error: Network Error', 'error');
                            } else {
                                if (error.response.status === 403) {
                                    this.toasted(error.response.data.message, 'error');
                                } else if (error.response.status === 401) {
                                    this.toasted(error.response.data.message, 'error');
                                } else if (error.response.status === 500) {
                                    this.toasted(error.response.data.message, 'error');
                                }  else {
                                    this.error = true;
                                    this.errors = error.response.data.errors;
                                }
                            }
                        });
                    }
                });
            },

            DeleteClient(client) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.get(process.env.VUE_APP_URL + '/api/clients/destroy/' + client, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');

                            if (this.search.length > 0) {
                                this.fetchClientsSearch(this);
                            } else {
                                this.fetchClients(this);
                            }

                            this.$swal(
                                this.$t('sweetAlert.deleted'),
                                '',
                                'success'
                            );

                        }).catch((error) => {
                            if (! error.response) {
                                this.toasted('Error: Network Error', 'error');
                            } else {
                                if (error.response.status === 403) {
                                    this.toasted(error.response.data.message, 'error');
                                } else if (error.response.status === 401) {
                                    this.toasted(error.response.data.message, 'error');
                                } else if (error.response.status === 500) {
                                    this.toasted(error.response.data.message, 'error');
                                }  else {
                                    this.error = true;
                                    this.errors = error.response.data.errors;
                                }
                            }
                        });
                    }
                });
            },


            CloseReserveInfo() {
                this.info_reserve = false;
                this.apartment_preview = {};
                this.fetchClients(this);
            },


            SearchInput(event) {
                this.page = 1;
                this.search = event.target.value;
                this.fetchClientsSearch(this);
            }
        },

        filters: {
            getStatus (status, buy, book) {
                let msg;
                switch (status) {
                    case 'buy':
                        msg = 'Покупал ' + buy;
                        break;
                    case 'booking':
                        msg = 'Забронировал до ' + book;
                        break;
                    default:
                        msg = 'отказался купить или другое';
                        break;
                }

                return msg;
            },


        }
    }
</script>

<style scoped>

</style>
