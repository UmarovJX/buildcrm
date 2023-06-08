import api from "@/services/api";

export default {
  actions: {
    async fetchUser(ctx, vm) {
      try {
        const response = await api.user.fetchUserData(vm.manager_id);
        ctx.commit("updateUser", response.data);
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

    nullManager(ctx) {
      ctx.commit("nullUser");
    },
  },

  mutations: {
    updateUser(state, manager) {
      state.user = manager;
    },

    nullUser(state) {
      state.user = {};
    },
  },

  state: {
    user: {},
  },

  getters: {
    getUser(state) {
      return state.user;
    },
  },
};
