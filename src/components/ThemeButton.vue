<template>
  <div>
    <input
      @change="toggleTheme"
      id="checkbox"
      type="checkbox"
      class="switch-checkbox"
    />
    <label for="checkbox" class="switch-label mb-0 mr-3 mt-1">
      <span v-if="userTheme === 'dark-theme'">
        <i class="fal fa-moon"></i>
      </span>
      <span v-else>
        <i class="fal fa-sun"></i>
      </span>
    </label>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userTheme: "light-theme",
    };
  },

  methods: {
    toggleTheme() {
      const activeTheme = localStorage.getItem("user-theme");
      if (activeTheme === "light-theme") {
        this.setTheme("dark-theme");
      } else {
        this.setTheme("light-theme");
      }
    },

    setTheme(theme) {
      localStorage.setItem("user-theme", theme);
      this.userTheme = theme;
      document.documentElement.className = theme;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
input {
  display: none;
}
span {
  i {
    cursor: pointer;
    color: white;
    font-size: 24px;
  }
}
</style>
