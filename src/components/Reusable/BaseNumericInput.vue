<script>
import accounting from "accounting-js";
import { isEmptyString, isNotUndefinedNullEmptyZero } from "@/util/inspect";

export default {
  name: "VueNumeric",

  props: {
    /**
     * Currency symbol.
     */
    currency: {
      type: String,
      default: "",
      required: false,
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

    /**
     * Enable/Disable minus value.
     */
    minus: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Input placeholder.
     */
    placeholder: {
      type: String,
      default: "",
      required: false,
    },

    /**
     * Value when the input is empty
     */
    emptyValue: {
      type: [Number, String],
      default: "",
      required: false,
    },

    /**
     * Number of decimals.
     * Decimals symbol are the opposite of separator symbol.
     */
    precision: {
      type: Number,
      default: 0,
      required: false,
    },

    /**
     * Thousand separator type.
     * Separator props accept either . or , (default).
     */
    separator: {
      type: String,
      default: ",",
      required: false,
    },

    /**
     * Forced thousand separator.
     * Accepts any string.
     */
    thousandSeparator: {
      default: undefined,
      required: false,
      type: String,
    },

    /**
     * Forced decimal separator.
     * Accepts any string.
     */
    decimalSeparator: {
      default: undefined,
      required: false,
      type: String,
    },

    /**
     * The output type used for v-model.
     * It can either be String or Number (default).
     */
    outputType: {
      required: false,
      type: String,
      default: "Number",
    },

    /**
     * v-model value.
     */
    value: {
      type: [Number, String],
      default: null,
      required: false,
    },

    /**
     * Hide input and show value in text only.
     */
    readOnly: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Class for the span tag when readOnly props is true.
     */
    readOnlyClass: {
      type: String,
      default: "",
      required: false,
    },

    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },

    /**
     * Position of currency symbol
     * Symbol position props accept either 'suffix' or 'prefix' (default).
     */
    currencySymbolPosition: {
      type: String,
      default: "prefix",
      required: false,
    },

    fieldStyle: {
      type: Object,
      default: () => ({}),
    },

    currencySymbol: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    amount: "",
    startTyping: false,
  }),

  computed: {
    locale() {
      return this.$i18n.locale;
    },
    /**
     * Number type of formatted value.
     * @return {Number}
     */
    amountNumber() {
      return this.unformat(this.amount);
    },

    /**
     * Number type of value props.
     * @return {Number}
     */
    valueNumber() {
      return this.unformat(this.value);
    },

    /**
     * Define decimal separator based on separator props.
     * @return {String} '.' or ','
     */
    decimalSeparatorSymbol() {
      if (typeof this.decimalSeparator !== "undefined")
        return this.decimalSeparator;
      if (this.separator === ",") return ".";
      return ",";
    },

    /**
     * Define thousand separator based on separator props.
     * @return {String} '.' or ','
     */
    thousandSeparatorSymbol() {
      if (typeof this.thousandSeparator !== "undefined")
        return this.thousandSeparator;
      if (this.separator === ".") return ".";
      if (this.separator === "space") return " ";
      return ",";
    },

    /**
     * Define format position for currency symbol and value.
     * @return {String} format
     */
    symbolPosition() {
      if (!this.currency) return "%v";
      return this.currencySymbolPosition === "suffix" ? "%v %s" : "%s %v";
    },
  },

  watch: {
    locale() {
      this.amount = this.format(this.valueNumber);
    },
    amount() {
      this.startTyping && this.formatAmount();
    },
    /**
     * Watch for value change from other input with same v-model.
     * @param {Number} newValue
     */
    valueNumber(newValue) {
      if (newValue === 0) {
        this.amount = this.format(0);
      } else if (this.$refs.numeric !== document.activeElement) {
        this.amount = this.format(newValue);
      }
    },

    /**
     * When readOnly is true, replace the span tag class.
     * @param {Boolean} newValue
     * @param {Boolean} oldValue
     */
    readOnly(newValue, oldValue) {
      if (oldValue === false && newValue === true) {
        this.$nextTick(() => {
          this.$refs.readOnly.className = this.readOnlyClass;
        });
      }
    },

    /**
     * Immediately reflect separator changes
     */
    separator() {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);
    },

    /**
     * Immediately reflect currency changes
     */
    currency() {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);
    },

    /**
     * Immediately reflect precision changes
     */
    precision() {
      this.process(this.valueNumber);
      this.amount = this.format(this.valueNumber);
    },
  },

  mounted() {
    // Set default value props when valueNumber has some value
    if (this.valueNumber || this.isDeliberatelyZero()) {
      this.process(this.valueNumber);
      if (parseFloat(this.format(this.valueNumber))) {
        this.amount = this.format(this.valueNumber);
      } else {
        this.amount = this.format(0);
      }

      // In case of delayed props value.
      // setTimeout(() => {
      //   this.process(this.valueNumber)
      //   this.amount = this.format(this.valueNumber)
      // }, 500)
    }

    // Set read-only span element's class
    if (this.readOnly) this.$refs.readOnly.className = this.readOnlyClass;
  },

  methods: {
    formatAmount() {
      let newValue = this.amount;

      if (typeof this.amount === "string") {
        newValue = this.amount?.replace(".", ",");
      }
      // console.log(newValue, 'amount');
      // if(typeof this.amount === 'float')
      const findDecimalSeparator = newValue?.indexOf(",");
      const unFormatValue = accounting.unformat(
        newValue,
        this.decimalSeparatorSymbol
      );
      let formattingValue = this.formatWithoutSeparator(unFormatValue)?.slice(
        0,
        -1
      );
      if (findDecimalSeparator !== -1 && newValue) {
        let decimalSide = newValue?.slice(findDecimalSeparator);
        let wholeSide = newValue?.slice(0, findDecimalSeparator);
        const unFormatWholeSide = accounting.unformat(wholeSide);
        if (decimalSide.length > 1) {
          const lastValueOfDecimalSide = parseInt(
            decimalSide[decimalSide.length - 1]
          );
          if (
            isNaN(lastValueOfDecimalSide) ||
            typeof lastValueOfDecimalSide !== "number"
          ) {
            decimalSide = decimalSide.slice(0, -1);
          }
        }

        const dotRegex = /,/gi;
        const matchDots = decimalSide.match(dotRegex);
        if (matchDots.length > 1) {
          decimalSide = decimalSide.slice(0, -1);
        }
        // console.log(this.formatWithoutSeparator(unFormatWholeSide).slice(0, -1), 'his.formatWithoutSeparator(unFormatWholeSide).slice(0, -1)');
        // console.log(decimalSide, 'decimalSide');
        // formattingValue = this.formatWithoutSeparator(unFormatWholeSide).slice(0, -1) + decimalSide
        formattingValue =
          this.formatWithoutSeparator(unFormatWholeSide).slice(0, -1) +
          decimalSide;
      }

      if (newValue !== formattingValue) {
        if (formattingValue === "0") {
          this.amount = null;
        } else {
          if (this.unformat(this.amount) === 0) {
            this.amount = "";
          } else {
            this.amount = formattingValue.replace(".", ",");
          }
        }
      }
    },

    /**
     * Handle change event.
     * @param {Object} e
     */
    onChangeHandler(e) {
      this.$emit("change", e);
    },
    /**
     * Handle blur event.
     * @param {Object} e
     */
    onBlurHandler(e) {
      this.$emit("blur", e);
      this.startTyping = false;
      const unFormatAmount = this.unformat(this.amount);
      if (parseInt(this.format(unFormatAmount)) === 0) {
        this.amount = this.format(0);
      } else {
        this.amount = this.format(unFormatAmount).toString().trim();
      }
    },

    /**
     * Handle focus event.
     * @param {Object} e
     */
    onFocusHandler(e) {
      this.$emit("focus", e);
      this.startTyping = true;
      const usd = `${this.$t("usd")}`;
      const ye = `${this.$t("ye")}`;
      const currency = `${this.currency}`;

      if (!this.amount) return;

      const symbolCurrencyIndex = this.amount.indexOf(currency);
      if (
        symbolCurrencyIndex !== -1 &&
        !isEmptyString(this.currency.trim()) &&
        isNotUndefinedNullEmptyZero(this.amount)
      ) {
        this.amount = this.amount.slice(0, symbolCurrencyIndex);
      }

      const symbolUsdIndex = this.amount.indexOf(usd);
      if (symbolUsdIndex !== -1) {
        this.amount = this.amount.slice(0, symbolUsdIndex);
      }

      const symbolSumIndex = this.amount.indexOf(ye);
      if (symbolSumIndex !== -1) {
        this.amount = this.amount.slice(0, symbolSumIndex);
      }

      this.amount = this.amount.toString().trim();
    },

    /**
     * Handle input event.
     */
    onInputHandler() {
      // const output = this.unformat(this.amount)
      // const beforeNext = parseInt(((output - output % 10) / 10).toFixed(2))
      // if (output > this.max) {
      //   const k = parseFloat((this.unformat(beforeNext)).toFixed(2))
      //   this.amount = this.format(k)
      // }
      //
      // this.$emit('input', this.unformat(this.amount))

      const output = this.unformat(this.amount);
      const beforeNext = (output - (output % 10)) / 10;
      if (output > this.max) {
        this.amount = this.format(beforeNext);
      }

      this.$emit("input", this.unformat(this.amount));
    },

    /**
     * Validate value before update the component.
     * @param {Number} value
     */
    process(value) {
      if (value >= this.max) this.update(this.max);
      if (value <= this.min) this.update(this.min);
      if (value > this.min && value < this.max) this.update(value);
      if (!this.minus && value < 0)
        this.min >= 0 ? this.update(this.min) : this.update(0);
    },

    /**
     * Update parent component model value.
     * @param {Number} value
     */
    update(value) {
      const fixedValue = accounting.toFixed(value, this.precision);
      const output =
        this.outputType.toLowerCase() === "string"
          ? fixedValue
          : Number(fixedValue);
      this.$emit("input", output);
    },

    /**
     * Format value using symbol and separator.
     * @param {Number} value
     * @return {String}
     */
    format(value) {
      let symbol;

      if (isEmptyString(this.currency.trim()) && this.currencySymbol) {
        symbol = this.$t("ye");
      } else {
        symbol = this.currency;
      }
      return accounting.formatMoney(value, {
        symbol,
        format: this.symbolPosition,
        precision: Number(this.precision),
        decimal: this.decimalSeparatorSymbol,
        thousand: this.thousandSeparatorSymbol,
      });
    },

    formatWithoutSeparator(value) {
      return accounting.formatMoney(value, {
        symbol: "",
        format: this.symbolPosition,
        precision: 0,
        decimal: this.decimalSeparatorSymbol,
        thousand: this.thousandSeparatorSymbol,
      });
    },

    formatDecimalSide(value) {
      return accounting.formatMoney(value, {
        symbol: this.currency,
        format: this.symbolPosition,
        precision: 0,
        decimal: 0,
        thousand: 0,
      });
    },

    /**
     * Remove symbol and separator.
     * @param {Number} value
     * @return {Number}
     */
    unformat(value) {
      const toUnformat =
        typeof value === "string" && value === "" ? this.emptyValue : value;
      return accounting.unformat(toUnformat, this.decimalSeparatorSymbol);
    },

    /**
     * Check if value was deliberately set to zero and not just evaluated
     * @return {boolean}
     */
    isDeliberatelyZero() {
      return this.valueNumber === 0 && this.value !== "";
    },

    setVModalValue(value) {
      this.amount = value;
      this.formatAmount();
    },
  },
};
</script>

<template>
  <input
    v-if="!readOnly"
    v-model="amount"
    type="text"
    ref="numeric"
    :style="fieldStyle"
    :disabled="disabled"
    :placeholder="placeholder"
    @blur="onBlurHandler"
    @input="onInputHandler"
    @focus="onFocusHandler"
    @change="onChangeHandler"
  />
  <span v-else ref="readOnly">{{ amount }}</span>
</template>
