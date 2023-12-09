<script>
import {makeProp as p} from "@/util/props";
import clickOutside from "@/directives/click-outside";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import XFormSelectOption from "@/components/ui-components/form-select/FormSelectOption";
import {KChipInputGroup} from "@/components/ui-components/chip-input-group";
import {
  PROP_TYPE_ARRAY,
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_OBJECT_STRING,
  PROP_TYPE_ARRAY_OBJECT_NUMBER_STRING,
} from "@/constants/props";
import {
  isArray,
  isNull,
  isObject,
  isPrimitive,
  isUndefinedOrNull,
} from "@/util/inspect";

export default {
  name: "XFormSelect",
  components: {
    BaseDownIcon,
    KChipInputGroup,
    XFormSelectOption,
  },
  directives: {
    clickOutside,
  },
  model: {
    prop: "value",
    event: "change",
  },
  emits: ["change"],
  props: {
    id: p(PROP_TYPE_STRING),
    name: p(PROP_TYPE_STRING),
    bilingual: p(PROP_TYPE_BOOLEAN, false),
    required: p(PROP_TYPE_BOOLEAN, false),
    disabled: p(PROP_TYPE_BOOLEAN, false),
    multiple: p(PROP_TYPE_BOOLEAN, false),
    value: p(PROP_TYPE_ARRAY_OBJECT_NUMBER_STRING),
    options: p(PROP_TYPE_ARRAY, []),
    valueField: p(PROP_TYPE_STRING, "value"),
    textField: p(PROP_TYPE_STRING, "text"),
    optionStyle: p(PROP_TYPE_OBJECT_STRING, {}),
    optionClass: p(PROP_TYPE_OBJECT_STRING, {}),
    placeholder: p(PROP_TYPE_STRING, undefined),
    label: p(PROP_TYPE_BOOLEAN, true),
    error: p(PROP_TYPE_BOOLEAN, false),
    getter: p(PROP_TYPE_STRING, "value", (vGetter) => {
      return ["full", "text", "value"].includes(vGetter);
    }),
    multilingual: p(PROP_TYPE_BOOLEAN, false),
    bottomToTop: p(PROP_TYPE_BOOLEAN,false)
  },
  data() {
    let selected = this.multiple ? [] : null;
    return {
      selected,
      open: false,
      showBottomToTop: false,
      formOptionsWrapperHeight: 0,
    };
  },
  computed: {
    optionWrapperStyle() {
      if (!this.open) {
        return {
          display: "none",
        };
      }
      return {};
    },
    showPlaceholder() {
      if (this.hasPlaceholderSlot) {
        return false;
      }

      if (this.label) {
        return true;
      }

      if (this.multiple) {
        return !this.selected.length;
      }

      return !this.selected;
    },
    showLabel() {
      const {multiple, selectList, selected} = this;
      if (!this.label) return false;
      if (multiple) {
        return selectList.value.length;
      } else {
        return !isNull(selected);
      }
    },
    localePlaceholder() {
      const {placeholder} = this;
      if (placeholder) {
        return placeholder;
      } else {
        return this.$t("please_select");
      }
    },
    hasPlaceholderSlot() {
      return this.$slots.hasOwnProperty("placeholder");
    },
    hasOutputSlot() {
      return this.$slots.hasOwnProperty("output");
    },
    selectList() {
      if (this.multiple) {
        if (this.selected?.length) {
          return {
            show: true,
            value: this.selected,
          };
        } else {
          return {
            show: false,
            value: [],
          };
        }
      } else {
        const {selected, textField} = this;
        if (selected) {
          return {
            show: true,
            value: selected[textField],
          };
        }
        return {
          show: false,
          value: [],
        };
      }
    },
  },
  watch: {
    selected() {
      this.handleChange();
    },
    value(latestValue) {
      if (
          !this.multiple &&
          (!this.selected || this.selected.value !== latestValue)
      ) {
        this.lunch();
        this.findOutputPosition();
      }
    },
  },
  mounted() {
    this.lunch();
    this.findOutputPosition();
  },
  beforeUpdate() {
    this.findOutputPosition();
  },
  methods: {
    findOutputPosition() {
      const windowHeight = window.innerHeight;
      const formSelectRect =
          this.$refs["x-form-select"].getBoundingClientRect();
      const {height: optionsTotalHeight} =
          this.$refs["k-form-options-wrapper"].getBoundingClientRect();
      const distanceCellBetweenBottom = windowHeight - formSelectRect.bottom;
      this.showBottomToTop = this.bottomToTop ||
          distanceCellBetweenBottom <
          formSelectRect.height * this.options.length + 50;
      // distanceCellBetweenBottom < formSelectRect.height + optionsTotalHeight;
    },
    lunch() {
      const {textField, valueField} = this;
      const _dValue = this.$attrs.value ?? this.value;
      const typeArray = isArray(_dValue);
      const typeObject = isObject(_dValue);
      if (isUndefinedOrNull(_dValue)) {
        this.selected = null;
        this.inactiveAllOption();
        return;
      }
      if (this.multiple) {
        if (typeArray) {
          const isContainObjects = _dValue.every((v) => isObject(v));
          const isContainPrimitives = _dValue.every((v) => isPrimitive(v));
          if (isContainObjects) {
            this.selected = [..._dValue];
          } else if (isContainPrimitives) {
            this.selected = _dValue.map((_vc) => {
              const _fChild = this.findOption(_vc);
              if (isUndefinedOrNull(_fChild)) {
                const c = {};
                c[valueField] = _vc;
                c[textField] = _vc;
                return c;
              }
              return _fChild.option;
            });
          }
        } else if (typeObject) {
          this.selected.push(_dValue);
        }
      } else {
        if (typeArray) {
          if (_dValue.length) {
            this.selected = _dValue[0];
          }
        } else if (typeObject) {
          const majorValue = _dValue[valueField];
          this.selected = this.findOption(majorValue).option ?? _dValue;
        } else if (isPrimitive(_dValue)) {
          this.selected = {};
          const _fChild = this.findOption(_dValue);
          if (isUndefinedOrNull(_fChild)) {
            this.selected[this.textField] = _dValue;
            this.selected[this.valueField] = _dValue;
          } else {
            this.selected = _fChild.option;
            this.inactiveAllOption();
            _fChild.makeActive();
          }
        }
      }
    },
    handleChange() {
      const {multiple, selected, valueField: vField} = this;
      if (multiple) {
        if (!selected?.length) {
          this.$emit("change", null);
        } else {
          switch (this.getter) {
            case "value": {
              const _cValue = selected.map(
                  (vSelect) => vSelect[this.valueField]
              );
              this.$emit("change", _cValue);
              break;
            }
            case "text": {
              const _cText = selected.map((vSelect) => vSelect[this.textField]);
              this.$emit("change", _cText);
              break;
            }
            default: {
              this.$emit("change", selected);
            }
          }
        }
        return;
      }

      if (isUndefinedOrNull(selected)) {
        this.$emit("change", null);
        return;
      }

      switch (this.getter) {
        case "value": {
          this.$emit("change", selected[vField]);
          break;
        }
        case "text": {
          const _cText = selected.map((vSelect) => vSelect[this.textField]);
          this.$emit("change", _cText);
          break;
        }
        default: {
          this.$emit("change", selected);
        }
      }
    },
    selectHandler({value, text, disabled}) {
      if (disabled) {
        if (this.multiple) {
          this.selected = this.selected.filter(
              (s) => s[this.valueField] !== value
          );
        } else {
          this.selected = null;
        }
      } else {
        if (this.multiple) {
          const option = this.generateOps(value, text);
          if (isUndefinedOrNull(this.selected)) {
            this.selected = [];
          }
          this.selected.push(option);
        } else {
          this.selected = this.generateOps(value, text);
        }
      }
    },
    generateOps(value, text) {
      let ops = {};
      ops[this.valueField] = value;
      ops[this.textField] = text;
      return ops;
    },
    toggleOptionList() {
      this.open = !this.open;
    },
    openOptionList() {
      this.open = true;
    },
    closeOptionList() {
      this.open = false;
    },
    clear() {
      this.selected = this.multiple ? [] : null;
      this.inactiveAllOption(null);
    },
    optionSelected(chOption) {
      const {textField, valueField} = this;
      const hTextField = chOption.hasOwnProperty(textField);
      const hValueField = chOption.hasOwnProperty(valueField);

      if (!(hValueField || hTextField)) return;

      const _value = chOption[valueField];
      const _text = chOption[textField];

      let value, text;
      if (hValueField) {
        if (hTextField) {
          value = _value;
          text = _text;
        } else {
          value = chOption;
          text = chOption;
        }
      } else if (hTextField) {
        value = _text;
        text = _text;
      }

      if (!this.multiple) {
        this.inactiveAllOption(value);
        this.toggleOptionList();
      }

      this.selectHandler({value, text, disabled: chOption.disabled});
    },
    findOption(optionValue) {
      const {valueField: vField} = this;
      return this.$children.find((_ch) => {
        return (
            _ch.$el.tagName.toLocaleLowerCase() === "li" &&
            _ch.option[vField] === optionValue
        );
      });
    },
    getOptionIndex(_value) {
      return this.$children.findIndex((_ch) => {
        return (
            _ch.$el.tagName.toLocaleLowerCase() === "li" &&
            _ch.option.value === _value
        );
      });
    },
    inactiveOption(_oValue) {
      this.$children.forEach((ch, idx) => {
        const isOption = ch.$el.tagName.toLocaleLowerCase() === "li";
        if (isOption && ch.option[this.valueField] === _oValue) {
          this.$children[idx].checked = false;
        }
      });
    },
    inactiveAllOption(_cValue = undefined) {
      this.$children.forEach((ch, idx) => {
        const isOption = ch.$el.tagName.toLocaleLowerCase() === "li";
        if (isOption && ch.option[this.valueField] !== _cValue) {
          this.$children[idx].checked = false;
        }
      });
    },
    removeSelectOption(removeOption) {
      const {multiple, valueField: vField} = this;
      if (!multiple) return;
      const hValueField = removeOption.hasOwnProperty(vField);
      let _value;
      if (hValueField) {
        _value = removeOption[vField];
      } else {
        _value = removeOption;
      }
      this.inactiveOption(_value);
      this.selected = this.selected.filter((_c) => _c[vField] !== _value);
    },
    getValueByCurrentLang(value) {
      if (value.hasOwnProperty(this.$i18n.locale)) {
        return value[this.$i18n.locale];
      }
      return value;
    },
  },
};
</script>

