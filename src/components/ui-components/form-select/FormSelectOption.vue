<template>
  <li
      :class="optionClass"
      :value="inlineOption.value"
      @click="optionClickHandle"
  >
    <slot name="option-left"/>
    <slot name="default"/>
    <span v-if="absentDefaultSlot">
      <span v-if="bilingual">{{ $t(inlineOption[textField]) }}</span>
      <span v-else-if="multilingual">{{ getMultilingualValue() }}</span>
      <span v-else>{{ inlineOption[textField] }}</span>
    </span>
    <slot name="option-right"/>
    <span
        v-if="showActiveCheckIcon"
        class="option-check-icon"
    >
      <base-check-icon
          fill="#7C3AED"
          :width="20"
          :height="20"
      />
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
import {isUndefinedOrNull, isObject, isString, isArray, isPrimitive} from '@/util/inspect'

export default {
  name: "XFormSelectOption",

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
      bilingual: this.$parent.bilingual ?? false,
      multilingual: this.$parent.multilingual ?? false
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
        return this.generateOps(null, null)
      }

      if (isString(option)) {
        return this.generateOps(option, option)
      }

      if (isObject(option)) {
        const hValueField = option.hasOwnProperty(valueField)
        const hTextField = option.hasOwnProperty(textField)

        if (hValueField) {
          const value = option[valueField]
          if (hTextField) {
            return option
          } else {
            return this.generateOps(value, value)
          }
        }

        if (hTextField) {
          return this.generateOps(textField, textField)
        }
      }

      return this.generateOps(null, null)
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
    generateOps(value, text) {
      let ops = {}
      ops[this.valueField] = value
      ops[this.textField] = text
      return ops
    },
    initOption() {
      const {valueField: vField, option} = this
      const _dValue = this.$parent.$attrs.value ?? this.$parent.value
      if (isUndefinedOrNull(_dValue)) return
      if (isArray(_dValue)) {
        const isContainPrimitives = isPrimitive(_dValue[0])

        if (isContainPrimitives) {
          const _idx = _dValue.find(_dv => _dv === option[vField])
          _idx && this.makeActive()
          return
        }

        const _idx = _dValue.find(_dv => _dv[vField] === option[vField])
        _idx && this.makeActive()
      } else if (isObject(_dValue)) {
        const isEqual = _dValue[vField] === option[vField]
        isEqual && this.makeActive()
      } else {
        (_dValue === option[vField]) && this.makeActive()
      }
    },
    optionClickHandle() {
      this.checked = !this.checked
      this.$parent.optionSelected({
        ...this.inlineOption, disabled: !this.checked
      })
    },
    makeActive() {
      this.checked = true
    },
    makeInactive() {
      this.checked = false
    },
    getMultilingualValue() {
      const v = this.inlineOption[this.textField]
      if (v.hasOwnProperty(this.$i18n.locale)) {
        return v[this.$i18n.locale]
      }
      return v
    },
  }
}
</script>

<style lang="scss" src="./form-select-option.scss" scoped/>