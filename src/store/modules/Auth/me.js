export default {
    actions: {
        setMe(ctx, me) {
            ctx.commit('updateMe', me);
        }
    },

    mutations: {
        updateMe(state, me) {
            state.me = me;
        }
    },

    state: {
        me: {}
    },

    getters: {
        getMe(state) {
            return state.me;
        }
    }
}
