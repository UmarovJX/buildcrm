export default [
  {
    path: "/bot",
    component: () => import("@/views/bot/Index.vue"),
    children: [
      {
        path: "",
        name: "bot",
        component: () => import("@/views/bot/views/BotPages.vue"),
        meta: {
          requiresAuth: "settings",
        },
      },
      {
        path: "objects",
        name: "bot-objects",
        component: () => import("@/views/bot/views/BotObjects.vue"),
        meta: {
          requiresAuth: "settings",
          parent: "bot",
        },
      },
    ],
  },
];
