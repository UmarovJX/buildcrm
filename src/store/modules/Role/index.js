export default {
    actions: {
        async fetchRole(ctx, vm) {
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const { data } = await vm.axios.get(process.env.VUE_APP_URL + '/roles/update/' + vm.$route.params.id, header);

                ctx.commit('updateRole', data);

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
        updateRole(state, role) {
            state.role = role;
        }
    },

    state: {
        role: {}
    },

    getters: {
        getRole(state) {
            return state.role;
        }
    }
}
