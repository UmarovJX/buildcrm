import Vue from 'vue';

import Header from './components/Dashboard/Layouts/Header';
import Multiselect from 'vue-multiselect';

import CreateObjectDiscount from './components/Dashboard/Objects/Components/Discount/Create';
import EditObjectDiscount from './components/Dashboard/Objects/Components/Discount/Edit';


Vue.component('header-block', Header);
Vue.component('multiselect', Multiselect);

Vue.component('create-discount', CreateObjectDiscount);
Vue.component('edit-discount', EditObjectDiscount);
