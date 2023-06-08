import api from "@/services/api";

export default {
  actions: {
    async fetchAccountants(ctx, vm) {
      try {
        const response = await api.accountants.fetchAccountants();
        const accountants = response.data;

        ctx.commit("updateAccountants", accountants);
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
    updateAccountants(state, managers) {
      state.accountants = managers;
    },
  },

  state: {
    accountants: [],
  },

  getters: {
    getAccountants(state) {
      return state.accountants;
    },
  },
};
