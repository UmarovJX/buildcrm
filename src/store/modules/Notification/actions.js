export default {
  openNotify({ commit, state }, data) {
    if (data) {
      commit("setNotify", data);
      setTimeout(() => {
        commit("setNotify", {});
      }, state.xNotify.duration);
    }
  },
};
