<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('companies.title') }}</h1>
                <ul class="breadcrumb ml-md-4 ml-3 mb-3 mb-md-0 align-self-start">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'home' }">
                            <i class="far fa-home"></i>
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <a href="#">
                            {{ $t('companies.title') }}
                        </a>
                    </li>
                    <li class="breadcrumb-item active">
                        {{ $t('list') }}
                    </li>
                </ul>
            </div>

            <b-link v-if="getPermission.users.create" class="my-btn my-btn__blue d-flex align-items-center" v-b-modal.modal-create>
                <i class="fal fa-plus mr-2"></i>
                {{ $t('add') }}
            </b-link>
        </div>

        <div class="my-container px-0 mx-0">
            <div class="table-responsive">
                <table class="table table-borderless my-table">
                    <thead>
                    <tr>
                        <th width="50"><i class="fas fa-hashtag"></i></th>
                        <th>{{ $t('companies.name') }}</th>
                        <th>{{ $t('companies.payment_account') }}</th>
                        <th>{{ $t('companies.phone') }}</th>
                        <th>{{ $t('companies.inn') }}</th>
                        <th>{{ $t('companies.mfo') }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr v-if="getLoading">
                        <td colspan="3" style="">
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

                    <tr>
                        <td colspan="3" v-if="getBranches.length === 0 && !getLoading">
                            <center>
                                {{ $t('no_data') }}
                            </center>
                        </td>
                    </tr>

                    <tr v-for="(branch, index) in getBranches" :key="index">
                        <td>
                            {{ branch.id }}
                        </td>

                        <td>
                            {{ getName(branch.type.name) }} «{{ branch.name }}»
                        </td>

                        <td>
                            {{ branch.payment_account }}
                        </td>

                        <td>
                           +{{ branch.phone }}
                        </td>

                        <td>
                            {{ branch.inn }}
                        </td>

                        <td>
                            {{ branch.mfo }}
                        </td>

                        <td class="float-right">
                            <div class="dropdown my-dropdown dropleft">
                                <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                    <i class="far fa-ellipsis-h"></i>
                                </button>

                                <div class="dropdown-menu">
                                    <b-button v-if="getPermission.users.update" @click="EditBranch(branch)" class="dropdown-item dropdown-item--inside" v-b-modal.modal-update>
                                        <i class="fas fa-edit"></i>
                                        {{ $t('edit') }}
                                    </b-button>

<!--                                    <b-button v-if="getPermission.users.delete" class="dropdown-item dropdown-item&#45;&#45;inside">-->
<!--                                        <i class="fas fa-trash"></i>-->
<!--                                        {{ $t('delete') }}-->
<!--                                    </b-button>-->
                                </div>
                            </div>
                        </td>
                    </tr>

                    </tbody>
                </table>
            </div>
        </div>
        <Create @CreateCompany="CreateCompany"></Create>
        <Update v-if="edit" :branch-id="branch_id" :branc="branch" @UpdateCompany="UpdateCompany"></Update>
    </main>
</template>

<script>

    import { mapGetters, mapActions } from 'vuex';

    import Create from './Components/CreateModal';
    import Update from './Components/UpdateModal';

    export default {

        components: {
            Create,
            Update
        },

        data: () => ({
            edit: false,
            branch_id: false,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getPermission', 'getBranches', 'getLoading']),

        mounted() {
            this.fetchBranches(this)
        },

        methods: {
            ...mapActions(['fetchBranches', 'fetchBranch']),

            EditBranch(branch) {
                this.edit = true;
                this.branch_id = branch.id;
                this.fetchBranch(this);
            },

            getName(name) {
                let locale = localStorage.locale;
                let value = '';

                if (locale) {
                    switch(locale){
                        case "ru":
                            value = name.ru;
                            break;
                        case "uz":
                            value = name.uz;
                            break;
                    }
                } else {
                    value = name.ru;
                }

                return value;
            },


            CreateCompany() {
                this.fetchBranches(this);
            },

            UpdateCompany() {
                this.edit = false;
                this.fetchBranches(this);
            }
        }

    }
</script>

<style scoped>

</style>
