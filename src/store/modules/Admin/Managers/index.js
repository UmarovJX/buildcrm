export default {
    actions: {
        async fetchUsers(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/users', vm.header);
                const managers = response.data;

                ctx.commit('updateUsers', managers);
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
          updateUsers(state, managers) {
              state.users = managers;
          }
    },

    state: {
        users: []
    },

    getters: {
        getUsers(state) {
            return state.users;
        }
    }
}
