export default {
    actions: {
        async fetchManager(ctx, vm) {
            try {
                 const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/managers/update/' + vm.manager_id, vm.header );
                 ctx.commit('updateManager', response.data);
            } catch (error) {
                if (! error.response) {
                    vm.toasted('Error: Network Error', 'error');
                } else {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

        nullManager(ctx) {
            ctx.commit('nullManager');
        },

    },

    mutations: {
        updateManager(state, manager) {
            state.manager = manager;
        },

        nullManager (state) {
            state.manager = {}
        },
    },

    state: {
        manager: {},
    },

    getters: {
        getManager(state) {
            return state.manager;
        }
    }
}
