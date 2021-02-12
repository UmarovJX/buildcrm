import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Auth from './components/Auth/Login';
import Dashboard from './components/Dashboard/Home';

import Objects from './components/Dashboard/Objects/Index';
import ObjStore from './components/Dashboard/Objects/Store';
// import ObjFilter from './components/Dashboard/Objects/Filter';
import ApartmentList from './components/Dashboard/Apartment/ApartmentsList';

// import Managers from './components/Dashboard/Managers/Index';
// import Accountants from './components/Dashboard/Accountants/Index';
// import Cashiers from './components/Dashboard/Cashiers/Index';

// import Clients from './components/Dashboard/Clients/Index';

import Users from './components/Dashboard/Users/Index';

import Roles from './components/Dashboard/Roles/Index';
import RolesUpdate from './components/Dashboard/Roles/Update';
import RolesStore from './components/Dashboard/Roles/Store';

// import TypePlan from './components/Dashboard/TypePlan/Index';
// import TypePlanList from './components/Dashboard/TypePlan/List';
// import TypePlanEdit from './components/Dashboard/TypePlan/Edit';
//
//
// import ApartmentView from './components/Dashboard/Apartment/View';

const routes = [
    {
        name: 'login',
        path: '',
        component: Auth
    },

    {
        path: '/home',
        name: 'home',
        component: Dashboard
    },

    {
        name: 'objects',
        path: '/objects',
        component: Objects
    },

    {
        name: 'objectsStore',
        path: '/objects/add',
        component: ObjStore
    },

    // {
    //     name: 'objects-filter',
    //     path: '/objects/filter',
    //     component: ObjFilter
    // },

    {
        name: 'apartments',
        path: '/objects/:id/apartments',
        component: ApartmentList
    },

    // {
    //     name: 'apartments-view',
    //     path: '/apartments/view/:id',
    //     component: ApartmentView
    // },

    {
        name: 'users',
        path: '/users',
        component: Users
    },

    {
        name: 'roles',
        path: '/roles',
        component: Roles
    },

    {
        name: 'roles-update',
        path: '/roles/update/:id',
        component: RolesUpdate
    },

    {
        name: 'roles-store',
        path: '/roles/store',
        component: RolesStore
    },


    // {
    //     name: 'clients',
    //     path: '/clients',
    //     component: Clients
    // },

    // {
    //     name: 'type_plan',
    //     path: '/type/layouts',
    //     component: TypePlan,
    // },
    //
    // {
    //     name: 'type-plan-view',
    //     path: '/type/layouts/view/:id',
    //     component: TypePlanList,
    // },
    //
    // {
    //     name: 'type-plan-edit',
    //     path: '/type/layouts/:object/edit/:id',
    //     component: TypePlanEdit,
    // },
    //
    // {
    //     name: 'settings',
    //     path: '/settings',
    //     component: Clients
    // },


];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
    linkActiveClass: "active"
});



export default router;

