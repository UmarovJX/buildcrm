import Vue from 'vue'
import {makeProp as p} from '@/util/props'
import {PROP_TYPE_STRING} from "@/constants/props";

export const props = {
    id:p(PROP_TYPE_STRING)
}

export const idMixin = Vue.extend({
    props,

})