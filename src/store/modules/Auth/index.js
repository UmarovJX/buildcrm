export default {
    actions: {
        setToken(ctx, token) {
            ctx.commit('updateToken', token);
        }
    },

    mutations: {
        updateToken(state, token) {
            state.token = token
        }
    },

    state: {
       token: null
    },

    getters: {
        getToken(state) {
            return state.token;
        }
    }
}