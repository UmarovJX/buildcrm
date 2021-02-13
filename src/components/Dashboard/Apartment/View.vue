<template>
    <main>
        <div class="d-flex align-items-center pb-3 pt-0 px-3 px-md-0 py-lg-3">
            <h1 class="title__default mb-md-0 mb-3">
                {{ getApartment.block.building.object.name }} - {{ getApartment.number }}
            </h1>
        </div>

        <div class="new-object px-3 px-sm-4 py-4">
            <div class="container px-0 mx-0">
                <div class="row mx-0">
                    <div class="col-lg-4 px-0">
                        <div class="building">
                            <div class="building__img" :style="{ 'background-image': 'url(' + url + '/' + getApartment.plan.plan + ')' }"></div>
                            <div class="building__type">{{ $t('apartments.view.plan') }}: {{ getApartment.plan.name }}</div>
                        </div>
                    </div>
                    <div class="col-lg-1 px-0">

                    </div>
                    <div class="col-lg-7 px-0">
                        <div class="building__info mt-3">
                            <p>{{ $t('apartments.view.number') }}: {{ getApartment.number }}</p>
                            <p>{{ $t('apartments.view.area') }}: {{ getApartment.area }}</p>
                            <p>{{ $t('apartments.view.rooms') }}: {{ getApartment.rooms }}</p>
                            <p>{{ $t('apartments.view.floor') }}: {{ getApartment.floor }}</p>
                            <p>{{ $t('apartments.view.price_m2') }}: {{ getApartment.price.price | number('0,0', { thousandsSeparator: ' ' }) }} {{ $t('ye') }}</p>
                            <p>{{ $t('apartments.view.total_price') }}: {{ getPrice(getApartment.area, getApartment.price.price) | number('0,0', { thousandsSeparator: ' ' }) }} {{ $t('ye') }}</p>
                        </div>
                        <div class="building__info mt-3 d-flex align-items-center">
                            <p>{{ $t('apartments.view.status') }}</p>

                            <div :class="[getApartment.status === 2 ? 'btn btn-warning ml-3' : '', getApartment.status === 1 ? 'btn btn-danger ml-3' : 'btn btn-success ml-3']">
                                {{ getApartment.status | getStatus($moment(getApartment.booking_date).format('DD.MM.YYYY'))  }}
                            </div>

                        </div>

                        <div class="col-12">
                            <b-link v-if="getApartment.status === 2 && getApartment.manager_id === getMe.user.id || getMe.role.id === 1 && getApartment.status === 2" @click="ReserveInfo(getApartment)" v-b-modal.modal-view-client class="btn btn-primary mt-3" >
                                <i class="far fa-eye"></i> {{ $t('apartments.list.view_client') }}
                            </b-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container px-0 mx-0 mt-4">
                <div class="row">
                    <div class="col-lg-4 my-2" v-for="(discount, index) in getApartment.block.building.object.discounts" :key="index">
                        <div class="apartment">
                            <h6>{{ $t('apartments.view.variant') }} {{ index + 1}}</h6>
                            <div class="apartment__variant">
                                <div class="apartment__info">
                                    Предоплата: <span>{{ discount.prepay_from }}%  -  {{ discount.prepay_to }}%</span>
                                </div>
                                <div class="apartment__info">Скидка: <span>{{ discount.discount }}% - {{ getDiscount(getApartment.area, getApartment.price.price, discount.discount) | number('0,0', { thousandsSeparator: ' ' }) }} {{ $t('ye') }}</span></div>
                                <div class="apartment__info">
                                    {{ discount.prepay_to }}% оплата - <span>{{ getPrepay(getApartment.area, getApartment.price.price, discount.prepay_to, discount.discount) | number('0,0', { thousandsSeparator: ' ' }) }} {{ $t('ye') }}</span>
                                </div>
                            </div>
                            <div class="mt-3 d-flex justify-content-between">
                                <button class="my-btn my-btn__blue px-2 mr-2 w-50 f-s-14" data-target="#booking"
                                        data-toggle="modal">
                                    Забронировать
                                </button>
                                <button class="my-btn my-btn__blue px-2 mr-2 w-50 f-s-14" data-target="#checkout"
                                        data-toggle="modal">
                                    Оформить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-5 d-flex justify-content-md-start justify-content-center">
                <button class="my-btn my-btn__blue" data-target="#another-variant" data-toggle="modal">
                    Другой вариант
                </button>
            </div>
        </div>

        <view-client v-if="info_reserve" @CancelReserve="CloseReserveInfo" :apartment-data="apartment_preview"  :client-id="client_id"></view-client>

    </main>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex';
    import ViewClient from './ViewClient'

    export default {
        components: {
            'view-client': ViewClient,
        },

        data: () => ({
            url: process.env.VUE_APP_URL,

            info_reserve: false,
            apartment_preview: {},
            client_id: 0,
        }),

        created () {
            this.fetchApartment(this);
        },

        mounted() {
            //this.fetchApartment(this);
        },

        computed: mapGetters(['getApartment', 'getMe']),

        methods: {
            ...mapActions(['fetchApartment', 'fetchReserveClient']),

            ReserveInfo(apartment) {
                this.info_reserve = true;
                this.apartment_preview = apartment;
                this.client_id = apartment.client_id;
                this.fetchReserveClient(this);
            },

            getPrice(area, price) {
                return price * area;
            },

            getPrepay(area, price, prepay, discount) {
                let total_discount = this.getDiscount(area, price, discount);

                let total = price * area;
                total = total - total_discount;

                return prepay * total / 100;
            },

            getDiscount(area, price, discount) {
                let total = price * area;
                return discount * total / 100;
            },

            CloseReserveInfo() {
                this.info_reserve = false;
                this.apartment_preview = {};
                this.fetchApartmentsFilter(this);
            },
        },

        filters: {
            getStatus (status, booking_date) {
                let msg;
                switch (status) {
                    case 1:
                        msg = 'Продано';
                        break;
                    case 2:
                        msg = 'Забронировано до ' + booking_date;
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

</style>
