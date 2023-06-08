import Vue from "vue";
import Multiselect from "vue-multiselect";

import CreateObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Create";
import EditObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Edit";
import Header from "./components/Dashboard/Layouts/Header";
import Paginate from "vuejs-paginate";
import VuePaginate from "./components/Plugins/Paginate";
import VueAwesomeSwiper from "vue-awesome-swiper";

Vue.component("vue-paginate", VuePaginate);
Vue.component("multiselect", Multiselect);
Vue.component("paginate", Paginate);
Vue.component("header-block", Header);
Vue.component("edit-discount", EditObjectDiscount);
Vue.component("create-discount", CreateObjectDiscount);

Vue.use(VueAwesomeSwiper);
