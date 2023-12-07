/* eslint-disable no-unused-vars */
import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push;

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(VueRouter);

import api from "@/services/api";
import Auth from "./components/Auth/Login";
import PageNotFound from "./components/PageNotFound";
import Dashboard from "./components/Dashboard/Home";
import Objects from "./components/Dashboard/Objects/Index";
import ObjStore from "./components/Dashboard/Objects/Store";
import UnfinishedContracts from "./components/Dashboard/Apartment/UnfinishedContracts.vue";
import Clients from "./views/clients/Index";
import ClientView from "./views/clients/View";
import ClientEdit from "./views/clients/EDit";
import Users from "./components/Dashboard/Users/Index";
import Roles from "./views/roles/Index";
import RolesUpdate from "./views/roles/Update";
import RolesStore from "./views/roles/Store";
import TypePlan from "./components/Dashboard/TypePlan/Index";
import TypePlanList from "./components/Dashboard/TypePlan/List";
import TypePlanEdit from "./components/Dashboard/TypePlan/Edit.vue";

import TypeParkingList from "./components/Dashboard/TypeParking/List";
import Facilities from "@/views/facilities/Index";
import FacilitiesShow from "@/views/facilities/Show";

import ConfirmApartment from "./components/Dashboard/Apartment/ConfirmApartment.vue";
import EditApartment from "./components/Dashboard/Apartment/EditApartment";
import Companies from "./components/Dashboard/Companies/Index";
import CompanyDetails from "./components/Dashboard/Companies/CompanyDetails";
import Promo from "./components/Dashboard/Objects/Promo/Index";
import UserSettings from "./views/UserSettings";
import Branches from "@/views/branches/BranchesPage";
import CreateBranchPage from "@/views/branches/CreateBranchPage";
import EditBranchContent from "@/views/branches/EditBranchContent";
import DealDocsTemplate from "@/components/Dashboard/Objects/DealDocsTemplate";
import ImportPayments from "@/components/Contracts/view/ImportPayments";
import Contracts from "@/views/contracts/Index";
import ContractView from "@/views/contracts/View/Index";
import ApartmentView from "@/views/objects/Apartments/View/Index";
import ObjectsView from "@/views/objects/View/Index";
import Debtors from "@/views/debtors/Index";
import CheckoutV2 from "@/views/checkoutV2/Index";
import ReContract from "@/views/reContract/Index";
import AppLayout from "@/views/AppLayout";
import Documentation from "@/views/documentation/documentation";
import Checkout from "@/views/Checkout";
import ApartmentContract from "@/views/objects/Apartments/View/ContractTab";
import ApartmentCommentTab from "@/views/objects/Apartments/View/CommentTab";
import ReleaseNote from "@/views/releaseNote/Index";
import ImportDebtorsList from "@/views/debtors/ImportDebtorsList";
import CheckoutContractReview from "@/views/checkoutV2/views/CheckoutContractReview.vue";

/*  CONTRACT VIEW COMPONENTS */
import TabPaymentSchedule from "@/components/Contracts/view/TabPaymentSchedule";
import TabObjectDetails from "@/components/Contracts/view/TabObjectDetails";
import TabClientDetails from "@/components/Contracts/view/TabClientDetails";
import TabContractDetails from "@/components/Contracts/view/TabContractDetails";
import TabReContractDetails from "@/components/Contracts/view/TabReContractDetails";
import ActivityLog from "@/components/Contracts/view/ActivityLog";
import FastPlanList from "@/views/objects/FastPlan/List";
import AddDrawing from "@/views/objects/FastPlan/AddDrawing.vue";
import Editor from "@/views/Editor.vue";

/*? PARKING ROUTES*/
import ParkingCheckout from "@/views/parking/checkout/Index.vue";

import BadContracts from "@/views/debtors/BadContracts";
import BadContractDetails from "@/views/debtors/BadContractDetails";

