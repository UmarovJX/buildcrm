import api from '@/services/api'

export default {
  actions: {
    async fetchFilterApartments(ctx, vm) {
      ctx.commit('updateLoading', true, { root: true })
      try {
        const response = await api.apartments.fetchFilteredApartments(
          vm.filter,
        )
        const apartments = response.data

        ctx.commit('updateApartment', apartments)
        ctx.commit('updateLoading', false, { root: true })
      } catch (error) {
        vm.toastedWithErrorCode(error)
      }
    },
  },

  mutations: {
    updateApartment(state, apartments) {
      state.apartments = apartments
    },
  },

  state: {
    apartments: [],
  },

  getters: {
    getFilteredApartments(state) {
      return state.apartments
    },
  },
}
