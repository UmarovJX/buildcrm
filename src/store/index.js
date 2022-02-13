import Vue from "vue";
import Vuex from "vuex";
import objects from "./modules/objects";
import objects_filter from "./modules/objects/filter";
import menus from "./modules/Menu";

import managers from "./modules/Admin/Managers";
import managers_info from "./modules/Admin/Managers/info";

import accountants from "./modules/Admin/Accountants";
import accountants_info from "./modules/Admin/Accountants/info";

import cashiers from "./modules/Admin/Cashiers";
import cashiers_info from "./modules/Admin/Cashiers/info";

import me from "./modules/Auth/me";
import auth from "./modules/Auth";
import getAuth from "./modules/Auth/check";

import apartments from "./modules/Manager/apartments";
import clients from "./modules/Clients/index";

import typePlan from "./modules/TypePlan/index";

import ApartmentView from "./modules/Apartment/index";
import ApartmentOrder from "./modules/Apartment/apartment-order";

import Loading from "./modules/Loading/index";
import Role from "./modules/Role/index";
import HomeCount from "./modules/Home/index";
import Currencies from "./modules/currency";
import Companies from "./modules/companies";
import Contracts from "./modules/contract";
import Debtors from "./modules/debtors";
import Settings from "./modules/settings";
import Promo from "@/store/modules/Promo";
import Features from "@/store/modules/Features";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Loading,
    Features,
    managers,
    managers_info,

    accountants,
    accountants_info,

    cashiers,
    cashiers_info,

    auth,
    me,
    getAuth,

    menus,
    objects,
    objects_filter,
    apartments,

    typePlan,
    clients,

    ApartmentView,
    ApartmentOrder,
    Role,

    HomeCount,
    Currencies,
    Companies,
    Contracts,
    Debtors,
    Settings,
    Promo
  },
});
