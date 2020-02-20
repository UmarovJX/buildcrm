export default {
    actions: {
        async fetchAccountants(ctx, vm) {
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/accountants', vm.header);
                const accountants = response.data;

                ctx.commit('updateAccountants', accountants);

            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

    },

    mutations: {
        updateAccountants(state, managers) {
            state.accountants = managers;
        }
    },

    state: {
        accountants: []
    },

    getters: {
        getAccountants(state) {
            return state.accountants;
        }
    }
}
