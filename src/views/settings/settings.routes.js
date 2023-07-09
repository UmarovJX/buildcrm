export default [
  {
    path: "/settings",
    component: () => import("@/views/settings/Index.vue"),
    children: [
      {
        path: "",
        name: "settings",
        component: () =>
          import("@/views/settings/views/SettingsClientTypes.vue"),
      },
      {
        path: "client/types",
        name: "settings-countries",
        component: () => import("@/views/settings/views/SettingsCountries.vue"),
      },
      {
        path: "holders",
        name: "settings-holders",
        component: () => import("@/views/settings/views/SettingsHolders.vue"),
      },
      {
        path: "statuses",
        name: "settings-statuses",
        component: () => import("@/views/settings/views/SettingsStatuses.vue"),
      },
    ],
  },
];
