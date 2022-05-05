import api from "@/services/api";

export default {
    actions: {
        async setMe(ctx, vm, path = '') {
            try {
                const response = await api.authV1.getMe()
                ctx.commit("updateMe", response.data);
                ctx.commit("updatePermissions", response.data);
                // ctx.commit("updateLocale", response.data);
                return path
            } catch (error) {
                if (error.response) {
                    vm.toasted(error.response.data.message, "error");
                }
            }
        },

        nullMe(ctx) {
            ctx.commit("updateMe", {});
            ctx.commit("nullPermissions");
        },
    },

    mutations: {
        updateMe(state, me) {
            state.me = me;
        },

        updateLocale(state, locale) {
            state.locale = locale;
        },

        updatePermissions(state, me) {
            state.permission = me.role.permissions;
        },

        nullPermissions(state) {
            state.permission = {};
        },
    },

    state: {
        me: {},
        permission: {},
    },

    getters: {
        getMe(state) {
            return state.me;
        },

        getPermission(state) {
            return state.permission;
        },
    },
};
