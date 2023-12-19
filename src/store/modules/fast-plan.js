export default {
  state: {
    fastPlanImage: null,
    fastPlanName: null,
    fastPlanId: null,
  },

  mutations: {
    updateFastPlanImage(state, fastPlanImage) {
      state.fastPlanImage = fastPlanImage
    },
    updateFastPlanName(state, fastPlanName) {
      state.fastPlanName = fastPlanName
    },
    updateFastPlanId(state, fastPlanId) {
      state.fastPlanId = fastPlanId
    },
  },

  getters: {
    getFastPlanImage(state) {
      return state.fastPlanImage
    },
    getFastPlanName(state) {
      return state.fastPlanName
    },
    getFastPlanId(state) {
      return state.fastPlanId
    },
  },
}