<template>
  <div
      ref="x-form-select"
      class="x-form-select"
      v-click-outside="closeOptionList"
  >
    <div
        @click="toggleOptionList"
        class="x-form-select-header"
        :class="{ 'select-validation-failed': error }"
    >
      <div
          class="x-form-select-header-content"
          :class="{
          'k-content-flex': selectList,
        }"
      >
        <div :class="{ 'k-form-option-label': showLabel }" class="placeholder">
          <slot name="placeholder"/>
          <span v-if="showPlaceholder" class="placeholder">
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
            <slot name="output"/>
            <template v-if="!hasOutputSlot">
              <slot name="output-prefix"/>
              <span v-if="bilingual">{{ $t(selectList.value) }}</span>
              <span v-else-if="multilingual">
                {{ getValueByCurrentLang(selectList.value) }}
              </span>
              <span v-else>{{ selectList.value }}</span>
              <slot name="output-suffix"/>
            </template>
          </div>
        </div>
      </div>
      <span
          class="x-form-select-icon"
          :class="{ 'x-form-select-icon-open': open }"
      >
        <base-down-icon/>
      </span>
    </div>
    <div
        ref="k-form-options-wrapper"
        class="x-form-select-main"
        :style="optionWrapperStyle"
        :class="{ 'x-form-select-position-top': showBottomToTop }"
    >
      <ul class="x-form-select-options">
        <x-form-select-option
            v-for="(option, index) in options"
            :key="`x-form-select-option-${index}`"
            :option="option"
        />
        <slot name="default"/>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" src="./form-select.scss" scoped/>
<style lang="scss" scoped>
.placeholder {
  color: var(--gray-400);
}
</style>
