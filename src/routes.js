/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err)
}


Vue.use(VueRouter)

import api from "@/services/api";
import Auth from "./components/Auth/Login";
import PageNotFound from "./components/PageNotFound";
import Dashboard from "./components/Dashboard/Home";
import Objects from "./components/Dashboard/Objects/Index";
import ObjStore from "./components/Dashboard/Objects/Store";
import UnfinishedContracts from "./components/Dashboard/Apartment/UnfinishedContracts.vue";
import Clients from "./components/Dashboard/Clients/Index";
import Users from "./components/Dashboard/Users/Index";
import Roles from "./components/Dashboard/Roles/Index";
import RolesUpdate from "./components/Dashboard/Roles/Update";
import RolesStore from "./components/Dashboard/Roles/Store";
import TypePlan from "./components/Dashboard/TypePlan/Index";
import TypePlanList from "./components/Dashboard/TypePlan/List";
import TypePlanEdit from "./components/Dashboard/TypePlan/Edit.vue";
import ConfirmApartment from "./components/Dashboard/Apartment/ConfirmApartment.vue";
import EditApartment from "./components/Dashboard/Apartment/EditApartment";
import Companies from "./components/Dashboard/Companies/Index";
import CompanyDetails from "./components/Dashboard/Companies/CompanyDetails";
import Settings from "./components/Dashboard/Settings/Index";
import Promo from './components/Dashboard/Objects/Promo/Index'
import UserSettings from "./views/UserSettings"
import Branches from "@/views/Branches/BranchesPage";
import CreateBranchPage from "@/views/Branches/CreateBranchPage";
import EditBranchContent from "@/views/Branches/EditBranchContent";
import DealDocsTemplate from "@/components/Dashboard/Objects/DealDocsTemplate";
import ImportPayments from "@/components/Contracts/view/ImportPayments";
import Contracts from "@/views/Contracts/Index"
import ContractView from "@/views/Contracts/View/Index"
import ApartmentView from '@/views/Objects/Apartments/View/Index'
import ObjectsView from '@/views/Objects/View/Index'
import Debtors from "@/views/Debtors/Index"
import Experiment from "@/views/Experiment";
import ReContract from "@/views/ReContract/Index"

const routes = [
    {
        path: '/experiment',
        name: 'experiment',
        component: () => import('@/views/experience')
    },

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

    /*
    {
        /!* OBJECTS *!/
        path: "/chess/:objectId",
        name: "chess",
        component: ChessObjects,
        meta: {
            requiresAuth: "objects"
        }
    },
    */

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
            requiresAuth: "promos",
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
        /* UNFINISHED CONTRACTS */
        name: "re-contract",
        path: "/re-contract/:id",
        component: ReContract,
        meta: {
            requiresAuth: "contracts",
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
            requiresAuth: "plans",
        },
    },

    {
        /* TYPE PLAN VIEW */
        name: "type-plan-view",
        path: "/type/layouts/view/:id",
        component: TypePlanList,
        meta: {
            requiresAuth: "plans",
        },
    },

    {
        /* TYPE PLAN EDIT*/
        name: "type-plan-edit",
        path: "/type/layouts/:object/edit/:id",
        component: TypePlanEdit,
        meta: {
            requiresAuth: "plans",
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
        component: Branches,
        meta: {
            requiresAuth: "branches",
        }
    },

    {
        /* CREATE BRANCH */
        name: 'create-branch',
        path: '/branches/create',
        component: CreateBranchPage,
        meta: {
            requiresAuth: "branches",
        }

    },

    {
        /* EDIT BRANCH */
        name: 'edit-branch',
        path: '/branches/:id/update',
        component: EditBranchContent,
        meta: {
            requiresAuth: "branches",
        }
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
})

let permission = store.state.permission
import Permission from "@/permission";

router.beforeEach(async (to, from, next) => {
    const login = localStorage.getItem('auth__access__token')
    if (to.name === 'login') return next()

    if (!Permission.user || !store.state.permission) {
        await api.authV1.getMe()
            .then((response) => {
                permission = response.data.role.permissions
                Permission.initializeUser(response.data)
            })
            .catch((error) => {
                return error
            });
    }

    if (login)
        if (to.path === '/')
            return next({name: 'home'})
        else if (to.matched.some((record) => record.meta['requiresAuth'])) {
            to.matched.some((record) => {
                const perm = permission[`${record.meta['requiresAuth']}`];
                if (perm && perm.view) {
                    next();
                } else {
                    next({
                        name: "not_found",
                    });
                }
            });
        } else {
            next();
        }
    else
        return next({name: 'login'})
})

export default router
