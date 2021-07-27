<template>
    <main>
        <div class="my-container px-0 mx-0">
            <div class="float-right mb-3">
                <date-picker v-model="date" type="date" range value-type="format" @change="ChangeDate" format="YYYY-MM-DD" placeholder="Select date range"></date-picker>

                <select class="form-control mt-3" v-model="orderBy" aria-label="Default select example">
                    <option selected value="all">Все</option>
                    <option value="expired">Просроченные</option>
                    <option value="friends">Знакомые</option>
                </select>
            </div>

            <form action="" class="my-form float-left w-100">
                <div class="mb-3 searching">
                    <input class="my-form__input" type="text" v-model="search" @input="SearchInput" :placeholder="$t('clients.search')">
                    <button><i class="far fa-search"></i></button>
                </div>
            </form>

            <div class="col-md-2 float-right">
                <div class="row">

                </div>
            </div>


            <div class="table-responsive">
                <table class="table table-borderless my-table my-table-third">
                    <thead>
                    <tr>
                        <th class="text-center"><i class="fas fa-sort"></i> {{ $t('clients.number') }}</th>
                        <th>{{ $t('clients.fio') }}</th>
                        <th>{{ $t('clients.phone') }}</th>
                        <th>Тип Клиента</th>
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

                    <tr v-for="(debtor, index) in getDebtors" :class="[debtor.order.friends ? 'table-warning' : '']" :key="index">
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
                            {{ debtor.order.friends | getTypeClient}}
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

    import DatePicker from 'vue2-datepicker';
    import 'vue2-datepicker/index.css';

    export default {
        components: {
            DatePicker
            // 'view-client': ViewClient
        },


        watch: {
            orderBy: function (newVal) {
                if (newVal != 'all') {
                    this.fetchDebtorsFilter(this);
                } else {
                    if (this.search.length > 0 || this.date.length > 0) {
                        this.fetchDebtorsFilter(this);
                    } else {
                        this.fetchDebtors(this);
                    }
                }
            }
        },

        data: () => ({
            orderBy: 'all',
            page: 1,

            date: [],

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
            ...mapActions(['fetchDebtors', 'fetchDebtorsFilter']),

            PageCallBack(pageNum) {
                this.page = pageNum;

                if (this.search.length > 0 || this.date.length > 0) {
                    this.fetchDebtorsFilter(this);
                } else {
                    this.fetchDebtors(this);
                }
            },

            ChangeDate() {
                if (this.date.length > 0) {
                    this.fetchDebtorsFilter(this);
                } else {
                    this.fetchDebtors(this);
                }
            },

            SearchInput(event) {
                this.page = 1;
                this.search = event.target.value;

                if (this.search.length > 0) {
                    this.fetchDebtorsFilter(this);
                } else {
                    this.fetchDebtors(this);
                }
            }
        },

        filters: {
            getTypeClient(type) {
                if (type) {
                    return 'Знакомый';
                }

                return 'Клиент';
            }
        }
    }
</script>

<style scoped>

</style>
