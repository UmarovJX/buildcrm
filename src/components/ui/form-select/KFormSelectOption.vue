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
  PROP_TYPE_STRING
} from '@/constants/props'
import {
  EVENT_NAME_CHANGE
} from '@/constants/events'
import {makeProp as p} from "@/util/props";
import {isUndefinedOrNull, isObject, isString} from '@/util/inspect'

export default {
  name: "KFormSelectOption",
  components: {
    BaseCheckIcon
  },
  props: {
    id: p(PROP_TYPE_NUMBER_STRING, undefined),
    option: p(PROP_TYPE_OBJECT_NUMBER_STRING_BOOLEAN, undefined),
    valueField: p(PROP_TYPE_STRING, 'value'),
    textField: p(PROP_TYPE_STRING, 'text'),
  },
  emits: [EVENT_NAME_CHANGE],
  data() {
    return {
      checked: false
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
  methods: {
    optionClickHandle() {
      this.checked = !this.checked
      const {value, text} = this.inlineOption
      this.$parent.optionSelected({
        value, text, disabled: !this.checked
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.k-form-option {
  position: relative;
  list-style-type: none;
  margin: 8px;
  cursor: pointer;
  padding: 1rem;
  border-radius: 16px;

  &:hover {
    background-color: var(--gray-100);
    color: var(--gray-600);
  }

  &-active,
  &-active:hover {
    background-color: var(--violet-100);
    color: var(--violet-600);
  }

  .option-check-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>