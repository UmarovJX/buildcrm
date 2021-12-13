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
import "sweetalert2/dist/sweetalert2.min.css";
import {mapActions, mapGetters} from "vuex";
import "./components";
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
} from "vee-validate";
import ru from "vee-validate/dist/locale/ru.json";
import * as rules from "vee-validate/dist/rules";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@/assets/scss/main.scss";
Vue.config.devtools = true;

const sweetOptions = {
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
};

Vue.use(VueMask);
Vue.use(vueMoment);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require("@/assets/img/no-image.jpg"),
  loading: require("@/assets/img/loading.gif"),
  attempt: 1,
});


Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});

localize("ru", ru);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSweetalert2, sweetOptions);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);
Vue.use(Vue2Filters);
Vue.mixin(toasted);
Vue.use(VueAxios, axios);
Vue.use(Toasted, {
  theme: "toasted-primary",
  position: "top-right",
  duration: 5000,
});
// Vue.config.productionTip = false;
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
