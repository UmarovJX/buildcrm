<template>
    <main>
        <div class="d-flex align-items-center pb-3 pt-0 px-3 px-md-0 py-lg-3">
            <h1 class="title__default mb-md-0 mb-3">
                {{ getApartment.object.name }} - {{ getApartment.number }}
            </h1>
        </div>

        <div class="new-object px-3 px-sm-4 py-4">
            <div class="container px-0 mx-0">
                <div class="row mx-0">
                    <div class="col-lg-4 px-0">
                        <div class="building">
                            <div class="building__img" :style="{ 'background-image': 'url(' + getApartment.plan.image + ')' }"></div>
                            <div class="building__type">{{ $t('apartments.view.plan') }}: {{ getApartment.plan.name }}</div>
                        </div>
                    </div>
                    <div class="col-lg-1 px-0">

                    </div>
                    <div class="col-lg-7 px-0">
                        <div class="building__info mt-3">
                            <p>{{ $t('apartments.view.number') }}: {{ getApartment.number }}</p>
                            <p>{{ $t('apartments.view.area') }}: {{ getApartment.plan.area }} м²</p>
                            <p>
                                {{ $t('apartments.list.balcony') }}:
                                <span v-if="getApartment.plan.balcony">
                                     {{ getApartment.plan.balcony_area }} м²
                                </span>

                                <span v-else>
                                    {{ $t('no') }}
                                </span>
                            </p>
                            <p>{{ $t('apartments.view.rooms') }}: {{ getApartment.rooms }}</p>
                            <p>{{ $t('apartments.view.floor') }}: {{ getApartment.floor }}</p>
                            <p>{{ $t('apartments.view.price_m2') }}: {{ getApartment.price_m2 | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</p>
                            <p>{{ $t('apartments.view.total_price') }}: {{ getApartment.price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</p>
                        </div>
                        <div class="building__info mt-3 d-flex align-items-center">
                            <p>{{ $t('apartments.view.status') }}</p>

                            <div :class="[getApartment.order === 'booked'  ? 'btn btn-warning ml-3' : '', getApartment.order.status === 'sold' || getApartment.order.status === 'contract' ? 'btn btn-danger ml-3' : 'btn btn-success ml-3']">
                                {{ getApartment.order.status | getStatus($moment(getApartment.order.booking_date).format('DD.MM.YYYY'))  }}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div class="container px-0 mx-0 mt-4">
                <div class="row">
                    <div class="col-lg-4 my-2" v-for="(discount, index) in getApartment.discounts" :key="index">
                        <Discount :discount="discount" :apartment="getApartment"></Discount>
                    </div>
                </div>
            </div>

            <div class="mt-5 d-flex justify-content-md-start justify-content-center">
<!--                <button class="btn btn-secondary" data-target="#another-variant" data-toggle="modal">-->
<!--                    Другой вариант-->
<!--                </button>-->

                <b-button v-if="getApartment.order.status === 'booked' && getApartment.order.user.id === getMe.user.id && (getPermission.apartments.root_contract || getPermission.apartments.reserve_cancel) || getMe.role.id === 1 && getApartment.order.status === 'booked'" type="button" @click="cancelReserve" class="ml-1" variant="light">
                    <i class="fas fa-eraser"></i> {{ $t('apartments.list.cancel_reserve') }}
                </b-button>

                <b-link v-if="getApartment.order.status === 'booked' && getApartment.order.user.id === getMe.user.id || getMe.role.id === 1 && getApartment.order.status === 'booked'" @click="ReserveInfo(getApartment)" v-b-modal.modal-view-client class="btn btn-secondary ml-1" >
                    <i class="far fa-eye"></i> {{ $t('apartments.list.view_client') }}
                </b-link>

                <b-button class="my-btn my-btn__blue ml-1"  v-if="getPermission.apartments.reserve && getApartment.order.status === 'available'" @click="[reserve = true, apartment_id = getApartment.id]"  v-b-modal.modal-create>
                    <i class="far fa-calendar-check"></i> {{ $t('apartments.list.book') }}
                </b-button>

                <b-button v-b-modal.modal-agree @click="ConfirmFindUser"  variant="primary" class="my-btn my-btn__blue ml-1" v-if="(getApartment.order.status != 'sold' || getApartment.order.status != 'contract') && getApartment.order.status === 'booked' && getApartment.order.user.id === getMe.user.id && getPermission.apartments.contract || !(getApartment.order.status == 'sold' || getApartment.order.status == 'contract') && getPermission.apartments.root_contract || (getApartment.order.status != 'sold' || getApartment.order.status != 'contract') && getApartment.order.status === 'available' && getPermission.apartments.contract">
    <!--                    getApartment.order.status != 'contract'  || getApartment.order.status === 'booked' && getApartment.order.user.id === getMe.user.id && getPermission.apartments.contract || getApartment.order.status != 'sold' &&  getPermission.apartments.root_contract || getApartment.order.status === 'available' && getPermission.apartments.contract-->
                    <i class="far fa-ballot-check"></i>  {{ $t('apartments.list.confirm') }}
                </b-button>


            </div>
        </div>

        <view-client v-if="info_reserve" @CancelReserve="CloseReserveInfo" :apartment-data="apartment_preview"  :client-id="client_id"></view-client>

        <reserve-add v-if="reserve | getPermission.apartments.reserve" :apartment="apartment_id" @CreateReserve="CreateReserveSuccess"></reserve-add>

        <agree-modal v-if="confirm" :apartment="getApartment" @successAgree="successAgree" @CloseAgree="CloseAgree"></agree-modal>

        <success-agree :contract="contract"></success-agree>
    </main>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex';
    import ViewClient from './ViewClient'
    import ReserveAdd from './Components/Reserve'
    import Agree from './Components/Agree'
    import SuccessAgree from './Components/SuccessAgree'
    import Discount from './Components/Discount'

    export default {
        components: {
            'view-client': ViewClient,
            'reserve-add': ReserveAdd,
            'agree-modal': Agree,
            'Discount': Discount,
            'success-agree': SuccessAgree
        },

        data: () => ({
            url: process.env.VUE_APP_URL,

            apartment_preview: {},
            client_id: 0,

            reserve: false,
            apartment_id: 0,
            order_id: 0,
            edit: false,
            confirm: false,
            isConfirm: false,

            info_reserve: false,

            contract: {
                id: null,
                contract: null,
                contract_path: null,
            },


            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        created () {
            this.fetchApartment(this);
        },


        computed: mapGetters(['getApartment', 'getMe', 'getPermission', 'getReserveClient']),

        methods: {
            ...mapActions(['fetchApartment', 'fetchReserveClient',]),

            ReserveInfo(apartment) {
                this.info_reserve = true;
                this.apartment_preview = apartment;
                this.order_id = apartment.order.id;
                this.fetchReserveClient(this);
            },

            CreateReserveSuccess() {
                this.fetchApartment(this);
            },

            getPrice(area, price) {
                return price * area;
            },

            CloseReserveInfo() {
                this.info_reserve = false;
                this.apartment_preview = {};
                this.fetchApartment(this);
            },

            ConfirmFindUser() {
                this.confirm = true;
                // this.fetchReserveClientFull(this);
            },

            CloseAgree() {
                this.confirm = false;
            },

            successAgree(value) {
                this.fetchApartment(this);
                this.contract = value;
                this.$bvModal.show('modal-success-agree');
            },

            async cancelReserve() {
                this.order_id = this.getApartment.order.id;
                this.fetchReserveClient(this);
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text_cancel_reserve'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes_cancel_reserve')
                }).then((result) => {
                    if (result.value) {

                        this.axios.delete(process.env.VUE_APP_URL + '/orders/' + this.getReserveClient.id  + '/reserve', this.header).then((response) => {

                            this.toasted(response.data.message, 'success');

                            this.$nextTick(() => {
                                this.$bvModal.hide('modal-view-client')
                            });


                            this.fetchApartment(this);

                            this.$swal(
                                this.$t('sweetAlert.canceled_reserve'),
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
        },

        filters: {
            getStatus (status, booking_date) {
                let msg;
                switch (status) {
                    case 'sold':
                        msg = 'Продано';
                        break;
                    case 'booked':
                        msg = 'Забронировано до ' + booking_date;
                        break;
                    case 'available':
                        msg = 'Свободен';
                        break;
                    case 'contract':
                        msg = 'Ждет оплата';
                        break;
                    default:
                        msg = 'Свободен';
                        break;
                }

                return msg;
            }
        }
    }
</script>

<style scoped>
    .apartment__variant {
        height: auto !important;
    }
</style>
