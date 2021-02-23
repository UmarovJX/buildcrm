<template>
    <main>
        <div class="mt-4">
            <div class="title__default my-2">
                {{ $t('apartments.list.apartments') }}: {{ getApartments.length }}
            </div>
        </div>

        <div class="my-container px-0 mx-0 my-4" v-if="getPermission.apartments.filter">
            <div class="d-flex justify-content-md-end justify-content-center">
                <b-link class="my-btn my-btn__blue d-flex align-items-center justify-content-center" v-b-modal.modal-filter-all>
                    <i class="far fa-sliders-h mr-2"></i> {{ $t('apartments.list.filter') }}
                </b-link>
            </div>
        </div>

        <div class="my-container px-0 mx-0">
            <div class="table-responsive">
                <table class="table table-borderless my-table my-table-second">
                    <thead>
                    <tr>
                        <th scope="col" width="50">{{ $t('apartments.list.number') }}</th>
<!--                        <th scope="col">{{ $t('apartments.list.object') }}</th>-->
                        <th scope="col">{{ $t('apartments.list.building') }}</th>
                        <th scope="col">{{ $t('apartments.list.block') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.rooms') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.floor') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.entrance') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.area') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.balcony') }}</th>
                        <th scope="col">{{ $t('apartments.list.price') }}</th>
                        <th scope="col">{{ $t('apartments.list.status') }}</th>

                        <th scope="col" class="text-right">

                        </th>
                    </tr>
                    </thead>
                    <tbody>

                        <tr v-if="getLoading">
                            <td colspan="12" style="">
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

                        <tr v-if="getApartments.length === 0 && !getLoading">
                            <td colspan="12">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>



                        <tr v-for="(apartment, index) in getApartments" :key="index" :class="[apartment.order.status === 'booked' ? 'table-warning' : '', apartment.order.status === 'sold' || apartment.order.status === 'contract' ? 'table-danger' : '' ]">
                            <td scope="row">
                                {{ apartment.number }}
                            </td>

