import api from "@/services/api";

export default {
  actions: {
    async fetchMenu(ctx) {
      await api.home
        .fetchMenu()
        .then((response) => {
          ctx.commit("updateMenus", response.data);
        })
        .catch(() => {
          // localStorage.clear();
        });
    },
  },

  mutations: {
    updateMenus(state, result) {
      state.menus = [...result, { icon: "group", action: "clients" }];
    },
  },

  state: {
    menus: [],
  },

  getters: {
    getMenus(state) {
      return state.menus;
    },
  },
};
