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


import typePlan from './modules/TypePlan/index';




Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
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

        typePlan
    }
})
