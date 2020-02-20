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
                    <b-form-input id="first_name" v-model="accountant.first_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.last_name')" label-for="last_name">
                    <b-form-input id="last_name" v-model="accountant.last_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.phone')" label-for="phone">
                    <b-form-input id="phone" v-model="accountant.phone"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.email')" label-for="email">
                    <b-form-input type="email" v-model="accountant.email" id="email"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.password')" label-for="password">
                    <b-form-input type="password" min="5" v-model="accountant.password" id="password"></b-form-input>
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

    export default {
        data: () => ({
            accountant: {
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


        mounted() {
            this.fetchObjects(this);
        },

        methods: {

            resetModal() {
                this.accountant.first_name = null;
                this.accountant.last_name = null;
                this.accountant.phone = null;
                this.accountant.password = null;
                this.accountant.email = null;

                this.$bvModal.hide('modal-create');

                this.error = false;
                this.errors = [];

                //this.objects = [];
            },

            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault();
                this.handleSubmit()
            },

            async handleSubmit() {
                try {
                    const response = await this.axios.post(process.env.VUE_APP_URL + '/api/accountants/store', this.accountant, this.header);

                    this.toasted(response.data.message, 'success');

                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-create')
                    });

                    this.$emit('CreateAccountant', this.accountant);

                } catch (error) {
                    console.log(error.response);

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
