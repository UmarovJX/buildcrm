import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import Toasted from "vue-toasted";
import Vue2Filters from "vue2-filters";
import VueLazyload from "vue-lazyload";
import router from "./routes";
import i18n from "./locales";
import toasted from "./util/toasted";
import store from "./store";
import vueMoment from "vue-moment";
import VueMask from "v-mask";
import VueSweetalert2 from "vue-sweetalert2";
import VueYandexMetrika from 'vue-yandex-metrika'
import "sweetalert2/dist/sweetalert2.min.css";
import "./components";
// import "./util/validation"
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";


import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/scss/main.scss";

Vue.config.devtools = true;

const sweetOptions = {
    confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
};
import {
    ValidationObserver, ValidationProvider, extend, localize,
} from "vee-validate"

import ru from './locales/ru/warns/index.json'
import uz from './locales/uz/warns/index.json'

import * as rules from "vee-validate/dist/rules"

localize({ru, uz})
localize(localStorage.locale)

Object.keys(rules).forEach((rule) => {
    extend(rule, rules[rule]);
})

Vue.component("ValidationObserver", ValidationObserver)
Vue.component("ValidationProvider", ValidationProvider)

Vue.use(VueMask);
Vue.use(vueMoment);
Vue.use(VueLazyload, {
    preLoad: 1.3, error: require("@/assets/img/no-image.jpg"), loading: require("@/assets/img/loading.gif"), attempt: 1,
});

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSweetalert2, sweetOptions);
Vue.use(Vue2Filters);
Vue.mixin(toasted);
Vue.use(VueAxios, axios);
Vue.use(Toasted, {
    iconPack: 'custom-class', theme: "toasted-primary", position: "top-right", duration: 5000,
});

// Vue.config.productionTip = false;
// Vue.prototype.$moment = moment;

/* YANDEX METRIKA */
Vue.use(VueYandexMetrika, {
    id: 86876647, router: router, env: process.env.NODE_ENV, options: {
        clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true
    }
})

new Vue({
    el: "#app", i18n, store, router, render: (h) => h(App),
});
