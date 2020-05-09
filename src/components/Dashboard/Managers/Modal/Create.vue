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
                    <b-form-input id="first_name" v-model="manager.first_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.last_name')" label-for="last_name">
                    <b-form-input id="last_name" v-model="manager.last_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.phone')" label-for="phone">
                    <b-form-input id="phone" v-model="manager.phone"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.email')" label-for="email">
                    <b-form-input type="email" v-model="manager.email" id="email"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.password')" label-for="password">
                    <b-form-input type="password" min="5" v-model="manager.password" id="password"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('objects.title')" label-for="objects">
                    <b-form-checkbox-group v-model="manager.objects" :options="getObjects" class="mb-3" value-field="id" text-field="name" switches></b-form-checkbox-group>
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
    import { mapActions, mapGetters } from 'vuex';

    export default {
        data: () => ({
            manager: {
                first_name: null,
                last_name: null,
                phone: null,
                password: null,
                email: null,
                objects: []

            },

            error: false,
            errors: [],

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        computed: mapGetters(['getObjects']),

        mounted() {
            this.fetchObjects(this);
        },

        methods: {

            ...mapActions(['fetchObjects']),

            resetModal() {
                this.manager.first_name = null;
                this.manager.last_name = null;
                this.manager.phone = null;
                this.manager.password = null;
                this.manager.email = null;

                this.$bvModal.hide('modal-create');

                this.error = false;
                this.errors = [];

                this.objects = [];
            },

            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault();
                this.handleSubmit()
            },

            async handleSubmit() {
                try {
                    const response = await this.axios.post(process.env.VUE_APP_URL + '/api/managers/store', this.manager, this.header);

                    this.toasted(response.data.message, 'success');

                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-create')
                    });

                    this.$emit('CreateManager', this.manager);

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
