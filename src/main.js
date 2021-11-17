import Vue from "vue";
import App from "./App.vue";

import axios from "axios";
import VueAxios from "vue-axios";
import Toasted from "vue-toasted";
import Vue2Filters from "vue2-filters";
import VueLazyload from "vue-lazyload";

import router from "./routes";
import i18n from "./lang";
import toasted from "./util/toasted";
// import getAuth from './util/getAuth';
import store from "./store";
// import moment from 'moment';
import vueMoment from "vue-moment";
// import VueHtmlToPaper from 'vue-html-to-paper';
Vue.use(vueMoment);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
  loading: "https://i.stack.imgur.com/MEBIB.gif",
  attempt: 1,
});

import {mapActions, mapGetters} from "vuex";

import "./components";

import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import {BootstrapVue, IconsPlugin} from "bootstrap-vue";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/scss/main.scss";
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  // This is the default
  inject: true,
  // Important to name this something other than 'fields'
  fieldsBagName: 'veeFields',
  // This is not required but avoids possible naming conflicts
  errorBagName: 'veeErrors'
})
Vue.config.devtools = true;

// const optionsPrint = {
//     name: '_blank',
//     specs: [
//         // 'fullscreen=yes',
//         // 'titlebar=yes',
//         // 'scrollbars=yes'
//     ],
//     "styles": [
//         "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
//         "https://unpkg.com/kidlat-css/css/kidlat.css",
//         "./landscape.css"
//     ]
// };
//
// Vue.use(VueHtmlToPaper, optionsPrint);

const sweetOptions = {
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
};

Vue.use(VueSweetalert2, sweetOptions);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(Vue2Filters);

Vue.mixin(toasted);

// Vue.mixin(getAuth);

Vue.use(VueAxios, axios);

Vue.use(Toasted, {
  theme: "toasted-primary",
  position: "top-right",
  duration: 5000,
});

Vue.config.productionTip = false;
// Vue.prototype.$moment = moment;
new Vue({
  el: "#app",
  i18n,
  store,
  router,
  render: (h) => h(App),

  computed: mapGetters(["getMe"]),

  created() {
    this.setMe(this, path);

    if (!localStorage.locale) {
      localStorage.locale = "ru";
      this.$i18n.locale = "ru";
    }

    let path = this.$router.currentRoute;

    if (localStorage.token) {
      // console.log(localStorage.token);
      let vm = this;
      this.setMe(vm, path);
    } else {
      if (path.path != "/") {
        this.$router.push("/");
      }
    }
  },

  methods: mapActions(["setMe"]),
});
