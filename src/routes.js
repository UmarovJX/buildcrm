/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
// import * as Sentry from "@sentry/vue";
// import {Integrations} from "@sentry/tracing";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

import Auth from "./components/Auth/Login";
import Dashboard from "./components/Dashboard/Home";

import Objects from "./components/Dashboard/Objects/Index";
import ObjStore from "./components/Dashboard/Objects/Store";
// import ObjFilter from './components/Dashboard/Objects/Filter';
import ApartmentsList from "./components/Dashboard/Apartment/ApartmentsList";

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
  },

  {
    name: "objectsStore",
    path: "/objects/add",
    component: ObjStore,
  },

  {
    name: "objectsEdit",
    path: "/objects/:id/update",
    component: ObjStore,
  },

  // {
  //     name: 'objects-filter',
  //     path: '/objects/filter',
  //     component: ObjFilter
  // },

  {
    name: "settings",
    path: "/settings",
    component: Settings,
  },

  {
    name: "debtors",
    path: "/debtors",
    component: Debtors,
  },
  {
    name: "apartments",
    path: "/objects/:object/apartments",
    component: ApartmentsList,
  },
  {
    name: "apartment-view",
    path: "/objects/:object/apartment/:id",
    component: ApartmentView,
  },
  {
    name: "confirm-apartment",
    path: "/objects/:object/apartment/:id/order",
    component: ConfirmApartment,
  },
  {
    name: "users",
    path: "/users",
    component: Users,
  },

  {
    name: "roles",
    path: "/roles",
    component: Roles,
  },

  {
    name: "roles-update",
    path: "/roles/update/:id",
    component: RolesUpdate,
  },

  {
    name: "roles-store",
    path: "/roles/store",
    component: RolesStore,
  },

  {
    name: "clients",
    path: "/clients",
    component: Clients,
  },

  {
    name: "contracts",
    path: "/contracts",
    component: Contracts,
  },

  {
    name: "contracts-view",
    path: "/contracts/:id",
    component: ContractsView,
  },

  {
    name: "type_plan",
    path: "/type/layouts",
    component: TypePlan,
  },

  {
    name: "type-plan-view",
    path: "/type/layouts/view/:id",
    component: TypePlanList,
  },

  {
    name: "type-plan-edit",
    path: "/type/layouts/:object/edit/:id",
    component: TypePlanEdit,
  },

  {
    name: "companies",
    path: "/companies",
    component: Companies,
  },

  //
  // {
  //     name: 'settings',
  //     path: '/settings',
  //     component: Clients
  // },
];

const router = new VueRouter({
  routes: routes,
  mode: "history",
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0};
  },
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
