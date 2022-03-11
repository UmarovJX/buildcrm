import Vue from "vue";
import Multiselect from "vue-multiselect";

import CreateObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Create";
import EditObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Edit";
import Header from "./components/Dashboard/Layouts/Header";
import Paginate from "vuejs-paginate";

Vue.component("multiselect", Multiselect);
Vue.component("paginate", Paginate);
Vue.component("header-block", Header);
Vue.component("edit-discount", EditObjectDiscount);
Vue.component("create-discount", CreateObjectDiscount);