<!--                            <td>-->
<!--                                {{ apartment.object.name }}-->
<!--                            </td>-->

                            <td>
                                {{ apartment.building.name }}
                            </td>

                            <td>
                                {{ apartment.block.name }}
                            </td>

                            <td class="text-center">
                                {{ apartment.rooms }}
                            </td>

                            <td class="text-center">
                                {{ apartment.floor }}
                            </td>

                            <td class="text-center">
                                {{ apartment.entrance }}
                            </td>

                            <td class="text-center">
                                {{ apartment.plan.area }} м²
                            </td>

                            <td class="text-center">
                                <span v-if="apartment.plan.balcony">
                                     {{ apartment.plan.balcony_area }} м²
                                </span>

                                <span v-else>
                                    {{ $t('no') }}
                                </span>

                            </td>

                            <td>
                                {{ apartment.price | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} сум
                            </td>
                            <td>
                                <small>{{ apartment.order.status | getStatus($moment(apartment.order.booking_date).format('DD.MM.YYYY'))  }}</small>
                            </td>
                            <td>
                                <div class="dropdown my-dropdown dropleft" >
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>

                                    <div class="dropdown-menu" >
                                        <b-link class="dropdown-item dropdown-item--inside" @click="[edit = true, apartment_id = apartment.id]" v-if="getPermission.apartments.edit" v-b-modal.modal-edit>
                                            <i class="far fa-pencil"></i> {{ $t('edit') }}
                                        </b-link>

                                        <b-link v-if="getPermission.apartments.reserve && apartment.order.status === 'available'" @click="[reserve = true, apartment_id = apartment.id]" v-b-modal.modal-create class="dropdown-item dropdown-item--inside">
                                            <i class="far fa-calendar-check"></i> {{ $t('apartments.list.book') }}
                                        </b-link>

                                        <b-link v-if="apartment.order.status === 'booked' && apartment.order.user.id === getMe.user.id || getPermission.apartments.root_contract && apartment.order.status === 'booked'" @click="ReserveInfo(apartment)" v-b-modal.modal-view-client class="dropdown-item dropdown-item--inside" >
                                            <i class="far fa-eye"></i> {{ $t('apartments.list.view_client') }}
                                        </b-link>


                                        <b-link v-if="apartment.order.status === 'booked' && apartment.order.user.id != getMe.user.id" @click="getInfoReserve(apartment)" v-b-modal.modal-view-info-manager class="dropdown-item dropdown-item--inside" >
                                            <i class="far fa-info-circle"></i> {{ $t('apartments.list.view_manager') }}
                                        </b-link>

                                        <router-link :to="{ name: 'apartments-view', params: { id: apartment.id }  }" :class="'dropdown-item dropdown-item--inside'" v-if="(apartment.order.status != 'sold' || apartment.order.status != 'contract') && apartment.order.status === 'booked' && apartment.order.user.id === getMe.user.id && getPermission.apartments.contract || !(apartment.order.status == 'sold' || apartment.order.status == 'contract') && getPermission.apartments.root_contract || (apartment.order.status != 'sold' || apartment.order.status != 'contract') && apartment.order.status === 'available' && getPermission.apartments.contract">
<!--                                            apartment.order.status === 'booked' && apartment.order.user.id === getMe.user.id && getPermission.apartments.contract || apartment.order.status != 'sold' && getPermission.apartments.root_contract || apartment.order.status === 'available' && getPermission.apartments.contract-->
                                            <i class="far fa-ballot-check"></i> {{ $t('apartments.list.confirm') }}
                                        </router-link>

                                        <router-link :to="{ name: 'apartments-view', params: { id: apartment.id }  }" :class="'dropdown-item dropdown-item--inside'" v-if="getPermission.apartments.view && apartment.order.status === 'contract' ||getPermission.apartments.view && apartment.order.status === 'sold' || !getPermission.apartments.contract && getPermission.apartments.view  || apartment.order.status === 'booked' && apartment.order.user.id != getMe.user.id">
                                            <i class="far fa-eye"></i> {{ $t('apartments.list.more') }}
                                        </router-link>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <reserve-add v-if="reserve | getPermission.apartments.reserve" :apartment="apartment_id" @CreateReserve="CreateReserveSuccess"></reserve-add>

        <filter-form v-if="getPermission.apartments.filter" @Filtered="Filtered"></filter-form>

        <view-client v-if="info_reserve" @CancelReserve="CloseReserveInfo" :apartment-data="apartment_preview"  :client-id="client_id"></view-client>

        <edit-modal v-if="getPermission.apartments.edit || edit" :apartment="apartment_id" @EditApartment="EditApartment"></edit-modal>

        <info-manager-modal :manager-data="this.manager_apartment" @ManagerInfo="ManagerInfo"></info-manager-modal>
    </main>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    import Filter from '../Objects/Components/Filter/Apartment';
    import ReserveAdd from './Components/Reserve'
    import EditApartment from './Components/Edit'
    import ViewClient from './ViewClient'
    import InfoManager from './InfoManager'

    export default {
        components: {
            'filter-form': Filter,
            'reserve-add': ReserveAdd,
            'view-client': ViewClient,
            'edit-modal': EditApartment,
            'info-manager-modal': InfoManager
        },

        data: () => ({
            filter: {
                rooms: [],
                floors: [],
                price_from: null,
                price_to: null,
                status: 0,
                usd: false,

                area_from: null,
                area_to: null,
            },

            reserve: false,
            apartment_id: 0,
            order_id: 0,
            edit: false,

            info_reserve: false,
            apartment_preview: {},


            info_manager: false,
            manager_apartment: {}
        }),

        mounted() {
            this.fetchApartments(this);
        },

        computed: mapGetters(['getApartments', 'getPermission', 'getMe', 'getLoading']),

        methods: {
            ...mapActions(['fetchApartments', 'fetchApartmentsFilter', 'fetchReserveClient']),

            getPrice(area, price) {
                return price * area;
            },

            moment: function () {
                return this.$moment();
            },

            Filtered(event) {
                this.filter = event;
            },

            CreateReserve (id) {
                this.reserve = true;
                this.apartment_id = id;
            },

            CreateReserveSuccess() {
                this.fetchApartmentsFilter(this);
            },

            ReserveInfo(apartment) {
                this.info_reserve = true;
                this.apartment_preview = apartment;
                this.order_id = apartment.order.id;
                this.fetchReserveClient(this);
                // this.$bvModal.show('modal-view-client');
            },

            getInfoReserve(apartment) {
                this.info_manager = true;
                this.manager_apartment = apartment.order.user;
            },

            ManagerInfo () {
                this.info_manager = false;
                this.manager_apartment = {};
            },

            CloseReserveInfo() {
                this.info_reserve = false;
                this.apartment_preview = {};
                this.fetchApartmentsFilter(this);
            },

            EditApartment() {
                this.apartment_id = 0;
                this.edit = false;
                this.fetchApartments(this);
            }
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
    .dropdown-menu .active {
        background: transparent;
    }
</style>
