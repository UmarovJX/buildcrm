<script>
import ErrorNotification from '@/components/Reusable/ErrorNotification'
import { computed, getCurrentInstance } from 'vue'

export default {
  name: 'AppLayout',
  components: { ErrorNotification },
  props: {
    theme: {
      type: String,
      default: 'light-theme',
    },
  },
  data() {
    return {
      showHeaderContent: false,
    }
  },
  watch: {
    '$route.name': {
      handler(name) {
        const unnecessaryRoute = ['login', 'home-2']
        const indexOfRoute = unnecessaryRoute.findIndex(
          routeName => routeName === name,
        )
        this.showHeaderContent = indexOfRoute === -1
      },
      deep: true,
      immediate: true,
    },
  },
  setup() {
    const vm = getCurrentInstance().proxy
    const isHomePage = computed(() => vm.$route.name === 'home')

    return {
      isHomePage,
    }
  },
}
</script>

<template>
  <div>
    <header-block
      v-if="showHeaderContent"
      :theme="theme"
    />
    <main
      v-if="showHeaderContent"
      class="main-content"
      :class="{'padding__reset':isHomePage}"
    >
      <ErrorNotification />
      <div class="app-content">
        <router-view />
      </div>
    </main>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.padding__reset{
  padding: 0;
}
</style>
