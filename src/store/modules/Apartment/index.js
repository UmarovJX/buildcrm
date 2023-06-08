import api from "@/services/api";

export default {
  state: {
    apartment: {},
    calc: {},
  },

  getters: {
    getApartment(state) {
      return state.apartment;
    },
    getCalcData(state) {
      return state.calc;
    },
  },

  actions: {
    async fetchApartment(ctx, vm) {
      ctx.commit("updateLoading", true, { root: true });
      try {
        const { object, id } = vm.$route.params;
        const { data } = await api.objectsV2.fetchObjectsApartment(object, id);
        ctx.commit("updateApartmentView", data);
        ctx.commit("updateLoading", false, { root: true });
      } catch (error) {
        vm.toastedWithErrorCode(error);
      }
    },
  },

  mutations: {
    setCalculationProperties(state, calc) {
      state.calc = calc;
    },
    updateApartmentView(state, apartment) {
      state.apartment = apartment;
    },
  },
};
