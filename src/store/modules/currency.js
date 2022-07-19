import api from "@/services/api";
import GeneralPermission from "@/permission/general";

export default {
    actions: {
        async fetchCurrency(ctx, vm) {
            // const permission = store.state.me
            // console.log(permission.permission.general.currency, 'store.state.permission');
            // console.log(permission?.general?.currency, 'permission && permission.general && permission.general.currency');
            try {
                const response = await api.authV1.getMe()
                if (GeneralPermission.getCurrencyPermission() || response.data.role?.permissions?.general?.currency) {
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
