import api from '@/services/api'

export default {
  actions: {
    async fetchAccountant(ctx, vm) {
      try {
        const response = await api.accountants.fetchAccountant(
          vm.accountant_id,
        )
        ctx.commit('updateAccountant', response.data)
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

    nullAccountant(ctx) {
      ctx.commit('nullAccountant')
    },
  },

  mutations: {
    updateAccountant(state, manager) {
      state.manager = manager
    },

    nullAccountant(state) {
      state.manager = {}
    },
  },

  state: {
    manager: {},
  },

  getters: {
    getAccountant(state) {
      return state.manager
    },
  },
}
