import api from "@/services/api";
export default {
  state: {
    me: {},
    permission: {},
  },

  getters: {},
  mutations: {
    UPDATEME(state, me) {
      state.me = me;
    },
  },
  actions: {
    FETCH_ME({commit}) {
      return new Promise((resolve, reject) => {
        api.authV1.getMe()
          .then((response) => {
            commit("UPDATEME", response.data);
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
  },
};
