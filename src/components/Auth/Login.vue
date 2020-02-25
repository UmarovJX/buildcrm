<template>
    <div>
        <div class="container vh-100 mt-3">
            <div class="d-flex justify-content-center align-items-center h-100">
                <form method="post" @submit.prevent="Login" class="w-50">
                    <div class="form">
                        <div class="form-group">
                            <label>{{ $t('auth.email') }}</label>
                            <input type="email" v-model="user.email" class="form-control">
                        </div>

                        <div class="form-group">
                            <label>{{ $t('auth.password') }}</label>
                            <input type="password" v-model="user.password" class="form-control">
                        </div>

                        <button type="submit" class="btn btn-success">
                            {{ $t('auth.login') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

    import { mapActions } from 'vuex';

    export default {
        data: () => ({
            user: {
                email: null,
                password: null
            },

            info: null
        }),

        mounted() {
            this.CheckLogin();
        },

        methods: {

            ...mapActions(['fetchAuth', 'fetchMenu', 'setMe']),


            Login() {
                let vm = this;
                let path = this.$router.currentRoute;

                this.axios.post(process.env.VUE_APP_URL + '/api/auth/login', this.user)
                    .then((response) => {
                        const token = response.data.access_token;
                        localStorage.token = token;
                        //this.setToken(token);

                        this.fetchAuth(this);
                        this.fetchMenu(this);
                        this.setMe(this, path);

                        vm.toasted(response.data.message, 'success');
                        vm.$router.push('/dashboard')
                    }).catch(function (error) {
                        if (! error.response) {
                            vm.toasted('Error: Network Error', 'error');
                        } else {
                            vm.toasted(error.response.data.message, 'error');
                        }
                    });
            },

            CheckLogin() {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                let vm = this;

                this.axios.get(process.env.VUE_APP_URL + '/api/auth/check', header).then(() => {
                    //this.items = response.data;
                    vm.$router.push({ path: 'dashboard' });
                }).catch(() => {
                    localStorage.clear();
                });
            }
        },


    }
</script>

<style scoped>

</style>
