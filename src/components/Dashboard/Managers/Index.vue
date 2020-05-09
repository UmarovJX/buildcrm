<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('managers.title') }}</h1>
                <ul class="breadcrumb ml-md-4 ml-3 mb-3 mb-md-0 align-self-start">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'objects' }">
                            <i class="far fa-home"></i>
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <a href="#">
                            {{ $t('managers.title') }}
                        </a>
                    </li>
                    <li class="breadcrumb-item active">
                        {{ $t('list') }}
                    </li>
                </ul>
            </div>

                <b-link v-if="getPermission.managers.create" class="my-btn my-btn__blue d-flex align-items-center" v-b-modal.modal-create>
                    <i class="fal fa-plus mr-2"></i>
                    {{ $t('add') }}
                </b-link>
        </div>

        <div class="my-container px-0 mx-0">
            <div class="table-responsive">
                <table class="table table-borderless my-table">
                    <thead>
                    <tr>
                        <th><i class="fas fa-hashtag"></i></th>
                        <th>{{ $t('managers.name') }}</th>
                        <th>{{ $t('managers.object') }}</th>
                        <th>{{ $t('managers.phone') }}</th>
                        <th>{{ $t('managers.login') }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colspan="6" v-if="getManagers.length == 0">
                            <center>
                                {{ $t('no_data') }}
                            </center>
                        </td>
                    </tr>
                        <tr v-for="(manager, index) in getManagers" :key="index">
                            <td>{{ manager.id }}</td>
                            <td> {{ manager.first_name }} {{ manager.last_name}}</td>
                            <td>
                                <span v-for="object in manager.objects" :key="object.id">
                                    {{ object.name }},
                                </span>
                            </td>
                            <td>+{{ manager.phone }}</td>
                            <td>{{ manager.email }}</td>
                            <td>
                                <div class="dropdown my-dropdown dropleft">
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>
                                    <div class="dropdown-menu" v-if="getPermission.managers.update || getPermission.managers.delete">
                                        <b-button v-if="getPermission.managers.update" @click="clickManager(manager.id)" class="dropdown-item dropdown-item--inside" href="#" v-b-modal.modal-edit>
                                            <i class="fas fa-pen"></i>
                                            {{ $t('edit') }}
                                        </b-button>

                                        <a class="dropdown-item dropdown-item--inside" v-if="getPermission.managers.delete"  @click="Delete(manager.id)" href="#">
                                            <i class="far fa-trash"></i>  {{ $t('delete') }}
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <create-modal v-if="getPermission.managers.create" @CreateManager="CreateManager"></create-modal>
        <edit-modal v-if="getPermission.managers.update" :manager-id="manager_id" @EditManager="EditManager"></edit-modal>
    </main>
</template>

<script>

    import { mapActions, mapGetters } from 'vuex';
    import Create from './Modal/Create';
    import Edit from './Modal/Edit';

    export default {
        components: {
            'create-modal': Create,
            'edit-modal': Edit
        },

        data: () => ({
            manager: {},
            manager_id: null,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getManagers', 'getManager', 'getPermission']),

        mounted() {
            this.fetchManagers(this);
        },

        methods: {

            ...mapActions(['fetchManagers', 'fetchManager']),

            CreateManager () {
                this.fetchManagers(this);
            },

            EditManager () {
                this.fetchManagers(this);
            },

            clickManager(id) {
                this.manager_id = id;
                this.fetchManager(this);
            },

            Delete (manager) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.get(process.env.VUE_APP_URL + '/api/managers/destroy/' + manager, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');
                            this.fetchManagers(this);

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
            },
        }
    }
</script>

<style scoped>

</style>
