export default {
    actions: {
        async fetchCurrency(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const { data } = await vm.axios.get(process.env.VUE_APP_URL + '/currency/', header);

                ctx.commit('updateCurrency', data);

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

    mutations: {
        updateCurrency(state, currency) {
            state.currency = currency;
        }
    },

    state: {
        currency: {}
    },

    getters: {
        getCurrency(state) {
            return state.currency;
        }
    }
}
