export default {
    actions: {
        async fetchCashier(ctx, vm) {
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/cashiers/update/' + vm.cashier_id, vm.header );
                ctx.commit('updateCashier', response.data);
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
        },

        nullCashier(ctx) {
            ctx.commit('nullCashier');
        },

    },

    mutations: {
        updateCashier(state, cashier) {
            state.cashier = cashier;
        },

        nullCashier (state) {
            state.cashier = {}
        },
    },

    state: {
        cashier: {},
    },

    getters: {
        getCashier(state) {
            return state.cashier;
        }
    }
}
