export default {
    actions: {
        async fetchManagers(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/managers', vm.header);
                const managers = response.data;

                ctx.commit('updateManagers', managers);
                ctx.commit('updateLoading', false, { root: true });

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

    },

    mutations: {
          updateManagers(state, managers) {
              state.managers = managers;
          }
    },

    state: {
        managers: []
    },

    getters: {
        getManagers(state) {
            return state.managers;
        }
    }
}
