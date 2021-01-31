<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('roles.title') }}</h1>
                <ul class="breadcrumb ml-md-4 ml-3 mb-3 mb-md-0 align-self-start">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'objects' }">
                            <i class="far fa-home"></i>
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'roles' }">
                            {{ $t('roles.title') }}
                        </router-link>
                    </li>
                    <li class="breadcrumb-item active">
                        {{ $t('edit') }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <b-tabs content-class="mt-3">
                    <b-tab :title="$t('general')" active>
                        <table class="table table-striped">
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.name_ru') }}
                                    </td>
                                    <td width="50%">
                                        <input class="form-control" v-model="getRole.name.ru" type="text" :placeholder="$t('roles.permissions.placeholder_ru')">
                                    </td>
                                </tr>


                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.name_uz') }}
                                    </td>
                                    <td width="50%">
                                        <input class="form-control" v-model="getRole.name.uz" type="text" :placeholder="$t('roles.permissions.placeholder_uz')">
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.objects.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.objects.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>


                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.users.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.users.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.roles.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.roles.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.clients.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.clients.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>


                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.type_plan.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.type_plan.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.apartments.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.apartments.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </b-tab><!--general-->

                    <b-tab :title="$t('objects.title')">
                        <table class="table table-striped">
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.objects.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.objects.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.objects.create') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.objects.create" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.objects.update') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.objects.update" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.objects.delete') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.objects.delete" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.objects.apartments') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.objects.apartments" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </b-tab><!--objects-->

                    <b-tab :title="$t('users.title')">
                        <table class="table table-striped">
                            <tbody>
                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.users.view') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.users.view" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.users.create') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.users.create" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.users.update') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.users.update" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.users.delete') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.users.delete" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </b-tab><!--users-->

                    <b-tab :title="$t('roles.title')">
                        <table class="table table-striped">
                            <tbody>
                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.roles.view') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.roles.view" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.roles.create') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.roles.create" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.roles.update') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.roles.update" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            <tr>
                                <td width="50%">
                                    {{ $t('roles.permissions.roles.delete') }}
                                </td>
                                <td width="50%">
                                    <b-form-checkbox switch v-model="getRole.permissions.roles.delete" size="lg"></b-form-checkbox>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </b-tab><!--roles-->

                    <b-tab :title="$t('clients.title')">
                        <table class="table table-striped">
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.clients.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.clients.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.clients.cancel_contract') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.clients.cancel_contract" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.clients.delete') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.clients.delete" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.clients.terminate') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.clients.terminate" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.clients.cancelled') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.clients.cancelled" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </b-tab><!--clients-->

                    <b-tab :title="$t('type_plan.title')">
                        <table class="table table-striped">
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.type_plan.view') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.type_plan.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.type_plan.update') }}
                                    </td>
                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.type_plan.update" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </b-tab><!--type Plans-->

                    <b-tab :title="$t('objects.apartments')">
                        <table class="table table-striped">
                            <tbody>
                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.apartments.view') }}
                                    </td>

                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.apartments.view" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.apartments.reserve') }}
                                    </td>

                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.apartments.reserve" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>


                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.apartments.contract') }}
                                    </td>

                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.apartments.contract" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.apartments.filter') }}
                                    </td>

                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.apartments.filter" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.apartments.edit') }}
                                    </td>

                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.apartments.edit" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>

                                <tr>
                                    <td width="50%">
                                        {{ $t('roles.permissions.apartments.root_contract') }}
                                    </td>

                                    <td width="50%">
                                        <b-form-checkbox switch v-model="getRole.permissions.apartments.root_contract" size="lg"></b-form-checkbox>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-tab><!--apartments-->

                    <b-tab :title="$t('accountants.role_title')">

                    </b-tab><!--accountants-->


                </b-tabs>
            </div>

            <div class="card-footer">
                <button class="btn btn-primary" @click="UpdateRoles">
                    <i class="fas fa-save"></i> {{ $t('save') }}
                </button>

                <button class="btn btn-default" @click="$router.go(-1)">
                    {{ $t('cancel') }}
                </button>
            </div>

        </div>
    </main>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        data: () => ({

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }

        }),

        mounted() {
            this.fetchRole(this);
        },

        computed: mapGetters(['getRole']),

        methods: {

            ...mapActions(['fetchRole']),

            UpdateRoles () {
                this.axios.put(process.env.VUE_APP_URL + '/roles/' + this.$route.params.id, this.getRole, this.header).then((response) => {

                    this.toasted(response.data.message, 'success');

                    this.$router.push({ name: 'roles' });

                    this.$swal(
                        this.$t('sweetAlert.success_update_role'),
                        '',
                        'success'
                    );

                }).catch((error) => {
                    if (! error.response) {
                        this.toasted('Error: Network Error', 'error');
                    } else {
                        if (error.response.status === 403) {
                            this.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 401) {
                            this.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 500) {
                            this.toasted(error.response.data.message, 'error');
                        } else {
                            this.error = true;
                            this.errors = error.response.data.errors;
                        }
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
