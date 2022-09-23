import Vue from 'vue'
import {makeProp as p} from '@/util/props'

import {
    NAME_FORM_SELECT_OPTION
} from '@/constants/components'

import {
    PROP_TYPE_BOOLEAN,
    PROP_TYPE_OBJECT_STRING,
    PROP_TYPE_OBJECT_NUMBER_STRING_BOOLEAN
} from "@/constants/props";

const props = {
    disabled: p(PROP_TYPE_BOOLEAN),
    value: p(PROP_TYPE_OBJECT_NUMBER_STRING_BOOLEAN),
    optionStyle: p(PROP_TYPE_OBJECT_STRING),
    optionClass: p(PROP_TYPE_OBJECT_STRING)
}

export const FormSelectOption = Vue.extend({
    name: NAME_FORM_SELECT_OPTION,
    functional: true,
    props,
    render(h, {props, children}) {
        const {value, disabled} = props
        return h('li', {
            attrs: {
                value,
                disabled
            },
            domProps: {
                value,
                textContent: value
            },
            style: props.optionStyle,
            class: props.optionClass,
        }, children)
    }
})

