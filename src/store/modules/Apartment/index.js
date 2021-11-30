export default {
  actions: {
    async fetchApartment(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const {data} = await vm.axios.get(
          process.env.VUE_APP_URL + "/objects/" + vm.$route.params.object + "/apartments/" + vm.$route.params.id,
          header
        );

        ctx.commit("updateApartmentView", data);
        ctx.commit("updateLoading", false, {root: true});
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
    },
  },

  mutations: {
    updateApartmentView(state, apartment) {
      state.apartment = apartment;
    },
  },

  state: {
    apartment: {},
  },

  getters: {
    getApartment(state) {
      return state.apartment;
    },
  },
};
