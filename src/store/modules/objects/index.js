export default {
  actions: {
    async fetchObjects(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const response = await vm.axios.get(
          process.env.VUE_APP_URL + "/objects",
          header
        );
        const objects = response.data;
        ctx.commit("updateObjects", objects);
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
      } finally {
        ctx.commit("updateLoading", false, {root: true});
      }
    },

    async fetchRoles(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const response = await vm.axios.get(
          process.env.VUE_APP_URL + "/roles",
          header
        );
        const roles = response.data;
        ctx.commit("updateRoles", roles);
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
      } finally {
        ctx.commit("updateLoading", false, {root: true});
      }
    },
  },

  state: {
    objects: [],
    roles: [],
  },

  mutations: {
    updateObjects(state, objects) {
      state.objects = objects;
    },

    updateRoles(state, roles) {
      state.roles = roles;
    },
  },

  getters: {
    getObjects(state) {
      return state.objects;
    },

    getRoles(state) {
      return state.roles;
    },
  },
};
