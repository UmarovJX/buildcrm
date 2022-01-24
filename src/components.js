import Vue from "vue";

import Header from "./components/Dashboard/Layouts/Header";
import Multiselect from "vue-multiselect";

import CreateObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Create";
import EditObjectDiscount from "./components/Dashboard/Objects/Components/Discount/Edit";

import Paginate from "vuejs-paginate";

Vue.component("header-block", Header);
Vue.component("multiselect", Multiselect);

Vue.component("create-discount", CreateObjectDiscount);
Vue.component("edit-discount", EditObjectDiscount);

Vue.component("paginate", Paginate);

/*=========================================================================================
  File Name: globalComponents.js
  Description: Here you can register components globally
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import VxTooltip from './components/Global/VueSaxTooltip'
import VxCard  from './components/Global/VueSaxCard'
import VxList  from './components/Global/VueSaxList'
import VxBreadcrumb  from './components/Global/VueSaxBreadCrumb'
import FeatherIcon  from './components/Global/VueSaxFeatherIcon'
import VxInputGroup  from './components/Global/VueSaxInputGroup'

Vue.component(VxTooltip.name, VxTooltip)
Vue.component(VxCard.name, VxCard)
Vue.component(VxList.name, VxList)
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
Vue.component(FeatherIcon.name, FeatherIcon)
Vue.component(VxInputGroup.name, VxInputGroup)


// v-select component
import vSelect from 'vue-select'

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
    Deselect: {
        render: createElement => createElement('feather-icon', {
            props: {
                icon: 'XIcon',
                svgClasses: 'w-4 h-4 mt-1'
            }
        })
    },
    OpenIndicator: {
        render: createElement => createElement('feather-icon', {
            props: {
                icon: 'ChevronDownIcon',
                svgClasses: 'w-5 h-5'
            }
        })
    }
})

Vue.component(vSelect)
