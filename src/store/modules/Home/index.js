import api from '@/services/api'

export default {
  actions: {
    async fetchCounts(ctx, vm) {
      try {
        const response = await api.home.fetchHome()
        const counts = response.data
        ctx.commit('getUpdateCounts', counts)
      } catch (error) {
        if (!error.response) {
          vm.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          vm.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 401) {
          vm.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 500) {
          vm.toasted(error.response.data.message, 'error')
        } else {
          vm.toasted(error.response.data.message, 'error')
        }
      }
    },
  },

  mutations: {
    getUpdateCounts(state, counts) {
      state.counts = counts
    },
  },

  state: {
    counts: {},
  },

  getters: {
    getHomeCounts(state) {
      return state.counts
    },
  },
}
