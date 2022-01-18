import router from '../../../routes'

export default {
  state: {
    apartments: {
      items: [],
      pagination: {},
    },
    filter: {},

    client: {},
  },
  mutations: {
    updateApartment(state, apartments) {
      if (apartments.pagination.current > 1) {
        state.apartments.pagination = apartments.pagination;
        state.apartments.items.push(...apartments.items);
      } else {
        state.apartments = apartments;
      }
    },

    updateFilter(state, filter) {
      state.filter = filter;
    },

    updateReserveClient(state, client) {
      state.client = client;
    },
  },
  actions: {
    async fetchApartments(ctx, vm) {
      /* eslint-disable no-debugger */
      // debugger;
      ctx.commit("updateLoading", true, {root: true});
      
      if (typeof router.currentRoute.query.rooms === "string") {
        const newArr = [];
        const newArrItem = parseInt(router.currentRoute.query.rooms);
        newArr.push(newArrItem);
        router.currentRoute.query.rooms = newArr;
      }
      if (typeof router.currentRoute.query.number === "string") {
        const newArr = [];
        const newArrItem = parseInt(router.currentRoute.query.number);
        newArr.push(newArrItem);
        router.currentRoute.query.number = newArr;
      }
      if (typeof router.currentRoute.query.floors === "string") {
        const newArr = [];
        const newArrItem = parseInt(router.currentRoute.query.floors);
        newArr.push(newArrItem);
        router.currentRoute.query.floors = newArr;
      }
      if (typeof router.currentRoute.query.blocks === "string") {
        const newArr = [];
        const newArrItem = parseInt(router.currentRoute.query.blocks);
        newArr.push(newArrItem);
        router.currentRoute.query.blocks = newArr;
      }

      if (router.currentRoute.name !== "apartments") return;

      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
          params: router.currentRoute.query,
        };

        let {data} = await vm.axios.get(
          `${process.env.VUE_APP_URL}/objects/${router.currentRoute.params.object}/apartments/`,
          header
        );

        ctx.commit("updateApartment", data);
        ctx.commit("updateLoading", false, {root: true});
      } catch (error) {
        this.toastedWithErrorCode(error);
      }
    },

    async fetchApartmentsFilter(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const response = await vm.axios.post(
          process.env.VUE_APP_URL +
            "/objects/" +
            router.currentRoute.params.object +
            "/filter?page=" +
            vm.page,
          vm.filter,
          header
        );
        const apartments = response.data;
        ctx.commit("updateApartment", apartments);
        ctx.commit("updateLoading", false, {root: true});
      } catch (error) {
        this.toastedWithErrorCode(error);
      }
    },

    async fetchFilterObject(ctx, vm) {
      ctx.commit("updateLoading", true, {root: true});
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const response = await vm.axios.get(
          process.env.VUE_APP_URL +
            "/objects/" +
            router.currentRoute.params.object +
            "/filter",
          header
        );
        const floors = response.data;
        ctx.commit("updateFilter", floors);
        ctx.commit("updateLoading", false, {root: true});
      } catch (error) {
        if (!error.response) {
          vm.toasted("Error: Network Error", "error");
        } else {
          this.toastedWithErrorCode(error);
        }
      }
    },

    async fetchReserveClient(ctx, vm) {
      try {
        let header = {
          headers: {
            Authorization: "Bearer " + localStorage.token,
          },
        };

        const response = await vm.axios.get(
          process.env.VUE_APP_URL + "/orders/" + vm.order_id + "/client",
          header
        );
        const client = response.data;
        ctx.commit("updateReserveClient", client);
      } catch (error) {
        if (!error.response) {
          vm.toasted("Error: Network Error", "error");
        } else {
          this.toastedWithErrorCode(error);
        }
      }
    },
  },
  getters: {
    getApartments(state) {
      return state.apartments;
    },

    getFilterParams(state) {
      return state.filter;
    },

    getReserveClient(state) {
      return state.client;
    },
  },
};
