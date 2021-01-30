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
                        <a href="#">
                            {{ $t('roles.title') }}
                        </a>
                    </li>
                    <li class="breadcrumb-item active">
                        {{ $t('list') }}
                    </li>
                </ul>
            </div>

            <router-link :to="{ name: 'roles-store'}" v-if="getPermission.roles.create" :class="'my-btn my-btn__blue d-flex align-items-center'">
                <i class="fal fa-plus mr-2"></i>
                {{ $t('add') }}
            </router-link>
        </div>

        <div class="my-container px-0 mx-0">
            <div class="table-responsive">
                <table class="table table-borderless my-table">
                    <thead>
                        <tr>
                            <th width="50"><i class="fas fa-hashtag"></i></th>
                            <th>{{ $t('roles.name') }}</th>
                            <th class="text-center">{{ $t('roles.users') }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="getLoading">
                            <td colspan="4" style="">
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
                            <td colspan="4" v-if="getRoles.length === 0">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>
                        <tr v-for="(role, index) in getRoles" :key="index">
                            <td>{{ role.id }}</td>

                            <td>{{ getName(role.name) }}</td>
                            <td class="text-center">{{ role.users_count }}</td>

                            <td class="float-right">
                                <div class="dropdown my-dropdown dropleft" v-if="getPermission.roles.update && role.id != 1 || getPermission.roles.delete && role.id != 1">

                                    <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                                        <i class="far fa-ellipsis-h"></i>
                                    </button>

                                    <div class="dropdown-menu" v-if="getPermission.roles.update || getPermission.roles.delete">
                                        <router-link :to="{ name: 'roles-update', params: { id: role.id }  }" v-if="getPermission.roles.update && role.id != 1" :class="'dropdown-item dropdown-item--inside'">
                                            <i class="fas fa-pen"></i>
                                            {{ $t('edit') }}
                                        </router-link>

                                        <a class="dropdown-item dropdown-item--inside" v-if="getPermission.roles.delete && role.id != 1" @click="Delete(role.id)" href="#">
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
    </main>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {

        data: () => ({
            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getRoles', 'getPermission', 'getLoading', 'getMe']),

        mounted() {
            this.fetchRoles(this);
        },

        methods: {

            ...mapActions(['fetchRoles']),


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

            Delete(id) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.are_you_sure_delete_role'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.delete(process.env.VUE_APP_URL + '/roles/delete/' + id, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');

                            this.fetchRoles(this);

                            this.$swal(
                                this.$t('sweetAlert.deleted'),
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
                                } else if (error.response.status === 404) {
                                    this.toasted(error.response.data.exception, 'error');
                                } else {
                                    this.error = true;
                                    this.errors = error.response.data.errors;
                                }
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
