import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Auth from './components/Auth/Login';
import Dashboard from './components/Dashboard/Home';

import Objects from './components/Dashboard/Objects/Index';
import ObjStore from './components/Dashboard/Objects/Store';

import Managers from './components/Dashboard/Managers/Index';

import Accountants from './components/Dashboard/Accountants/Index';

const routes = [
    {
        path: '',
        component: Auth
    },

    {
        path: '/dashboard',
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
        name: 'managers',
        path: '/dashboard/managers',
        component: Managers
    },

    {
        name: 'accountants',
        path: '/dashboard/accountants',
        component: Accountants
    }







];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
});



export default router;

