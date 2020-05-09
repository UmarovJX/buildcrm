<template>
    <main>
        <div class="object">
            <div class="object__item" v-for="(object, index) in getObjects" :key="index">

                <div class="object__more-info" v-if="getPermission.objects.create || getPermission.objects.update">
                    <div class="dropdown my-dropdown dropleft">
                        <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="far fa-ellipsis-h"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" v-if="getPermission.objects.update" href="#">
                                <i class="fas fa-pen"></i> {{ $t('edit') }}
                            </a>
                            <a class="dropdown-item" v-if="getPermission.objects.delete" @click="DeleteObject(object.id)" href="#">
                                <i class="fas fa-trash"></i> {{ $t('delete') }}
                            </a>
                        </div>
                    </div>
                </div>

                <router-link v-if="getPermission.objects.apartments" :class="'object__link'" :to="{ name: 'apartments', params: { id: object.id } }">
                    <div class="object__img" style="background-image: url('/vendor/dashboard/img/object__img1.png');"></div>
                    <div class="object__name">{{ object.name }}</div>
                    <div class="object__info">{{ $t('objects.apartments') }}: {{ object.apartment_count }}</div>
                    <div class="object__info">{{ $t('objects.address') }}: {{ object.address }}</div>
                </router-link>

                <a href="#" :class="'object__link'" v-else>
                    <div class="object__img" style="background-image: url('/vendor/dashboard/img/object__img1.png');"></div>
                    <div class="object__name">{{ object.name }}</div>
                    <div class="object__info">{{ $t('objects.apartments') }}: {{ object.apartment_count }}</div>
                    <div class="object__info">{{ $t('objects.address') }}: {{ object.address }}</div>
                </a>
            </div>

            <div class="object__item object__item-last" @click="createBlock" v-if="getPermission.objects.create">
                <a href="#" class="object__link">
                    <div class="object__add"><i class="fal fa-plus"></i></div>
                    <div class="object__name">
                        {{ $t('add') }}
                    </div>
                </a>
            </div>
            
        </div>
    </main>
<!--    <div>-->
<!--        <div class="container">-->
<!--            <div class="col-md-12 mt-3">-->
<!--                <div class="row">-->
<!--                    <div class="col-md-12 mb-3">-->
<!--                        <div class="row">-->

<!--                            <div class="col-md-6">-->
<!--                                <button type="button" data-toggle="collapse" href="#collapseFilter" role="button" aria-expanded="false" aria-controls="collapseFilter" class="btn btn-primary">-->
<!--                                    <i class="fa fa-filter"></i> {{ $t('apartments.list.filter') }}-->
<!--                                </button>-->
<!--                            </div>-->

<!--                            <div class="col-md-12">-->
<!--                                <div class="collapse mt-3" id="collapseFilter">-->
<!--                                    <div class="card card-body">-->
<!--                                        <div class="form-group">-->
<!--                                            <label>{{ $t('apartments.filter.apartments') }}</label><br>-->

<!--                                            <div class="form-check form-check-inline" v-for="(room, index) in getFilterRooms" :key="index">-->
<!--                                                <input class="form-check-input" v-model="filter.rooms" type="checkbox" :id="'rooms' + index" :value="room">-->
<!--                                                <label class="form-check-label" :for="'rooms' + index">{{ room }}</label>-->
<!--                                            </div>-->

<!--                                        </div>-->

<!--                                        <div class="form-group">-->
<!--                                            <label>{{ $t('apartments.filter.floor') }}</label><br>-->

<!--                                            <div class="form-check form-check-inline" v-for="(floor, index) in getFilterFloors" :key="index">-->
<!--                                                <input class="form-check-input" v-model="filter.floors" type="checkbox" :id="'floor' + index" :value="floor">-->
<!--                                                <label class="form-check-label" :for="'floor' + index">{{ floor }}</label>-->
<!--                                            </div>-->

<!--                                        </div>-->

<!--                                        <div class="col-md-12">-->
<!--                                            <div class="row">-->
<!--                                                <div class="col-md-12">-->
<!--                                                    <div class="row">-->
<!--                                                        <label>{{ $t('apartments.filter.price') }}</label>-->
<!--                                                    </div>-->
<!--                                                </div>-->

