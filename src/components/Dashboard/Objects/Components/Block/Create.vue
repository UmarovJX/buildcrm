<template>
    <div class="w-100">
        <form @submit.prevent="saveBlock" class="w-100">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-6">
                        <h3>
                            {{ $t('objects.create.new_block') }}
                        </h3>
                    </div>

                    <div class="col-md-6">
                        <button type="button" @click="removeBlock" class="btn btn-danger float-right">
                            <i class="fa fa-trash"></i> {{ $t('delete') }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-6 mt-3">
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">
                                    <i class="fa fa-home"></i>
                                </span>
                            </div>
                            <input type="text" class="form-control" v-model="block_preview.name" required :placeholder="$t('objects.placeholder.block_name')">
                        </div>
                    </div>

                    <div class="col-md-12 mt-3">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="count_floor">{{ $t('objects.create.count_floors') }}</label>
                                    <input type="number" v-model="block_preview.floor" min="1" required class="form-control" id="count_floor">
                                </div>
                            </div>

                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="count_apartments">{{ $t('objects.create.count_apartments') }}</label>
                                    <input type="number" v-model="block_preview.apartment" v-bind:disabled="disabled.apartments" required min="1" class="form-control" id="count_apartments">
                                </div>
                            </div>

                            <div class="col-md-4 pt-3" v-if="disabled.btn_save">
                                <p></p>
                                <button type="button" @click="createApartments" class="btn btn-primary btn-block">
                                    {{ $t('create') }}
                                </button>
                            </div>

                            <div class="col-md-12">
                                <hr>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-12" v-if="disabled.settings">
                        <h3>{{ $t('objects.create.prices') }}</h3>
                        <div class="row">
                            <!-- prices -->
                            <div class="col-md-12" v-for="(price, index) in block_preview.prices" :key="index">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="price_area">{{ $t('objects.create.price_area') }}</label>
                                            <input type="number" min="1" v-model="price.price" class="form-control" id="price_area" required>
                                        </div>
                                    </div>

                                    <div class="col-md-4 float-left">
                                        <div class="form-group">
                                            <label>{{ $t('objects.create.floors') }}</label>

                                            <multiselect
                                                    v-model="price.floors"
                                                    :multiple="true"
                                                    :options="settings.available_floors"
                                                    @select="selectFloor"
                                                    @remove="removeFloor"
                                            >
                                            </multiselect>

                                        </div>
                                    </div>

                                    <div class="col-1 pt-3">
                                        <p></p>
                                        <button type="button" v-if="block_preview.prices.length != 1" @click="removePrice(index)" class="btn btn-danger">
                                            <i class="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div class="col-md-8 ">
                                <button  class="btn btn-primary float-right" type="button" @click="addPrice">
                                    <i class="fa fa-plus"></i> {{ $t('objects.create.new_price') }}
                                </button>
                            </div>
                            <!-- prices -->

                            <!--apartments-->
                            <div class="col-md-12">
                                <hr>
                                <h3>{{ $t('objects.create.apartments') }}</h3>

                                <div class="row">
                                    <div class="col-md-3 mt-3" v-for="(apartment, index) in block_preview.apartments" :key="index">
                                        <div class="card">
                                            <div class="card-body">
                                                <p class="card-text">
                                                    {{ $t('objects.create.apartment') }} {{ index + 1 }} <br>

                                                </p>

                                                <div class="card-text">
                                                    <div class="form-group row">
                                                        <label class="col-sm-4 col-form-label">{{ $t('objects.create.floor') }}</label>
                                                        <div class="col-sm-8">
                                                            <select class="custom-select" v-model="apartment.floor">
                                                                <option v-for="floor in block_preview.floors" :value="floor" :key="floor">
                                                                    {{ floor }}
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="card-text">
                                                    <div class="form-group row">
                                                        <label class="col-sm-7 col-form-label">{{ $t('objects.create.plan') }}</label>
                                                        <div class="col-sm-5">
                                                            <select class="custom-select" v-model="apartment.type_plan" required>
                                                                <option v-for="(plan, index) in dataObject.type_plan" :value="index" :key="index">
                                                                    {{ plan.name }}
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="card-text">
                                                    <div class="form-group row">
                                                        <label class="col-sm-8 col-form-label">{{ $t('objects.create.rooms') }}</label>
                                                        <div class="col-sm-4">
                                                            <input type="number" min="1" required class="form-control" v-model="apartment.rooms">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="card-text">
                                                    <div class="form-group row">
                                                        <label class="col-sm-8 col-form-label">{{ $t('objects.create.area') }}</label>
                                                        <div class="col-sm-4">
                                                            <input type="number" min="1" required class="form-control" v-model="apartment.area">
                                                        </div>
                                                    </div>
                                                </div>

                                                <p class="card-text">
                                                    {{ $t('objects.create.price') }}: {{ calcApartmentPrice(index, apartment.area, apartment.floor) }} сум
                                                </p>


                                            </div>
                                        </div>
                                    </div><!--apartment for-->

                                    <div class="col-md-3 mt-3" @click="createApartment">
                                        <div class="card  text-center">
                                            <div class="card-body">
                                                <h1 class="card-title">
                                                    <i class="fa fa-plus"></i>
                                                </h1>

                                                <div class="cart-text">
                                                    {{ $t('add') }}
                                                </div>

                                                <div class="card-text">

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <!--apartments-->

                            <div class="col-md-12">
                                <div class="row">
                                    <button type="submit" class="btn btn-success">
                                        <i class="fa fa-save"></i> {{ $t('save') }}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        props: ['dataObject'],

        data: () => ({

            block_preview: {
                name: null,
                floor: 1,
                apartment: 1,
                apartments: [],
                floors: [],
                prices: []
            },

            settings: {
                available_floors: [],
                disabled_floors: []
            },

            disabled: {
                apartments: false,
                block_create: false,
                settings: false,
                btn_save: true,
            }

        }),

        watch: {
            'block_preview.apartment': function () {
                if (this.block_preview.apartment > 0 && this.block_preview.floor > 0) {
                    this.disabled.btn_save = true;
                }
            },

            'block_preview.floor': function () {
                if (this.block_preview.apartment > 0 && this.block_preview.floor > 0) {
                    this.disabled.btn_save = true;
                }
            }
        },

        methods: {
            saveBlock() {
                    this.$emit('InsertBlock', {...this.block_preview});
                    this.$emit('RemoveBlock');
                    this.clearPreviewBlock();
            },

            removeBlock() {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.$emit('RemoveBlock');
                        this.clearPreviewBlock();
                    }
                });
            },

            clearPreviewBlock() {
                this.block_preview.apartment = 1;
                this.block_preview.apartments = [];
                this.block_preview.floor = 1;
                this.block_preview.floors = [];
                this.block_preview.name = '';
                this.block_preview.prices = [];

                this.disabled.block_create = false;
                this.disabled.btn_save = true;
                this.disabled.settings = false;
                this.disabled.apartments = false;
            },

            createApartments() {
                if (!this.disabled.apartments) {
                    for (let i = 0; i < this.block_preview.apartment; i++) {
                        this.block_preview.apartments.push({
                            floor: 1,
                            type_plan: null,
                            rooms: 0,
                            area: 0,
                            price: 0,
                            price_id: 0
                        })
                    }
                    this.disabled.apartments = true;

                    this.block_preview.prices.push({
                        price: 0,
                        floors: []
                    });
                }

                this.block_preview.floors = [];
                this.settings.available_floors = [];

                if (this.settings.available_floors.length > 0|| this.settings.disabled_floors.length > 0) {
                    for (let i = 1; i <= this.block_preview.floor; i++) {
                        this.block_preview.floors.push(i);
                        this.settings.available_floors.push(i);
                    }
                    this.settings.disabled_floors = [];
                    this.block_preview.prices = [{
                        price: 0,
                        floors: []
                    }];
                } else {
                    for (let i = 1; i <= this.block_preview.floor; i++) {
                        this.block_preview.floors.push(i);
                        this.settings.available_floors.push(i);
                    }
                }

                this.disabled.settings = true;
                this.disabled.btn_save = false;
            },

            selectFloor(index) {
                let keyy = 0;
                this.settings.available_floors.map((value, key) => {
                    if (value === index) {
                        keyy =  key;
                    }
                });

                this.settings.available_floors.splice(keyy, 1);
                this.settings.disabled_floors.push(index);
                this.sortDisabledFloors()
            },

            removeFloor(index) {
                let keyy = 0;

                this.settings.disabled_floors.map((value, key) => {
                    if (value === index) {
                        keyy =  key;
                    }
                });

                this.settings.disabled_floors.splice(keyy, 1);
                this.settings.available_floors.push(index);
                this.sortAvailableFloors()
            },

            calcApartmentPrice(index, area, floor) {
                var price = 0;

                for (var prices = 0; prices < this.block_preview.prices.length; prices++) {
                    for (var floors = 0; floors < this.block_preview.prices[prices].floors.length; floors++) {
                        if (this.block_preview.prices[prices].floors[floors] === floor) {
                            this.block_preview.apartments[index].price_id = prices;
                            price = this.block_preview.prices[prices].price;
                        }
                    }
                }

                return price * area;
            },


            sortDisabledFloors() {
                this.settings.disabled_floors.sort((a, b) => {
                    return a - b;
                });
            },

            sortAvailableFloors() {
                this.settings.available_floors.sort((a, b) => {
                    return a - b;
                });
            },

            createApartment() {
                this.block_preview.apartments.push({
                    floor: 1,
                    type_plan: null,
                    rooms: 0,
                    area: 0,
                    price: 0,
                });

                this.block_preview.apartment += 1;
            },

            addPrice() {
                this.block_preview.prices.push({
                    price: 0,
                    floors: []
                })
            },

            removePrice(index) {
                this.block_preview.prices[index].floors.map((value) => {
                    for (let ii = 0; ii < this.settings.disabled_floors.length; ii++) {
                        if (value == this.settings.disabled_floors[ii]) {
                            this.settings.disabled_floors.splice(ii, 1);
                            this.settings.available_floors.push(value);
                            this.sortAvailableFloors();
                            this.sortDisabledFloors();
                        }
                    }
                });
                this.block_preview.prices.splice(index, 1);
            },
        }
    }
</script>

<style scoped>

</style>
