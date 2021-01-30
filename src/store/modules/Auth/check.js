export default {
    actions: {
        async fetchAuth(ctx, vm) {
            //let res = false;
            if (localStorage.token) {
                try {
                    await vm.axios.get(process.env.VUE_APP_URL + '/oauth/me', {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.token,
                        },
                    });

                    ctx.commit('updateAuth', true);
                } catch (error) {
                    if (! error.response) {
                        vm.toasted('Error: Network Error', 'error');
                    } else {
                        if (error.response.status === 403) {
                            vm.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 401) {
                            vm.toasted(error.response.data.message, 'error');
                        } else if (error.response.status === 500) {
                            vm.toasted(error.response.data.message, 'error');
                        } else {
                            vm.toasted(error.response.data.message, 'error');
                        }
                    }
                }
            }
        },


        nullableAuth(ctx) {
            ctx.commit('updateAuth', false);
        }
    },

    mutations: {
        updateAuth(state, status) {
            state.auth = status;
        },
    },

    state: {
        auth: false
    },

    getters: {
        getAuth(state) {
            return state.auth;
        }
    }
}
