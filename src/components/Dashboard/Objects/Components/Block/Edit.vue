<template>
    <div>
        <b-modal id="modal-edit-object" class="py-4" ref="modal" :title="$t('objects.create.edit_block')" size="lg" hide-footer hide-header-close no-close-on-backdrop>
            <form class="my-form" @submit.prevent="saveBlock">
                <div class="container px-0 mx-0">
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3">
                                <label class="d-block" for="new_block_title">
                                    {{ $t('objects.create.name') }}
                                </label>
                                <input v-model="block_preview.name" required :placeholder="$t('objects.placeholder.block_name')" id="new_block_title" class="my-form__input" type="text" >
                            </div>
                        </div>
                        <div class="col-lg-9">
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-3">
                                        <label class="d-block" for="new_block_floor-count">
                                            {{ $t('objects.create.count_floors') }}
                                        </label>
                                        <input v-model="block_preview.floor" required class="my-form__input" type="number" value="15" id="new_block_floor-count" min="1" max="100">
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <div class="mb-3">
                                        <label class="d-block" for="new_block_room-count">
                                            {{ $t('objects.create.count_apartments') }}
                                        </label>
                                        <input class="my-form__input" v-model="block_preview.apartment" v-bind:disabled="disabled.apartments" required min="1" type="number" id="new_block_room-count">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 d-flex flex-column justify-content-end align-items-end">
                            <div class="mb-3" v-if="disabled.btn_save">
                                <button type="button" @click="createApartments" class=" my-btn my-btn__blue">
                                    {{ $t('create') }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="disabled.settings">
                        <div class="row" v-for="(price, index) in block_preview.prices" :key="index" >
                            <div class="col-lg-4">
                                <div class="mb-3">
                                    <label class="d-block" for="new_block_price">
                                        {{ $t('objects.create.price_area') }}
                                    </label>
                                    <input id="new_block_price" class="my-form__input" type="number" v-model="price.price" required min="1">
                                </div>
                            </div>
                            <div class="col-lg-8">
                                <div class="mb-3">
                                    <div>
                                        <label class="d-block">
                                            {{ $t('objects.create.floors') }}
                                        </label>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <multiselect
                                                    v-model="price.floors"
                                                    :multiple="true"
                                                    :options="settings.available_floors"
                                                    @select="selectFloor"
                                                    @remove="removeFloor"
                                            >
                                            </multiselect>
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn-danger ml-2" v-if="block_preview.prices.length != 1" @click="removePrice(index)">
                                                <i class="far fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="mt-4 d-flex justify-content-md-start justify-content-center" v-if="disabled.settings">
                    <button type="button" class="my-btn my-btn__blue" @click="addPrice">
                        <i class="fal fa-plus mr-2"></i> {{ $t('objects.create.new_price') }}
                    </button>
                </div>


                <hr class="mt-4 mb-3" v-if="disabled.settings">

                <div class="container px-0 mx-0" v-if="disabled.settings">
                    <div class="row">
                        <div class="col-lg-4 my-2" v-for="(apartment, index) in block_preview.apartments" :key="index">
                            <div class="apartment">
                                <button type="button" class="apartment__close" @click="removeApartment(index)">
                                    <i class="fal fa-times"></i>
                                </button>

                                <div class="apartment__info">
                                    {{ $t('objects.create.apartment') }} <span>{{ index + 1 }}</span>
                                </div>

                                <div class="apartment__info">
                                    {{ $t('objects.create.floor') }}:

                                    <select class="custom-select" v-model="apartment.floor">
                                        <option v-for="floor in block_preview.floors" :value="floor" :key="floor">
                                            {{ floor }}
                                        </option>
                                    </select>
                                </div>

                                <div class="apartment__info">
                                    <div class="dropdown my-dropdown__two">
                                        <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                            {{ $t('objects.create.plan.name') }}
                                        </button>
                                        <select class="custom-select" v-model="apartment.type_plan" required>
                                            <option disabled selected value="null">
                                                {{ $t('objects.create.choose_plan') }}
                                            </option>

                                            <option v-for="(plan, index) in dataObject.type_plan" :value="index" :key="index">
                                                {{ plan.name }}
                                            </option>

                                        </select>
                                    </div>
                                </div>
                                <div class="apartment__info">
                                    {{ $t('objects.create.rooms') }}:
                                    <input type="number" min="1" required class="form-control" v-model="apartment.rooms">
                                </div>

                                <div class="apartment__info">
                                    {{ $t('objects.create.entrance') }}:
                                    <input type="number" min="1" required class="form-control" v-model="apartment.entrance">
                                </div>

                                <div class="apartment__info">
                                    {{ $t('objects.create.area') }}:
                                    <input type="number" min="0" required class="form-control" disabled v-if="apartment.type_plan === null" >
                                    <input type="number" min="1" required class="form-control" disabled v-else v-model="dataObject.type_plan[apartment.type_plan].area">
                                </div>

                                <div v-if="dataObject.type_plan[apartment.type_plan] && dataObject.type_plan[apartment.type_plan].balcony">
                                    <div class="apartment__info">
                                        {{ $t('objects.create.plan.balcony_area') }}:
                                        <input type="number" min="0" required class="form-control" disabled v-if="apartment.type_plan === null" >
                                        <input type="number" min="1" required class="form-control" disabled v-else v-model="dataObject.type_plan[apartment.type_plan].balcony_area">
                                    </div>

                                    {{ $t('objects.create.plan.balcony_paid') }}:
                                    <input type="checkbox" v-model="apartment.balcony_paid">
                                </div>

                                <div class="apartment__info">
                                    {{ $t('objects.create.price') }}:
                                    <span>{{  calcApartmentPrice(index, apartment.type_plan === null ? 0 : dataObject.type_plan[apartment.type_plan], apartment, 0) | number('0,0', { thousandsSeparator: ' ' }) }} {{ $t('usd') }}</span><br>

                                    {{ $t('objects.create.price') }} {{ $t('ye') }}:
                                    <span>{{  calcApartmentPrice(index, apartment.type_plan === null ? 0 : dataObject.type_plan[apartment.type_plan], apartment, currency.usd) | number('0,0', { thousandsSeparator: ' ' }) }} {{ $t('ye') }}</span>
                                </div>

                            </div>
                        </div>

                        <div class="col-lg-4 my-2">
                            <div class="apartment apartment-last">
                                <a href="#" @click="createApartment" class="object__link position-relative top-0 left-0">
                                    <div class="object__add object__add--inside"><i class="fal fa-plus"></i></div>
                                    <div class="object__name object__name--inside">
                                        {{ $t('objects.create.apartment') }}
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="mt-4 mb-3">

                <div class="mt-4 d-flex justify-content-md-start justify-content-center float-right">
                    <button type="button" class="btn btn-default mr-2" @click="cancelBlock">
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
    export default {
        props: ['dataObject', 'block_preview', 'currency', 'balcony'],

        data: () => ({
            //block_preview: dataBlock,

            settings: {
                available_floors: [],
                disabled_floors: []
            },

            disabled: {
                apartments: true,
                block_create: true,
                settings: true,
                btn_save: false,
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
                // this.$emit('InsertBlock', {...this.block_preview});
                this.$emit('SaveEditBlock');
                this.clearPreviewBlock();
            },

            cancelBlock() {
                this.$emit('CancelEditBlock');
                this.$bvModal.hide('modal-edit-object');
                this.clearPreviewBlock();
            },

            clearPreviewBlock() {
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
                            // area: 0,
                            price: 0,
                            balcony_paid: false,
                            entrance: 1,
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

            calcApartmentPrice(index, area, apartment, currency) {
                var price = 0;

                if (area === 0)
                    return 0;

                for (var prices = 0; prices < this.block_preview.prices.length; prices++) {
                    for (var floors = 0; floors < this.block_preview.prices[prices].floors.length; floors++) {
                        if (this.block_preview.prices[prices].floors[floors] === apartment.floor) {
                            this.block_preview.apartments[index].price_id = prices;
                            price = this.block_preview.prices[prices].price;
                        }
                    }
                }

                if (currency === 0) {
                    if (area.balcony && apartment.balcony_paid)
                        return (price * area.area) + (this.balcony * area.balcony_area);

                    return price * area.area;
                } else {
                    if (area.balcony && apartment.balcony_paid)
                        return ((price * area.area) + (this.balcony * area.balcony_area)) * currency;

                    return price * area.area * currency;
                }

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
                    // area: 0,
                    price: 0,
                    balcony_paid: false,
                    entrance: 1
                });

                let apartment_count = this.block_preview.apartment + 1;

                this.block_preview.apartment = apartment_count;
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

            removeApartment(index) {
                this.block_preview.apartment -= 1;
                this.block_preview.apartments.splice(index, 1)
            }
        }
    }
</script>

<style scoped>

</style>
