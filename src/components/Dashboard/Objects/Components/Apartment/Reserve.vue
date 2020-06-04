<template>
    <div>
        <b-modal id="modal-create" ref="modal" :title="$t('apartments.list.book')" hide-footer @show="resetModal">
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
                    <b-form-input id="first_name" v-model="client.first_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.last_name')" label-for="last_name">
                    <b-form-input id="last_name" v-model="client.last_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.phone')" label-for="phone">
                    <b-form-input id="phone" v-model="client.phone"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="4" :label="$t('apartments.list.period_date')" label-for="period_date">
                    <b-form-datepicker v-model="client.period_date" locale="ru"></b-form-datepicker>
                </b-form-group>

                <div class="float-right">
                    <b-button variant="light" @click="resetModal">
                        {{ $t('cancel') }}
                    </b-button>

                    <b-button type="submit" class="ml-1" variant="success">
                        <b-icon-box-arrow-up-right></b-icon-box-arrow-up-right> {{ $t('apartments.list.book') }}
                    </b-button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
    export default {

        props: ['apartment'],

        data: () => ({

            client: {
                first_name: null,
                last_name: null,
                phone: null,
                period_date: null,
                apartment_id: null
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
                this.client.first_name = null;
                this.client.last_name = null;
                this.client.phone = null;
                this.client.period_date = null;

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
                    this.client.apartment_id = this.apartment;

                    const response = await this.axios.post(process.env.VUE_APP_URL + '/api/clients/reserve', this.client, this.header);

                    this.toasted(response.data.message, 'success');

                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-create')
                    });

                    this.$emit('CreateReserve', this.client);

                } catch (error) {
                    if (! error.response) {
                        this.toasted('Error: Network Error', 'error');
                    } else {
                        if (error.response.status === 403) {
                            this.toasted(error.response.data.message, 'error');
                        } else {
                            this.error = true;
                            this.errors = error.response.data.errors;
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
