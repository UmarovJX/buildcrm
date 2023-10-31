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
          requiresAuth: "bot",
        },
      },
      {
        path: "objects",
        name: "bot-objects",
        component: () => import("@/views/bot/views/BotObjects.vue"),
        meta: {
          requiresAuth: "bot",
          parent: "bot",
        },
      },
    ],
  },
];
