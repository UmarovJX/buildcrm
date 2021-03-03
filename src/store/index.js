import Vue from 'vue';
import Vuex from 'vuex';

import objects from './modules/objects';
import objects_filter from './modules/objects/filter';
import menus from './modules/Menu';

import managers from './modules/Admin/Managers';
import managers_info from './modules/Admin/Managers/info';

import accountants from './modules/Admin/Accountants';
import accountants_info from './modules/Admin/Accountants/info';

import cashiers from './modules/Admin/Cashiers';
import cashiers_info from './modules/Admin/Cashiers/info';

import me from './modules/Auth/me';
import auth from './modules/Auth';
import getAuth from './modules/Auth/check';

import apartments from './modules/Manager/apartments';
import clients from './modules/Clients/index';

import typePlan from './modules/TypePlan/index';

import ApartmentView from './modules/Apartment/index';

import Loading from './modules/Loading/index';
import Role from './modules/Role/index';
import HomeCount from './modules/Home/index';
import Currencies from './modules/currency';
import Branches from './modules/branches';
import Contracts from './modules/contract';




Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Loading,

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
        Role,

        HomeCount,
        Currencies,
        Branches,
        Contracts

    }
})
