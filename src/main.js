import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

import router from './routes';
import i18n from './lang';


Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  render: h => h(App),
}).$mount('#app');
