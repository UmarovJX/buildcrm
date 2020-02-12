export default {
    actions: {
        async fetchAccountant(ctx, vm) {
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/accountants/update/' + vm.accountant_id, vm.header );
                ctx.commit('updateAccountant', response.data);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

        nullAccountant(ctx) {
            ctx.commit('nullAccountant');
        },

    },

    mutations: {
        updateAccountant(state, manager) {
            state.manager = manager;
        },

        nullAccountant (state) {
            state.manager = {}
        },
    },

    state: {
        manager: {},
    },

    getters: {
        getAccountant(state) {
            return state.manager;
        }
    }
}
