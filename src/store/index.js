import Vue from 'vue';
import Vuex from 'vuex';

import objects from './modules/objects';
import menus from './modules/Menu';

import managers from './modules/Admin/Managers';
import managers_info from './modules/Admin/Managers/info';

import accountants from './modules/Admin/Accountants';
import accountants_info from './modules/Admin/Accountants/info';

import cashiers from './modules/Admin/Cashiers';
import cashiers_info from './modules/Admin/Cashiers/info';


import auth from './modules/Auth';
import getAuth from './modules/Auth/check';



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
        getAuth,

        menus,
        objects
    }
})
