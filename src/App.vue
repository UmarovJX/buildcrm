<template>
  <div id="app">
    <div class="connection-status">
      <div class="banner">
        <div class="content disconnected" v-if="connecting === 2">
          <div class="mr-1">
            <i class="fal fa-times-circle"></i>
          </div>
          <span>Нет подключения к Интернету</span>
        </div>
        <div class="content connected" v-if="connecting === 1">
          <div class="mr-1">
            <i class="fal fa-check-circle"></i>
          </div>
          <span>Подключен к интернету!</span>
        </div>
      </div>
    </div>
    <header-block v-if="showHeaderContent" :theme="theme"></header-block>
    <router-view></router-view>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

export default {
  name: 'App',
  data() {
    return {
      onLine: navigator.onLine,
      theme: "",
      connecting: null,
      showHeaderContent: false
    }
  },
  computed: {
    ...mapGetters(["getMe"])
  },
  created() {
    console.log(this.$route)
    if (!localStorage.locale) {
      localStorage.locale = "ru";
      this.$i18n.locale = "ru";
    }

    let path = this.$router.currentRoute;
    if (localStorage.token) {
      let vm = this;
      this.setMe(vm, path);
    } else {
      if (path.path !== "/") {
        this.$router.push("/");
      }
    }

    if (!localStorage.getItem("user-theme")) {
      this.setTheme("light-theme");
    }
  },
  methods: {
    ...mapActions(["setMe"]),
    ...mapMutations(['setContentTheme']),
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
      this.setContentTheme = theme
      this.userTheme = theme;
      document.documentElement.className = theme;
    },
  },
  watch: {
    '$route.name': {
      handler: function (name) {
        const unnecessaryRoute = ['login']
        const indexOfRoute = unnecessaryRoute.findIndex(routeName => routeName === name)
        this.showHeaderContent = indexOfRoute === -1;
      },
      deep: true,
      immediate: true
    },
    onLine(v) {
      if (v) {
        this.$toasted.clear();
        this.connecting = 1;
        setTimeout(() => {
          this.connecting = null;
        }, 5000);
        // this.$toasted.show("Подключен к интернету!", {
        //   theme: "toasted-primary",
        //   position: "top-right",
        //   duration: 5000,
        //   type: "success",
        //   fitToScreen: true,
        // });
      } else {
        this.connecting = 2;
        // this.$toasted.show("Нет подключения к Интернету", {
        //   theme: "toasted-primary",
        //   position: "top-right",
        //   duration: null,
        //   type: "error",
        // });
      }
    },
  },
  mounted() {
    // const initUserTheme = this.getMediaPreference();
    const activeTheme = localStorage.getItem("user-theme");
    this.theme = activeTheme;
    if (activeTheme === "light-theme") {
      this.setTheme("light-theme");
    } else if (activeTheme === "dark-theme") {
      this.setTheme("dark-theme");
    } else {
      // this.setTheme(initUserTheme);
      // this.theme = initUserTheme;
      this.setTheme("light-theme");
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
