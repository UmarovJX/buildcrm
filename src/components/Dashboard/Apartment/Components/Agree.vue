<template>
    <div>
        <b-modal id="modal-agree" class="py-4" ref="modal" :title="$t('apartments.list.confirm')" size="lg" hide-footer hide-header-close no-close-on-backdrop>

            <div class="input-group" v-if="step === 1">
                <input type="text" :placeholder="$t('apartments.agree.placeholder.search')" class="form-control" v-model="search_label" >
                <div class="input-group-append">
                    <button class="btn btn-success" @click="Search" type="button">
                        <i class="fa fa-search"></i> {{ $t('search') }}
                    </button>
                </div>
            </div>

            <div class="mt-4 d-flex justify-content-md-start justify-content-center float-right" v-if="step === 1">
                <button type="button" class="btn btn-default mr-2" @click="removeBlock">
                    {{ $t('cancel') }}
                </button>
            </div>

            <form ref="form" @submit.stop.prevent="sendForm" v-if="step === 2">
                <div class="container px-0 mx-0">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="first_name">{{ $t('apartments.agree.first_name') }}</label>
                                <input id="first_name" class="my-form__input" type="text" required v-model="client.first_name" :placeholder="$t('apartments.agree.placeholder.first_name')">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="last_name">{{ $t('apartments.agree.last_name') }}</label>
                                <input id="last_name" class="my-form__input" type="text" required v-model="client.last_name" :placeholder="$t('apartments.agree.placeholder.last_name')">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="second_name">{{ $t('apartments.agree.second_name') }}</label>
                                <input id="second_name" class="my-form__input" type="text" required v-model="client.second_name" :placeholder="$t('apartments.agree.placeholder.second_name')">
                            </div>
                        </div>

                        <div class="col-md-12">
                            <hr>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="checkout-pasport">{{ $t('apartments.agree.passport_series') }}</label>
                                <input class="my-form__input" type="text" :placeholder="$t('apartments.agree.placeholder.passport_series')" required v-model="client.passport_series"  id="checkout-pasport">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="issue_passport">{{ $t('apartments.agree.issued_by_whom') }}</label>
                                <input class="my-form__input" type="text" :placeholder="$t('apartments.agree.placeholder.issued_by_whom')" required v-model="client.issued_by_whom"  id="issue_passport">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="date_of_issue">{{ $t('apartments.agree.date_of_issue') }}</label>
                                <b-form-datepicker v-model="client.date_of_issue" locale="ru"></b-form-datepicker>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="birth_day">{{ $t('apartments.agree.birth_day') }}</label>
                               <input v-model="client.birth_day" type="date" class="form-control">
                            </div>
                        </div>

                        <div class="col-md-12">
                            <hr>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="phone">{{ $t('apartments.agree.phone') }}</label>
                                <input class="my-form__input" type="tel" :placeholder="$t('apartments.agree.placeholder.phone')" required v-model="client.phone"  id="phone">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="other_phone">{{ $t('apartments.agree.other_phone') }}</label>
                                <input class="my-form__input" type="tel" :placeholder="$t('apartments.agree.placeholder.other_phone')" required v-model="client.other_phone"  id="other_phone">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="language">{{ $t('apartments.agree.language') }}</label>
                                <select class="form-control" id="language" v-model="client.language">
                                    <option value="uz">Узбекский</option>
                                    <option value="ru">Русский</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <hr>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="d-block" for="discounts">{{ $t('apartments.view.variant') }}</label>
                                <select class="form-control" id="discounts" v-model="client.discount" @change="ChangeDiscount()">
                                    <option :value="{id: null}">
                                        {{ $t('apartments.agree.placeholder.enter_discount') }}
                                    </option>

                                    <option v-for="(discount, index) in apartment.discounts" :value="discount" :key="index">
                                        {{ $t('apartments.view.variant') }} {{ index + 1}} - {{ discount.prepay_from }}%  -  {{ discount.prepay_to }}%
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-12 my-2" v-if="client.discount.id">
                            <Discount :discount="client.discount" :apartment="apartment"></Discount>
                        </div>
                    </div>
                </div>

                <div class="alert alert-danger mt-3" v-if="error">
                    <ul>
                        <li v-for="(error, index) in errors" :key="index">
                        <span v-for="msg in error" :key="msg">
                            {{ msg }}
                        </span>
                        </li>
                    </ul>
                </div>

                <div class="mt-4 d-flex justify-content-md-start justify-content-center float-right">
                    <button type="button" class="btn btn-default mr-2" @click="removeBlock">
                        {{ $t('cancel') }}
                    </button>

                    <button type="button" class="btn btn-primary" @click="[step = 3, next = false, confirm = true]" v-if="next">
                         {{ $t('next') }} <i class="fa fa-chevron-circle-right"></i>
                    </button>

                    <button type="submit" class="btn btn-success" v-if="confirm">
                         {{ $t('create_agree') }} <i class="fa fa-file-contract"></i>
                    </button>
                </div>
            </form>

            <div class="" v-if="step === 3">
                <form ref="form" @submit.stop.prevent="sendForm">
                    <h6 class="color-blue-darker">Цена продажи: {{ apartment.price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</h6>

                        <div class="container px-0 mx-0 mt-4">
                            <div class="row">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label class="d-block" for="initial-fee">Первоначальный взнос:</label>
                                        <div class="row">
                                            <div class="col-md-6 col-8">
                                                <input id="initial-fee" class="my-form__input" disabled type="text" :value="getPrepay() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' })">
                                            </div>
                                            <div class="col-md-6 col-4 pl-0 d-flex align-items-center justify-content-start">
                                                <div class="h6 mb-0">{{ client.discount.prepay_to }}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <table class="table table-hover mx-0 mt-2 p-0 my-table-another-variant">
                            <tbody class="m-0 p-0">
                            <tr>
                                <td class="px-0 py-2">Скидка - {{ client.discount.discount }}%</td>
                                <td class="px-0 py-2 text-right">{{ getDiscount() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</td>
                            </tr>

                            <tr>
                                <td class="px-0 py-2">Итого со скидкой</td>
                                <td class="px-0 py-2 text-right">{{ getTotal() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</td>
                            </tr>

                            <tr>
                                <td class="px-0 py-2">Сумма рассрочки</td>
                                <td class="px-0 py-2 text-right">{{ getDebt() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</td>
                            </tr>
                            </tbody>
                        </table>

                        <div class="col-md-12">
                            <div class="row">
                                <div class="mb-3">
                                    <label class="d-block" for="month">Месяцев</label>
                                    <input id="month" class="my-form__input" type="number" min="1" required v-model="month" :placeholder="$t('apartments.agree.placeholder.first_name')">
                                </div>
                            </div>
                        </div>

                        <span>
                            {{ month }} месяцев по {{ getMonth() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                        </span>

                        <table class="table">
                            <thead>
                                <tr>
                                    <th>
                                        Месяцы
                                    </th>

                                    <th>
                                        Сумма
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td>
                                        {{ new Date() | moment('DD.MM.YYYY') }}
                                    </td>

                                    <td>
                                        {{ getPrepay() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }}  {{ $t('ye') }}
                                    </td>
                                </tr>

                                <tr v-for="(month, index) in credit_months" :key="index">
                                    <td>
                                        {{ month.month | moment('DD.MM.YYYY') }}
                                    </td>

                                    <td>
                                        {{ month.amount | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    <div class="alert alert-danger mt-3" v-if="error">
                        <ul>
                            <li v-for="(error, index) in errors" :key="index">
                        <span v-for="msg in error" :key="msg">
                            {{ msg }}
                        </span>
                            </li>
                        </ul>
                    </div>
                        <div class="mt-4 d-flex justify-content-md-start justify-content-center float-right">
                            <button type="button" class="btn btn-default mr-2" @click="removeBlock">
                                {{ $t('cancel') }}
                            </button>

                            <button type="button" class="btn btn-secondary mr-1" @click="[step = 2, next = true, confirm = false]">
                                <i class="fa fa-chevron-circle-left"></i> {{ $t('back') }}
                            </button>

                            <button type="submit" class="btn btn-success" v-if="confirm">
                                {{ $t('create_agree') }} <i class="fa fa-file-contract"></i>
                            </button>
                        </div>
                </form>


<!--                <button type="submit" class="btn btn-success" v-if="confirm">-->
<!--                    {{ $t('create_agree') }} <i class="fa fa-file-contract"></i>-->
<!--                </button>-->
            </div>
        </b-modal>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Discount from './Discount'
    export default {
        props: {
            apartment: {}
        },

        components: {
            Discount
        },

        computed: mapGetters(['getReserveClient']),

        name: "Agree",

        watch: {
            month: function (newVal) {
                this.CreditMonths(newVal);
            }
        },

        data: () => ({
            step: 1,
            search_label: '',
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

            month: "6",

            confirm: false,
            next: false,

            error: false,
            errors: [],

            credit_months: [

            ],

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        mounted() {
            if (this.apartment.order.id) {
                this.reserveClientFull();
            }
        },

        methods: {

            async Search() {

                try {
                    const { data } = await this.axios.get(process.env.VUE_APP_URL + '/orders/client/search?field=' + this.search_label, this.header);
                    this.step = 2;

                    this.client = {
                        id: data.id,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        second_name: data.second_name,
                        passport_series: data.passport_series,
                        issued_by_whom: data.issued_by_whom,
                        language: data.language,
                        birth_day: data.birth_day,
                        phone: data.phone,
                        other_phone: data.other_phone,
                        date_of_issue: data.date_of_issue,
                        discount: {id: null},
                    }

                } catch (error) {
                    console.log(4);
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

            async reserveClientFull() {
                try {
                    const { data } = await this.axios.get(process.env.VUE_APP_URL + '/orders/' + this.apartment.order.id + '/confirm/client', this.header);
                    this.step = 2;
                    this.client = {
                        id: data.id,
                        first_name: data.first_name,
                        birth_day: data.birth_day,
                        last_name: data.last_name,
                        second_name: data.second_name,
                        passport_series: data.passport_series,
                        issued_by_whom: data.issued_by_whom,
                        language: data.language,
                        phone: data.phone,
                        other_phone: data.other_phone,
                        date_of_issue: data.date_of_issue,
                        discount: {id: null},
                    }

                } catch (error) {
                    console.log(4);
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

            async sendForm() {

                if (this.client.discount.id === null)
                    return;

                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text_agree'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes_agree')
                }).then((result) => {
                    if (result.value) {
                        const formData = new FormData();

                        if (this.apartment.order.id)
                            formData.append('order_id', this.apartment.order.id);

                            formData.append('id', this.client.id);
                            formData.append('first_name', this.client.first_name);
                            formData.append('last_name', this.client.last_name);
                            formData.append('second_name', this.client.second_name);
                            formData.append('passport_series', this.client.passport_series);
                            formData.append('issued_by_whom', this.client.issued_by_whom);
                            formData.append('language', this.client.language);
                            formData.append('phone', this.client.phone);
                            formData.append('other_phone', this.client.other_phone);
                            formData.append('date_of_issue', this.client.date_of_issue);
                            formData.append('discount_id', this.client.discount.id);
                            formData.append('birth_day', this.client.birth_day);

                            if (this.step === 3 && this.client.discount.prepay_to != 100) {
                                formData.append('months', this.month);
                            }

                            this.axios.post(process.env.VUE_APP_URL + '/orders/' + this.apartment.id , formData, this.header)
                            .then(response => {
                                this.toasted(response.data.message, 'success');

                                this.$bvModal.hide('modal-agree');

                                this.$emit('successAgree', response.data);

                            })
                            .catch(error => {
                                if (! error.response) {
                                    this.toasted('Error: Network Error', 'error');
                                } else {
                                    if (error.response.status === 403) {
                                        this.toasted(error.response.data.message, 'error');
                                    } else if (error.response.status === 401) {
                                        this.toasted(error.response.data, 'error');
                                    } else if (error.response.status === 500) {
                                        this.toasted(error.response.data.message, 'error');
                                    } else if (error.response.status === 422) {
                                        this.error = true;
                                        this.errors = error.response.data;
                                    } else {
                                        this.toasted(error.response.data.message, 'error');
                                    }
                                }
                            });


                                // this.$nextTick(() => {
                                //     this.$bvModal.hide('modal-upload-logo')
                                // });

                                // this.$emit('UploadLogo');

                    }
                });

            },

            removeBlock() {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text_cancel_agree'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes_close')
                }).then((result) => {
                    if (result.value) {
                        this.$bvModal.hide('modal-agree');
                        this.$emit('CloseAgree');
                    }
                });
            },

            ChangeDiscount() {

                this.CreditMonths(this.month);

                if (this.client.discount.id === null) {
                    this.next = false;
                    this.confirm = false;
                    return;
                }

                if (this.client.discount.prepay_to === 100) {
                    this.next = false;
                    this.confirm = true;
                    return;
                }


                this.confirm = false;
                this.next = true;
                return;
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

            getTotal() {
                let total_discount = this.getDiscount();

                // let total = price * area;
                let total = this.apartment.price - total_discount;

                return total;
            },

            CreditMonths(newVal) {

               let today = new Date();

                this.credit_months = [];

                for (var i = 0; i < newVal; i++) {

                    this.credit_months.push({
                        month:  today.setMonth( today.getMonth() + 1 ),
                        amount: this.getMonth()
                    })
                }
            }
        }
    }
</script>

<style scoped>
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #a4a4a4;
        opacity: 0.8; /* Firefox */
    }
</style>
