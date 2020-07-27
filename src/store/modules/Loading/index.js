export default {
    mutations: {
        updateLoading(state, type) {
            state.loading = type;
        }
    },

    state: {
        loading: false
    },

    getters: {
        getLoading(state) {
            return state.loading;
        }
    }
}
