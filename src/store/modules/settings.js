export default {
  actions: {
    async fetchPlaymobile(ctx, vm) {
      // ctx.commit('updateLoading', true, { root: true });

      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const {data} = await vm.axios.get(
          process.env.VUE_APP_URL + "/settings",
          header
        );
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
