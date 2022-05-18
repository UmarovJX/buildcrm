<template>
  <input
      type="number"
      ref="price-input"
      :placeholder="placeholderFormat"
      v-model="priceAmount"
      @blur="onBlurHandler"
      @input="onInputHandler"
      @focus="onFocusHandler"
      @change="onChangeHandler"
  >
</template>

<script>
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
      default: ',',
      required: false
    },
    thousandSeparator: {
      default: undefined,
      required: false,
      type: String
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
    }
  },
  data() {
    return {
      priceAmount: null,
      placeholderFormat: null
    }
  },
  created() {
    this.initComponent()
  },
  methods: {
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
      if (this.value) {
        this.priceAmount = this.formatNumber(this.value)
      }
    },
    formatNumber(primitiveValue) {
      if (!primitiveValue) return
      /* types of value
      * 12,1111.22222
      * !!!! 234.2121 , .... qayta takrorlanish oldi olindi
      * 0.45,21212
      * 0,57.999
      * */
      const valueToString = primitiveValue.toString()
      primitiveValue = this.removeExcessDotAndComma(valueToString)
      return primitiveValue
    },
    formatToPrice(rawPrice, decimalCount = 0) {
      if (!rawPrice) return 0

      const dollarUSLocale = Intl.NumberFormat('en-US')
      const price = dollarUSLocale.format(parseInt(rawPrice))
      const result = price.toLocaleString().replace(/,/g, '  ')

      if (decimalCount) {
        const decimalValue = (rawPrice % 1).toFixed(decimalCount)
        if (decimalValue > 0) {
          return (result + decimalValue.slice(1)).replace('.', ',')
        }
      }

      return result
    },
    removeExcessDotAndComma(array) {
      const hasDotOrComma = array.some(arr => arr === '.' || arr === ',')
      if (!hasDotOrComma) {
        return array
      }

      const remover = (list) => {
        return list.filter((value, index) => {
          const previousArr = array.slice(0, index)
          const isDotOrComma = value === ',' || value === '.'
          if (isDotOrComma) {
            const hasBefore = previousArr.includes(value)
            return !hasBefore
          }
          return true
        })
      }

      if (typeof array === 'string') {
        const list = array.split('')
        return remover(list).join('')
      }

      return remover(array)
    },
    onBlurHandler() {

    },
    onInputHandler() {

    },
    onFocusHandler() {

    },
    onChangeHandler() {

    },
  }
}
</script>

<style scoped>

</style>