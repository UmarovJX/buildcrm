<template>
    <div>
        <div class="container">
            <div class="col-md-12 mt-3">
                <div class="row">
                    <div class="col-md-12 mb-3">
                        <div class="row">
                            <div class="col-md-6">
                                {{ $t('apartments.list.apartments') }}: {{ getFilteredApartments.length }}
                            </div>
                            <div class="col-md-6">
                                <button type="button" data-toggle="collapse" href="#collapseFilter" role="button" aria-expanded="false" aria-controls="collapseFilter" class="btn btn-primary">
                                    <i class="fa fa-filter"></i> {{ $t('apartments.list.filter') }}
                                </button>
                            </div>

                            <div class="col-md-12">
                                <div class="collapse mt-3" id="collapseFilter">
                                    <div class="card card-body">
                                        <div class="form-group">
                                            <label>{{ $t('apartments.filter.apartments') }}</label><br>

                                            <div class="form-check form-check-inline" v-for="(room, index) in getFilterRooms" :key="index">
                                                <input class="form-check-input" v-model="filter.rooms" type="checkbox" :id="'rooms' + index" :value="room">
                                                <label class="form-check-label" :for="'rooms' + index">{{ room }}</label>
                                            </div>

                                        </div>

                                        <div class="form-group">
                                            <label>{{ $t('apartments.filter.floor') }}</label><br>

                                            <div class="form-check form-check-inline" v-for="(floor, index) in getFilterFloors" :key="index">
                                                <input class="form-check-input" v-model="filter.floors" type="checkbox" :id="'floor' + index" :value="floor">
                                                <label class="form-check-label" :for="'floor' + index">{{ floor }}</label>
                                            </div>

                                        </div>

                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="row">
                                                        <label>{{ $t('apartments.filter.price') }}</label>
                                                    </div>
                                                </div>

                                                <div class="col-md-3">
                                                    <div class="row">
                                                        <div class="input-group mb-3">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text" >{{ $t('apartments.filter.ot') }}</span>
                                                            </div>
                                                            <input type="number" v-model="filter.price_from" class="form-control"  >
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-md-4">
                                                    <div class="input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text" >{{ $t('apartments.filter.do') }}</span>
                                                        </div>
                                                        <input type="number" v-model="filter.price_to" class="form-control" >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="row">
                                                        <label>{{ $t('apartments.filter.area') }}</label>
                                                    </div>
                                                </div>

                                                <div class="col-md-3">
                                                    <div class="row">
                                                        <div class="input-group mb-3">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text" >{{ $t('apartments.filter.ot') }}</span>
                                                            </div>
                                                            <input type="number" v-model="filter.area_from" class="form-control"  >
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="col-md-4">
                                                    <div class="input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <span class="input-group-text" >{{ $t('apartments.filter.do') }}</span>
                                                        </div>
                                                        <input type="number" v-model="filter.area_to" class="form-control" >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label>{{ $t('apartments.filter.object') }}</label><br>
                                            <div class="form-check form-check-inline" v-for="(object, index) in getObjects" :key="index">
                                                <input class="form-check-input" v-model="filter.objects" type="checkbox" :id="'object' + index" :value="object.id">
                                                <label class="form-check-label" :for="'object' + index">{{ object.name }}</label>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label>{{ $t('apartments.filter.status') }}</label><br>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="checkbox" v-model="filter.status" id="status" value="1">
                                                <label class="form-check-label" for="status">{{ $t('apartments.filter.free') }}</label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table class="table">
                        <thead class="thead-dark">
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
                                {{ $t('action') }}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(apartment, index) in getFilteredApartments" :key="index">
                            <th scope="row">
                                {{ apartment.block.name }}-{{ apartment.id }}
                            </th>

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
                                {{ apartment.status | getStatus($moment(apartment.booking_date).format('DD.MM.YYYY'))  }}
                            </td>
                            <td class="text-right">
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fa fa-ellipsis-v"></i>
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" href="#" ><i class="fa fa-unlock-alt"></i> {{ $t('apartments.list.book') }}</a>
                                        <a class="dropdown-item" href="#" ><i class="fa fa-database"></i> {{ $t('apartments.list.confirm') }}</a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
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
            }
        }),

        mounted() {
            this.fetchObjects(this);
            this.fetchApartmentsFloors(this);
            this.fetchApartmentsRooms(this);
        },

        watch: {
            'filter.rooms': function () {
                this.fetchFilterApartments(this);
            },

            'filter.floors': function () {
                this.fetchFilterApartments(this);
            },

            'filter.price_from': function () {
                this.fetchFilterApartments(this);
            },

            'filter.price_to': function () {
                this.fetchFilterApartments(this);
            },

            'filter.area_from': function () {
                this.fetchFilterApartments(this);
            },

            'filter.area_to': function () {
                this.fetchFilterApartments(this);
            },

            'filter.status': function () {
                this.fetchFilterApartments(this);
            },

            'filter.objects': function () {
                this.fetchFilterApartments(this);
            },
        },

        computed: mapGetters(['getObjects', 'getFilteredApartments', 'getFilterRooms', 'getFilterFloors']),

        methods: {
            ...mapActions(['fetchFilterApartments', 'fetchObjects', 'fetchApartmentsFloors', 'fetchApartmentsRooms',]),

            getPrice(area, price) {
                return price * area;
            },

            moment: function () {
                return this.$moment();
            }
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
