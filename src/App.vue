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
  },
  watch: {
    onLine(v) {
      if (v) {
        this.$toasted.clear();
        this.$toasted.show("Siz online dasiz!!", {
          theme: "toasted-primary",
          position: "top-right",
          duration: 5000,
          type: "success",
          fitToScreen: true,
        });
      } else {
        this.$toasted.show("Internet aloqasi uzildi (", {
          theme: "toasted-primary",
          position: "top-right",
          duration: null,
          type: "error",
        });
      }
    },
  },
  mounted() {
    window.addEventListener("online", this.updateOnlineStatus);
    window.addEventListener("offline", this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.removeEventListener("online", this.updateOnlineStatus);
    window.removeEventListener("offline", this.updateOnlineStatus);
  },
};
</script>
<style>
img[lazy="error"] {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
