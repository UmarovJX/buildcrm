/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
// import * as Sentry from "@sentry/vue";
// import {Integrations} from "@sentry/tracing";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

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

// import Contracts from "./components/Dashboard/Contracts/Index";
import ContractsView from "./components/Dashboard/Contracts/View";

import Users from "./components/Dashboard/Users/Index";

import Roles from "./components/Dashboard/Roles/Index";
import RolesUpdate from "./components/Dashboard/Roles/Update";
import RolesStore from "./components/Dashboard/Roles/Store";

import TypePlan from "./components/Dashboard/TypePlan/Index";
import TypePlanList from "./components/Dashboard/TypePlan/List";
import TypePlanEdit from "./components/Dashboard/TypePlan/Edit";

// import ApartmentView from "./components/Dashboard/Apartment/View";
import ConfirmApartment from "./components/Dashboard/Apartment/ConfirmApartment";
import EditApartment from "./components/Dashboard/Apartment/EditApartment";
import Companies from "./components/Dashboard/Companies/Index";
import CompanyDetails from "./components/Dashboard/Companies/CompanyDetails";
// import Debtors from "./components/Dashboard/Debtors/DebtorsList";
import Settings from "./components/Dashboard/Settings/Index";
import Promo from './components/Dashboard/Objects/Promo/Index'
/* PAGES */
import UserSettings from "./views/UserSettings"
import Branches from "@/views/Branches/BranchesPage";
import CreateBranchPage from "@/views/Branches/CreateBranchPage";
import EditBranchContent from "@/views/Branches/EditBranchContent";
import DealDocsTemplate from "@/components/Dashboard/Objects/DealDocsTemplate";
// import CloneView from "@/views/Contracts/View";
import ImportPayments from "@/components/Contracts/view/ImportPayments";
import Contracts from "@/views/Contracts/Index"
import ContractView from "@/views/Contracts/View/Index"
import ApartmentView from '@/views/Objects/Apartments/View/Index'
import ObjectsView from '@/views/Objects/View/Index'
import Debtors from "@/views/Debtors/Index"
// import ObjectTable from "@/components/Objects/ObjectTable";
import Experiment from "@/views/Experiment";

