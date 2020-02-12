<template>
    <div>
        <div class="container">
            <div class="col-md-12 mt-3">
                <div class="row">

                    <b-button class="float-right mb-2" variant="success" v-b-modal.modal-create>
                        <i class="fa fa-plus"></i>
                        {{ $t('add') }}
                    </b-button>

                    <table class="table">
                        <thead class="thead-dark">
                        <tr>
                            <th scope="col" width="50">#</th>
                            <th scope="col">{{ $t('managers.name') }}</th>
                            <th scope="col">{{ $t('managers.object') }}</th>
                            <th scope="col">{{ $t('managers.phone') }}</th>
                            <th scope="col">{{ $t('managers.login') }}</th>
                            <th scope="col" class="text-right">{{ $t('action') }}</th>
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
                            <tr v-for="manager in getManagers" v-bind:key="manager.id">
                                <th scope="row">{{ manager.id }}</th>
                                <td>
                                    {{ manager.first_name }} {{ manager.last_name}}
                                </td>

                                <td>
                                    <span v-for="object in manager.objects" v-bind:key="object.id">
                                        {{ object.name }},
                                    </span>
                                </td>

                                <td>
                                    +{{ manager.phone }}
                                </td>

                                <td>
                                    {{ manager.email }}
                                </td>

                                <td class="text-right">
                                    <b-button class="btn-sm mr-1" @click="clickManager(manager.id)" variant="primary" v-b-modal.modal-edit>
                                        <i class="fa fa fa-edit"></i>
                                    </b-button>

                                    <a href="#" @click="Delete(manager.id)" class="btn btn-sm btn-danger">
                                        <i class="fa fa-trash"></i>
                                    </a>
                                </td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <create-modal @CreateManager="CreateManager"></create-modal>
        <edit-modal :manager-id="manager_id" @EditManager="EditManager"></edit-modal>

    </div>
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

        computed: mapGetters(['getManagers', 'getManager']),

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
