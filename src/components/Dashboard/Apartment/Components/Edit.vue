<template>
    <div>
        <b-modal id="modal-edit" ref="modal" :title="$t('edit') + ' - ' + apartment_info.number" hide-footer @show="resetModal">
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

                <div class="apartment__info mb-3">
                    {{ $t('objects.create.apartment') }}:<br>
                    <input type="text" required class="form-control" v-model="apartment_info.number">
                </div>

                <div class="apartment__info mb-3">
                    {{ $t('apartments.list.entrance') }}:
                    <input type="number" min="1" required class="form-control" v-model="apartment_info.entrance">
                </div>

                <div class="apartment__info mb-3">
                    {{ $t('objects.create.rooms') }}:
                    <input type="number" min="1" required class="form-control" v-model="apartment_info.rooms">
                </div>

                <div class="apartment__info mb-3">
                    <div class="dropdown my-dropdown__two">
                        <button type="button" class="dropdown-toggle" data-toggle="dropdown">
                            {{ $t('objects.create.plan.name') }}
                        </button>
                        <select class="custom-select" v-model="apartment_info.plan_id" required>
                            <option disabled  value="null">
                                {{ $t('objects.create.choose_plan') }}
                            </option>

                            <option v-for="(plan, index) in plans" :value="plan.id" :key="index">
                                {{ plan.name }} - {{ $t('apartments.list.balcony') }}: {{ plan.balcony ? plan.balcony_area : $t('no') }}
                            </option>

                        </select>
                    </div>
                </div>

                <div class="apartment__info mb-3">
                    {{ $t('objects.create.floor') }}:

                    <select class="custom-select" v-model="apartment_info.floor">
                        <option v-for="floor in floors" :value="floor" :key="floor">
                            {{ floor }}
                        </option>
                    </select>
                </div>

                <div class="mt-4 d-flex justify-content-md-start justify-content-center float-right">
                    <button type="button" class="btn btn-default mr-2" @click="resetModal">
                        {{ $t('cancel') }}
                    </button>

                    <button type="submit" class="btn btn-success">
                        <i class="fa fa-save"></i> {{ $t('save') }}
                    </button>
                </div>

            </form>
        </b-modal>
    </div>
</template>

<script>
    export default {

        props: ['apartment'],

        data: () => ({
            apartment_info: {
                block: {
                    floors: []
                },
                area: 0,
                number: 0,
                plan_id: 0
            },
            plans: [],
            floors: [],

            error: false,
            errors: [],

            header: {
                headers: {
                    Authorization: 'Bearer ' + localStorage.token
                }
            }
        }),

        watch: {
            apartment: function() {
                this.GetInfoApartment();
            }
        },


        methods: {

            async GetInfoApartment() {
                try {
                    const { data } = await this.axios.get(process.env.VUE_APP_URL + '/apartments/' + this.apartment, this.header);

                    this.apartment_info = data;
                    this.plans = data.plans;
                    this.floors = data.floors;

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
            },

            resetModal() {
                this.$bvModal.hide('modal-edit');

                this.error = false;
                this.errors = [];
            },

            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault();
                this.handleSubmit()
            },

            async handleSubmit() {
                try {
                    let info = {
                        'rooms': this.apartment_info.rooms,
                        'plan_id': this.apartment_info.plan_id,
                        'floor': this.apartment_info.floor,
                        'entrance': this.apartment_info.entrance,
                        'number': this.apartment_info.number
                    };

                    const { data } = await this.axios.put(process.env.VUE_APP_URL + '/apartments/' + this.apartment_info.id, info, this.header);

                    this.toasted(data.message, 'success');

                    this.$nextTick(() => {
                        this.$bvModal.hide('modal-edit')
                    });

                    this.$emit('EditApartment');

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
