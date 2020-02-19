<template>
    <div>
        <div class="container">
           <div class="alert alert-danger mt-3" v-if="error">
                <ul>
                    <li v-for="(error, index) in errors" :key="index">
                        <span v-for="msg in error" :key="msg">
                            {{ msg }}
                        </span>
                    </li>
                </ul>
           </div>

            <form @submit.prevent="submitObject">
                <div class="col-md-12 mt-3">
                    <div class="row">
                        <div class="col-md-6 mt-3">
                            <h3>
                                {{ $t('objects.create.new') }}
                            </h3>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="fa fa-home"></i>
                                    </span>
                                </div>
                                <input type="text" class="form-control" v-model="object.name" :placeholder="$t('objects.placeholder.name')" required>
                            </div>

                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">
                                        <i class="fa fa-map-marker"></i>
                                    </span>
                                </div>
                                <input type="text" class="form-control" v-model="object.address" :placeholder="$t('objects.placeholder.address')" required>
                            </div>
                        </div>

                        <div class="col-md-6 mt-3">
                            <h3>
                                {{ $t('objects.create.type_plan') }}
                            </h3>
                            <p>
                                <span v-if="object.type_plan.length == 0" class="text-danger">
                                    {{ $t('objects.create.no_type_plan') }}
                                </span>
                                <span v-for="(plan, index) in object.type_plan" :key="index">
                                    {{ plan.name }} |
                                </span>
                            </p>
                            <div class="input-group mb-3">
                                <input type="text"  v-model="object.new_type_plan" class="form-control" :placeholder="$t('objects.placeholder.type_plan')">
                                <div class="input-group-append">
                                    <button class="btn btn-primary" @click="addTypePlan" type="button" id="button-addon2">
                                        {{ $t('add') }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12" v-for="(building, index) in buildings" :key="index">
                            <h3 v-if="!building.edit">
                                {{ building.name }}
                                <button type="button" @click="editBuildingName(index)" class="btn btn-info btn-sm">
                                    <i class="fa fa-edit"></i> {{ $t('edit') }}
                                </button>

                                <button v-if="buildings.length > 1" type="button" @click="deleteBuilding(index)" class="btn btn-danger btn-sm ml-1">
                                    <i class="fa fa-trash"></i> {{ $t('delete') }}
                                </button>
                            </h3>

                            <div class="col-md-4" v-else>
                                <div class="row">
                                    <div class="input-group mb-3 ">
                                        <input type="text" :placeholder="$t('objects.placeholder.building_name')" class="form-control"  v-model="building.name">
                                        <div class="input-group-append">
                                            <button class="btn btn-success" @click="saveBuildingName(index)" type="button">
                                                <i class="fa fa-save"></i> {{ $t('save') }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div class="row">
                                <div class="col-md-3" v-for="(block, indexx) in building.blocks" :key="indexx">
                                    <div class="card">
                                        <div class="card-body">
                                            <h1 class="card-title text-center">
                                                <i class="fa fa-home"></i>
                                            </h1>
                                            <p class="card-text text-center">
                                                {{ block.name }}
                                            </p>

                                            <p class="card-text text-left">
                                                {{ $t('objects.create.apartments') }}: {{ block.apartment }} <br>
                                                {{ $t('objects.create.floors') }}: {{ block.floor }}
                                            </p>
                                        </div>

                                        <div class="card-footer">
                                            <a href="#" @click="editBlock(index, indexx)"><i class="fa fa-edit"></i> {{ $t('edit') }}</a><br>
                                            <a href="#" @click="deleteBlock(index, indexx)"><i class="fa fa-trash"></i> {{ $t('delete') }}</a>
                                        </div>
                                    </div>
                                </div>
                                <!-- Blocks -->

                                <div class="col-md-3" @click="createBlock(index)">
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
                                <div class="col-md-12">
                                    <hr>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-12">
                            <button type="button" @click="createBuilding" class="btn btn-success">
                                <i class="fa fa-plus"></i> {{ $t('objects.create.create_build') }}
                            </button>
                        </div>

                        <div class="col-md-12 mt-3" v-if="disabled.block.create">
                            <hr>
                            <div class="row">
                                <create-block :data-object="object" @InsertBlock="InsertBlock" @RemoveBlock="disabledBlock"></create-block>
                            </div>
                        </div>

                        <div class="col-md-12 mt-3" v-if="disabled.block.edit">
                            <hr>
                            <div class="row">
                                <edit-block :data-object="object" :block_preview="edit.block" @CancelEditBlock="CancelEditBlock" @SaveEditBlock="saveEditBlock"></edit-block>
                            </div>
                        </div>


                        <table class="table mt-3">
                            <thead class="thead-dark">
                            <tr>
                                <th scope="col">{{ $t('objects.create.pre_pay') }}</th>
                                <th scope="col" class="text-center">{{ $t('objects.create.discount') }}</th>
                                <th scope="col" class="text-right">{{ $t('action') }}</th>
                            </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(discount, index) in discounts" :key="index">
                                    <td scope="row">
                                        {{ discount.prepay_from }}% - {{discount.prepay_to}}%
                                    </td>
                                    <td class="text-center">
                                        {{ discount.discount }}%
                                    </td>
                                    <td class="text-right">
                                        <div class="dropdown">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </button>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <a class="dropdown-item" href="#" @click="editDiscount(index)"><i class="fa fa-edit"></i> {{ $t('edit') }}</a>
                                                <a class="dropdown-item" href="#" @click="DeleteDiscount(index)"><i class="fa fa-trash"></i> {{ $t('delete') }}</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <button type="button" @click="disabled.discount.create = true" class="btn btn-success">
                            <i class="fa fa-plus"></i> {{ $t('objects.create.create_discount') }}
                        </button>

                        <div class="col-md-12 mt-3" v-if="disabled.discount.create">
                            <hr>
                            <div class="row">
                                <create-discount @RemoveDiscount="disabled.discount.create = false" @SaveDiscount="SaveDiscount"></create-discount>
                            </div>
                        </div>

                        <div class="col-md-12 mt-3" v-if="disabled.discount.edit">
                            <hr>
                            <div class="row">
                                <edit-discount @cancelDiscount="disabled.discount.edit = false" @SaveDiscount="disabled.discount.edit = false" :data-discount="edit.discount"></edit-discount>
                            </div>
                        </div>

                        <div class="col-md-12 mt-3">
                            <div class="row">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa fa-save"></i> {{ $t('save') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <div style="margin-top: 300px">

        </div>
    </div>
</template>

<script>

    import CreateBlock from './Components/Block/Create';
    import EditBlock from './Components/Block/Edit';

    export default {
        components: {
            'create-block': CreateBlock,
            'edit-block': EditBlock,
        },

        data: () => ({
            object: {
                name: null,
                address: null,
                type_plan: [],
                new_type_plan: null,
            },
            buildings: [],
            discounts: [],

            block_building_index: 0,
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

        mounted() {
            this.buildings.push({
                name: 'Корпус A',
                edit: false,
                blocks: []
            })
        },

        methods: {
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

            createBlock(index) {
                if (! this.disabled.block.create) {
                    this.disabled.block.create = true;
                    this.block_building_index = index;
                }
            },

            InsertBlock(event) {
                let index = this.block_building_index;
                this.buildings[index].blocks.push(event);
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
                        this.buildings.splice(index, 1)
                        this.clearPreviewBlock();
                    }
                });
            },

            editBlock(building, index) {
                this.disabled.block.edit = true;
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

                this.axios.post(process.env.VUE_APP_URL + '/api/objects/store', data, this.header).then((response) => {
                    if (response.data.status) {
                        vm.toasted(response.data.message, 'success');
                        vm.$router.push({name: 'objects'});
                    }
                }).catch((error) => {
                    if (! error.response) {
                        vm.toasted('Error: Network Error', 'error');
                    } else {
                        var errors = error.response.data.errors;
                        vm.error = true;
                        vm.errors = errors;
                    }

                });

            }
        },
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
