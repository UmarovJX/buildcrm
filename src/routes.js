import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Auth from './components/Auth/Login';
import Dashboard from './components/Dashboard/Home';

import Objects from './components/Dashboard/Objects/Index';
import ObjStore from './components/Dashboard/Objects/Store';
import ObjFilter from './components/Dashboard/Objects/Filter';
import ObjApartment from './components/Dashboard/Objects/Manager/Apartments';

// import Managers from './components/Dashboard/Managers/Index';
// import Accountants from './components/Dashboard/Accountants/Index';
// import Cashiers from './components/Dashboard/Cashiers/Index';

import Clients from './components/Dashboard/Clients/Index';

import Users from './components/Dashboard/Users/Index';

import Roles from './components/Dashboard/Roles/Index';
import RolesUpdate from './components/Dashboard/Roles/Update';
import RolesStore from './components/Dashboard/Roles/Store';

import TypePlan from './components/Dashboard/TypePlan/Index';
import TypePlanList from './components/Dashboard/TypePlan/List';
import TypePlanEdit from './components/Dashboard/TypePlan/Edit';


import ApartmentView from './components/Dashboard/Apartment/View';

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
        name: 'apartments-view',
        path: '/dashboard/apartments/view/:id',
        component: ApartmentView
    },

    {
        name: 'users',
        path: '/dashboard/users',
        component: Users
    },

    {
        name: 'roles',
        path: '/dashboard/roles',
        component: Roles
    },

    {
        name: 'roles-update',
        path: '/dashboard/roles/update/:id',
        component: RolesUpdate
    },

    {
        name: 'roles-store',
        path: '/dashboard/roles/store',
        component: RolesStore
    },


    {
        name: 'clients',
        path: '/dashboard/clients',
        component: Clients
    },

    {
        name: 'type_plan',
        path: '/dashboard/type/layouts',
        component: TypePlan,
    },

    {
        name: 'type-plan-view',
        path: '/dashboard/type/layouts/view/:id',
        component: TypePlanList,
    },

    {
        name: 'type-plan-edit',
        path: '/dashboard/type/layouts/:object/edit/:id',
        component: TypePlanEdit,
    }



];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
    linkActiveClass: "active"
});



export default router;

