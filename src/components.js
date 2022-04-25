import Vue from "vue";
import Multiselect from "vue-multiselect";

// const extendedSelect = {
//     extends: Multiselect,
//     styles:{
//
//     }
// }


import CreateObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Create";
import EditObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Edit";
import Header from "./components/Dashboard/Layouts/Header";
import Paginate from "vuejs-paginate";
import VuePaginate from './components/Plugins/Paginate'

Vue.component('vue-paginate', VuePaginate)
Vue.component("multiselect", Multiselect);
Vue.component("paginate", Paginate);
Vue.component("header-block", Header);
Vue.component("edit-discount", EditObjectDiscount);
Vue.component("create-discount", CreateObjectDiscount);

import VueAwesomeSwiper from 'vue-awesome-swiper'

// import style

Vue.use(VueAwesomeSwiper, /* { default options with global component } */)