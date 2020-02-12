import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios';
import Toasted from 'vue-toasted';
import router from './routes';
import i18n from './lang';
import toasted from './util/toasted';
import getAuth from './util/getAuth';
import store from './store';

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

Vue.mixin(toasted);
Vue.mixin(getAuth);

Vue.use(VueAxios, axios);

Vue.use(Toasted, {
  theme: "toasted-primary",
  position: "top-right",
  duration : 5000
});

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  i18n,
  store,
  router,
  render: h => h(App),

  created() {
    let path = this.$router.currentRoute;

    if (localStorage.token) {
      let vm = this;

      //this.toasted('test', 'error');
      this.axios.get(process.env.VUE_APP_URL + '/api/auth/me', {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      }).then(() => {
          if (path.path == '/') {
            vm.$router.push('dashboard');
          }
      }).catch((error) => {
          if (! error.response) {
            vm.toasted('Error: Network Error', 'error');
          } else {
              vm.toasted(error.response.data.message, 'error');
              localStorage.clear();
              this.$router.push('/');
          }
      });
    } else {
       if (path.path != '/') {
         this.$router.push('/');
       }
    }
  }
});
