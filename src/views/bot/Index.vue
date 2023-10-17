<script>
import AppHeader from "@/components/Header/AppHeader.vue";
import SettingsTab from "@/views/settings/components/SettingsTab.vue";
//import SettingsPermission from "@/permission/settings.permission";

export default {
  name: "SettingsPage",
  components: {
    AppHeader,
    SettingsTab,
  },
  data() {
    // const holdersViewPms = SettingsPermission.getPermission("holders.view");
    // const statusesViewPms = SettingsPermission.getPermission("statuses.view");
    // const clientTypesViewPms =
    //   SettingsPermission.getPermission("client_types.view");
    // const countriesViewPms = SettingsPermission.getPermission(
    //   "client_countries.view"
    // );

    const tabs = [
      {
        counts: 0,
        name: "bot.pages",
        value: "bot",
      },
      {
        counts: 0,
        name: "bot.objects",
        value: "bot-objects",
      },
    ];

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
        {{ $t("bot.title") }}
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
