<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    theme: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      userTheme: 'light-theme',
    }
  },
  watch: {
    theme(value) {
      if (value) {
        this.userTheme = value
      }
    },
  },
  mounted() {
    this.setTheme(this.theme)
  },

  methods: {
    ...mapMutations(['setContentTheme']),
    toggleTheme() {
      const activeTheme = localStorage.getItem('user-theme')
      if (activeTheme === 'light-theme') {
        this.setTheme('dark-theme')
        this.setContentTheme('dark-theme')
      } else {
        this.setTheme('light-theme')
        this.setContentTheme('light-theme')
      }
    },

    setTheme(theme) {
      localStorage.setItem('user-theme', theme)
      this.userTheme = theme
      document.documentElement.className = theme
    },
  },
}
</script>

<template>
  <div>
    <input
      id="checkbox"
      type="checkbox"
      class="switch-checkbox"
      @change="toggleTheme"
    >
    <label
      for="checkbox"
      class="switch-label mb-0 mr-3 mt-1"
    >
      <span v-if="userTheme === 'dark-theme'">
        <i class="fal fa-moon" />
      </span>
      <span v-else>
        <i class="fal fa-sun" />
      </span>
    </label>
  </div>
</template>

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
