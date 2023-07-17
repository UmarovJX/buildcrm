<script>
import AppHeader from "@/components/Header/AppHeader.vue";
import SettingsTab from "@/views/settings/components/SettingsTab.vue";
import SettingsPermission from "@/permission/settings.permission";

export default {
  name: "SettingsPage",
  components: {
    AppHeader,
    SettingsTab,
  },
  data() {
    const holdersViewPms = SettingsPermission.getPermission("holders.view");
    const statusesViewPms = SettingsPermission.getPermission("statuses.view");
    const clientTypesViewPms =
      SettingsPermission.getPermission("client_types.view");
    const countriesViewPms = SettingsPermission.getPermission(
      "client_countries.view"
    );

    const tabs = [];

    if (clientTypesViewPms) {
      tabs.push({
        counts: 0,
        name: "client_types",
        value: "settings",
      });
    }

    if (countriesViewPms) {
      tabs.push({
        counts: 0,
        name: "priority_countries",
        value: "settings-countries",
      });
    }

    if (holdersViewPms) {
      tabs.push({
        counts: 0,
        name: "holders.title",
        value: "settings-holders",
      });
    }

    if (statusesViewPms) {
      tabs.push({
        counts: 0,
        name: "statuses.title",
        value: "settings-statuses",
      });
    }

    if (tabs.length && this.$route.name !== tabs[0].value) {
      this.$router.push({
        name: tabs[0].value,
      });
    } else {
      this.$router.push({
        name: "home",
      });
    }

    return {
      tabs,
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
