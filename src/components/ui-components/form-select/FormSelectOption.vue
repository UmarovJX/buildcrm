<template>
  <li
      :class="optionClass"
      :value="inlineOption.value"
      @click="optionClickHandle"
  >
    <slot name="option-left"/>
    <slot name="default"/>
    <span v-if="absentDefaultSlot">
      {{ inlineOption.text }}
    </span>
    <slot name="option-right"/>
    <span
        v-if="showActiveCheckIcon"
        class="option-check-icon"
    >
      <base-check-icon fill="#7C3AED" :width="20" :height="20"/>
    </span>
  </li>
</template>

<script>
import BaseCheckIcon from "@/components/icons/BaseCheckIcon";
import {
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_OBJECT_NUMBER_STRING_BOOLEAN,
} from '@/constants/props'
import {
  EVENT_NAME_CHANGE
} from '@/constants/events'
import {makeProp as p} from "@/util/props";
import {isUndefinedOrNull, isObject, isString, isArray} from '@/util/inspect'

export default {
  name: "KFormSelectOption",

  components: {
    BaseCheckIcon
  },

  props: {
    id: p(PROP_TYPE_NUMBER_STRING, undefined),
    option: p(PROP_TYPE_OBJECT_NUMBER_STRING_BOOLEAN, undefined),
  },

  emits: [EVENT_NAME_CHANGE],

  data() {
    const valueField = this.$parent.valueField ?? 'value'
    const textField = this.$parent.textField ?? 'text'
    return {
      textField,
      valueField,
      checked: false,
    }
  },

  computed: {
    absentDefaultSlot() {
      return !this.$slots.hasOwnProperty('default')
    },
    absentOptionRight() {
      return !this.$slots.hasOwnProperty('option-right')
    },
    showActiveCheckIcon() {
      return this.absentOptionRight && this.checked
    },
    inlineOption() {
      const {option, valueField, textField} = this
      if (isUndefinedOrNull(option)) {
        return {
          value: null,
          text: null
        }
      }

      if (isString(option)) {
        return {
          value: option,
          text: option
        }
      }

      if (isObject(option)) {
        const hValueField = option.hasOwnProperty(valueField)
        const hTextField = option.hasOwnProperty(textField)

        if (hValueField) {
          const value = option[valueField]
          if (hTextField) {
            return {
              value,
              text: option[textField]
            }
          } else {
            return {
              value,
              text: value
            }
          }
        }

        if (hTextField) {
          return {
            value: option[textField],
            text: option[textField]
          }
        }
      }

      return {
        value: null,
        text: null
      }
    },
    optionClass() {
      const kOptionClass = ['k-form-option']
      if (this.checked) {
        kOptionClass.push('k-form-option-active')
      }
      return kOptionClass
    }
  },

  created() {
    this.initOption()
  },

  methods: {
    initOption() {
      const {valueField: vField, option} = this
      const _dValue = this.$parent.$attrs.value ?? this.$parent.value
      if (isUndefinedOrNull(_dValue)) return
      if (isArray(_dValue)) {
        const _idx = _dValue.find(_dv => _dv[vField] === option[vField])
        _idx && this.makeActive()
      } else if (isObject(_dValue)) {
        const isEqual = _dValue[vField] === option[vField]
        isEqual && this.makeActive()
      }
    },
    optionClickHandle() {
      const {value, text} = this.inlineOption
      this.checked = !this.checked
      this.$parent.optionSelected({
        value, text, disabled: !this.checked
      })
    },
    makeActive() {
      this.checked = true
    },
    makeInactive() {
      this.checked = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "form-select-option";
</style>