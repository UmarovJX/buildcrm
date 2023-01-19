/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";

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
// import Settings from "./components/Dashboard/Settings/Index";
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
import CheckoutV2 from "@/views/CheckoutV2/Index";
import ReContract from "@/views/ReContract/Index"
import AppLayout from "@/views/AppLayout";
import Documentation from "@/views/Documentation/documentation";
import Checkout from "@/views/Checkout";
import ApartmentContract from '@/views/Objects/Apartments/View/ContractTab'
import ApartmentCommentTab from "@/views/Objects/Apartments/View/CommentTab";
import ReleaseNote from "@/views/ReleaseNote/Index";
import ImportDebtorsList from "@/views/Debtors/ImportDebtorsList";
import CheckoutContractReview from "@/views/CheckoutV2/views/CheckoutContractReview.vue";

/*  CONTRACT VIEW COMPONENTS */
import TabPaymentSchedule from "@/components/Contracts/view/TabPaymentSchedule";
import TabObjectDetails from "@/components/Contracts/view/TabObjectDetails";
import TabClientDetails from "@/components/Contracts/view/TabClientDetails";
import TabContractDetails from "@/components/Contracts/view/TabContractDetails";
import TabReContractDetails from "@/components/Contracts/view/TabReContractDetails";
import ActivityLog from "@/components/Contracts/view/ActivityLog";
import Settings from "@/views/Settings/Index";
import FastPlanList from "@/views/Objects/FastPlan/List";
import AddDrawing from "@/views/Objects/FastPlan/AddDrawing.vue";

import Editor from "@/views/Editor.vue";

