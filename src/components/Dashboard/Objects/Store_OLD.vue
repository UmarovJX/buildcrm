<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <h1 class="title__big mb-md-0 mb-3">{{ $t('objects.create.new') }}</h1>
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

        <div class="new-object px-3 px-sm-4 py-4">
            <!-- <div class="my-form"> -->
            <form @submit.prevent="submitObject">
                <div class="container px-0 mx-0">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="d-block text-uppercase" for="title">
                                    {{ $t('objects.create.name') }}
                                </label>
                                <vs-input v-model="value" placeholder="Name" />
                                <input class="my-form__input" v-model="object.name" id="title" type="text" required :placeholder="$t('objects.placeholder.name')">
                            </div>
                        </div>

                        <div class="col-lg-6">

                            <div class="mb-3">
                                <label class="d-block text-uppercase" for="address">
                                    {{ $t('objects.address') }}
                                </label>
                                <input class="my-form__input" id="address" type="text" v-model="object.address" :placeholder="$t('objects.placeholder.address')" required >
                            </div>
                        </div>

                        <div class="col-lg-6">

                            <div class="mb-3">
                                <label class="d-block text-uppercase" for="address">
                                    {{ $t('companies.title') }}
                                </label>
                                <select class="form-control" v-model="object.branch_id">
                                    <option value="0">
                                        {{ $t('companies.branch_enter') }}
                                    </option>
                                    <option v-for="(branch, index) in getBranches" :key="index" :value="branch.id">
                                        {{ branch.type.name.ru }} "{{ branch.name }}"
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- </div> -->

                <hr>


                <div>
                    <label class="d-block text-uppercase" for="type_plan">
                        {{ $t('objects.create.type_plan') }}
                    </label>

                    <table class="table table-striped" v-if="object.type_plan.length > 0">
                        <thead>
                        <tr>
                            <th scope="col" width="10">#</th>
                            <th scope="col">{{ $t('objects.create.plan.name') }}</th>
                            <th scope="col">{{ $t('objects.create.plan.area') }}</th>
                            <th scope="col">{{ $t('objects.create.plan.balcony') }}</th>
                            <th scope="col">{{ $t('objects.create.plan.balcony_area') }}</th>
                            <th scope="col" width="150" class="text-right">{{ $t('action') }}</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(plan, index) in object.type_plan" :key="index" >
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ plan.name }}</td>
                                <td>{{ plan.area }}</td>
                                <td>{{ plan.balcony ? $t('yes') : $t('no') }}</td>
                                <td>{{ plan.balcony_area }}</td>
                                <td class="text-right">
                                    <b-button v-if="!plan.deleted" size="sm" variant="danger" @click="deletePlan(plan)">
                                        <i class="fas fa-trash"></i>
                                    </b-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <b-button variant="success" v-b-modal.modal-create-type-plan v-if="object.type_plan.length > 0">
                        <i class="fas fa-plus-circle"></i> {{ $t('objects.create.new_type_plan') }}
                    </b-button>

                    <div class="object__item object__item--inside object__item-last" v-if="object.type_plan.length === 0" >
                        <b-link class="object__link" @click="disabled.plan.create = true" v-b-modal.modal-create-type-plan>
                            <div class="object__add object__add--inside"><i class="fal fa-plus"></i></div>
                            <div class="object__name object__name--inside">
                                {{ $t('objects.create.new_type_plan') }}
                            </div>
                        </b-link>
                    </div>

<!--                    <div class="d-flex my-btn__group">-->
<!--                        <input type="text" id="type_plan" v-model="object.new_type_plan" :placeholder="$t('objects.placeholder.type_plan')">-->
<!--                        <button type="button" class="border-left-0 my-btn my-btn__blue d-flex align-items-center" @click="addTypePlan">-->
<!--                            <i class="fal fa-plus mr-2"></i> {{ $t('add') }}-->
<!--                        </button>-->
<!--                    </div>-->

<!--                    <div class="type-plane mt-1">-->
<!--                        <span v-if="object.type_plan.length === 0" class="text-danger">-->
<!--                            {{ $t('objects.create.no_type_plan') }}-->
<!--                        </span>-->
<!--                            <span v-for="(plan, index) in object.type_plan" :key="index">-->
<!--                            {{ plan.name }},-->
<!--                        </span>-->
<!--                    </div>-->
                </div>

                <hr>

                <div v-if="object.type_plan.length > 0">
                    <!-- ЗДАНИЕ 1 -->
                    <div  v-for="(building, index) in buildings" :key="index">
                        <div v-if="!building.edit">
                            <h3 class="title__middle my-3">
                                {{ building.name }}
                            </h3>
                        </div>

                        <div v-if="!building.edit">
                            <p class="my-3">
                                {{ $t('objects.create.balcony_price') }}: {{ building.balcony_price ? building.balcony_price : $t('no') }} $
                            </p>
                        </div>

                        <div class="col-md-4" v-else>
                            <div class="row">
