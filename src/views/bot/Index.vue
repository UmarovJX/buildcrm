<script>
import AppHeader from '@/components/Header/AppHeader.vue'
import SettingsTab from '@/views/settings/components/SettingsTab.vue'
// import SettingsPermission from "@/permission/settings.permission";

export default {
  name: 'SettingsPage',
  components: {
    AppHeader,
    SettingsTab,
  },
  data() {
    const tabs = [
      {
        counts: 0,
        name: 'bot.pages',
        value: 'bot',
      },
      // {
      //   counts: 0,
      //   name: "bot.objects",
      //   value: "bot-objects",
      // },
    ]

    return {
      tabs,
    }
  },
  computed: {
    currentTab() {
      return this.$route.name
    },
  },
  methods: {
    changeRouteView(v) {
      if (this.$route.name !== v) {
        this.$router.push({
          name: v,
        })
      }
    },
  },
}
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("bot.title") }}
      </template>
    </app-header>

    <settings-tab
      :tabs="tabs"
      :current-tab="currentTab"
      class="mb-4"
      @change="changeRouteView"
    />

    <router-view />
  </div>
</template>
