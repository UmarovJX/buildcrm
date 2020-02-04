import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

//import Home from './components/HelloWorld'
//import Admin from './components/Admin/Hello'
import Auth from './components/Auth/Login';

const routes = [
    {
        path: '',
        component: Auth
    }
];

const router = new VueRouter({
    routes: routes,
    mode: 'history',
});



export default router;

