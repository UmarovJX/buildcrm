<script>
import AppHeader from "@/components/Header/AppHeader.vue";
import SettingsTab from "@/views/settings/components/SettingsTab.vue";

export default {
  name: "SettingsPage",
  components: {
    AppHeader,
    SettingsTab,
  },
  data() {
    return {
      tabs: [
        {
          counts: 0,
          name: "client_types",
          value: "settings",
        },
        {
          counts: 0,
          name: "priority_countries",
          value: "settings-countries",
        },
        {
          counts: 0,
          name: "holders.title",
          value: "settings-holders",
        },
        {
          counts: 0,
          name: "statuses.title",
          value: "settings-statuses",
        },
      ],
    };
  },
  computed: {
    currentTab() {
      return this.$route.name;
    },
  },
  methods: {
    changeRouteView(v) {
      if (this.$route.name !== v) {
        this.$router.push({
          name: v,
        });
      }
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("settings.title") }}
      </template>
    </app-header>

    <settings-tab
      @change="changeRouteView"
      :tabs="tabs"
      :current-tab="currentTab"
      class="mb-4"
    />

    <router-view />
  </div>
</template>
