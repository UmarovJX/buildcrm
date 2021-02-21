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
                                <select class="form-control" id="discounts" v-model="client.discount">
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

                    <button type="submit" class="btn btn-success">
                        <i class="fa fa-save"></i> {{ $t('save') }}
                    </button>
                </div>
            </form>
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

            error: false,
            errors: [],

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

                try {
                    const response = await this.axios.post(process.env.VUE_APP_URL + '/orders/' + this.apartment.id , formData, this.header);

                    this.toasted(response.data.message, 'success');

                    // this.$nextTick(() => {
                    //     this.$bvModal.hide('modal-upload-logo')
                    // });

                    // this.$emit('UploadLogo');

                } catch (error) {
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
                }
            },

            removeBlock() {
                this.$bvModal.hide('modal-agree');
                this.$emit('CloseAgree');
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
