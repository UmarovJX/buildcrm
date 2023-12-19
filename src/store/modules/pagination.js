export default {
  actions: {},

  state: {
    currentPagination: 1,
  },

  mutations: {
    SET_CURRENT_PAGINATION(state, currentPagination) {
      state.currentPagination = currentPagination
    },
  },

  getters: {
    getCurrentPagination(state) {
      return state.currentPagination
    },
  },
}
