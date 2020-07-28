export default {
    actions: {
        async fetchObjects(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/objects', header);
                const objects = response.data;
                ctx.commit('updateLoading', false, { root: true });
                ctx.commit('updateObjects', objects);
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

        async fetchRoles(ctx, vm) {
            ctx.commit('updateLoading', true, { root: true });
            try {
                let header = {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token
                    }
                };

                const response = await vm.axios.post(process.env.VUE_APP_URL + '/api/roles', {}, header);
                const roles = response.data;
                ctx.commit('updateRoles', roles);
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
        }
    },

    state: {
        objects: [],
        roles: []
    },

    mutations: {
        updateObjects(state, objects) {
            state.objects = objects;
        },

        updateRoles(state, roles) {
            state.roles = roles;
        }
    },

    getters: {
        getObjects(state) {
            return state.objects;
        },

        getRoles(state) {
            return state.roles;
        }
    }
}
