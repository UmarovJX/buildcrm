import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Auth from './components/Auth/Login';
import Dashboard from './components/Dashboard/Home';

import Objects from './components/Dashboard/Objects/Index';
import ObjStore from './components/Dashboard/Objects/Store';
import ObjFilter from './components/Dashboard/Objects/Filter';
import ObjApartment from './components/Dashboard/Objects/Manager/Apartments';

import Managers from './components/Dashboard/Managers/Index';
import Accountants from './components/Dashboard/Accountants/Index';
import Cashiers from './components/Dashboard/Cashiers/Index';

const routes = [
    {
        name: 'login',
        path: '',
        component: Auth
    },

    {
        path: '/dashboard',
        name: 'home',
        component: Dashboard
    },

    {
        name: 'objects',
        path: '/dashboard/objects',
        component: Objects
    },

    {
        name: 'objectsStore',
        path: '/dashboard/objects/add',
        component: ObjStore
    },

    {
        name: 'objects-filter',
        path: '/dashboard/objects/filter',
        component: ObjFilter
    },

    {
        name: 'apartments',
        path: '/dashboard/objects/:id/apartments',
        component: ObjApartment
    },


    {
        name: 'managers',
        path: '/dashboard/managers',
        component: Managers
    },

    {
        name: 'accountants',
        path: '/dashboard/accountants',
        component: Accountants
    },

    {
        name: 'cashier',
        path: '/dashboard/cashiers',
        component: Cashiers
    }

];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
});



export default router;

