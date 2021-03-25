<template>
    <main>

        <div class="card">
            <div class="card-content">
                <div class="card-header">
                    <h5 class="card-title">
                        {{ $t('apartments.list.contract') }} #: {{ order.contract }}
                    </h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            {{ order.branch.type.name.kr }} "{{ order.branch.name }}"<br>
                            {{ order.branch.first_name }} {{ order.branch.last_name }} {{ order.branch.second_name }}  <br>
                            р/с: {{ order.branch.payment_account }} <br>
                            ИНН: {{ order.branch.inn }}, МФО: {{ order.branch.mfo}} <br>
                        </div>

                        <div class="col-md-6 text-right">
                            {{ order.client.first_name }} {{ order.client.last_name }} {{ order.client.second_name }}<br>
                            {{ order.client.passport_series }}<br>
                            {{ order.client.issued_by_whom }}<br>
                            {{ order.client.date_of_issue | moment('DD.MM.YYYY') }} берилган<br>
                            {{ order.client.birth_day | moment('DD.MM.YYYY') }} тугилган<br>
                            +{{ order.client.phone }}<br>
                            +{{ order.client.other_phone }}
                        </div>

                        <div class="col-md-12 mt-3">

                            <table class="table table-striped">
                                <thead class="table-dark">
                                <tr>
                                    <th scope="col" width="50">{{ $t('apartments.list.number') }}</th>
                                            <th scope="col">{{ $t('apartments.list.object') }}</th>
                                    <th scope="col">{{ $t('apartments.list.building') }}</th>
                                    <th scope="col">{{ $t('apartments.list.block') }}</th>
                                    <th scope="col" class="text-center">{{ $t('apartments.list.rooms') }}</th>
                                    <th scope="col" class="text-center">{{ $t('apartments.list.floor') }}</th>
                                    <th scope="col" class="text-center">{{ $t('apartments.list.entrance') }}</th>
                                    <th scope="col" class="text-center">{{ $t('apartments.list.area') }}</th>
                                    <th scope="col" class="text-center">{{ $t('apartments.list.balcony') }}</th>
                                    <th scope="col">{{ $t('apartments.list.price') }}</th>
                                </tr>
                                </thead>

                                <tbody>
                                    <td scope="row">
                                        {{ order.apartment.number }}
                                    </td>
                                    <td>
                                        {{ order.apartment.object.name }}
                                    </td>

                                    <td>
                                        {{ order.apartment.building.name }}
                                    </td>

                                    <td>
                                        {{ order.apartment.block.name }}
                                    </td>

                                    <td class="text-center">
                                        {{ order.apartment.rooms }}
                                    </td>

                                    <td class="text-center">
                                        {{ order.apartment.floor }}
                                    </td>

                                    <td class="text-center">
                                        {{ order.apartment.entrance }}
                                    </td>

                                    <td class="text-center">
                                        {{ order.apartment.plan.area }} м²
                                    </td>

                                    <td class="text-center">
                                        <span v-if="order.apartment.plan.balcony">
                                             {{ order.apartment.plan.balcony_area }} м²
                                        </span>
                                            <span v-else>
                                            {{ $t('no') }}
                                        </span>
                                    </td>

                                    <td>
                                        {{ order.apartment.price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} сум
                                    </td>
                                </tbody>
                            </table>


                            <table class="table table-striped" v-if="order.status === 'contract' || order.status === 'sold'">
                                <thead class="table-dark">
                                    <tr>
                                        <th colspan="2">
                                            Тариф
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
<!--                                    <tr>-->
<!--                                        <td width="240">-->
<!--                                            Цена продажи-->
<!--                                        </td>-->
<!--                                        <td>-->
<!--                                            {{ order.apartment.price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}-->
<!--                                        </td>-->
<!--                                    </tr>-->

                                    <tr>
                                        <td width="240">
                                           Курс доллара
                                        </td>
                                        <td>
                                            {{ order.currency.usd | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                                        </td>
                                    </tr>

<!--                                    <tr>-->
<!--                                        <td width="240">-->
<!--                                            Скидка-->
<!--                                        </td>-->
<!--                                        <td>-->
<!--                                            {{ order.discount.discount }} %-->
<!--                                        </td>-->
<!--                                    </tr>-->

                                    <tr>
                                        <td width="240">
                                            Первоначальный взнос
                                        </td>
                                        <td>
                                            {{ order.initial_payment | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="240">
                                            Цена квартиру
                                        </td>
                                        <td>
                                            {{ order.transaction_price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td width="240">
                                            Остаток
                                        </td>
                                        <td>
                                            {{ order.transaction_price - order.initial_payment | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table class="table table-striped" v-if="order.status === 'contract' || order.status === 'sold'">
                                <thead class="table-dark">
                                <tr>
                                    <th width="250">
                                        Расписание для оплаты
                                    </th>

                                    <th class="text-center">
                                        Статус
                                    </th>

                                    <th >
                                        Комментария
                                    </th>

                                    <th>
                                        Дата оплата
                                    </th>

                                    <th class="text-center">
                                        Сумма
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(month, index) in order.payments" :key="index">
                                        <td>
                                            {{ month.date_payment | moment('DD.MM.YYYY') }}
                                        </td>

                                        <td class="text-center">
                                            {{ getStatusPayment(month) }}
                                        </td>

                                        <td >

                                        </td>

                                        <td >

                                        </td>

                                        <td  class="text-center">
                                            {{ month.amount | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}

                                        </td>
                                    </tr>

                                    <tr>
                                        <td>

                                        </td>
                                        <td>

                                        </td>

                                        <td class="text-center">

                                        </td>

                                        <td class="text-center">

                                        </td>

                                        <td  class="text-center">
                                           Итого: {{ order.transaction_price| number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a :href="order.contract_path" class="btn btn-success "  v-if="order.status === 'contract' || order.status === 'sold'">
                        <i class="fa fa-download"></i> Скачать договор
                    </a>

                    <router-link :to="{ name: 'apartments-view', params: { id: order.apartment.id }  }" :class="'btn btn-primary ml-1'" >
                        <i class="far fa-eye"></i> Посмотреть квартиру
                    </router-link>

                    <button type="button" @click="cancelOrder" class="btn btn-danger float-right"  v-if="order.status === 'contract'">
                        <i class="fa fa-minus-circle"></i> Отменить договор
                    </button>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    // import Discount from './Discount'

    export default {
        props: {
            apartment: {}
        },

        components: {
            // Discount
        },

        data: () => ({
            step: 1,

            order: {
                id: null,

                contract: null,
                contract_path: null,
                initial_payment: null,
                payment_status: null,
                status: 'contract',
                transaction_price: null,
                contract_date: null,
                payments: [],

                discount: {
                    discount: 0
                },

                apartment: {
                    id: 0,
                    price: 0,
                    number: null,
                    entrance: 0,
                    floor: 0,
                    plan: {
                        area: 0,
                        balcony: false,
                        balcony_area: 0
                    },
                    object: {
                        name: null
                    },

                    building: {
                        name: null
                    },

                    block: {
                        name: null
                    },
                },

                currency: {
                    usd: 0
                },

                branches: {
                    name: null,
                    payment_account: null,
                    inn: null,
                    mfo: null,
                    bank_name: {
                        ru: null
                    },
                    phone: null,
                    first_name: null,
                    last_name: null,
                    second_name: null,
                    type: {
                        kr: null
                    },
                },

                client: {
                    id: null,
                    first_name: '',
                    last_name: '',
                    second_name: '',
                    passport_series: '',
                    issued_by_whom: '',
                    birth_day: null,
                    language: 'uz',
                    phone: '',
                    other_phone: null,
                    date_of_issue: null,
                    discount: {id: null},
                    edit: false
                },
            },

            error: false,
            errors: [],

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        mounted() {
            this.fetchOrder();
        },

        methods: {


            async fetchOrder() {
                try {
                    const { data } = await this.axios.get(process.env.VUE_APP_URL + '/orders/' + this.$route.params.id, this.header);
                    this.step = 1;

                    this.order = data;
                } catch (error) {
                    if (! error.response) {
                        this.toasted('Error: Network Error', 'error');
                    } else {
                        if (error.response.status === 403) {
                            this.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 401) {
                            this.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 500) {
                            this.toasted(error.response.data.message, 'error');
                        } else {
                            this.toasted(error.response.data.message, 'error');
                        }
                    }
                }
            },

            cancelOrder() {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text_cancel_contract'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes_cancel_reserve')
                }).then((result) => {
                    if (result.value) {

                        this.axios.delete(process.env.VUE_APP_URL + '/deals/' + this.order.id , this.header).then((response) => {
                            console.log(response);
                            this.$router.back(-1);

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
                                } else {
                                    this.error = true;
                                    this.errors = error.response.data.errors;
                                }
                            }
                        });
                    }
                });
            },

            removeBlock() {
                this.$bvModal.hide('modal-contract-info');
            },

            getPrepay() {
                let total_discount = this.getDiscount();

                let total = this.apartment.price - total_discount;

                return this.client.discount.prepay_to * total / 100;
            },

            getDiscount() {
                return this.client.discount.discount * this.apartment.price / 100;
            },

            getMonth() {
                return (this.getTotal() - this.getPrepay()) / this.month;
            },

            getDebt() {
                return this.getTotal() - this.getPrepay();
            },

            getStatusPayment(payment) {
                switch (payment.status) {
                    case 'waiting':
                        return 'Ожидает оплату';
                    case 'paid':
                        return 'Оплачено';
                    default:
                        return 'Отказано'
                }
            },

            getTotal() {
                let total_discount = this.getDiscount();

                // let total = price * area;
                let total = this.apartment.price - total_discount;

                return total;
            },
        },
    }
</script>

<style scoped>
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #a4a4a4;
        opacity: 0.8; /* Firefox */
    }

    /*.invoice-box{*/
    /*    max-width:100%;*/
    /*    margin:auto;*/
    /*    padding:30px;*/
    /*    border:1px solid #eee;*/
    /*    box-shadow:0 0 10px rgba(0, 0, 0, .15);*/
    /*    font-size:16px;*/
    /*    line-height:24px;*/
    /*    font-family:'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;*/
    /*    color:#555;*/
    /*    background: #fff;*/
    /*}*/

    /*.invoice-box table{*/
    /*    width:100%;*/
    /*    line-height:inherit;*/
    /*    text-align:left;*/
    /*}*/

    /*.invoice-box table td{*/
    /*    padding:5px;*/
    /*    vertical-align:top;*/
    /*}*/

    /*.invoice-box table tr td:nth-child(2){*/
    /*    text-align:right;*/
    /*}*/

    /*.invoice-box table tr.top table td{*/
    /*    padding-bottom:20px;*/
    /*}*/

    /*.invoice-box table tr.top table td.title{*/
    /*    font-size:45px;*/
    /*    line-height:45px;*/
    /*    color:#333;*/
    /*}*/

    /*.invoice-box table tr.information table td{*/
    /*    padding-bottom:40px;*/
    /*}*/

    /*.invoice-box table tr.heading td{*/
    /*    background:#eee;*/
    /*    border-bottom:1px solid #ddd;*/
    /*    font-weight:bold;*/
    /*}*/

    /*.invoice-box table tr.details td{*/
    /*    padding-bottom:20px;*/
    /*}*/

    /*.invoice-box table tr.item td{*/
    /*    border-bottom:1px solid #eee;*/
    /*}*/

    /*.invoice-box table tr.item.last td{*/
    /*    border-bottom:none;*/
    /*}*/

    /*.invoice-box table tr.total td:nth-child(2){*/
    /*    border-top:2px solid #eee;*/
    /*    font-weight:bold;*/
    /*}*/

    /*@media only screen and (max-width: 600px) {*/
    /*    .invoice-box table tr.top table td{*/
    /*        width:100%;*/
    /*        display:block;*/
    /*        text-align:center;*/
    /*    }*/

    /*    .invoice-box table tr.information table td{*/
    /*        width:100%;*/
    /*        display:block;*/
    /*        text-align:center;*/
    /*    }*/
    /*}*/

</style>
