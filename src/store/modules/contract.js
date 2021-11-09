// import router from "@/routes";

export default {
  actions: {
    async fetchContracts(ctx, vm) {
      // console.log(router.currentRoute.query.page);
      console.log(vm.page);
      ctx.commit("updateLoading", true, {root: true});
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const {data} = await vm.axios.get(
          process.env.VUE_APP_URL + "/deals?page=" + vm.page,
          header
        );
        // router.push({
        //   name: "contracts",
        //   query: {
        //     page: router.currentRoute.query.page,
        //   },
        // });
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

    async fetchContractSearch(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const {data} = await vm.axios.get(
          process.env.VUE_APP_URL +
            "/deals/search?page=" +
            vm.page +
            "&search=" +
            vm.search +
            "&orderBy=" +
            vm.orderBy,
          header
        );

        // router.push({
        //   name: "contracts",
        //   query: {
        //     page: router.currentRoute.query.page,
        //     search: router.currentRoute.query.search,
        //     orderBy: router.currentRoute.query.orderBy,
        //   },
        // });
        ctx.commit("updateContract", data.items);
        ctx.commit("updatePagination", data.pagination);
        ctx.commit("updateLoading", false, {root: true});
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
};