const routes = [
    {
        /* HOME */
        path: "/home",
        name: "home",
        component: Dashboard,
    },

    {
        path: '/experiment',
        name: 'experiment',
        component: Experiment
    },

    {
        /* LOGIN */
        path: "/login",
        name: "login",
        component: Auth,
    },

    /*{
        /!* OBJECTS *!/
        path: "/chess/:objectId",
        name: "chess",
        component: ChessObjects,
        meta: {
            requiresAuth: "objects"
        }
    },*/

    {
        /* OBJECTS */
        name: "objects",
        path: "/objects",
        component: Objects,
        meta: {
            requiresAuth: "objects",
        },
    },

    {
        /* OBJECTS STORE */
        name: "objectsStore",
        path: "/objects/add",
        component: ObjStore,
        meta: {
            requiresAuth: "objects",
        },
    },

    {
        /* OBJECTS EDIT */
        name: "objectsEdit",
        path: "/objects/:id/update",
        component: ObjStore,
        meta: {
            requiresAuth: "objects",
        },
    },

    {
        /* OBJECTS PROMO */
        name: "objects-promo",
        path: "/objects/:id/promo",
        component: Promo,
        meta: {
            requiresAuth: "objects",
        }
    },


    {
        /* OBJECT DEAL TEMPLATE */
        name: "object-deal-template",
        path: "/branches/:id/contracts",
        component: DealDocsTemplate,
        meta: {
            requiresAuth: "objects",
        },
    },


    {
        /* SETTINGS */
        name: "settings",
        path: "/settings",
        component: Settings,
    },

    {
        /* PROFILE */
        path: '/profile',
        name: 'user-settings',
        component: UserSettings
    },

    {
        /* DEBTORS */
        name: "debtors",
        path: "/debtors",
        component: Debtors,
        meta: {
            requiresAuth: "debtors",
        },
    },

    {
        /* APARTMENTS */
        name: "apartments",
        path: "/objects/:object/apartments",
        component: ObjectsView,
        meta: {
            requiresAuth: "apartments",
        },
    },

    {
        /* UNFINISHED CONTRACTS */
        name: "unfinished-contracts",
        path: "/objects/unfinished-contracts",
        component: UnfinishedContracts,
        meta: {
            requiresAuth: "apartments",
        },
    },

    {
        /* APARTMENT VIEW */
        name: "apartment-view",
        path: "/objects/:object/apartment/:id",
        component: ApartmentView,
        meta: {
            requiresAuth: "apartments",
        },
    },

    // {
    //     /* CLONE APARTMENT VIEW */
    //     name: "apartment-view-clone",
    //     path: "/objects/:object/apartment/:id/clone",
    //     component: ApartmentCloneView,
    //     meta: {
    //         requiresAuth: "apartments",
    //     },
    // },

    {
        /* CONFIRM APARTMENT*/
        name: "confirm-apartment",
        path: "/objects/:object/apartment/:id/order",
        component: ConfirmApartment,
        meta: {
            requiresAuth: "apartments",
        },
    },
    {
        /* CONFIRM APARTMENT*/
        name: "edit-apartment",
        path: "/objects/apartment/:id/update",
        component: EditApartment,
        meta: {
            requiresAuth: "apartments",
        },
    },
    {
        /* USERS */
        name: "users",
        path: "/users",
        component: Users,
        meta: {
            requiresAuth: "users",
        },
    },

    {
        /* ROLES */
        name: "roles",
        path: "/roles",
        component: Roles,
        meta: {
            requiresAuth: "roles",
        },
    },

    {
        /* ROLES UPDATE */
        name: "roles-update",
        path: "/roles/update/:id",
        component: RolesUpdate,
        meta: {
            requiresAuth: "roles",
        },
    },

    {
        /* ROLES STORE */
        name: "roles-store",
        path: "/roles/store",
        component: RolesStore,
        meta: {
            requiresAuth: "roles",
        },
    },

    {
        /* CLIENTS */
        name: "clients",
        path: "/clients",
        component: Clients,
        meta: {
            requiresAuth: "clients",
        },
    },

    {
        /* CONTRACTS */
        name: "contracts",
        path: "/contracts",
        component: Contracts,
        meta: {
            requiresAuth: "contracts",
        },
    },

    {
        /* CONTRACTS VIEW */
        name: "contracts-view",
        path: "/contracts/:id",
        component: ContractView,
        meta: {
            requiresAuth: "contracts"
        }
    },

    {
        /* CONTRACT IMPORT PAYMENTS */
        name: "contract-import-payments",
        path: "/contracts/:id/clone/import-payments",
        component: ImportPayments,
        meta: {
            requiresAuth: "contracts",
        }
    },


    {
        /* TYPE PLAN */
        name: "type_plan",
        path: "/type/layouts",
        component: TypePlan,
        meta: {
            requiresAuth: "type_plan",
        },
    },

    {
        /* TYPE PLAN VIEW */
        name: "type-plan-view",
        path: "/type/layouts/view/:id",
        component: TypePlanList,
        meta: {
            requiresAuth: "type_plan",
        },
    },

    {
        /* TYPE PLAN EDIT*/
        name: "type-plan-edit",
        path: "/type/layouts/:object/edit/:id",
        component: TypePlanEdit,
        meta: {
            requiresAuth: "type_plan",
        },
    },

    {
        /* COMPANIES */
        name: "companies",
        path: "/companies",
        component: Companies,
        meta: {
            requiresAuth: "companies",
        }
    },
    {
        /* COMPANIES */
        name: "company-details",
        path: "/company/:companyId/details",
        component: CompanyDetails,
        meta: {
            requiresAuth: "companies",
        }
    },

    {
        /* BRANCHES */
        name: 'branches',
        path: '/branches',
        component: Branches
    },

    {
        /* CREATE BRANCH */
        name: 'create-branch',
        path: '/branches/create',
        component: CreateBranchPage
    },

    {
        /* EDIT BRANCH */
        name: 'edit-branch',
        path: '/branches/:id/update',
        component: EditBranchContent
    },

    {
        /* 404 PAGE */
        path: "*",
        name: "not_found",
        component: PageNotFound,
    }
]


const router = new VueRouter({
    routes: routes,
    mode: "history",
    linkActiveClass: "active",
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0};
    },
});

router.beforeEach((to, from, next) => {
    const AUTH_TOKEN = localStorage.getItem('auth__access__token')
    if (to.name === 'login') return next()

    if (AUTH_TOKEN)
        if (to.path === '/')
            return next({name: 'home'})
        else
            return next()
    else
        return next({name: 'login'})
})

// router.beforeEach((to, from, next) => {
//   const login = localStorage.token;

//   if (to.matched.some((record) => record.meta.requiresAuth)) {
//     to.matched.some((record) => {
//       if (!login) {
//         next({
//           name: "login",
//         });
//       }
//       let permission = store.state.me;
//       setTimeout(() => {
//         permission = permission.permission[`${record.meta.requiresAuth}`].view;
//         if (permission) {
//           next();
//         } else {
//           next({
//             name: "not_found",
//           });
//         }
//       }, 500);
//     });
//   } else {
//     next(); // make sure to always call next()!
//   }
// });

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