<!--                                                <div class="col-md-3">-->
<!--                                                    <div class="row">-->
<!--                                                        <div class="input-group mb-3">-->
<!--                                                            <div class="input-group-prepend">-->
<!--                                                                <span class="input-group-text" >{{ $t('apartments.filter.ot') }}</span>-->
<!--                                                            </div>-->
<!--                                                            <input type="number" v-model="filter.price_from" class="form-control"  >-->
<!--                                                        </div>-->
<!--                                                    </div>-->
<!--                                                </div>-->

<!--                                                <div class="col-md-4">-->
<!--                                                    <div class="input-group mb-3">-->
<!--                                                        <div class="input-group-prepend">-->
<!--                                                            <span class="input-group-text" >{{ $t('apartments.filter.do') }}</span>-->
<!--                                                        </div>-->
<!--                                                        <input type="number" v-model="filter.price_to" class="form-control" >-->
<!--                                                    </div>-->
<!--                                                </div>-->
<!--                                            </div>-->
<!--                                        </div>-->

<!--                                        <div class="col-md-12">-->
<!--                                            <div class="row">-->
<!--                                                <div class="col-md-12">-->
<!--                                                    <div class="row">-->
<!--                                                        <label>{{ $t('apartments.filter.area') }}</label>-->
<!--                                                    </div>-->
<!--                                                </div>-->

<!--                                                <div class="col-md-3">-->
<!--                                                    <div class="row">-->
<!--                                                        <div class="input-group mb-3">-->
<!--                                                            <div class="input-group-prepend">-->
<!--                                                                <span class="input-group-text" >{{ $t('apartments.filter.ot') }}</span>-->
<!--                                                            </div>-->
<!--                                                            <input type="number" v-model="filter.area_from" class="form-control"  >-->
<!--                                                        </div>-->
<!--                                                    </div>-->
<!--                                                </div>-->

<!--                                                <div class="col-md-4">-->
<!--                                                    <div class="input-group mb-3">-->
<!--                                                        <div class="input-group-prepend">-->
<!--                                                            <span class="input-group-text" >{{ $t('apartments.filter.do') }}</span>-->
<!--                                                        </div>-->
<!--                                                        <input type="number" v-model="filter.area_to" class="form-control" >-->
<!--                                                    </div>-->
<!--                                                </div>-->
<!--                                            </div>-->
<!--                                        </div>-->

<!--                                        <div class="form-group">-->
<!--                                            <label>{{ $t('apartments.filter.object') }}</label><br>-->
<!--                                            <div class="form-check form-check-inline" v-for="(object, index) in getObjects" :key="index">-->
<!--                                                <input class="form-check-input" v-model="filter.objects" type="checkbox" :id="'object' + index" :value="object.id">-->
<!--                                                <label class="form-check-label" :for="'object' + index">{{ object.name }}</label>-->
<!--                                            </div>-->
<!--                                        </div>-->

<!--                                        <div class="form-group">-->
<!--                                            <label>{{ $t('apartments.filter.status') }}</label><br>-->
<!--                                            <div class="form-check form-check-inline">-->
<!--                                                <input class="form-check-input" type="checkbox" v-model="filter.status" id="status" value="1">-->
<!--                                                <label class="form-check-label" for="status">{{ $t('apartments.filter.free') }}</label>-->
<!--                                            </div>-->

<!--                                        </div>-->



<!--                                        <button type="button" @click="filterSend" class="btn btn-success">-->
<!--                                            <i class="fa fa-filter"></i> {{ $t('apartments.list.filter') }}-->
<!--                                        </button>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->


<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {

        data: () => ({
            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            },

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

        computed: mapGetters(['getObjects', 'getPermission', 'getFilterRooms', 'getFilterFloors']),

        methods: {
            ...mapActions(['fetchObjects', 'fetchApartmentsFloors', 'fetchApartmentsRooms', 'fetchFilterApartments']),

            createBlock() {
                this.$router.push({ name: 'objectsStore'})
            },

            filterSend() {
                this.fetchFilterApartments(this);
                this.$router.push({ name: 'objects-filter' });
            },

            DeleteObject(object) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.get(process.env.VUE_APP_URL + '/api/objects/destroy/' + object, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');
                            this.fetchObjects(this);

                            this.$swal(
                                this.$t('sweetAlert.deleted'),
                                '',
                                'success'
                            );

                        }).catch((error) => {
                            if (! error.response) {
                                this.toasted('Error: Network Error', 'error');
                            } else {
                                this.toasted(error.response.data.error, 'error');
                            }
                        });
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
