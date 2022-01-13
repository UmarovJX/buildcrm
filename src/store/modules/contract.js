import router from "../../routes";
export default {
  state: {
    contracts: [],
    pagination: {},
  },

  mutations: {
    updateContract(state, contracts) {
      state.contracts = contracts;
    },

    updatePagination(state, pagination) {
      state.pagination = pagination;
    },
  },

  getters: {
    getContracts(state) {
      return state.contracts;
    },

    getPaginationContracts(state) {
      return state.pagination;
    },
  },
  actions: {
    async fetchContracts(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});

      if (typeof router.currentRoute.query.object_id === "string") {
        const newArr = [];
        const newArrItem = parseInt(router.currentRoute.query.object_id);
        newArr.push(newArrItem);
        router.currentRoute.query.object_id = newArr;
      }
      if (typeof router.currentRoute.query.apartment_number === "string") {
        const newArr = [];
        const newArrItem = parseInt(router.currentRoute.query.apartment_number);
        newArr.push(newArrItem);
        router.currentRoute.query.apartment_number = newArr;
      }
      if (typeof router.currentRoute.query.date === "string") {
        const newArr = [];
        const newArrItem = parseInt(router.currentRoute.query.date);
        newArr.push(newArrItem);
        router.currentRoute.query.date = newArr;
      }

      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
          params: router.currentRoute.query,
        };

        const {data} = await vm.axios.get(
          process.env.VUE_APP_URL + "/deals",
          header
        );
        ctx.commit("updateLoading", false, {root: true});
        ctx.commit("updateContract", data.items);
        ctx.commit("updatePagination", data.pagination);
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
};
