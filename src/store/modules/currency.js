import api from "@/services/api";
// import GeneralPermission from "@/permission/general";

export default {
    actions: {
        async fetchCurrency(ctx, vm) {
            try {
                const response = await api.authV1.getMe()
                if (response.data.role && response.data.role.permissions && response.data.role.permissions.general && response.data.role.permissions.general.currency) {
                    const {data} = await api.settingsV2.fetchCurrency()
                    ctx.commit('updateCurrency', data);
                }

            } catch (error) {
                if (!error.response) {
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
                // }
            }

        }
    },

    mutations: {
        updateCurrency(state, currency) {
            state.currency = currency;
        }
    },

    state: {
        currency: {}
    },

    getters: {
        getCurrency(state) {
            return state.currency;
        }
    }
}
