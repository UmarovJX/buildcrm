export default {
    actions: {
        async setMe(ctx, vm, path) {
            try {
                const response = await vm.axios.get(process.env.VUE_APP_URL + '/api/auth/me', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.token,
                    },
                });

                ctx.commit('updateMe', response.data);
                ctx.commit('updatePermissions', response.data);

                if (path.path == '/') {
                    vm.$router.push('dashboard');
                }
            } catch (error) {
                if (error.response) {
                    vm.toasted(error.response.data.message, 'error');
                }
            }
        },

        nullMe(ctx) {
            ctx.commit('updateMe', {});
            ctx.commit('nullPermissions');
        }
    },

    mutations: {
        updateMe(state, me) {
            state.me = me;
        },

        updatePermissions(state, me) {
            state.permission = me.role.permissions;
        },

        nullPermissions(state) {
            state.permission = {};
        }
    },

    state: {
        me: {},
        permission: {}

    },

    getters: {
        getMe(state) {
            return state.me;
        },

        getPermission(state) {
            return state.permission;
        }
    }
}
