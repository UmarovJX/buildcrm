<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('users.title') }}</h1>
                <ul class="breadcrumb ml-md-4 ml-3 mb-3 mb-md-0 align-self-start">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'objects' }">
                            <i class="far fa-home"></i>
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <a href="#">
                            {{ $t('users.title') }}
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
                        <th><i class="fas fa-hashtag"></i></th>
                        <th>{{ $t('users.name') }}</th>
                        <th>{{ $t('users.object') }}</th>
                        <th>{{ $t('users.phone') }}</th>
                        <th>{{ $t('users.roles') }}</th>
                        <th>{{ $t('users.login') }}</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-if="getLoading">
                            <td colspan="7" style="">
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
                            <td colspan="7" v-if="getUsers.length === 0">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>
                        <tr v-for="(user, index) in getUsers" :key="index">
                            <td>{{ user.id }}</td>
                            <td> {{ user.first_name }} {{ user.last_name}}</td>

                            <td>
                                <span v-for="object in user.objects" :key="object.id">
                                    {{ object.name }},
                                </span>
                            </td>

                            <td>+{{ user.phone }}</td>
                            <td>{{ getName(user.role.name) }}</td>
                            <td>{{ user.email }}</td>

                            <td>
                                <div class="dropdown my-dropdown dropleft" v-if="user.id != getMe.user.id"> <!--user.role.id != 1 &&-->
                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>

                                    <div class="dropdown-menu" v-if="getPermission.users.update || getPermission.users.delete">
                                        <b-button v-if="getPermission.users.update" @click="clickManager(user.id)" class="dropdown-item dropdown-item--inside" href="#" v-b-modal.modal-edit>
                                            <i class="fas fa-pen"></i>
                                            {{ $t('edit') }}
                                        </b-button>

                                        <a class="dropdown-item dropdown-item--inside" v-if="getPermission.users.delete"  @click="Delete(user.id)" href="#">
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

        <create-modal v-if="getPermission.users.create" @CreateManager="CreateManager"></create-modal>
        <edit-modal v-if="getPermission.users.update" :manager-id="manager_id" @EditManager="EditManager"></edit-modal>
    </main>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import Create from './Modal/Create';
    import Edit from './Modal/Edit';

    export default {
        components: {
            'create-modal': Create,
            'edit-modal': Edit,
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

        computed: mapGetters(['getUsers', 'getUser', 'getPermission', 'getLoading', 'getMe']),

        mounted() {
            this.fetchUsers(this);
        },

        methods: {

            ...mapActions(['fetchUsers', 'fetchUser', 'fetchMenu']),

            CreateManager () {
                this.fetchUsers(this);
            },

            EditManager () {
                this.fetchUsers(this);
            },

            clickManager(id) {
                this.manager_id = id;
                this.fetchUser(this);
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

            Delete (user) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.delete(process.env.VUE_APP_URL + '/users/' + user, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');
                            this.fetchUsers(this);
                            this.fetchMenu(this);

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