<!--                                <div class="input-group">-->
<!--                                    <input type="text" :placeholder="$t('objects.placeholder.building_name')" class="form-control"  v-model="building.name">-->
<!--                                    <div class="input-group-append">-->
<!--                                        <button class="btn btn-success" @click="saveBuildingName(index)" type="button">-->
<!--                                            <i class="fa fa-save"></i> {{ $t('save') }}-->
<!--                                        </button>-->
<!--                                    </div>-->
<!--                                </div>-->

                                <div class="input-group mb-3">
                                    <span class="input-group-text">
                                        {{ $t('objects.placeholder.building_name') }}
                                    </span>
                                    <input type="text" class="form-control" v-model="building.name" :placeholder="$t('objects.placeholder.building_name')">
                                </div>

                                <div class="input-group mb-3">
                                    <span class="input-group-text">
                                        {{ $t('objects.create.balcony_price') }}
                                    </span>
                                    <input type="text" class="form-control"  v-model="building.balcony_price" :placeholder="$t('objects.create.balcony_price')">
                                </div>

                                <button class="btn btn-success" @click="saveBuildingName(index)" type="button">
                                    <i class="fa fa-save"></i> {{ $t('save') }}
                                </button>

                            </div>
                        </div>

                        <div class="new-object__inside px-3 px-sm-4 py-4 my-4">
                        <!-- Квартирные блоки -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h3 class="title__middle mb-0">{{ $t('objects.create.blocks_apartment') }}</h3>
                            <div>
                                <div class="dropdown my-dropdown dropleft">
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>
                                    <div class="dropdown-menu">
                                        <a class="dropdown-item dropdown-item--inside" href="#" @click="editBuildingName(index)" >
                                            <i class="fas fa-pen"></i> {{ $t('edit') }}
                                        </a>

                                        <a class="dropdown-item dropdown-item--inside" href="#" @click="CopyBuilding(index)" >
                                            <i class="fas fa-copy"></i> {{ $t('objects.create.copy_building') }}
                                        </a>

                                        <a v-if="buildings.length > 1" class="dropdown-item dropdown-item--inside" href="#" @click="deleteBuilding(index)">
                                            <i class="far fa-trash"></i> {{ $t('delete') }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="object "><!--mb-5-->
                            <div class="object__item object__item--inside" v-for="(block, indexx) in building.blocks" :key="indexx">
                                <div class="object__more-info">
                                    <div class="dropdown my-dropdown dropleft">
                                        <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                            <i class="far fa-ellipsis-h"></i>
                                        </button>
                                        <div class="dropdown-menu">

                                            <b-link class="dropdown-item dropdown-item--inside" href="#" @click="editBlock(index, indexx)" v-b-modal.modal-edit-object>
                                                <i class="fas fa-pen"></i> {{ $t('edit') }}
                                            </b-link>

                                            <a class="dropdown-item dropdown-item--inside" @click="CopyBlock(index, indexx)">
                                                <i class="far fa-copy"></i>{{ $t('objects.create.copy_block') }}
                                            </a>

                                            <a class="dropdown-item dropdown-item--inside" @click="deleteBlock(index, indexx)">
                                                <i class="far fa-trash"></i> {{ $t('delete') }}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <a href="#" class="object__link">
                                    <div class="object__img object__img--inside" style="background-image: url('/vendor/dashboard/img/object__img2.png');"></div>
                                    <div class="object__name object__name--inside">
                                        {{ block.name }}
                                    </div>
                                    <div class="object__info object__info--inside">
                                        {{ $t('objects.create.apartments') }}: {{ block.apartments.length }},
                                        {{ $t('objects.create.floors') }}: {{ block.floor }}
                                    </div>
                                </a>
                            </div>

                            <div class="object__item object__item--inside object__item-last">
                                <b-link @click="createBlock(index)" class="object__link" v-b-modal.modal-create-object>
                                    <div class="object__add object__add--inside"><i class="fal fa-plus"></i></div>
                                    <div class="object__name object__name--inside">
                                        {{ $t('objects.create.new_block') }}
                                    </div>
                                </b-link>
                            </div>
                        </div>

                        <!-- Parking lot -->
                    </div>
                    </div>

                    <div class="d-flex justify-content-center justify-content-md-start">
                        <a href="#" class="my-btn my-btn__blue d-flex align-items-center" @click="createBuilding">
                            <i class="fal fa-plus mr-2"></i> {{ $t('objects.create.create_build') }}
                        </a>
                    </div>

                    <hr class="mt-4 mb-3">

                    <div class="container px-0 mx-0">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="discount mt-4 mb-4" v-for="(discount, index) in discounts" :key="index">
                                    <div class="container px-0 mx-0">
                                        <div class="row">
                                            <div >
                                                <div class="col-lg-5 float-left">
                                                    <div class="mb-3">
                                                        <label class="d-block" for="new_block_prepay">
                                                            {{ $t('objects.create.pre_pay') }}
                                                        </label>
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <div class="">
                                                                <input id="new_block_prepay" class="my-form__input" disabled type="text" :value="discount.prepay_from +'%'">
                                                            </div>
                                                            <div class="mx-2 long-horizontal-line">
                                                                &#8213;
                                                            </div>
                                                            <div class="">
                                                                <input id="new_block_prepay_to" class="my-form__input" disabled type="text" :value="discount.prepay_to +'%'">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-7 float-left">
                                                    <div class="mb-3">
                                                        <div>
                                                            <label class="d-block" for="new_block_discount">
                                                                   {{ $t('objects.create.discount') }}
                                                            </label>
                                                        </div>
                                                        <div class="d-flex align-items-center">
                                                            <div class="flex-grow-1">
                                                                <input id="new_block_discount" class="my-form__input" disabled type="text"  :value="discount.discount +'%'">
                                                            </div>
                                                            <div>
                                                                <button type="button" class="my-btn my-btn__blue my-btn__blue--small ml-2" @click="editDiscount(index)" v-b-modal.modal-edit-discount>
                                                                    <i class="far fa-pen"></i>
                                                                </button>
                                                            </div>
                                                            <div>
                                                                <button type="button" class="my-btn my-btn__blue my-btn__blue--small ml-2" @click="DeleteDiscount(index)">
                                                                    <i class="far fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-md-start justify-content-center">
                                    <button type="button" class="my-btn my-btn__blue" @click="disabled.discount.create = true" v-b-modal.modal-create-discount>
                                        <i class="fal fa-plus mr-2"></i> {{ $t('objects.create.create_discount') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <div class="mt-4 d-flex justify-content-md-end justify-content-center">
                        <button type="submit" class=" my-btn my-btn__blue">
                            <i class="fa fa-save"></i> {{ $t('save') }}
                        </button>
                    </div>
                </div>

            </form>

        </div>

        <create-block v-if="disabled.block.create" :data-object="object" :balcony="building_balcony_price" :currency="getCurrency" @InsertBlock="InsertBlock" @RemoveBlock="disabledBlock"></create-block>

        <edit-block v-if="disabled.block.edit" :data-object="object" :balcony="building_balcony_price" :currency="getCurrency" :block_preview="edit.block" @CancelEditBlock="CancelEditBlock" @SaveEditBlock="saveEditBlock"></edit-block>

        <create-discount v-if="disabled.discount.create" @RemoveDiscount="disabled.discount.create = false" @SaveDiscount="SaveDiscount" ></create-discount>

        <edit-discount v-if="disabled.discount.edit" @cancelDiscount="disabled.discount.edit = false" @SaveDiscount="disabled.discount.edit = false" :data-discount="edit.discount"></edit-discount>

        <type-plan-create v-if="disabled.plan.create" @RemovePlan="disabled.plan.create = false" @savePlan="savePlan"></type-plan-create>

    </main>
</template>

<script>

    import CreateBlock from './Components/Block/CreateOld';
    import EditBlock from './Components/Block/Edit';
    import TypePlanCreateModal from './Components/Store/TypePlanCreateModal';
    import { mapGetters, mapActions} from 'vuex';

    export default {
        components: {
            'create-block': CreateBlock,
            'edit-block': EditBlock,
            'type-plan-create': TypePlanCreateModal
        },

        watch: {
            'object.type_plan': function () {

            }
        },

        data: () => ({
            object: {
                name: null,
                address: null,
                branch_id: 0,
                type_plan: [],
                new_type_plan: null,
            },
            buildings: [],
            discounts: [],

            block_building_index: 0,
            building_balcony_price: 0,

            edit: {
                block: {},
                discount: {}
            },
            disabled: {
                block: {
                    create: false,
                    edit: false
                },
                discount: {
                    create: false,
                    edit: false
                },
                plan: {
                    create: false,
                    edit: false
                }
            },

            error: false,
            errors: [],

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getCurrency', 'getBranches']),


        mounted() {
            this.buildings.push({
                name: 'Корпус A',
                balcony_price: null,
                edit: false,
                blocks: []
            });

            this.fetchCurrency(this);
            this.fetchBranches(this);
        },

        methods: {
            ...mapActions(['fetchCurrency', 'fetchBranches']),
            addTypePlan() {
                if (this.object.new_type_plan != null) {
                    this.object.type_plan.push({
                        name: this.object.new_type_plan
                    });

                    this.object.new_type_plan = null;
                }
            },

            SaveDiscount (event) {
                this.disabled.discount.create = false;
                this.discounts.push({...event});
            },

            savePlan(event) {
                this.object.type_plan.push({...event})
            },

            CopyBlock(BuildingIndex, blockIndex) {
                let block = this.buildings[BuildingIndex].blocks[blockIndex];

                let building = {
                    apartment: block.apartment,
                    apartments: this.copy(block.apartments),
                    floor: block.floor,
                    floors: this.copy(block.floors),
                    name: block.name,
                    prices: this.copy(block.prices) //[...block.prices]
                };

                this.buildings[BuildingIndex].blocks.push({...building});
            },

            CopyBuilding(index) {
                let buildings = {
                    name: null,
                    edit: true,
                    blocks: this.copy(this.buildings[index].blocks)
                };

                this.buildings.push({...buildings});
            },

             copy(o) {
                if (o === null) return null;

                var output, v, key;
                output = Array.isArray(o) ? [] : {};
                for (key in o) {
                    v = o[key];
                    output[key] = (typeof v === "object") ? this.copy(v) : v;
                }
                return output;
            },


            deletePlan(plan) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {

                        plan.name = 'Удалено';
                        plan.area = 0;
                        plan.balcony = false;
                        plan.balcony_area = 0;
                        plan.deleted = true;
                    }
                });
            },

            createBlock(index) {
                if (! this.disabled.block.create) {
                    this.disabled.block.create = true;
                    this.building_balcony_price = this.buildings[index].balcony_price;
                    this.block_building_index = index;
                }
            },

            InsertBlock(event) {
                console.log(event);
                // let index = this.block_building_index;
                // this.buildings[index].blocks.push(event);
            },

            saveEditBlock() {
                this.disabled.block.edit = false;
            },

            CancelEditBlock() {
                this.disabled.block.edit = false;
            },

            disabledBlock() {
                this.disabled.block.create = false;
            },

            createBuilding() {
                this.buildings.push({
                    name: null,
                    balcony_price: null,
                    edit: true,
                    blocks: []
                })
            },

            saveBuildingName(index) {
                if (this.buildings[index].name != null) {
                    this.buildings[index].edit = false;
                }
            },

            editBuildingName(index) {
                this.buildings[index].edit = true;
            },

            deleteBuilding(index) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.buildings.splice(index, 1);
                        this.clearPreviewBlock();
                    }
                });
            },

            editBlock(building, index) {
                this.disabled.block.edit = true;
                this.building_balcony_price = this.buildings[building].balcony_price;
                this.edit.block = this.buildings[building].blocks[index];
            },

            editDiscount (index) {
                this.disabled.discount.edit = true;
                this.edit.discount = this.discounts[index];
            },

            deleteBlock(building, index) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.buildings[building].blocks.splice(index, 1);
                    }
                });
            },

            DeleteDiscount (index) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.discounts.splice(index, 1);
                    }
                });
            },

            submitObject () {
                let data = {
                    object: this.object,
                    buildings: this.buildings,
                    discounts: this.discounts
                };

                let vm = this;

                this.axios.post(process.env.VUE_APP_URL + '/objects', data, this.header).then((response) => {
                    if (response.status == 201) {
                        vm.toasted(vm.$t('messages.created'), 'success');
                        vm.$router.push({name: 'objects'});
                    }
                }).catch((error) => {

                    if (! error.response) {
                        vm.toasted('Error: Network Error', 'error');
                    } else {
                        if (error.response.status === 403) {
                            this.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 401) {
                            this.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 500) {
                            this.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 422) {
                            this.error = true;
                            this.errors = error.response.data;
                        } else {
                            this.error = true;
                            this.errors = error.response.data;
                        }
                    }

                });

            }
        },
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
