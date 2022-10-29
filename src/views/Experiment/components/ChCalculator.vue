<template>
  <div class="ch-calculator-wrapper">
    <!--? PAYMENT OPTION SELECT  -->
    <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${ $t('enter_discount') }`"
        class="cw-payment-option"
    >
      <k-form-select
          :bilingual="true"
          :error="!!errors[0]"
          :options="paymentOptions"
          :placeholder="$t('enter_discount')"
          value-field="id"
          v-model="paymentDetails.discount"
          @change="changeDiscount"
      />
    </validation-provider>

    <!--? INSTALLMENT PLAN  -->
    <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${ $t('installment') }`"
        class="cw-monthly-payment"
    >
      <k-form-input
          type="number"
          v-model="paymentDetails.monthly_payment_period"
          :label="true"
          :error="!!errors[0]"
          :placeholder="`${ $t('installment') }`"
          class="w-100"
          @input="updateMonthlyPaymentPeriod"
      />
    </validation-provider>

    <!--? PREPAYMENT  -->
    <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${ $t('prepayment') }`"
        class="cw-prepayment"
    >
      <k-form-input
          type="number"
          v-model="paymentDetails.prepay"
          :label="true"
          :error="!!errors[0]"
          :placeholder="`${ $t('prepayment') }`"
          class="w-100"
          @input="editPrepayHandler"
      />
    </validation-provider>

    <!--? INITIAL_FEE  -->
    <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${ $t('payments.initial_fee') }`"
        class="cw-initial-fee"
    >
      <k-form-input
          type="number"
          v-model="paymentDetails.initial_price"
          :label="true"
          :error="!!errors[0]"
          :placeholder="`${ $t('payments.initial_fee') }`"
          class="w-100"
          @input="editInitialPriceHandler"
      />
    </validation-provider>

    <!--? TOTAL_DISCOUNT  -->
    <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${ $t('total_discount') }`"
        class="cw-total-discount"
    >
      <k-form-input
          type="number"
          v-model="paymentDetails.total_discount"
          :label="true"
          :error="!!errors[0]"
          :placeholder="`${ $t('total_discount') }`"
          class="w-100"
          @input="addDiscount"
      />
    </validation-provider>

    <!--? DISCOUNT_PER_M2  -->
    <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${ $t('discount_per_m2') }`"
        class="cw-discount-per-m2"
    >
      <k-form-input
          type="number"
          v-model="paymentDetails.discount_per_m2"
          :label="true"
          :error="!!errors[0]"
          :placeholder="`${ $t('discount_per_m2') }`"
          class="w-100"
          @input="addDiscountEachSquare"
      />
    </validation-provider>

    <!--? FIRST_PAYMENT_DATE  -->
    <validation-provider
        :name="`${ $t('first_payment_date') }`"
        rules="required"
        v-slot="{ errors }"
        class="cw-first-payment-date"
    >
      <base-date-picker
          v-model="paymentDetails.first_payment_date"
          :range="false"
          :error="!!errors[0]"
          class="data-picker w-100"
          format="DD.MM.YYYY"
          :placeholder="`${ $t('first_payment_date') }`"
          :icon-fill="datePickerIconFill"
          @input="setFirstPaymentDate"
      />
    </validation-provider>

    <!--? MONTHLY_PAYMENT_DATE  -->
    <validation-provider
        :name="`${ $t('payment_date') }`"
        rules="required"
        v-slot="{ errors }"
        class="cw-monthly-payment-date"
    >
      <base-date-picker
          v-model="paymentDetails.payment_date"
          :range="false"
          :error="!!errors[0]"
          class="data-picker w-100"
          format="DD.MM.YYYY"
          :placeholder="`${ $t('payment_date') }`"
          :icon-fill="datePickerIconFill"
          @input="setMonthlyPaymentDate"
      />
    </validation-provider>
  </div>
</template>

<script>
import {hasChild} from "@/util/object";
import {makeProp as p} from "@/util/props";
import {numberFormatDecimal as fmd} from "@/util/numberHelper";
import {PROP_TYPE_OBJECT} from "@/constants/props";

import {KFormSelect} from "@/components/ui-components/form-select";
import {KFormInput} from "@/components/ui-components/form-input";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import {mapActions, mapGetters} from "vuex";


