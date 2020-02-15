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
                            <th scope="col">{{ $t('managers.phone') }}</th>
                            <th scope="col">{{ $t('managers.login') }}</th>
                            <th scope="col" class="text-right">{{ $t('action') }}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td colspan="5" v-if="getAccountants.length == 0">
                                <center>
                                    {{ $t('no_data') }}
                                </center>
                            </td>
                        </tr>
                        <tr v-for="accountant in getAccountants" v-bind:key="accountant.id">
                            <th scope="row">{{ accountant.id }}</th>
                            <td>
                                {{ accountant.first_name }} {{ accountant.last_name}}
                            </td>

                            <td>
                                +{{ accountant.phone }}
                            </td>

                            <td>
                                {{ accountant.email }}
                            </td>

                            <td class="text-right">
                                <b-button class="btn-sm mr-1" @click="clickAccountant(accountant.id)" variant="primary" v-b-modal.modal-edit>
                                    <i class="fa fa fa-edit"></i>
                                </b-button>

                                <a href="#" @click="Delete(accountant.id)" class="btn btn-sm btn-danger">
                                    <i class="fa fa-trash"></i>
                                </a>
                            </td>

                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <create-modal @CreateAccountant="CreateAccountant"></create-modal>
        <edit-modal :accountant-id="accountant_id" @EditAccountant="EditAccountant"></edit-modal>

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
            accountant: {},
            accountant_id: null,

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getAccountants']),

        mounted() {
            this.fetchAccountants(this);
        },

        methods: {

            ...mapActions(['fetchAccountants', 'fetchAccountant']),

            CreateAccountant () {
                this.fetchAccountants(this);
            },

            EditAccountant () {
                this.fetchAccountants(this);
            },

            clickAccountant(id) {
                this.accountant_id = id;
                this.fetchAccountant(this);
            },

            Delete (accountant) {
                this.$swal({
                    title: this.$t('sweetAlert.title'),
                    text: this.$t('sweetAlert.text'),
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: this.$t('sweetAlert.yes')
                }).then((result) => {
                    if (result.value) {
                        this.axios.get(process.env.VUE_APP_URL + '/api/accountants/destroy/' + accountant, this.header).then((response) => {

                            this.toasted(response.data.message, 'success');
                            this.fetchAccountants(this);

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
