<template>
    <main>
        <div class="d-flex justify-content-between align-items-center flex-md-row flex-column pb-3 pt-0 px-0 py-lg-3">
            <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-md-0 mb-3">
                <h1 class="title__big my-0 order-md-0 order-1">{{ $t('edit') }}</h1>
                <ul class="breadcrumb ml-md-4 ml-3 mb-3 mb-md-0 align-self-start">
                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'objects' }">
                            <i class="far fa-home"></i>
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <router-link :to="{name: 'type_plan'}">
                            {{ $t('type_plan.title') }}
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <router-link :to="{ name: 'type-plan-view', params: { id: getPlanObject.id } }">
                            {{ getPlanObject.name }}
                        </router-link>
                    </li>

                    <li class="breadcrumb-item">
                        <a href="#">
                            {{ getPlan.name }}
                        </a>
                    </li>

                    <li class="breadcrumb-item active">
                        {{ $t('edit') }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="alert alert-danger mt-3" v-if="error">
            <ul>
                <li v-for="(error, index) in errors" :key="index">
                        <span v-for="msg in error" :key="msg">
                            {{ msg }}
                        </span>
                </li>
            </ul>
        </div>

        <div class="new-object px-3 px-sm-4 py-4">
            <form @submit.prevent="SavePlan">
                <div class="container px-0 mx-0">
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label for="title" class="d-block text-uppercase">
                                    {{ $t('type_plan.name') }}
                                </label>
                                <input id="title" v-model="getPlan.name" type="text" required :placeholder="$t('type_plan.name')" class="my-form__input">
                            </div>
                            <div class="mb-3">
                                <label for="plan" class="d-block text-uppercase">
                                    {{ $t('type_plan.plan') }} <span :class="getPlan.image ? 'text-success' : 'text-danger'">{{ getPlan.image ? $t('type_plan.yes_img') : $t('type_plan.no_img') }}</span>
                                </label>
                                <input id="plan" type="file" @change="handleFileUpload($event)" >
                            </div>
                        </div>

                    </div>
                </div>
                <div class="mt-4 d-flex justify-content-md-start justify-content-center">
                    <button type="submit" class=" my-btn my-btn__blue"><i class="fa fa-save"></i> Сохранить </button>
                </div>
            </form>
        </div>

    </main>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    export default {

        data: () => ({
           plan: {
                image: ''
            }
        }),

        mounted() {
            this.fetchPlan(this);
            // setTimeout(function () {
            //     this.plan.name = this.getPlan.name;
            // }, 2000)
        },

        computed: mapGetters(['getPermission', 'getPlanObject', 'getPlan']),

        methods: {
            ...mapActions(['fetchPlan']),


            handleFileUpload(event) {
                this.plan.image = event.target.files[0]
            },

            SavePlan() {
                let headers = {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.token,
                        'Content-Type': 'multipart/form-data'
                    }
                };

                let formData = new FormData();

                formData.append('image', this.plan.image);
                formData.append('name', this.getPlan.name);

                let vm = this;

                this.axios.post( process.env.VUE_APP_URL + '/api/type/plan/update/' + this.$route.params.object +'/' + this.$route.params.id,
                    formData,
                    headers
                ).then((response) => {
                    if (response.data.status) {
                        vm.$router.back(-1);
                    }
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        this.toasted(error.response.data.message, 'error');
                    } else if (error.response.status == 401) {
                        this.toasted(error.response.data.message, 'error');
                    }  else {
                        this.error = true;
                        this.errors = error.response.data.errors;
                    }
                });

            }
        }
    }
</script>

<style scoped>

</style>
