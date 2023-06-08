import api from "@/services/api";

export default {
  actions: {
    async fetchPlaymobile(ctx, vm) {
      // ctx.commit('updateLoading', true, { root: true });
      try {
        const { data } = await api.settings.fetchSettings();
        ctx.commit("updateSms", data);
        // ctx.commit('updateLoading', false, { root: true });
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
    },
  },

  state: {
    playmobile: {},
  },

  mutations: {
    updateSms(state, data) {
      state.playmobile = data;
    },
  },

  getters: {
    getPlaymobile(state) {
      return state.playmobile;
    },
  },
};
