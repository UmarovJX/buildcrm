<template>
  <input
      type="text"
      ref="price-input"
      :placeholder="placeholderFormat"
      v-model="priceAmount"
      @blur="onBlurHandler"
      @input="onInputHandler"
      @focus="onFocusHandler"
  >
</template>

<script>
import {
  splitString,
  isSatisfyInput,
  formatByConfiguration,
  removeExcessDotAndComma,
} from "@/util/base-input";
import {isPrimitiveValue} from "@/util/reusable";

export default {
  name: "BasePriceInput",
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
    formatNumber(primitiveValue) {
      if (!primitiveValue) return
      const valueToString = primitiveValue.toString().split('')
      primitiveValue = this.removeExcessDotAndComma(valueToString)
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
        this.priceAmount = this.formatNumber(this.value)
      }
    },
    formatPriceAmount(value) {
      const {formatVersion} = this.formatAmount(value)
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
      this.$emit(eventName, baseVersion, eventObject)
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
