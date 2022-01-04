import axios from "axios";
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
        axios
          .get(process.env.VUE_APP_URL + "/oauth/me", {
            headers: {
              Authorization: "Bearer " + localStorage.token,
            },
          })
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
