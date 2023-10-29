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

    const languagesViewPms = SettingsPermission.getPermission("languages.view");
    const translationsViewPms =
      SettingsPermission.getPermission("translations.view");
    const versionsViewPms = SettingsPermission.getPermission("versions.view");

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
    if (languagesViewPms) {
      tabs.push({
        counts: 0,
        name: "languages",
        value: "settings-languages",
      });
    }
    if (translationsViewPms) {
      tabs.push({
        counts: 0,
        name: "translations",
        value: "settings-translations",
      });
    }
    if (versionsViewPms) {
      tabs.push({
        counts: 0,
        name: "versions",
        value: "settings-versions",
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
