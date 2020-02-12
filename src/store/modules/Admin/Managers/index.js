export default {
    actions: {
        async fetchManagers(ctx, vm) {
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/managers', vm.header);
                const managers = response.data;

                ctx.commit('updateManagers', managers);

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
