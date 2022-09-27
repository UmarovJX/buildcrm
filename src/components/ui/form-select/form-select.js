import Vue from 'vue'
import {FormSelectOption} from "@/components/ui/form-select/form-select-option";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import '@/components/ui/form-select/scss/form-select.scss'
import {idMixin} from '@/mixins/id'

import {NAME_FORM_SELECT} from '@/constants/components'
import {EVENT_NAME_CHANGE} from '@/constants/events'
import {
    PROP_TYPE_ARRAY,
    PROP_TYPE_STRING,
    PROP_TYPE_BOOLEAN,
    PROP_TYPE_NUMBER_OBJECT_STRING,
} from '@/constants/props'

import {makeProp as p} from "@/util/props";
import {isObject} from "@/util/inspect";
import {from as ArrayFrom} from '@/util/array'

const props = {
    id: p(PROP_TYPE_STRING),
    name: p(PROP_TYPE_STRING),
    required: p(PROP_TYPE_BOOLEAN, false),
    disabled: p(PROP_TYPE_BOOLEAN, false),
    multiple: p(PROP_TYPE_BOOLEAN, false),
    pure: p(PROP_TYPE_BOOLEAN, false),
    value: p(PROP_TYPE_NUMBER_OBJECT_STRING),
    options: p(PROP_TYPE_ARRAY, []),
    valueField: p(PROP_TYPE_STRING, 'value'),
    textField: p(PROP_TYPE_STRING, 'text'),
}

const $options = (h, {options, textField, valueField}) => {
    return options.map((option, index) => {
        const {disabled, optionClass, optionStyle} = option
        let label, value
        const key = `option-${index}`

        if (isObject(option)) {
            label = option[textField]
            value = option[valueField]
        } else {
            label = option
            value = option
        }

        return h(FormSelectOption, {
            key,
            props: {
                value,
                label,
                disabled,
                optionClass,
                optionStyle
            },
            domProps: {
                value
            },
            on: {
                change(value) {
                    this.$emit(EVENT_NAME_CHANGE, value)
                }
            }
        })
    })
}

const children = (h, {slots, optionsContext}) => {
    const children = []
    const {options} = optionsContext

    if (slots.default) {
        children.push(slots.default)
    }

    if (options.length) {
        const optionsComponent = $options(h, optionsContext)
        children.push(...optionsComponent)
    }

    if (slots.first) {
        children.unshift(slots.first)
    }

    if (slots.last) {
        children.push(slots.last)
    }

    return children
}

const methods = {
    onChange(event) {
        console.log('onChange')
        const {target} = event
        const chooseList = ArrayFrom(target.options)
            .filter(o => o.selected)
            .map(o => o.value)
        if (chooseList.length) {
            let value = this.multiple ? chooseList : chooseList[0]
            this.$emit(EVENT_NAME_CHANGE, value)
        }
    }
}

const computed = {
    selectClass() {
        if (this.pure) return {}
        return ['k-form-select-self']
    },
    selectStyle() {
        return {}
    },
    parentClass() {
        if (this.pure) return {}
        return ['k-form-select-wrapper']
    },
    parentStyle() {
        return {}
    },
    selectDownIconClass() {
        return ['k-form-select-down-icon']
    },
    selectedValues() {
        const selectList = this.options.filter(o => o.selected)
        if (selectList.length) {
            if (this.multiple) {
                return selectList[0]
            }
            return selectList
        }
        return undefined
    },
    activeOptionClass() {
        if (this.pure) return {}
        return ['k-form-select-option option-active']
    },
    activeOptionStyle() {
        return ['k-form-select-option']
    },
}

export const FormSelect = Vue.extend({
    name: NAME_FORM_SELECT,
    mixins: [idMixin],
    props,
    computed,
    methods,
    model: {
        event: 'change'
    },
    render(h) {
        const {
            id, name, required, disabled, value, options, valueField, textField, multiple
        } = this

        const optionsContext = {
            options,
            textField,
            valueField
        }

        const $select = h('ul', {
                class: this.selectClass,
                style: this.selectStyle,
                attrs: {
                    id,
                    name,
                    required,
                    disabled,
                    multiple
                },
                directives: [
                    {
                        name: 'model',
                        value
                    }
                ],
                on: {
                    change: this.onChange
                }
            },
            children(h, {
                slots: this.$slots,
                optionsContext
            })
        )

        const $active = h('div', {
                class: this.activeOptionClass,
                style: this.activeOptionStyle
            },
            [
                h('div', {}, this.selectedValues)
            ])

        return h('div', {
            class: this.parentClass,
            style: this.parentStyle,
            on: {
                change: this.onChange
            }
        }, [
            $active,
            $select,
            h(BaseDownIcon, {
                class: this.selectDownIconClass
            })
        ])
    }
})
