import api from "@/services/api";

export default {
  actions: {
    async fetchApartmentOrder(ctx, vm) {
      ctx.commit("updateLoading", true, { root: true });
      try {
        const { data } = await api.orders.fetchHoldOrder(vm.$route.params.id);
        ctx.commit("updateApartmentOrder", data);
        ctx.commit("updateLoading", false, { root: true });
      } catch (error) {
        vm.toastedWithErrorCode(error);
        vm.$router.push("/");
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
