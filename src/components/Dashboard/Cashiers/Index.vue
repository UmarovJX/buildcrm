<template>
    <div>
        <div class="container">
            <div class="col-md-12 mt-3">
                <div class="row">
                    <b-button v-if="getPermission.cashiers.create"  class="float-right mb-2" variant="success" v-b-modal.modal-create>
                        <i class="fa fa-plus"></i>
                        {{ $t('add') }}
                    </b-button>

                    <table class="table">
                        <thead class="thead-dark">
                        <tr>
                            <th scope="col" width="50">#</th>
                            <th scope="col">{{ $t('managers.name') }}</th>
                            <th scope="col">{{ $t('managers.phone') }}</th>
                            <th scope="col">{{ $t('managers.login') }}</th>
                            <th scope="col" class="text-right">{{ $t('action') }}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="5" v-if="getCashiers.length == 0">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>
                        <tr v-for="cashier in getCashiers" v-bind:key="cashier.id">
                            <th scope="row">{{ cashier.id }}</th>
                            <td>
                                {{ cashier.first_name }} {{ cashier.last_name}}
                            </td>

                            <td>
                                +{{ cashier.phone }}
                            </td>

                            <td>
                                {{ cashier.email }}
                            </td>

                            <td class="text-right">
                                <b-button class="btn-sm mr-1" v-if="getPermission.cashiers.update"  @click="clickCashier(cashier.id)" variant="primary" v-b-modal.modal-edit>
                                    <i class="fa fa fa-edit"></i>
                                </b-button>

                                <a href="#" v-if="getPermission.cashiers.delete"  @click="Delete(cashier.id)" class="btn btn-sm btn-danger">
                                    <i class="fa fa-trash"></i>
                                </a>
                            </td>

                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <create-modal v-if="getPermission.cashiers.create" @CreateCashier="CreateCashier"></create-modal>
        <edit-modal v-if="getPermission.cashiers.update" :cashier-id="cashier_id" @EditCashier="EditCashier"></edit-modal>

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
            cashier: {},
            cashier_id: null,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getCashiers', 'getPermission']),

        mounted() {
            this.fetchCashiers(this);
        },

        methods: {

            ...mapActions(['fetchCashiers', 'fetchCashier']),

            CreateCashier () {
                this.fetchCashiers(this);
            },

            EditCashier () {
                this.fetchCashiers(this);
            },

            clickCashier(id) {
                this.cashier_id = id;
                this.fetchCashier(this);
            },

            Delete (cashier) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.get(process.env.VUE_APP_URL + '/api/cashiers/destroy/' + cashier, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');
                            this.fetchCashiers(this);

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
