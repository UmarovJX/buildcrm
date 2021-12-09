<template>
  <div id="app">
    <header-block></header-block>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      onLine: navigator.onLine,
    };
  },
  methods: {
    updateOnlineStatus(e) {
      const {type} = e;
      this.onLine = type === "online";
    },
    getMediaPreference() {
      const hasDarkPreference = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (hasDarkPreference) {
        return "dark-theme";
      } else {
        return "light-theme";
      }
    },
    setTheme(theme) {
      localStorage.setItem("user-theme", theme);
      this.userTheme = theme;
      document.documentElement.className = theme;
    },
  },
  watch: {
    onLine(v) {
      if (v) {
        this.$toasted.clear();
        this.$toasted.show("Подключен к интернету!", {
          theme: "toasted-primary",
          position: "top-right",
          duration: 5000,
          type: "success",
          fitToScreen: true,
        });
      } else {
        this.$toasted.show("Нет подключения к Интернету", {
          theme: "toasted-primary",
          position: "top-right",
          duration: null,
          type: "error",
        });
      }
    },
  },
  mounted() {
    const initUserTheme = this.getMediaPreference();
    const activeTheme = localStorage.getItem("user-theme");
    if (activeTheme === "light-theme") {
      this.setTheme("light-theme");
    } else if (activeTheme === "dark-theme") {
      this.setTheme("dark-theme");
    } else {
      this.setTheme(initUserTheme);
    }
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
};
</script>

<style lang="scss"></style>
