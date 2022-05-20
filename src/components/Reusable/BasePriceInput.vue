<template>
  <input
      type="text"
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
import accounting from "accounting-js";

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
    setValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  data() {
    return {
      priceAmount: null,
      placeholderFormat: null
    }
  },
  watch: {
    priceAmount(lastAmount) {
      this.formatPriceAmount(lastAmount)
    },
    value: {
      handler(last) {
        if (this.setValue) {
          this.priceAmount = last
        }
      },
      immediate: true
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
    splitString: (value) => value.toString().split(''),
    isDotSymbol: (symbol) => (symbol === '.'),
    isCommaSymbol: (symbol) => (symbol === ','),
    isNumberSymbol: (symbol) => !isNaN(parseInt(symbol)),
    isGapSymbol: (symbol) => (symbol === ' '),
    isSatisfySeparator(symbol) {
      return this.isGapSymbol(symbol) || this.isCommaSymbol(symbol) || this.isDotSymbol(symbol)
    },
    isSatisfyInput(symbol) {
      return this.isNumberSymbol(symbol) || this.isSatisfySeparator(symbol)
    },
    formatPriceAmount(value) {
      const {baseVersion, formatVersion} = this.formatAmount(value)
      if (formatVersion) {
        this.priceAmount = formatVersion
        this.emitInput(baseVersion)
      } else {
        this.emitInput(0)
      }
    },
    formatAmount(amount) {
      if (amount) {
        const splitAmount = this.splitString(amount)
        const getAllowSymbols = splitAmount.filter(peace => !!this.isSatisfyInput(peace))
        const removeExcessSymbol = this.removeExcessDotAndComma(getAllowSymbols, 'array')
        const {formatVersion, baseVersion} = this.formatByConfiguration(removeExcessSymbol)
        return {
          formatVersion,
          baseVersion
        }
      }

      return {
        formatVersion: '',
        baseVersion: ''
      }
    },
    emitInput(value) {
      this.$emit('input', value)
    },
    formatByConfiguration(array) {
      const {decimalSeparator, thousandSeparator} = this
      let thousandIndex = array.findIndex(value => this.isSatisfySeparator(value))
      let thousandValue = array[thousandIndex]
      let decimalIndex = array.findIndex((value) => {
        return value !== thousandValue && this.isSatisfySeparator(value)
      })

      if (decimalIndex === -1 && thousandSeparator !== thousandValue) {
        decimalIndex = thousandIndex
        thousandIndex = null
        thousandValue = thousandSeparator
      }

      const decimalValue = array[decimalIndex]
      if (decimalIndex !== -1) {
        let loopPackage = []
        for (let i = decimalIndex + 1; i < array.length; i++) {
          const loopValue = array[i]
          if (!(loopValue === decimalValue || loopValue === thousandValue)) {
            loopPackage.push(loopValue)
          }
        }
        const removeCount = array.length - decimalIndex + 1
        array.splice(decimalIndex + 1, removeCount, ...loopPackage)
      }

      let decimalSide = ''
      let thousandSide = ''
      if (decimalIndex !== -1) {
        decimalSide = array.slice(decimalIndex + 1).join('')
        thousandSide = array.slice(0, decimalIndex).join('').replaceAll(thousandValue, '')
        thousandSide.replace(' ', '')
      } else {
        thousandSide = array.slice(0).join('').replaceAll(thousandValue, '')
      }

      let result = accounting.formatNumber(thousandSide, {
        precision: 0,
        thousand: thousandSeparator,
        separator: decimalSeparator
      })

      if (decimalValue) {
        result += decimalSeparator
        if (decimalSide.length) {
          result += decimalSide.replace('.', '')
        }
      }

      return {
        formatVersion: result,
        baseVersion: thousandSide + '.' + decimalSide
      }
    },
    setInitialAmountValue() {
      if (this.value) {
        this.priceAmount = this.formatNumber(this.value)
      }
    },
    formatNumber(primitiveValue) {
      if (!primitiveValue) return
      const valueToString = primitiveValue.toString().split('')
      primitiveValue = this.removeExcessDotAndComma(valueToString)
      return primitiveValue
    },
    removeExcessDotAndComma(array, givenType = 'string') {
      const hasDotOrComma = array.some(arr => arr === '.' || arr === ',')
      if (!hasDotOrComma) {
        return array
      }

      const remover = (list) => {
        return list.filter((value, index) => {
          const previousArr = array.slice(index - 1, index)
          const isComma = value === ','
          const isDot = value === '.'
          if (isComma) {
            const hasBefore = previousArr.includes(value)
            return !hasBefore
          } else if (isDot) {
            const hasBefore = previousArr.includes(value)
            return !hasBefore
          }
          return true
        })
      }

      if (givenType === 'array') {
        return remover(array)
      }

      return remover(array).join('')
    },
    onBlurHandler() {

    },
    onInputHandler() {

    },
    onFocusHandler() {

    },
    onChangeHandler() {

    },
    setTriggerValue(value) {
      if (value) {
        // const {decimalSeparator, thousandSeparator} = this
        // const array = value.toString().split('')
        // const decimalIndex = array.findIndex(arr => arr === '.')
        // let decimalValue = ''
        // if (decimalIndex) {
        //   decimalValue = array.slice(decimalIndex + 1).join('')
        // }
        //
        // let thousandValue = array.slice(0, decimalIndex).join('')
        // let result = accounting.formatNumber(thousandValue, {
        //   precision: 0,
        //   thousand: thousandSeparator,
        //   separator: decimalSeparator
        // })
        //
        // if (decimalValue) {
        //   result += decimalSeparator + decimalValue
        // }
        let decimalValue = value % 1

        if (decimalValue > 0) {
          decimalValue = decimalValue.toString().slice(3)
          value += parseInt(decimalValue).toFixed(2).toString().slice(0, 2)
        }
        const {formatVersion} = this.formatAmount(value)
        const splitAmount = this.splitString(formatVersion)
        const decimalIndex = splitAmount.findIndex(arr => arr === this.decimalSeparator)
        if (decimalIndex !== -1) {
          const decimalValue = splitAmount.slice(decimalIndex + 1).join('').slice(0, 2)
          this.priceAmount = splitAmount.slice(0, decimalIndex + 1).join('') + decimalValue
        } else {
          this.priceAmount = formatVersion
        }
      } else {
        this.priceAmount = null
      }
    }
  }
}
</script>

<style scoped>

</style>