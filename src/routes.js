/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
// import * as Sentry from "@sentry/vue";
// import {Integrations} from "@sentry/tracing";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

import Auth from "./components/Auth/Login";
import PageNotFound from "./components/PageNotFound";
import Dashboard from "./components/Dashboard/Home";

import Objects from "./components/Dashboard/Objects/Index";
import ObjStore from "./components/Dashboard/Objects/Store";
// import ObjFilter from './components/Dashboard/Objects/Filter';
import ApartmentsList from "./components/Dashboard/Apartment/ApartmentsList";
import UnfinishedContracts from "./components/Dashboard/Apartment/UnfinishedContracts.vue";

// import Managers from './components/Dashboard/Managers/Index';
// import Accountants from './components/Dashboard/Accountants/Index';
// import Cashiers from './components/Dashboard/Cashiers/Index';

import Clients from "./components/Dashboard/Clients/Index";

import Contracts from "./components/Dashboard/Contracts/Index";
import ContractsView from "./components/Dashboard/Contracts/View";

import Users from "./components/Dashboard/Users/Index";

import Roles from "./components/Dashboard/Roles/Index";
import RolesUpdate from "./components/Dashboard/Roles/Update";
import RolesStore from "./components/Dashboard/Roles/Store";

import TypePlan from "./components/Dashboard/TypePlan/Index";
import TypePlanList from "./components/Dashboard/TypePlan/List";
import TypePlanEdit from "./components/Dashboard/TypePlan/Edit";
//
//
import ApartmentView from "./components/Dashboard/Apartment/View";
import ConfirmApartment from "./components/Dashboard/Apartment/ConfirmApartment";
import Companies from "./components/Dashboard/Companies/Index";
import Debtors from "./components/Dashboard/Debtors/DebtorsList";
import Settings from "./components/Dashboard/Settings/Index";
const routes = [
  {
    name: "login",
    path: "",
    component: Auth,
    // meta: {
    //   guest: true,
    // },
  },

  {
    path: "/home",
    name: "home",
    component: Dashboard,
  },

  {
    name: "objects",
    path: "/objects",
    component: Objects,
    meta: {
      requiresAuth: "objects",
    },
  },

  {
    name: "objectsStore",
    path: "/objects/add",
    component: ObjStore,
    meta: {
      requiresAuth: "objects",
    },
  },

  {
    name: "objectsEdit",
    path: "/objects/:id/update",
    component: ObjStore,
    meta: {
      requiresAuth: "objects",
    },
  },

  {
    name: "settings",
    path: "/settings",
    component: Settings,
  },

  {
    name: "debtors",
    path: "/debtors",
    component: Debtors,
    meta: {
      requiresAuth: "debtors",
    },
  },
  {
    name: "apartments",
    path: "/objects/:object/apartments",
    component: ApartmentsList,
    meta: {
      requiresAuth: "apartments",
    },
  },
  {
    name: "unfinished-contracts",
    path: "/objects/unfinished-contracts",
    component: UnfinishedContracts,
    meta: {
      requiresAuth: "apartments",
    },
  },
  {
    name: "apartment-view",
    path: "/objects/:object/apartment/:id",
    component: ApartmentView,
    meta: {
      requiresAuth: "apartments",
    },
  },
  {
    name: "confirm-apartment",
    path: "/objects/:object/apartment/:id/order",
    component: ConfirmApartment,
    meta: {
      requiresAuth: "apartments",
    },
  },
  {
    name: "users",
    path: "/users",
    component: Users,
    meta: {
      requiresAuth: "users",
    },
  },

  {
    name: "roles",
    path: "/roles",
    component: Roles,
    meta: {
      requiresAuth: "roles",
    },
  },

  {
    name: "roles-update",
    path: "/roles/update/:id",
    component: RolesUpdate,
    meta: {
      requiresAuth: "roles",
    },
  },

  {
    name: "roles-store",
    path: "/roles/store",
    component: RolesStore,
    meta: {
      requiresAuth: "roles",
    },
  },

  {
    name: "clients",
    path: "/clients",
    component: Clients,
    meta: {
      requiresAuth: "clients",
    },
  },

  {
    name: "contracts",
    path: "/contracts",
    component: Contracts,
    meta: {
      requiresAuth: "contracts",
    },
  },

  {
    name: "contracts-view",
    path: "/contracts/:id",
    component: ContractsView,
    meta: {
      requiresAuth: "contracts",
    },
  },

  {
    name: "type_plan",
    path: "/type/layouts",
    component: TypePlan,
    meta: {
      requiresAuth: "type_plan",
    },
  },

  {
    name: "type-plan-view",
    path: "/type/layouts/view/:id",
    component: TypePlanList,
    meta: {
      requiresAuth: "type_plan",
    },
  },

  {
    name: "type-plan-edit",
    path: "/type/layouts/:object/edit/:id",
    component: TypePlanEdit,
    meta: {
      requiresAuth: "type_plan",
    },
  },

  {
    name: "companies",
    path: "/companies",
    component: Companies,
    meta: {
      requiresAuth: "companies",
    },
  },

  //
  // {
  //     name: 'settings',
  //     path: '/settings',
  //     component: Clients
  // },

  {
    path: "*",
    name: "not_found",
    component: PageNotFound,
  },
];

const router = new VueRouter({
  routes: routes,
  mode: "history",
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0};
  },
});

router.beforeEach((to, from, next) => {
  const login = localStorage.token;
  // if (!login) {
  //   next('/login');
  // }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    to.matched.some((record) => {
      if (!login) {
        next({
          name: "login",
        });
      }
      console.log(record.meta.requiresAuth);
      let permission = store.state.me;
      setTimeout(() => {
        permission = permission.permission[`${record.meta.requiresAuth}`].view;
        if (permission) {
          next();
        } else {
          next({
            name: "not_found",
          });
        }
      }, 500);
    });
  } else {
    next(); // make sure to always call next()!
  }
});

// Sentry.init({
//   Vue,
//   dsn: "https://b3a6289d3b5846c4b42327c0e3f7ecdb@o1056926.ingest.sentry.io/6043378",
//   integrations: [
//     new Integrations.BrowserTracing({
//       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
//       tracingOrigins: ["localhost", "http://crm.xonsaroy.uz/", /^\//],
//     }),
//   ],
//   tracesSampleRate: 1.0,
// });

export default router;
