import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Toasted from 'vue-toasted'
import Vue2Filters from 'vue2-filters'
import VueLazyload from 'vue-lazyload'
import vueMoment from 'vue-moment'
import VueMask from 'v-mask'
import VueSweetalert2 from 'vue-sweetalert2'
import VueYandexMetrika from 'vue-yandex-metrika'
import 'sweetalert2/dist/sweetalert2.min.css'
import './assets/scss/components/_calendar.scss'
import './components'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/scss/main.scss'

import vSelect from 'vue-select'
import VueApexCharts from 'vue-apexcharts'

import {
  ValidationObserver,
  ValidationProvider,
  extend,
  localize,
} from 'vee-validate'

import * as rules from 'vee-validate/dist/rules'
import uz from './locales/uz/warns/index.json'
import ru from './locales/ru/warns/index.json'
import store from './store'
import { initI18n } from './locales'
import toasted from './util/toasted'
import router from './routes'

Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

Vue.component('v-select', vSelect)

Vue.config.devtools = true

const sweetOptions = {
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
}

localize({ ru, uz })

const localeLang = localStorage.locale ? localStorage.locale : 'ru'

localize(localeLang)

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule])
})

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

Vue.use(VueMask)
Vue.use(vueMoment)

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('@/assets/img/no-image.jpg'),
  loading: require('@/assets/img/loading.gif'),
  attempt: 1,
})

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueSweetalert2, sweetOptions)
Vue.use(Vue2Filters)
Vue.mixin(toasted)
Vue.use(VueAxios, axios)

Vue.use(Toasted, {
  iconPack: 'custom-class',
  theme: 'toasted-primary',
  position: 'top-right',
  duration: 5000,
})

Vue.use(VueYandexMetrika, {
  id: 95343388,
  router,
  // eslint-disable-next-line no-undef
  env: process.env.NODE_ENV,
  options: {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  },
})

initI18n().then(function (i18n) {
  new Vue({
    el: '#app',
    i18n,
    store,
    router,
    render: h => h(App),
  })
})

