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
        meta: {
          requiresAuth: "settings",
        },
      },
      {
        path: "client/countries",
        name: "settings-countries",
        component: () => import("@/views/settings/views/SettingsCountries.vue"),
        meta: {
          requiresAuth: "settings.client_countries",
          parent: "settings",
        },
      },
      {
        path: "holders",
        name: "settings-holders",
        component: () => import("@/views/settings/views/SettingsHolders.vue"),
        meta: {
          requiresAuth: "settings.holders",
          parent: "settings",
        },
      },
      {
        path: "statuses",
        name: "settings-statuses",
        component: () => import("@/views/settings/views/SettingsStatuses.vue"),
        meta: {
          requiresAuth: "settings.statuses",
          parent: "settings",
        },
      },
      {
        path: "languages",
        name: "settings-languages",
        component: () => import("@/views/settings/views/SettingsLanguages.vue"),
        meta: {
          requiresAuth: "settings.languages",
          parent: "settings",
        },
      },
      {
        path: "translations",
        name: "settings-translations",
        component: () =>
          import("@/views/settings/views/SettingsTranslations.vue"),
        meta: {
          requiresAuth: "settings.translations",
          parent: "settings",
        },
      },
      {
        path: "versions",
        name: "settings-versions",
        component: () => import("@/views/settings/views/SettingsVersions.vue"),
        meta: {
          requiresAuth: "settings.versions",
          parent: "settings",
        },
      },
      {
        path: "facilities",
        name: "settings-facilities",
        component: () => import("@/views/settings/views/SettingsFacilities.vue"),
        meta: {
          requiresAuth: "settings.versions",
          parent: "settings",
        },
      },
      {
        path: "reissue/types",
        name: "reissue-types",
        component: () => import("@/views/settings/views/SettingsReissueTypes.vue"),
        meta: {
          requiresAuth: "settings.reorder_types",
          parent: "settings",
        },
      },
      {
        path: "permission/group",
        name: "permission-group",
        component: () => import("@/views/settings/views/permission-group/Index.vue"),
        meta: {
          requiresAuth: "settings.permission_group",
          parent: "settings",
        },
      },
    ],
  },
];
