<template>
    <main>
        <div class="my-container px-0 mx-0">
<!--            <form action="" class="my-form">-->
<!--                <div class="mb-3 searching">-->
<!--                    <input class="my-form__input" type="text" v-model="search" @input="SearchInput" :placeholder="$t('clients.search')">-->
<!--                    <button><i class="far fa-search"></i></button>-->
<!--                </div>-->
<!--            </form>-->

            <div class="table-responsive">
                <table class="table table-borderless my-table my-table-third">
                    <thead>
                    <tr>
                        <th class="text-center"><i class="fas fa-sort"></i> {{ $t('clients.number') }}</th>
                        <th>{{ $t('clients.fio') }}</th>
                        <th>{{ $t('clients.phone') }}</th>
                        <th>Сумма</th>
<!--                        <th>{{ $t('clients.object') }}</th>-->
<!--                        <th>{{ $t('apartments.list.status') }}</th>-->
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

                    <tr v-if="getDebtors.length === 0 && !getLoading">
                        <td colspan="8">
                            <center>
                                {{ $t('no_data') }}
                            </center>
                        </td>
                    </tr>

                    <tr v-for="(debtor, index) in getDebtors" :key="index">
                        <td class="text-center">
                            {{ debtor.order.contract }}
                        </td>
                        <td>
                            {{ debtor.client.first_name }} {{ debtor.client.last_name }} {{ debtor.client.second_name }}
                        </td>
                        <td>
                            +{{ debtor.client.phone }}
                        </td>

                        <td>
                            {{ debtor.amount| number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                        </td>

                        <td>
                            {{ debtor.date_payment | moment('DD.MM.YYYY') }}
                        </td>

                        <td>
                            <div class="dropdown my-dropdown dropleft">
                                <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                    <i class="far fa-ellipsis-h"></i>
                                </button>
                                <div class="dropdown-menu">

                                    <router-link :to="{ name: 'contracts-view', params: { id: debtor.order.id }  }" :class="'dropdown-item dropdown-item--inside'">
                                        <i class="far fa-eye"></i> {{ $t('apartments.list.more') }}
                                    </router-link>
                                </div>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <paginate
                        :pageCount="getPaginationDebtors.total"
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
            orderBy: 'all',
            page: 1,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            },

            search: ''
        }),

        computed: mapGetters(['getMe', 'getPermission', 'getLoading', 'getDebtors', 'getPaginationDebtors']),

        created() {
            this.fetchDebtors(this);
        },

        methods: {
            ...mapActions(['fetchDebtors']),

            PageCallBack(pageNum) {
                this.page = pageNum;

                // if (this.search.length > 0) {
                //     this.fetchContractSearch(this);
                // } else {
                    this.fetchDebtors(this);
                // }
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

        }
    }
</script>

<style scoped>

</style>
