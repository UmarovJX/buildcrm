<template>
  <div class="k-form-select">
    <div @click="openOptionList" class="k-form-select-header">
      <div
          class="k-form-select-header-content"
          :class="{
            'k-content-flex':selectList
          }"
      >
        <slot name="placeholder"/>
        <div
            :class="{'k-form-option-label':selectList}"
            v-if="showPlaceholder"
        >
          <span>{{ placeholder }}</span>
        </div>
        <div v-show="selectList">
          {{ selectList }}
        </div>
      </div>
      <span class="k-form-select-down-icon" :class="{'k-form-spin-down-icon':open}">
        <base-down-icon/>
      </span>
    </div>
    <ul v-show="open" class="k-form-select-main">
      <k-form-select-option
          v-for="(option,index) in options"
          :key="`k-form-select-option-${index}`"
          :option="option"
          :value-field="valueField"
          :text-field="textField"
      />
      <slot name="default"/>
    </ul>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import KFormSelectOption from "@/components/ui/form-select/KFormSelectOption";
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_OBJECT_STRING,
  PROP_TYPE_NUMBER_OBJECT_STRING
} from "@/constants/props";

export default {
  name: "KFormSelect",
  components: {
    BaseDownIcon,
    KFormSelectOption
  },
  props: {
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
    absentPlaceholderSlot() {
      return !this.$slots.hasOwnProperty('placeholder')
    },
    showPlaceholder() {
      const {absentPlaceholderSlot, placeholder} = this
      return absentPlaceholderSlot && placeholder
    },
    selectList() {
      if (this.multiple) {
        return this.selected.reduce((l, option) => l + ',' + option.text, '').slice(1)
      } else {
        const {selected, textField} = this
        if (selected) {
          return selected[textField]
        }
      }

      return null
    }
  },
  methods: {
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
    openOptionList() {
      this.open = !this.open
    },
    optionSelected(chOption) {
      const {textField, valueField} = this
      const hTextField = chOption.hasOwnProperty(textField)
      const hValueField = chOption.hasOwnProperty(valueField)
      let value, text
      if (hValueField) {
        const vOption = chOption[valueField]
        if (hTextField) {
          value = vOption
          text = chOption[textField]
        } else {
          value = chOption
          text = chOption
        }
      } else if (hTextField) {
        const tOption = chOption[textField]
        value = tOption
        text = tOption
      }

      if (!this.multiple) {
        this.$children.forEach((ch, idx) => {
          const isOption = ch.$el.tagName.toLocaleLowerCase() === 'li'
          if (isOption && ch.option.value !== value) {
            this.$children[idx].checked = false
          }
        })

        this.openOptionList()
      }

      this.selectHandler({value, text, disabled: chOption.disabled})
    }
  }
}
</script>

<style lang="scss" scoped>
.k-form-select {
  font-family: Inter, sans-serif;
  position: relative;

  &-header {
    background-color: var(--gray-100);
    border-radius: 32px;
    padding: 12px 20px;
    position: relative;
    cursor: pointer;

    &-content {
      .k-form-option-label {
        display: flex;
        font-size: 8px;
        font-weight: 900;
        line-height: 10px;
        font-style: normal;
        align-items: center;
        letter-spacing: 1px;
        color: var(--gray-400);
        text-transform: uppercase;
        font-family: Craftwork Sans, sans-serif;
      }
    }
  }

  &-main {
    position: absolute;
    top: calc(100% + 12px);
    border: 1px solid #E5E7EB;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
    width: 100%;
    border-radius: 24px;
    padding: 0;
  }

  &-down-icon {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .k-form-spin-down-icon{
    //transform: ;
  }
}


</style>