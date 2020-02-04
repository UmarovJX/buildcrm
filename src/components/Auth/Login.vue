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
    export default {
        data: () => ({
            user: {
                email: null,
                password: null
            }
        }),

        mounted() {

        },

        methods: {
            Login() {
                this.axios.post('http://127.0.0.1:8000/api/auth/login', this.user);
            }
        }
    }
</script>

<style scoped>

</style>