<template>
    <div>
        <b-modal id="modal-create" ref="modal" :title="$t('add')" hide-footer @show="resetModal">
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
                    <b-form-input id="first_name" v-model="cashier.first_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.last_name')" label-for="last_name">
                    <b-form-input id="last_name" v-model="cashier.last_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.phone')" label-for="phone">
                    <b-form-input id="phone" v-model="cashier.phone"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.email')" label-for="email">
                    <b-form-input type="email" v-model="cashier.email" id="email"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.password')" label-for="password">
                    <b-form-input type="password" min="5" v-model="cashier.password" id="password"></b-form-input>
                </b-form-group>


                <div class="float-right">
                    <b-button @click="resetModal">
                        <i class="fas fa-window-close"></i> {{ $t('cancel') }}
                    </b-button>

                    <b-button type="submit" class="ml-1" variant="success">
                        <i class="fas fa-save"></i> {{ $t('save') }}
                    </b-button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>

    export default {
        data: () => ({
            cashier: {
                first_name: null,
                last_name: null,
                phone: null,
                password: null,
                email: null
            },

            error: false,
            errors: [],

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        methods: {
            resetModal() {
                this.cashier.first_name = null;
                this.cashier.last_name = null;
                this.cashier.phone = null;
                this.cashier.password = null;
                this.cashier.email = null;

                this.$bvModal.hide('modal-create');

                this.error = false;
                this.errors = [];
            },

            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault();
                this.handleSubmit()
            },

            async handleSubmit() {
                try {
                    const response = await this.axios.post(process.env.VUE_APP_URL + '/api/cashiers/store', this.cashier, this.header);

                    this.toasted(response.data.message, 'success');

                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-create')
                    });

                    this.$emit('CreateCashier', this.cashier);

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
