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
        },
      },
      {
        path: "holders",
        name: "settings-holders",
        component: () => import("@/views/settings/views/SettingsHolders.vue"),
        meta: {
          requiresAuth: "settings.holders",
        },
      },
      {
        path: "statuses",
        name: "settings-statuses",
        component: () => import("@/views/settings/views/SettingsStatuses.vue"),
        meta: {
          requiresAuth: "settings.statuses",
        },
      },
      {
        path: "languages",
        name: "settings-languages",
        component: () => import("@/views/settings/views/SettingsLanguages.vue"),
        meta: {
          requiresAuth: "settings.languages",
        },
      },
      {
        path: "translations",
        name: "settings-translations",
        component: () =>
          import("@/views/settings/views/SettingsTranslations.vue"),
        meta: {
          requiresAuth: "settings.translations",
        },
      },
    ],
  },
];
