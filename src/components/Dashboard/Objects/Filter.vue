<template>
    <main>
        <div class="mt-4">
<!--            <div class="title__default my-2">Ташкент, Мирабадский район, пересечение улиц Янгизамон и Сайхун </div>-->
            <div class="title__default my-2">
                {{ $t('apartments.list.apartments') }}: {{ getFilteredApartments.length }}
            </div>
        </div>
        <div class="my-container px-0 mx-0">
            <div class="table-responsive">
                <table class="table table-borderless my-table my-table-second">
                    <thead>
                    <tr>
                        <th scope="col" width="50">{{ $t('apartments.list.number') }}</th>
                        <th scope="col">{{ $t('apartments.list.object') }}</th>
                        <th scope="col">{{ $t('apartments.list.building') }}</th>
                        <th scope="col">{{ $t('apartments.list.block') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.rooms') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.floor') }}</th>
                        <th scope="col" class="text-center">{{ $t('apartments.list.area') }}</th>
                        <th scope="col">{{ $t('apartments.list.price') }}</th>
                        <th scope="col">{{ $t('apartments.list.status') }}</th>
                        <th scope="col" class="text-right">

                        </th>

                    </tr>
                    </thead>
                    <tbody>

                        <tr v-if="getFilteredApartments.length == 0">
                            <td colspan="10">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>
                        <tr v-for="(apartment, index) in getFilteredApartments" :key="index">
                            <td scope="row">
                                {{ apartment.block.name }}-{{ apartment.id }}
                            </td>

                            <td>
                                {{ apartment.block.building.object.name }}
                            </td>

                            <td>
                                {{ apartment.block.building.name }}
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
                                {{ apartment.area }}
                            </td>

                            <td>
                                {{ getPrice(apartment.area, apartment.price.price) | number('0,0', { thousandsSeparator: ' ' }) }} сум
                            </td>
                            <td>
                                <small>{{ apartment.status | getStatus($moment(apartment.booking_date).format('DD.MM.YYYY'))  }}</small>
                            </td>
                            <td>
                                <div class="dropdown my-dropdown dropleft">
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>
                                    <div class="dropdown-menu">
                                        <b-link v-if="getPermission.apartments.reserve" @click="CreateReserve(apartment.id)" v-b-modal.modal-create class="dropdown-item dropdown-item--inside">
                                            <i class="far fa-calendar-check"></i> {{ $t('apartments.list.book') }}
                                        </b-link>

                                        <a class="dropdown-item dropdown-item--inside" href="product-item.html">
                                            <i class="far fa-ballot-check"></i> {{ $t('apartments.list.confirm') }}
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>


                    </tbody>
                </table>
            </div>
        </div>

        <div class="my-container px-0 mx-0 my-4" v-if="getPermission.apartments.filter">
            <div class="d-flex justify-content-md-end justify-content-center">
                <b-link class="my-btn my-btn__blue d-flex align-items-center justify-content-center" v-b-modal.modal-filter-all>
                    <i class="far fa-sliders-h mr-2"></i> {{ $t('apartments.list.filter') }}
                </b-link>
            </div>
        </div>

        <reserve-add v-if="reserve | getPermission.apartments.reserve" :apartment="apartment_id" @CreateReserve="CreateReserveSuccess"></reserve-add>

        <filter-form v-if="getPermission.apartments.filter" @Filtered="Filtered"></filter-form>
    </main>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import Filter from './Components/Filter/All';
    import ReserveAdd from './Components/Apartment/Reserve'

    export default {
        components: {
            'filter-form': Filter,
            'reserve-add': ReserveAdd
        },

        data: () => ({
            filter: {
                rooms: [],
                floors: [],
                price_from: null,
                price_to: null,
                status: 0,

                objects: [],
                area_from: null,
                area_to: null,
            },

            reserve: false,
            apartment_id: 0
        }),

        mounted() {
            this.fetchObjects(this);
        },

        computed: mapGetters(['getObjects', 'getFilteredApartments', 'getPermission']),

        methods: {
            ...mapActions(['fetchFilterApartments', 'fetchObjects']),

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
                this.fetchFilterApartments(this);
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
