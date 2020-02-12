<template>
    <div>
        <b-modal id="modal-edit" ref="modal" :title="$t('edit')" hide-footer @show="resetModal">
            <b-alert show variant="danger" v-if="error">
                <ul>
                    <li v-for="(error, index) in errors" :key="index">
                        <span v-for="msg in error" :key="msg">
                            {{ msg }}
                        </span>
                    </li>
                </ul>
            </b-alert>

            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.first_name')" label-for="first_name">
                    <b-form-input id="first_name" v-model="getAccountant.first_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.last_name')" label-for="last_name">
                    <b-form-input id="last_name" v-model="getAccountant.last_name" ></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.phone')" label-for="phone">
                    <b-form-input id="phone" v-model="getAccountant.phone" ></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.email')" label-for="email">
                    <b-form-input type="email" v-model="getAccountant.email"  id="email"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.password')" label-for="password">
                    <b-form-input type="password" min="5" v-model="getAccountant.password"   id="password"></b-form-input>
                </b-form-group>

                <div class="float-right">
                    <b-button @click="resetModal">
                        <b-icon-backspace-fill></b-icon-backspace-fill> {{ $t('cancel') }}
                    </b-button>

                    <b-button type="submit" class="ml-1" variant="success">
                        <b-icon-box-arrow-up-right></b-icon-box-arrow-up-right> {{ $t('save') }}
                    </b-button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        props: ['accountantId'],

        data: () => ({
            error: false,
            errors: [],

            accountant: {},

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        mounted () {},

        computed: mapGetters(['getAccountant']),

        methods: {
            ...mapActions(['nullAccountant']),


            resetModal() {
                this.$bvModal.hide('modal-edit');

                this.nullAccountant();

                this.error = false;
                this.errors = [];
            },

            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault();
                this.handleSubmit()
            },

            async handleSubmit() {
                this.accountant = this.getAccountant;

                try {
                    const response = await this.axios.post(process.env.VUE_APP_URL + '/api/accountants/update/' + this.accountantId, this.accountant, this.header);

                    this.toasted(response.data.message, 'success');

                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-edit')
                    });

                    this.$emit('EditAccountant', this.accountant);

                } catch (error) {
                    if (! error.response) {
                        this.toasted('Error: Network Error', 'error');
                    } else {
                        this.error = true;
                        this.errors = error.response.data.errors;
                    }
                }
            }
        }

    }
</script>

<style scoped>

</style>
