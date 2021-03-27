<template>
    <main>
        <div class="my-container px-0 mx-0">
            <div class="d-flex justify-content-md-end justify-content-center mb-3">
                <div class="currency d-flex align-items-center">
                    <div class="currency__price mr-3">1 USD = {{ getCurrency.usd }} UZS</div>
                </div>
            </div>

            <form action="" class="my-form">
                <div class="mb-3 searching">
                    <input class="my-form__input" type="text" v-model="search" @input="SearchInput" :placeholder="$t('clients.search')">
                    <button><i class="far fa-search"></i></button>
                </div>
            </form>

            <div class="col-md-2 float-right">
                <div class="row">
                    <select class="form-control" v-model="orderBy" aria-label="Default select example">
                        <option selected value="all">Все</option>
                        <option value="sold">Проданные</option>
                        <option value="contract">Неоплаченные</option>
                        <option value="booked">Забронированные</option>
                    </select>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-borderless my-table my-table-third">
                    <thead>
                    <tr>
                        <th class="text-center"><i class="fas fa-sort"></i> {{ $t('clients.number') }}</th>
                        <th>{{ $t('clients.fio') }}</th>
                        <th>{{ $t('clients.phone') }}</th>
                        <th>{{ $t('clients.amount') }}</th>
                        <th>{{ $t('clients.apartment') }}</th>
                        <th>{{ $t('apartments.list.status') }}</th>
                        <th>{{ $t('clients.date') }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr v-if="getLoading">
                        <td colspan="8" style="">
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

                    <tr v-if="getContracts.length === 0 && !getLoading">
                        <td colspan="8">
                            <center>
                                {{ $t('no_data') }}
                            </center>
                        </td>
                    </tr>

                        <tr v-for="(contract, index) in getContracts" :key="index" :class="[contract.status === 'booked' || contract.status === 'contract'  ? 'table-warning' : '', contract.status === 'sold' ? 'table-danger' : '']">
                            <td class="text-center">
                                {{ contract.contract }}
                            </td>
                            <td>
                                {{ contract.client.first_name }} {{ contract.client.last_name }} {{ contract.client.second_name }}
                            </td>
                            <td>
                                +{{ contract.client.phone }}
                            </td>

                            <td>
                                {{ contract.status === 'booked' ? contract.apartment.price : contract.transaction_price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                            </td>

                            <td>
                                {{ contract.apartment.object.name }} - {{ contract.apartment.building.name }} - {{ contract.apartment.number }}
                            </td>

                            <td>
                                {{ contract.status | getStatusOrder }}
                            </td>
                            <td>

                                <small v-if="contract.status === 'cancelled'">{{ contract.status | getStatus('', '')  }}</small>
                                <small v-else>{{ contract.status | getStatus($moment(contract.contract_date).format('DD.MM.YYYY'), $moment(contract.booking_date).format('DD.MM.YYYY'))  }}</small>
                            </td>
                            <td>
                                <div class="dropdown my-dropdown dropleft">
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item dropdown-item--inside" v-if="contract.status === 'contract' || contract.status === 'sold'" :href="contract.contract_path">
                                            <i class="fa fa-download"></i> {{ $t('contracts.download') }}
                                        </a>

                                        <router-link :to="{ name: 'contracts-view', params: { id: contract.id }  }" :class="'dropdown-item dropdown-item--inside'">
                                            <i class="far fa-eye"></i> {{ $t('apartments.list.more') }}
                                        </router-link>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <paginate
                        :pageCount="getPaginationContracts.total"
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
    </main>
</template>

<script>
    import { mapActions, mapGetters} from 'vuex';
    // import ViewClient from '../Apartment/ViewClient';

    export default {
        components: {
            // 'view-client': ViewClient
        },


        watch: {
            orderBy: function (newVal) {
                if (newVal != 'all') {
                    this.fetchContractSearch(this);
                } else {
                    if (this.search.length > 0) {
                        this.fetchContractSearch(this);
                    } else {
                        this.fetchContracts(this);
                    }
                }
            }
        },

        data: () => ({
            info_reserve: false,
            apartment_preview: {},
            client_id: 0,

            orderBy: 'all',
            page: 1,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            },

            search: ''
        }),

        computed: mapGetters(['getMe', 'getPermission', 'getLoading', 'getPaginationContracts', 'getContracts', 'getCurrency']),

        mounted() {
            this.fetchContracts(this);
            this.fetchCurrency(this);
        },

        methods: {
            ...mapActions(['fetchContracts', 'fetchCurrency', 'fetchContractSearch']),

            PageCallBack(pageNum) {
                this.page = pageNum;

                if (this.search.length > 0) {
                    this.fetchContractSearch(this);
                } else {
                    this.fetchContracts(this);
                }
            },

            SearchInput(event) {
                this.page = 1;
                this.search = event.target.value;

                if (this.search.length > 0) {
                    this.fetchContractSearch(this);
                } else {
                    this.fetchContracts(this);
                }
            }
        },

        filters: {
            getStatus (status, buy, book) {
                let msg;

                switch (status) {
                    case 'sold':
                        msg = buy;
                        break;
                    case 'booked':
                        msg = 'Забронировал до ' + book;
                        break;
                    case 'contract':
                        msg = buy;
                        break;
                    default:
                        msg = 'отказался купить или другое';
                        break;
                }

                return msg;
            },


            getStatusOrder(status) {
                let msg;
                switch (status) {
                    case 'sold':
                        msg = 'Продано';
                        break;
                    case 'booked':
                        msg = '';
                        break;
                    case 'contract':
                        msg = 'Оформлен контракт ';
                        break;
                }

                return msg;
            }

        }
    }
</script>

<style scoped>

</style>
