<template>
  <div class="k-form-select" v-click-outside="closeOptionList">
    <div
        @click="toggleOptionList"
        class="k-form-select-header"
    >
      <div
          class="k-form-select-header-content"
          :class="{
            'k-content-flex':selectList
          }"
      >
        <div
            :class="{'k-form-option-label':showLabel}"
        >
          <slot name="placeholder"/>
          <span v-if="!hasPlaceholderSlot">
            {{ localePlaceholder }}
          </span>
        </div>
        <div v-if="selectList.show">
          <div v-if="multiple" class="k-chip-input-group-wrapper">
            <k-chip-input-group
                :chips="selectList.value"
                :value-field="valueField"
                :text-field="textField"
                @delete="removeSelectOption"
            />
          </div>
          <div v-else>
            {{ selectList.value }}
          </div>
        </div>
      </div>
      <span
          class="k-form-select-icon"
          :class="{'k-form-select-icon-open':open}"
      >
        <base-down-icon/>
      </span>
    </div>
    <ul v-show="open" class="k-form-select-main">
      <k-form-select-option
          v-for="(option,index) in options"
          :key="`k-form-select-option-${index}`"
          :option="option"
      />
      <slot name="default"/>
    </ul>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import clickOutside from '@/directives/click-outside'
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import KFormSelectOption from "@/components/ui-components/form-select/FormSelectOption";
import {KChipInputGroup} from "@/components/ui-components/chip-input-group";
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_OBJECT_STRING,
  PROP_TYPE_ARRAY_OBJECT_NUMBER_STRING
} from "@/constants/props";
import {isArray, isNull, isObject, isPrimitive, isUndefinedOrNull} from "@/util/inspect";

export default {
  name: "KFormSelect",
  components: {
    BaseDownIcon,
    KChipInputGroup,
    KFormSelectOption
  },
  directives: {
    clickOutside
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  emits: ['change'],
  props: {
    id: p(PROP_TYPE_STRING),
    name: p(PROP_TYPE_STRING),
    required: p(PROP_TYPE_BOOLEAN, false),
    disabled: p(PROP_TYPE_BOOLEAN, false),
    multiple: p(PROP_TYPE_BOOLEAN, false),
    pure: p(PROP_TYPE_BOOLEAN, false),
    value: p(PROP_TYPE_ARRAY_OBJECT_NUMBER_STRING),
    options: p(PROP_TYPE_ARRAY, []),
    valueField: p(PROP_TYPE_STRING, 'value'),
    textField: p(PROP_TYPE_STRING, 'text'),
    optionStyle: p(PROP_TYPE_OBJECT_STRING, {}),
    optionClass: p(PROP_TYPE_OBJECT_STRING, {}),
    placeholder: p(PROP_TYPE_STRING, undefined),
    label: p(PROP_TYPE_BOOLEAN, true)
  },

  data() {
    let selected = this.multiple ? [] : null
    return {
      selected,
      open: false
    }
  },

  computed: {
    showLabel() {
      const {multiple, selectList, selected} = this
      if (multiple) {
        return selectList.value.length
      } else {
        return !isNull(selected)
      }
    },
    localePlaceholder() {
      const {placeholder} = this
      if (placeholder) {
        return placeholder
      } else {
        return this.$t('please_select')
      }
    },
    hasPlaceholderSlot() {
      return this.$slots.hasOwnProperty('placeholder')
    },
    selectList() {
      if (this.multiple) {
        if (this.selected.length) {
          return {
            show: true,
            value: this.selected
          }
        } else {
          return {
            show: false,
            value: []
          }
        }
      } else {
        const {selected, textField} = this
        console.log(selected)
        if (selected) {
          return {
            show: true,
            value: selected[textField]
          }
        }
        return {
          show: false,
          value: [],
        }
      }
    }
  },

  watch: {
    selected() {
      this.handleChange()
    }
  },

  created() {
    this.lunch()
  },

  methods: {
    lunch() {
      const _dValue = this.$attrs.value ?? this.value
      const typeArray = isArray(_dValue)
      const typeObject = isObject(_dValue)
      if (isUndefinedOrNull(_dValue))
        return
      if (this.multiple) {
        if (typeArray) {
          this.selected = [..._dValue]
        } else if (typeObject(_dValue)) {
          this.selected.push(_dValue)
        }
      } else {
        if (typeArray) {
          if (_dValue.length) {
            this.selected = _dValue[0]
          }
        } else if (typeObject) {
          this.selected = _dValue
        } else if (isPrimitive(_dValue)) {
          this.selected = {}
          this.selected[this.textField] = _dValue
          this.selected[this.valueField] = _dValue
        }
      }
    },
    handleChange() {
      const {multiple, selected} = this
      if (multiple && !selected.length) {
        this.$emit('change', null)
        return
      }
      this.$emit('change', selected)
    },
    selectHandler({value, text, disabled}) {
      if (disabled) {
        if (this.multiple) {
          this.selected = this.selected.filter(s => s.value !== value)
        } else {
          this.selected = null
        }
      } else {
        if (this.multiple) {
          this.selected.push({value, text})
        } else {
          this.selected = {value, text}
        }
      }
    },
    toggleOptionList() {
      this.open = !this.open
    },
    openOptionList() {
      this.open = true
    },
    closeOptionList() {
      this.open = false
    },
    clear() {
      this.selected = this.multiple ? [] : null
      this.inactiveAllOption(null)
    },
    optionSelected(chOption) {
      const {textField, valueField} = this
      const hTextField = chOption.hasOwnProperty(textField)
      const hValueField = chOption.hasOwnProperty(valueField)

      if (!(hValueField || hTextField)) return

      const _value = chOption[valueField]
      const _text = chOption[textField]

      let value, text
      if (hValueField) {
        if (hTextField) {
          value = _value
          text = _text
        } else {
          value = chOption
          text = chOption
        }
      } else if (hTextField) {
        value = _text
        text = _text
      }

      if (!this.multiple) {
        this.inactiveAllOption(value)
        this.toggleOptionList()
      }

      this.selectHandler({value, text, disabled: chOption.disabled})
    },
    getOptionIndex(_value) {
      return this.$children
          .findIndex(_ch => {
            return _ch.$el.tagName.toLocaleLowerCase() === 'li' && _ch.option.value === _value
          })
    },
    inactiveOption(_oValue) {
      this.$children.forEach((ch, idx) => {
        const isOption = ch.$el.tagName.toLocaleLowerCase() === 'li'
        if (isOption && ch.option.value === _oValue) {
          this.$children[idx].checked = false
        }
      })
    },
    inactiveAllOption(_cValue) {
      this.$children.forEach((ch, idx) => {
        const isOption = ch.$el.tagName.toLocaleLowerCase() === 'li'
        if (isOption && ch.option.value !== _cValue) {
          this.$children[idx].checked = false
        }
      })
    },
    removeSelectOption(removeOption) {
      const {multiple, valueField: vField} = this
      if (!multiple) return
      const hValueField = removeOption.hasOwnProperty(vField)
      if (hValueField) {
        const _value = removeOption[vField]
        this.inactiveOption(_value)
        this.selected = this.selected.filter(_c => _c[vField] !== _value)
      }
    }
  }
}
</script>

<style lang="scss" src="./form-select.scss" scoped/>
