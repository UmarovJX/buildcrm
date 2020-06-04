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
                    <b-form-input id="first_name" v-model="getManager.first_name"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.last_name')" label-for="last_name">
                    <b-form-input id="last_name" v-model="getManager.last_name" ></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.phone')" label-for="phone">
                    <b-form-input id="phone" v-model="getManager.phone" ></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.email')" label-for="email">
                    <b-form-input type="email" v-model="getManager.email"  id="email"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('user.password')" label-for="password">
                    <b-form-input type="password" min="5" v-model="getManager.password"   id="password"></b-form-input>
                </b-form-group>

                <b-form-group label-cols="4" label-cols-lg="2" :label="$t('objects.title')" label-for="objects">
                    <b-form-checkbox-group id="checkbox-group-2" v-model="getManager.object_ids" name="flavour-2" switches>
                        <b-form-checkbox v-for="object in getObjects" :key="object.id" :value="object.id" >
                            {{ object.name }}
                        </b-form-checkbox>
                    </b-form-checkbox-group>

<!--                    <b-form-checkbox-group  :options="getObjects" v-model="getManager.object_id" class="mb-3" value-field="id" text-field="name" switches></b-form-checkbox-group>-->
                </b-form-group>

                <div class="float-right">
                    <b-button variant="light" @click="resetModal">
                        {{ $t('cancel') }}
                    </b-button>

                    <b-button type="submit" class="ml-1" variant="success">
                        <i class="fas fa-save"></i>  {{ $t('save') }}
                    </b-button>
                </div>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    export default {
        props: ['managerId'],

        data: () => ({
            error: false,
            errors: [],

            manager: {},

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        mounted () {},

        computed: mapGetters(['getObjects', 'getManager']),

        methods: {
            ...mapActions(['nullManager']),

            resetModal() {
                this.$bvModal.hide('modal-edit');

                this.nullManager();

                this.error = false;
                this.errors = [];

                this.objects = [];
            },

            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault();
                this.handleSubmit()
            },

            async handleSubmit() {
                this.manager = this.getManager;

                try {
                    const response = await this.axios.post(process.env.VUE_APP_URL + '/api/managers/update/' + this.managerId, this.manager, this.header);

                    this.toasted(response.data.message, 'success');

                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-edit')
                    });

                    this.$emit('EditManager', this.manager);

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
