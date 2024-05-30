<script>
import { hasChild } from "@/util/object";
import { makeProp as p } from "@/util/props";
import { numberFormatDecimal as fmd } from "@/util/numberHelper";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { PROP_TYPE_OBJECT } from "@/constants/props";

import { XFormSelect } from "@/components/ui-components/form-select";
import { XFormInput } from "@/components/ui-components/form-input";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import {
  fullPrice,
  currentInstallmentObj,
  basePrice,
  fullPayment,
  prepayAmount,
} from "@/views/checkoutV3/helper/calculator.js";
export default {
  name: "ChCalculator",
  components: {
    XFormSelect,
    XFormInput,
    BaseDatePicker,
  },
  props: {
    order: p(PROP_TYPE_OBJECT, {}),
  },
  emits: ["set-v-flags"],
  data() {
    return {
      datePickerIconFill: "var(--violet-600)",
      calcRef: `ch-calculator-${this.order.apartment.uuid}`,
    };
  },
  computed: {
    prepayAmount: {
      get: prepayAmount,
      set(v) {
        if (this.order.calculation.type === "installment") {
          return this.emitCalc(
            "prepay",
            +(
              (v * 100) /
              (this.order.apartment.plan.area * this.discount.amount -
                this.order.calculation.discount_amount)
            ).toFixed(2)
          );
        }
        const val = v > this.fullPayment ? this.fullPayment : v;
        this.emitCalc("prepay", +((val / this.fullPayment) * 100).toFixed(2));
      },
    },
    otherM2Price: {
      get() {
        return this.order.calculation.price / this.order.apartment.plan.area;
      },
      set(v) {
        this.emitCalc("price", v * this.order.apartment.plan.area);
      },
    },

    m2Discount: {
      get() {
        return (
          this.order.calculation.discount_amount /
          this.order.apartment.plan.area
        );
      },
      set(v) {
        this.emitCalc(
          "discount_amount",
          +(v * this.order.apartment.plan.area).toFixed(2)
        );
      },
    },
    fullPrice,
    currentInstallmentObj,
    basePrice,
    fullPayment,
    discount() {
      return this.paymentOptions.find(
        (el) => el.id === this.order.calculation.discount
      );
    },
    paymentOptions() {
      if (this.order.apartment.discounts) {
        const discounts = this.order.apartment.discounts.map(
          (discount, index) => {
            let text = this.$t("apartments.view.variant");
            if (discount.type === "promo") {
              text += ` ${this.$t("promo.by_promo")}`;
            }
            text += `  ${index + 1} - ${discount.prepay}%`;
            return {
              text,
              value: discount.id,
              ...discount,
            };
          }
        );
        if (this.order.calculation.type === "installment") {
          return discounts.filter((el) => el.type !== "percent");
        } else {
          discounts.push({
            text: ` ${this.$t("apartments.view.other_variant")}`,
            value: "other",
            type: "percent",
            currency: null,
            amount: 0,
            id: "other",
            prepay: 30,
          });
          return discounts;
        }
      }
      return [];
    },
    installmentOptions() {
      return this.order.calculation.installments.map((el) => ({
        value: el.id,
        text: el.months + " " + this.$t("months"),
      }));
    },
    typeOptions() {
      return [
        {
          text: this.$t("flexible"),
          value: "custom",
        },
        {
          text: this.$t("tariff"),
          value: "installment",
        },
      ];
    },
  },
  watch: {},
  methods: {
    // NEW
    emitCalc(field, v) {
      this.$emit("update-calc", {
        uuid: this.order.uuid,
        field: field,
        value: v,
      });
    },
    // NEW
    async checkValidation() {
      await this.validate().then(() => {
        this.updateValidationState({
          apmId: this.apartment.id,
          validate: this.getValidationFlags(),
        });
        this.$emit("set-v-flags", this.getValidationFlags());
      });
    },
    async validate() {
      return await this.$refs[this.calcRef].validate();
    },
    getValidationFlags() {
      return this.$refs[this.calcRef].flags;
    },
  },
};
</script>

