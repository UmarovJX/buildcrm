import api from "@/services/api";
// import GeneralPermission from "@/permission/general";

export default {
    actions: {
        async fetchCurrency(ctx) {
            // if (GeneralPermission.getCurrencyPermission()) {
            try {
                const response = await api.authV1.getMe()
                if (response.data.role && response.data.role.permissions && response.data.role.permissions.general && response.data.role.permissions.general.currency) {
                    const {data} = await api.settingsV2.fetchCurrency()
                    ctx.commit('updateCurrency', data);
                }
            } catch (error) {
                this.toastedWithErrorCode(error)
            }
            // }
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
