import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios';
import Toasted from 'vue-toasted';
import Vue2Filters from 'vue2-filters';

import router from './routes';
import i18n from './lang';
import toasted from './util/toasted';
import getAuth from './util/getAuth';
import store from './store';
import moment from 'moment';


import { mapActions, mapGetters} from 'vuex';

import './components';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

const sweetOptions = {
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
};

Vue.use(VueSweetalert2, sweetOptions);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vue2Filters);

Vue.mixin(toasted);
Vue.mixin(getAuth);

Vue.use(VueAxios, axios);

Vue.use(Toasted, {
  theme: "toasted-primary",
  position: "top-right",
  duration : 5000
});

Vue.config.productionTip = false;
Vue.prototype.$moment = moment;

new Vue({
    el: "#app",
    i18n,
    store,
    router,
    render: h => h(App),

    computed: mapGetters(['getMe']),

    created() {
        this.setMe(this, path);

        if (!localStorage.locale) {
            localStorage.locale = 'ru';
            this.$i18n.locale = 'ru';
        }

        let path = this.$router.currentRoute;

        if (localStorage.token) {
          let vm = this;
            this.setMe(vm, path);
        } else {
           if (path.path != '/') {
             this.$router.push('/');
           }
        }
    },

    methods: mapActions(['setMe'])

});