export default {
  name: "ChCalculator",
  components: {
    KFormSelect,
    KFormInput,
    BaseDatePicker
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, {})
  },
  data() {
    const {
      monthly_payment_period,
      discount,
      prepay,
      initial_price,
      total_discount,
      discount_per_m2,
      first_payment_date,
      payment_date
    } = this.apartment.calc

    return {
      datePickerIconFill: 'var(--violet-600)',
      paymentDetails: {
        monthly_payment_period,
        discount: discount.id,
        prepay,
        initial_price,
        total_discount,
        discount_per_m2,
        first_payment_date,
        payment_date
      }
    }
  },
  computed: {
    paymentOptions() {
      if (hasChild(this.apartment)) {
        const discounts = this.apartment.discounts.map((discount, index) => {
          let text = this.$t("apartments.view.variant")
          if (discount.type === 'promo') {
            text += this.$t('promo.by_promo')
          }
          text += ` ${index + 1} - ${discount.prepay}%`
          return {
            text,
            value: discount.id,
            ...discount,
          }
        })

        discounts.push({
          text: ' ' + this.$t('apartments.view.other_variant'),
          value: 'other',
          type: 'percent',
          currency: null,
          amount: 0,
          id: 'other',
          prepay: 30
        })
        return discounts
      }
      return []
    },
    ...mapGetters('Experiment', ['getApm'])
  },

  methods: {
    ...mapActions('Experiment', [
      'updateApmDiscount',
      'setMonthlyPaymentPeriod',
      'editPrepay',
      'editInitialPrice',
      'updateDiscount',
      'updateFirstPaymentDate',
      'updatePaymentDate'
    ]),
    getCalc() {
      return this.getApm({uuid: this.apartment.id}).calc
    },
    refreshFieldsValue() {
      const {
        monthly_payment_period,
        discount,
        prepay,
        initial_price,
        total_discount,
        discount_per_m2,
        first_payment_date,
        payment_date
      } = this.getCalc()

      this.paymentDetails = {
        monthly_payment_period,
        discount: discount.id,
        prepay,
        initial_price,
        total_discount,
        discount_per_m2,
        first_payment_date,
        payment_date
      }
    },
    changeDiscount(discountId) {
      const {calc, id: apmId} = this.apartment
      if (calc.discount.id !== discountId) {
        this.updateApmDiscount({
          apmId,
          discountId
        })
        this.refreshFieldsValue()
      }
    },
    updateMonthlyPaymentPeriod(monthly_payment_period) {
      if (this.getCalc().monthly_payment_period !== monthly_payment_period) {
        this.setMonthlyPaymentPeriod({
          apmId: this.apartment.id,
          monthly_payment_period
        })
        this.refreshFieldsValue()
      }
    },
    editPrepayHandler(prepay) {
      if (this.getCalc().prepay !== prepay) {
        this.editPrepay({
          apmId: this.apartment.id,
          prepay
        })
        this.refreshFieldsValue()
      }
    },
    editInitialPriceHandler(initial_price) {
      if (this.getCalc().initial_price !== initial_price) {
        this.editInitialPrice({
          apmId: this.apartment.id,
          initial_price
        })
        this.refreshFieldsValue()
      }
    },
    addDiscount(total_discount) {
      if (this.getCalc().total_discount !== total_discount) {
        const discount_per_m2 = fmd(total_discount / this.getCalc().plan.area)
        this.updateDiscountMtd({
          discount_per_m2,
          total_discount
        })
      }
    },
    addDiscountEachSquare(discount_per_m2) {
      if (this.getCalc().discount_per_m2 !== discount_per_m2) {
        const total_discount = fmd(discount_per_m2 * this.getCalc().plan.area)
        this.updateDiscountMtd({
          discount_per_m2,
          total_discount
        })
      }
    },
    updateDiscountMtd({total_discount, discount_per_m2}) {
      this.updateDiscount({
        apmId: this.apartment.id,
        discount_per_m2,
        total_discount
      })
      this.refreshFieldsValue()
    },
    setFirstPaymentDate(first_payment_date) {
      if (this.getCalc().first_payment_date !== first_payment_date) {
        this.updateFirstPaymentDate({
          apmId: this.apartment.id,
          first_payment_date
        })
      }
    },
    setMonthlyPaymentDate(payment_date) {
      if (this.getCalc().payment_date !== payment_date) {
        this.updatePaymentDate({
          apmId: this.apartment.id,
          payment_date
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ch-calculator-wrapper {
  display: grid;
  grid-template-areas:
    "cv-cell-1 cv-cell-1"
    "cv-cell-2 cv-cell-2"
    "cv-cell-3 cv-cell-4"
    "cv-cell-5 cv-cell-6"
    "cv-cell-7 cv-cell-7"
    "cv-cell-8 cv-cell-8";
  gap: 1rem;


  .cw-payment-option {
    grid-area: cv-cell-1;
  }

  .cw-monthly-payment {
    grid-area: cv-cell-2;
  }

  .cw-prepayment {
    grid-area: cv-cell-3;
  }

  .cw-initial-fee {
    grid-area: cv-cell-4;
  }

  .cw-total-discount {
    grid-area: cv-cell-5;
  }

  .cw-discount-per-m2 {
    grid-area: cv-cell-6;
  }

  .cw-first-payment-date {
    grid-area: cv-cell-7;
  }

  .cw-monthly-payment-date {
    grid-area: cv-cell-8;
  }
}
</style>