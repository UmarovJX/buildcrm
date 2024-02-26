<script>
import BaseTimesCircleIcon from "@/components/icons/BaseTimesCircleIcon";
import { isUndefinedOrNullOrEmpty, isUndefinedOrNull } from "@/util/inspect";
import { debounce } from "@/util/reusable";

const cssDefaultProperty = {
  type: String,
  default: "",
};

export default {
  name: "BaseInput2",

  components: {
    BaseTimesCircleIcon,
    BaseNumericInput: () => import("@/components/Reusable/BaseNumericInput"),
  },

  model: {
    prop: "value",
    event: "input",
  },

  emits: ["input", "blur", "focus"],

  props: {
    placeholder: {
      type: String,
    },
    precision: {
      type: Number,
      default: 0,
    },
    value: {
      type: [String, Number, Array],
      default: () => null,
    },
    type: {
      type: String,
      default: () => "text",
    },
    label: {
      type: Boolean,
      default: () => false,
    },
    error: {
      type: Boolean,
      default: () => false,
    },
    currency: {
      type: String,
      default: " ",
    },
    mask: {
      type: String,
      default: "",
    },
    disable: {
      type: Boolean,
      default: () => false,
    },
    readonly: {
      type: Boolean,
      default: () => false,
    },
    autocomplete: {
      type: String,
      default: "on",
    },
    /**
     * Maximum value allowed.
     */
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER || 9007199254740991,
      required: false,
    },

    /**
     * Minimum value allowed.
     */
    min: {
      type: Number,
      default: Number.MIN_SAFE_INTEGER || -9007199254740991,
      required: false,
    },
    currencySymbol: {
      type: Boolean,
      default: false,
    },
    margin: cssDefaultProperty,
    padding: cssDefaultProperty,
    paddingLeft: cssDefaultProperty,
    paddingRight: cssDefaultProperty,
    paddingBottom: cssDefaultProperty,
    paddingTop: cssDefaultProperty,
    marginTop: cssDefaultProperty,
    marginBottom: cssDefaultProperty,
    marginLeft: cssDefaultProperty,
    marginRight: cssDefaultProperty,
  },

  data() {
    const inputModel = this.value;

    return {
      inputModel,
      showClearIcon: !isUndefinedOrNullOrEmpty(inputModel),
    };
  },

  computed: {
    inputFieldStyle() {
      const {
        margin,
        padding,
        paddingLeft,
        paddingRight,
        paddingBottom,
        paddingTop,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      } = this;
      return {
        margin,
        padding,
        paddingLeft,
        paddingRight,
        paddingBottom,
        paddingTop,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      };
    },
  },

  watch: {
    inputModel: debounce(function () {
      this.emitValue();
      this.toggleClearButton();
    }, 0), // 1500
    value(valueUpdateByParent) {
      if (valueUpdateByParent !== this.inputModel) {
        this.inputModel = valueUpdateByParent;
      }
    },
  },

  methods: {
    isUndefinedOrNullOrEmpty,
    isUndefinedOrNull,
    toggleClearButton() {
      this.showClearIcon = !isUndefinedOrNullOrEmpty(this.inputModel);
    },
    clearSearchInput() {
      this.effectModel("");
    },
    effectModel(value) {
      this.inputModel = value;
    },
    emitValue() {
      this.$emit("input", this.inputModel);
    },
  },
};
</script>

<template>
  <div
    class="base-input gray-300"
    :class="{
      error: error,
      label: !isUndefinedOrNullOrEmpty(value) && label,
      'disable-input': disable,
    }"
  >
    <div v-if="!isUndefinedOrNullOrEmpty(value) && label" class="input-label">
      <span>
        {{ placeholder }}
      </span>
    </div>
    <base-numeric-input
      v-if="type === 'number'"
      ref="base-input"
      v-model="inputModel"
      :minus="false"
      :value="null"
      :disabled="disable"
      :readonly="readonly"
      :currency="currency"
      :placeholder="placeholder"
      :field-style="inputFieldStyle"
      :precision="precision"
      :currency-symbol="currencySymbol"
      :max="max"
      :min="min"
      separator="space"
      currency-symbol-position="suffix"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <input
      v-else-if="mask !== ''"
      id="base-input-mask"
      ref="base-input"
      v-model="inputModel"
      v-mask="mask"
      :type="type"
      :readonly="readonly"
      :style="inputFieldStyle"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disable"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
    <input
      v-else
      id="base-input"
      ref="base-input"
      v-model="inputModel"
      :readonly="readonly"
      :type="type"
      :style="inputFieldStyle"
      :placeholder="placeholder"
      :disabled="disable"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />

    <span
      v-show="showClearIcon && !disable && !readonly"
      class="clear__icon"
      @click="clearSearchInput"
    >
      <base-times-circle-icon />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.input-label {
  font-family: CraftworkSans, serif;
  position: relative;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--gray-400);
  width: 100%;
  display: flex;
  padding-left: 1rem;
  margin-bottom: 6px;

  span {
    font-weight: 900;
    font-size: 8px;
    line-height: 10px;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.base-input {
  width: 100%;
  height: 3.5rem;
  padding: 13px 20px 13px 1.25rem;
  border: 0.25rem solid transparent;
  border-radius: 2rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  font-family: Inter, serif;

  &.label {
    padding: 8px 20px 8px 1.25rem;
  }

  &:focus-within {
    border: 0.25rem solid var(--gray-200);
    background-color: var(--gray-100);
  }

  input {
    font-family: Inter, sans-serif !important;
    width: 100%;
    background-color: transparent;
    height: 100%;
    outline: none;
    border: none;
    font-weight: 700;
    color: var(--gray-600);
    padding: 0 !important;

    &::placeholder {
      font-weight: 600;
      color: var(--gray-400);
      font-family: Inter, sans-serif !important;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:focus {
      transition: background-color 600000s 0s, color 600000s 0s;
      font-family: Inter, sans-serif !important;
    }
  }

  &:hover {
    background-color: var(--gray-200);
  }

  &-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
}

.disable-input {
  background-color: var(--gray-300) !important;

  &:focus-within,
  input,
  input:hover {
    background-color: var(--gray-300);
  }
}

.clear__icon {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  transition: transform 100ms ease-in;

  &:hover {
    transform: scale(1.1);
  }
}

::placeholder {
  color: var(--gray-600);
  opacity: 1;
}

input[type="date"] {
  padding-right: 2rem;
}

input[type="date"]::-webkit-datetime-edit-text,
input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: var(--gray-600);
}

::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 60%;
  right: 2rem;
  transform: translateY(-60%);
}

.error {
  border: 0.25rem solid var(--red-500) !important;
}

@media (max-width: 996px) {
  .search__content-input {
    width: 60%;
  }
}
</style>
