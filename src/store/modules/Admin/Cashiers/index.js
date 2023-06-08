import api from "@/services/api";

export default {
  actions: {
    async fetchCashiers(ctx, vm) {
      try {
        const response = await api.home.fetchCashiers();
        const cashiers = response.data;

        ctx.commit("updateCashiers", cashiers);
      } catch (error) {
        if (!error.response) {
          vm.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            vm.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            vm.toasted(error.response.data.message, "error");
          } else if (error.response.status === 500) {
            vm.toasted(error.response.data.message, "error");
          } else {
            vm.toasted(error.response.data.message, "error");
          }
        }
      }
    },
  },

  mutations: {
    updateCashiers(state, cashiers) {
      state.cashiers = cashiers;
    },
  },

  state: {
    cashiers: [],
  },

  getters: {
    getCashiers(state) {
      return state.cashiers;
    },
  },
};