const routes = [
    {
        path: '/',
        name: 'app-layout',
        component: AppLayout,
        children: [
            {
                /* HOME */
                path: "",
                name: "home",
                component: Dashboard,
            },

            {
                /* HOME */
                path: "/editor",
                name: "editor",
                component: Editor,
            },


            {
                path: '/checkout_v2/:object/apartment/:id/order',
                name: 'checkout_v2',
                component: CheckoutV2
            },

            {
                path: '/review/:object/contract/review/:ids',
                name: 'checkout-contract-review',
                component: CheckoutContractReview
            },

            {
                path: '/checkout_v2/:object/apartment/:id/update',
                name: 'checkout_v2_update',
                component: CheckoutV2
            },

            {
                path: '/documentation',
                name: 'documentation',
                component: Documentation
            },
            {
                /* LOGIN */
                path: "/login",
                name: "login",
                component: Auth,
            },

            {
                path: '/checkout/:id',
                name: 'checkout',
                component: Checkout
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
                /* OBJECTS */
                name: "release-note",
                path: "/release-note",
                component: ReleaseNote,
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
                /* DEBTORS */
                name: "debtors-import",
                path: "/debtors-import",
                component: ImportDebtorsList,
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
                children: [
                    {
                        name: "checkout",
                        path: "/objects/:object/apartments/checkout",
                        component: ObjectsView,
                        meta: {
                            requiresAuth: "apartments",
                        },
                    },
                    {
                        name: "comments",
                        path: "/objects/:object/apartments/comments",
                        component: ObjectsView,
                        meta: {
                            requiresAuth: "apartments",
                        },
                    }
                ]
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
                // name: "apartment-view",
                path: "/objects/:object/apartment/:id",
                component: ApartmentView,
                meta: {
                    requiresAuth: "apartments",
                },
                children: [
                    {
                        name: "apartment-view",
                        path: "",
                        component: ApartmentContract,
                        meta: {
                            requiresAuth: "apartments",
                        },
                    },
                    {
                        name: "apartment-view-comment",
                        path: "comment",
                        component: ApartmentCommentTab,
                        meta: {
                            requiresAuth: "apartments.comments",
                        },
                    }
                ]
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
                path: "/contracts/:id",
                component: ContractView,
                meta: {
                    requiresAuth: "contracts"
                },
                children: [
                    {
                        name: "contracts-view",
                        path: "/",
                        component: TabPaymentSchedule,
                        meta: {
                            requiresAuth: "contracts",
                        },
                    },
                    {
                        name: "contract-object-details",
                        path: "object-details",
                        component: TabObjectDetails,
                        meta: {
                            requiresAuth: "contracts",
                        },
                    },
                    {
                        name: "contract-client-details",
                        path: "client-details",
                        component: TabClientDetails,
                        meta: {
                            requiresAuth: "contracts",
                        },
                    },
                    {
                        name: "contract-details",
                        path: "contract-details",
                        component: TabContractDetails,
                        meta: {
                            requiresAuth: "contracts",
                        },
                    },
                    {
                        name: "reissue-details",
                        path: "reissue-details",
                        component: TabReContractDetails,
                        meta: {
                            requiresAuth: "contracts",
                        },
                    },
                    {
                        name: "contract-logs",
                        path: "contract-logs",
                        component: ActivityLog,
                        meta: {
                            requiresAuth: "contracts",
                        },
                    }
                ]
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
                /* FAST PLAN */
                name: "fast_plan",
                path: "object/:object/fast/layouts",
                component: FastPlanList,
                meta: {
                    requiresAuth: "plans",
                },
            },

            {
                /* FAST PLAN */
                name: "fast_plan_add",
                path: "object/:object/fast/layouts/add",
                component: AddDrawing,
                meta: {
                    requiresAuth: "plans",
                },
            },

            {
                /* FAST PLAN */
                name: "fast_plan_apartments",
                path: "object/:object/fast/layouts/add/:plan/apartments",
                component: ChooseApartments,
                meta: {
                    requiresAuth: "plans",
                },
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
                path: '/documentation/icons',
                name: 'icons',
                component: () => import('@/views/Documentation/icons')

            },
            {
                path: '/documentation/sidebar',
                name: 'sidebar',
                component: () => import('@/views/Documentation/Sidebar')
            },
            {
                path: '/documentation/topbar',
                name: 'topbar',
                component: () => import('@/views/Documentation/Topbar')
            },
            {
                path: '/documentation/buttons',
                name: 'buttons',
                component: () => import('@/views/Documentation/Buttons')
            },
            {
                path: '/documentation/text-fields',
                name: 'text-fields',
                component: () => import('@/views/Documentation/TextFields')
            },
            {
                path: '/documentation/checkbox',
                name: 'checkbox',
                component: () => import('@/views/Documentation/Checkbox')
            },
            {
                path: '/documentation/loader',
                name: 'loader',
                component: () => import('@/views/Documentation/Loader')
            },
            {
                path: '/documentation/notification',
                name: 'notification',
                component: () => import('@/views/Documentation/Notification')
            },
            {
                path: '/documentation/calendar',
                name: 'calendar',
                component: () => import('@/views/Documentation/Calendar')
            },
            {
                path: '/documentation/search',
                name: 'search',
                component: () => import('@/views/Documentation/Search')
            },
            {
                path: '/documentation/tooltip',
                name: 'tooltip',
                component: () => import('@/views/Documentation/Tooltip')
            },
            {
                path: '/documentation/note',
                name: 'note',
                component: () => import('@/views/Documentation/Note')
            },
            {
                path: '/documentation/checkmate',
                name: 'checkmate',
                component: () => import('@/views/Documentation/Checkmate')
            },
            {
                path: '/documentation/tabs',
                name: 'tabs',
                component: () => import('@/views/Documentation/Tabs')
            },
            {
                path: '/documentation/actions',
                name: 'actions',
                component: () => import('@/views/Documentation/Actions')
            },

            {
                /* 404 PAGE */
                path: "*",
                name: "not_found",
                component: PageNotFound,
            }
        ]
    }
]


const router = new VueRouter({
    routes: routes,
    mode: "history",
    linkActiveClass: "active",
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    },
})

let user = null
import Permission from "@/permission";
import ChooseApartments from "@/views/Objects/FastPlan/ChooseApartments.vue";

router.beforeEach(async (to, from, next) => {
    const login = localStorage.getItem('auth__access__token')
    if (to.name === 'login') return next()

    if (login) {
        if (!Permission.user) {
            return await api.authV1.getMe()
                 .then((response) => {
                     user = response.data.user
                     Permission.initializeUser(response.data)
                 })
                 .finally(() => {
                     const {requiresAuth} = to.meta
                     if (requiresAuth) {
                         const perm = Permission.getUserPermission(requiresAuth)
                         if (user.role === 1 || (perm && perm.view)) {
                             return next()
                         } else {
                             return next({
                                 name: "not_found",
                             })
                         }
                     } else {
                         return next()
                     }
                 })
        } else {
            next()
        }
    } else {
        Permission.clearUserPermission()
        return next({name: 'login'})
    }

})

export default router
