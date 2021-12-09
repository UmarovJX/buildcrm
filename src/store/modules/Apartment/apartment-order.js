export default {
  actions: {
    async fetchApartmentOrder(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});
      console.log(vm.$route.params.id);
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const {data} = await vm.axios.get(
          process.env.VUE_APP_URL + "/orders/" + vm.$route.params.id + "/hold",
          header
        );

        console.log('data', data);

        ctx.commit("updateApartmentOrder", data);
        ctx.commit("updateLoading", false, {root: true});
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
    },
  },

  mutations: {
    updateApartmentOrder(state, apartment) {
      state.apartmentOrder = apartment;
    },
  },

  state: {
    apartmentOrder: {},
  },

  getters: {
    getApartmentOrder(state) {
      return state.apartmentOrder;
    },
  },
};