const routes = [
  {
    path: "/",
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
        path: "/review/:object/contract/review/:ids",
        name: "checkout-contract-review",
        component: CheckoutContractReview,
      },

      {
        path: "/parking/:object/checkout/:id",
        name: "parking-checkout",
        component: ParkingCheckout,
      },

      {
        path: "/parking/:object/checkout/:id/update",
        name: "parking-checkout-update",
        component: ParkingCheckout,
      },

      {
        path: "/checkout-v2/:object/apartment/:id/order",
        name: "checkout-v2",
        component: CheckoutV2,
      },

      {
        path: "/checkout-v2/:object/apartment/:id/update",
        name: "checkout-v2-update",
        component: CheckoutV2,
      },

      {
        path: "/documentation",
        name: "documentation",
        component: Documentation,
      },
      {
        /* LOGIN */
        path: "/login",
        name: "login",
        component: Auth,
      },

      {
        path: "/checkout/:id",
        name: "checkout",
        component: Checkout,
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
        },
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
        /* PROFILE */
        path: "/profile",
        name: "user-settings",
        component: UserSettings,
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
          },
        ],
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
          },
        ],
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
        /* CLIENTS */
        name: "client-view",
        path: "/clients/:uuid",
        component: ClientView,
        meta: {
          requiresAuth: "clients",
        },
      },
      {
        /* CLIENTS */
        name: "client-edit",
        path: "/clients/:uuid/edit",
        component: ClientEdit,
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
        name: "bad-contracts",
        path: "/debtors/issues",
        component: BadContracts,
        meta: {
          requiresAuth: "contracts",
          parent: "debtors",
        },
      },
      {
        name: "bad-contract-details",
        path: "/debtors/issues/:contract",
        component: BadContractDetails,
        meta: {
          requiresAuth: "contracts",
          parent: "debtors",
        },
      },

      {
        /* CONTRACTS VIEW */
        path: "/contracts/:id",
        component: ContractView,
        meta: {
          requiresAuth: "contracts",
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
          },
        ],
      },

      {
        /* CONTRACT IMPORT PAYMENTS */
        name: "contract-import-payments",
        path: "/contracts/:id/clone/import-payments",
        component: ImportPayments,
        meta: {
          requiresAuth: "contracts",
        },
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
        /* TYPE Parking VIEW */
        name: "type-parking-view",
        path: "/type/parkings/view/:id",
        component: TypeParkingList,
        meta: {
          requiresAuth: "plans",
        },
      },
      {
        /* FACILITIES */
        name: "facilities",
        path: "/facilities/:object",
        component: Facilities,
        meta: {
          requiresAuth: "objects.manage_facilities",
        },
      },
      {
        /* FACILITIES */
        name: "facilities-show",
        path: "/facilities/show/:object",
        component: FacilitiesShow,
        meta: {
          requiresAuth: "apartments",
        },
      },

      {
        /* COMPANIES */
        name: "companies",
        path: "/companies",
        component: Companies,
        meta: {
          requiresAuth: "companies",
        },
      },
      {
        /* COMPANIES */
        name: "company-details",
        path: "/company/:companyId/details",
        component: CompanyDetails,
        meta: {
          requiresAuth: "companies",
        },
      },

      {
        /* BRANCHES */
        name: "branches",
        path: "/branches",
        component: Branches,
        meta: {
          requiresAuth: "branches",
        },
      },

      {
        /* CREATE BRANCH */
        name: "create-branch",
        path: "/branches/create",
        component: CreateBranchPage,
        meta: {
          requiresAuth: "branches",
        },
      },

      {
        /* EDIT BRANCH */
        name: "edit-branch",
        path: "/branches/:id/update",
        component: EditBranchContent,
        meta: {
          requiresAuth: "branches",
        },
      },

      // {
      //   path: "/documentation/icons",
      //   name: "icons",
      //   component: () => import("@/views/documentation/icons"),
      // },
      // {
      //   path: "/documentation/sidebar",
      //   name: "sidebar",
      //   component: () => import("@/views/documentation/Sidebar"),
      // },
      // {
      //   path: "/documentation/topbar",
      //   name: "topbar",
      //   component: () => import("@/views/documentation/Topbar"),
      // },
      // {
      //   path: "/documentation/buttons",
      //   name: "buttons",
      //   component: () => import("@/views/documentation/Buttons"),
      // },
      // {
      //   path: "/documentation/text-fields",
      //   name: "text-fields",
      //   component: () => import("@/views/documentation/TextFields"),
      // },
      // {
      //   path: "/documentation/checkbox",
      //   name: "checkbox",
      //   component: () => import("@/views/documentation/Checkbox"),
      // },
      // {
      //   path: "/documentation/loader",
      //   name: "loader",
      //   component: () => import("@/views/documentation/Loader"),
      // },
      // {
      //   path: "/documentation/notification",
      //   name: "notification",
      //   component: () => import("@/views/documentation/Notification"),
      // },
      // {
      //   path: "/documentation/calendar",
      //   name: "calendar",
      //   component: () => import("@/views/documentation/Calendar"),
      // },
      // {
      //   path: "/documentation/search",
      //   name: "search",
      //   component: () => import("@/views/documentation/Search"),
      // },
      // {
      //   path: "/documentation/tooltip",
      //   name: "tooltip",
      //   component: () => import("@/views/documentation/Tooltip"),
      // },
      // {
      //   path: "/documentation/note",
      //   name: "note",
      //   component: () => import("@/views/documentation/Note"),
      // },
      // {
      //   path: "/documentation/checkmate",
      //   name: "checkmate",
      //   component: () => import("@/views/documentation/Checkmate"),
      // },
      // {
      //   path: "/documentation/tabs",
      //   name: "tabs",
      //   component: () => import("@/views/documentation/Tabs"),
      // },
      // {
      //   path: "/documentation/actions",
      //   name: "actions",
      //   component: () => import("@/views/documentation/Actions"),
      // },

      /*  !REPORTS */
      {
        path: "reports",
        name: "reports",
        component: () => import("@/views/reports/AppReports.vue"),
        meta: {
          requiresAuth: "reports",
        },
      },

      /* ! PLANNING */
      {
        path: "plan",
        name: "plan",
        component: () => import("@/views/plan/Index.vue"),
        meta: {
          requiresAuth: "plan",
        },
      },


      ...settingsRoutes,
      ...botRoutes,

      {
        /* 404 PAGE */
        path: "*",
        name: "not_found",
        component: PageNotFound,
      },
    ],
  },
];

const router = new VueRouter({
  routes: routes,
  mode: "history",
  linkActiveClass: "active",
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});

let user = null;
import Permission from "@/permission";
import ChooseApartments from "@/views/objects/FastPlan/ChooseApartments.vue";
import settingsRoutes from "@/views/settings/settings.routes";
import botRoutes from "@/views/bot/bot.routes";
import { isBoolean } from "@/util/inspect";

router.beforeEach(async (to, from, next) => {
  const login = localStorage.getItem("auth__access__token");
  if (to.name === "login") return next();

  if (login) {
    if (!Permission.user) {
      return await api.authV1
        .getMe()
        .then((response) => {
          user = response.data.user;
          Permission.initializeUser(response.data);
        })
        .finally(() => {
          const { requiresAuth } = to.meta;
          if (requiresAuth) {
            const perm = Permission.getUserPermission(requiresAuth);
            const hasAccess =
              (isBoolean(perm) && perm) ||
              user.role === 1 ||
              (perm && perm?.view);

            if (hasAccess) {
              return next();
            } else {
              return next({
                name: "not_found",
              });
            }
          } else {
            return next();
          }
        });
    } else {
      next();
    }
  } else {
    Permission.clearUserPermission();
    return next({ name: "login" });
  }
});

export default router;
