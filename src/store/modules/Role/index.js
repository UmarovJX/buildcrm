export default {
    actions: {

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
