export default {
    actions: {
        async fetchAuth(ctx, vm) {
            //let res = false;
            if (localStorage.token) {
                try {
                    const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/auth/check', {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.token,
                        },
                    });

                    ctx.commit('updateAuth', response.data.status);
                } catch (error) {
                    if (! error.response) {
                        vm.toasted('Error: Network Error', 'error');
                    } else {
                        vm.toasted(error.response.data.message, 'error');
                    }
                }
            }
        }
    },

    mutations: {
        updateAuth(state, status) {
            state.auth = status;
        }
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