<template>
  <validation-observer :ref="calcRef" tag="div" class="ch-calculator-wrapper">
    <!--? PAYMENT Type SELECT  -->
    <validation-provider
      v-slot="{ errors }"
      rules="required"
      :name="`${$t('enter_discount')}`"
      class="cw-payment-option full"
    >
      <x-form-select
        :value="order.calculation.type"
        :error="!!errors[0]"
        :options="typeOptions"
        :placeholder="$t('plan_type')"
        value-field="value"
        @change="(e) => emitCalc('type', e)"
      />
    </validation-provider>
    <!--? PAYMENT DISCOUNT SELECT  -->
    <validation-provider
      v-if="paymentOptions.length"
      v-slot="{ errors }"
      rules="required"
      :name="`${$t('enter_discount')}`"
      class="cw-payment-option full"
    >
      <x-form-select
        :value="order.calculation.discount"
        :bilingual="true"
        :error="!!errors[0]"
        :options="paymentOptions"
        :placeholder="$t('enter_discount')"
        value-field="id"
        @change="
          (e) =>
            emitCalc(
              'discount',
              paymentOptions.find((el) => el.id === e)
            )
        "
      />
    </validation-provider>

    <!-- Months -->
    <validation-provider
      v-if="order.calculation.type === 'custom'"
      v-slot="{ errors }"
      :rules="
        order.calculation.prepay < 100
          ? 'required|min_value:1'
          : 'required|min_value:0'
      "
      :name="`${$t('installment')}`"
      class="cw-monthly-payment full"
    >
      <x-form-input
        :value="order.calculation.months"
        type="number"
        :currency="`${$t('month_lowercase')}`"
        :label="true"
        :max="360"
        :error="!!errors[0]"
        :placeholder="`${$t('installment')}`"
        class="w-100"
        autocomplete="off"
        @input="(e) => emitCalc('months', e)"
      />
    </validation-provider>
    <!-- FOR INSTALLMENTS -->
    <validation-provider
      v-else
      v-slot="{ errors }"
      rules="required"
      :name="`${$t('enter_discount')}`"
      class="cw-payment-option full"
    >
      <x-form-select
        :value="order.calculation.currentInstallment"
        :error="!!errors[0]"
        :options="installmentOptions"
        :placeholder="$t('installment months')"
        value-field="value"
        @change="(e) => emitCalc('currentInstallment', e)"
      />
    </validation-provider>

    <!--? PREPAYMENT  -->
    <validation-provider
      v-slot="{ errors }"
      rules="required|min_value:0"
      :name="`${$t('prepayment')}`"
      class="cw-prepayment"
    >
      <x-form-input
        :value="order.calculation.prepay"
        type="number"
        currency="%"
        :precision="2"
        :label="true"
        :max="100"
        :error="!!errors[0]"
        :placeholder="`${$t('prepayment')}`"
        class="w-100"
        @input="(e) => emitCalc('prepay', e)"
        :readonly="order.calculation.type === 'installment'"
      />
    </validation-provider>

    <!--? INITIAL_FEE  -->
    <validation-provider
      v-slot="{ errors }"
      rules="required|min_value:0"
      :name="`${$t('payments.initial_fee')}`"
      class="cw-initial-fee"
    >
      <x-form-input
        v-model="prepayAmount"
        type="number"
        :currency-symbol="true"
        :label="true"
        :precision="2"
        :error="!!errors[0]"
        :placeholder="`${$t('payments.initial_fee')}`"
        class="w-100"
        :readonly="order.calculation.type === 'installment'"
      />
    </validation-provider>

    <!--! START OF ANOTHER PRICE FIELDS -->
    <!--? STARTING PRICE  -->
    <validation-provider
      v-if="order.calculation.discount === 'other'"
      v-slot="{ errors }"
      rules="required|min_value:0"
      :name="`${$t('starting_price')}`"
      class="cw-starting-price"
    >
      <x-form-input
        :value="order.calculation.price"
        type="number"
        :label="true"
        :precision="2"
        :currency-symbol="true"
        :error="!!errors[0]"
        :placeholder="`${$t('starting_price')}`"
        class="w-100"
        @input="(e) => emitCalc('price', e)"
      />
    </validation-provider>

    <!--? PRICE PER M2 -->
    <validation-provider
      v-if="order.calculation.discount === 'other'"
      v-slot="{ errors }"
      rules="required|min_value:0"
      :name="`${$t('price_m2')}`"
      class="cw-price-m2"
    >
      <x-form-input
        v-model="otherM2Price"
        type="number"
        :currency-symbol="true"
        :label="true"
        :precision="2"
        :error="!!errors[0]"
        :placeholder="`${$t('price_m2')}`"
        class="w-100"
        @input="updateIndividualPrice('price_m2')"
        @focus="focusOnFieldHandler('price_m2')"
      />
    </validation-provider>
    <!--! END OF ANOTHER PRICE FIELDS -->

    <!--? TOTAL_DISCOUNT  -->
    <validation-provider
      v-slot="{ errors }"
      :name="`${$t('total_discount')}`"
      class="cw-total-discount"
    >
      <x-form-input
        :value="order.calculation.discount_amount"
        type="number"
        :currency-symbol="true"
        :label="true"
        :precision="2"
        :error="!!errors[0]"
        class="w-100"
        :placeholder="`${$t('total_discount')}`"
        @input="(e) => emitCalc('discount_amount', e)"
      />
    </validation-provider>

    <!--? DISCOUNT_PER_M2  -->
    <validation-provider
      v-slot="{ errors }"
      :name="`${$t('discount_per_m2')}`"
      class="cw-discount-per-m2"
    >
      <x-form-input
        v-model="m2Discount"
        type="number"
        :currency-symbol="true"
        :label="true"
        :precision="2"
        :error="!!errors[0]"
        class="w-100"
        :placeholder="`${$t('discount_per_m2')}`"
      />
    </validation-provider>

    <!--? FIRST_PAYMENT_DATE  -->
    <validation-provider
      v-slot="{ errors }"
      :name="`${$t('first_payment_date')}`"
      rules="required"
      class="cw-first-payment-date full"
    >
      <base-date-picker
        :value="order.calculation.first_payment_date"
        :range="false"
        :error="!!errors[0]"
        class="data-picker w-100"
        format="DD.MM.YYYY"
        :placeholder="`${$t('first_payment_date')}`"
        :icon-fill="datePickerIconFill"
        @input="(e) => emitCalc('first_payment_date', e)"
      />
    </validation-provider>

    <!--? MONTHLY_PAYMENT_DATE  -->
    <validation-provider
      v-slot="{ errors }"
      :name="`${$t('payment_date')}`"
      rules="required"
      class="cw-monthly-payment-date full"
    >
      <base-date-picker
        :value="order.calculation.monthly_payment_date"
        :range="false"
        :error="!!errors[0]"
        class="data-picker w-100"
        format="DD.MM.YYYY"
        :placeholder="`${$t('payment_date')}`"
        :icon-fill="datePickerIconFill"
        @input="(e) => emitCalc('monthly_payment_date', e)"
      />
    </validation-provider>
  </validation-observer>
</template>

<style lang="scss" scoped>
.ch-calculator-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  row-gap: 10px;
}
.full {
  grid-column: span 2;
}
</style>
