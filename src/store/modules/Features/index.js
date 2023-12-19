export default {
  mutations: {
    setContentTheme(state, theme) {
      state.theme = theme
    },
  },

  state: {
    theme: localStorage['user-theme'],
  },

  getters: {
    getTheme: state => state.theme,
  },
}
