<template>
  <div class="price-input-content">
    <span
        v-if="topPlaceholder"
        class="top-placeholder"
        :class="[
            { 'hide-content': topPlaceholder },
            { 'show-content': priceAmount }
        ]"
    >
      {{ placeholderFormat }}
    </span>
    <input
        type="text"
        ref="price-input"
        class="price-input"
        :placeholder="placeholderFormat"
        v-bind="$attrs"
        v-model="priceAmount"
        @blur="onBlurHandler"
        @input="onInputHandler"
        @focus="onFocusHandler"
    >
    <span v-if="priceAmount" @click="clearPriceAmountValue" class="delete-button">
      <base-times-circle-icon/>
    </span>
  </div>
</template>

<script>
import {
  splitString,
  isSatisfyInput,
  formatByConfiguration,
  removeExcessDotAndComma,
} from "@/util/base-input";
import {isPrimitiveValue} from "@/util/reusable";
import BaseTimesCircleIcon from "@/components/icons/BaseTimesCircleIcon";

export default {
  name: "BasePriceInput",
  inheritAttrs: false,
  components: {
    BaseTimesCircleIcon
  },
  props: {
    value: {
      type: [Number, String],
      default: null,
      required: false
    },
    placeholder: {
      type: [String, Number, Object],
      default: null
    },
    precision: {
      type: Number,
      default: 0,
      required: false
    },
    decimalSeparator: {
      type: String,
      default: ','
    },
    thousandSeparator: {
      type: String,
      default: ' ',
    },
    outputType: {
      required: false,
      type: String,
      default: 'Number'
    },
    readOnly: {
      type: Boolean,
      default: false,
      required: false
    },
    currencyFare: {
      type: String,
      default: 'uz',
      required: false
    },
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER || 9007199254740991,
      required: false,
    },
    min: {
      type: Number,
      default: Number.MIN_SAFE_INTEGER || -9007199254740991,
      required: false
    },
    permissionChange: {
      type: Boolean,
      default: false
    },
    topPlaceholder: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input', 'focus-on'],
  data() {
    return {
      priceAmount: null,
      placeholderFormat: null,
      sideEffect: true
    }
  },
  watch: {
    priceAmount(lastAmount) {
      this.formatPriceAmount(lastAmount)
    },
    value: {
      handler(last) {
        if (this.permissionChange) {
          this.formatPriceAmount(last)
        }
      },
      immediate: true
    }
  },
  created() {
    this.initComponent()
  },
  methods: {
    clearPriceAmountValue() {
      this.priceAmount = null
      this.$emit('input', null)
    },
    formatNumber(primitiveValue) {
      if (!primitiveValue) return
      const valueToString = primitiveValue.toString().split('')
      primitiveValue = removeExcessDotAndComma(valueToString)
      return primitiveValue
    },
    initComponent() {
      this.setPlaceholder()
      this.setInitialAmountValue()
    },
    setPlaceholder() {
      const {placeholder} = this
      if (placeholder) {
        const type = typeof placeholder
        if (isPrimitiveValue(type)) {
          this.placeholderFormat = placeholder
        } else {
          this.placeholderFormat = this.$t(placeholder.lang)
        }
      }
    },
    setInitialAmountValue() {
      if (this.value && this.permissionChange) {
        this.sideEffect = false
        const {formatVersion} = this.formatAmount(this.value)
        this.priceAmount = formatVersion
      }
    },
    formatPriceAmount(value) {
      const {max} = this
      const {formatVersion, baseVersion} = this.formatAmount(value)
      const stringBaseVersion = baseVersion.toString()
      const length = stringBaseVersion.length
      if (length > max) {
        let setter = undefined
        const findDotPosition = stringBaseVersion.split('').indexOf('.')
        if (findDotPosition) {
          setter = stringBaseVersion.slice(0, -2)
        } else {
          setter = stringBaseVersion.slice(0, -1)
        }
        const {formatVersion: lastFormatValue} = this.formatAmount(parseFloat(setter))
        this.priceAmount = lastFormatValue
        return
      }

      if (formatVersion) {
        this.priceAmount = formatVersion
      } else {
        this.priceAmount = null
      }
    },
    formatAmount(amount) {
      if (amount) {
        const {decimalSeparator, thousandSeparator} = this
        const splitAmount = splitString(amount)
        const getAllowSymbols = splitAmount.filter(peace => !!isSatisfyInput(peace))
        if (getAllowSymbols.length) {
          const removeExcessSymbol = removeExcessDotAndComma(getAllowSymbols, 'array')
          const {formatVersion, baseVersion} =
              formatByConfiguration(removeExcessSymbol, {
                decimalSeparator,
                thousandSeparator
              })
          return {
            formatVersion,
            baseVersion
          }
        }
      }

      return {
        formatVersion: '',
        baseVersion: ''
      }
    },
    extendEvent(eventName, eventObject) {
      const {baseVersion} = this.formatAmount(this.priceAmount)
      let amount = baseVersion
      if (amount) {
        amount = parseFloat(baseVersion)
      }
      this.$emit(eventName, amount, eventObject)
    },
    onBlurHandler(event) {
      this.extendEvent('blur', event)
    },
    onInputHandler(event) {
      if (this.sideEffect) {
        this.extendEvent('input', event)
      }
    },
    onFocusHandler(event) {
      this.sideEffect = true
      this.extendEvent('focus', event)
    }
  }
}
</script>

<style lang="scss" scoped>
.price-input-content {
  position: relative;
}

.top-placeholder {
  font-family: CraftworkSans, serif;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.6rem;
  font-weight: 700;
}

.price-input {
  border: none;
  background-color: transparent;

  &::placeholder {
    color: var(--gray-400);
  }
}

.delete-button {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  transition: transform ease-in-out;
}

.hide-content {
  visibility: hidden;
}

.show-content {
  color: var(--gray-400);
  visibility: visible;
  padding-top: 0.5rem;
  font-weight: 900;
}
</style>
