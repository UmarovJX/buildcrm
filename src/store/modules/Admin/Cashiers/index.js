export default {
    actions: {
        async fetchCashiers(ctx, vm) {
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/cashiers', vm.header);
                const cashiers = response.data;

                ctx.commit('updateAccountants', cashiers);

            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.error, 'error');
                }
            }
        },

    },

    mutations: {
        updateCashiers(state, cashiers) {
            state.cashiers = cashiers;
        }
    },

    state: {
        cashiers: []
    },

    getters: {
        getCashiers(state) {
            return state.cashiers;
        }
    }
}
