<script>
import { hasChild } from "@/util/object";
import { makeProp as p } from "@/util/props";
import { numberFormatDecimal as fmd } from "@/util/numberHelper";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { PROP_TYPE_OBJECT } from "@/constants/props";

import { XFormSelect } from "@/components/ui-components/form-select";
import { XFormInput } from "@/components/ui-components/form-input";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";

export default {
  name: "ChCalculator",
  components: {
    XFormSelect,
    XFormInput,
    BaseDatePicker,
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, {}),
  },
  emits: ["set-v-flags"],
  data() {
    const {
      monthly_payment_period,
      discount,
      prepay,
      initial_price,
      total_discount,
      discount_per_m2,
      first_payment_date,
      payment_date,
      other,
    } = this.apartment.calc;

    return {
      datePickerIconFill: "var(--violet-600)",
      calcRef: "ch-calculator-" + this.apartment.id,
      paymentDetails: {
        monthly_payment_period,
        discount: discount.id,
        prepay,
        initial_price,
        total_discount,
        discount_per_m2,
        first_payment_date,
        payment_date,
        price_m2: other.price_m2,
        starting_price: other.starting_price,
      },
    };
  },
  computed: {
    ...mapGetters("ParkingCheckout", [
      "getApm",
      "apartmentArea",
      "findApmIdx",
      "gtsEditFirstAttempt",
      "getPrice",
      "apartmentArea",
    ]),
    paymentOptions() {
      if (hasChild(this.apartment)) {
        const discounts = this.apartment.discounts.map((discount, index) => {
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
        });

        discounts.push({
          text: " " + this.$t("apartments.view.other_variant"),
          value: "other",
          type: "percent",
          currency: null,
          amount: 0,
          id: "other",
          prepay: 30,
        });
        return discounts;
      }
      return [];
    },
    showAnotherPriceFields() {
      return this.paymentDetails.discount === "other";
    },
    allowToShowPrepay() {
      // return this.paymentDetails.prepay !== 0
      return true;
    },
    allowToShowInitialPrice() {
      // return this.paymentDetails.prepay !== 0
      return true;
    },
    allowToShowFullPayment() {
      // return this.paymentDetails.prepay === 100;
      return false;
    },
    disableInitialPrice() {
      return this.paymentDetails.prepay === 100;
    },
    maxTotalDiscountAmount() {
      const idx = this.findApmIdx(this.apartment.id);
      return this.getPrice(idx);
    },
    maxDiscountEachSquare() {
      const idx = this.findApmIdx(this.apartment.id);
      return this.maxTotalDiscountAmount / this.apartmentArea(idx);
    },
  },
  watch: {
    "apartment.calc.monthly_payment_period": {
      handler(mthPymPeriod) {
        if (this.paymentDetails.monthly_payment_period !== mthPymPeriod) {
          this.paymentDetails.monthly_payment_period = mthPymPeriod;
        }
      },
      immediate: false,
    },
    paymentDetails: {
      handler() {
        this.checkValidation();
      },
      deep: true,
      immediate: false,
    },
  },
  methods: {
    ...mapActions("ParkingCheckout", [
      "updateApmDiscount",
      "setMonthlyPaymentPeriod",
      "editPrepay",
      "editInitialPrice",
      "updateDiscount",
      "updateFirstPaymentDate",
      "updatePaymentDate",
      "setIndividualPrice",
      "updateValidationState",
      "changeFirstAttempt",
      "turnInitialEditStateOn",
      "turnInitialEditStateOff",
    ]),
    ...mapMutations("ParkingCheckout", ["updateApartment"]),
    focusTotalDiscount() {
      this.focusOnFieldHandler("total_discount");
      this.disableInitialForChange();
    },
    focusDiscountEachSquare() {
      this.focusOnFieldHandler("discount_per_m2");
      this.disableInitialForChange();
    },
    blurTotalDiscount() {
      this.changeEditForInitial();
    },
    blurDiscountEachSquare() {
      this.changeEditForInitial();
    },
    disableInitialForChange() {
      this.updateApartment({
        idx: this.findApmIdx(this.apartment.id),
        edit: {
          initial_price: true,
          prepay: true,
        },
      });
    },
    changeEditForInitial() {
      this.updateApartment({
        idx: this.findApmIdx(this.apartment.id),
        edit: {
          initial_price: false,
          prepay: false,
        },
      });
    },
    focusOnFieldHandler() {
      this.changeFirstAttempt({
        apmId: this.apartment.id,
        firstAttempt: false,
      });
    },
    getCalc() {
      return this.getApm({ uuid: this.apartment.id }).calc;
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
        payment_date,
        other,
      } = this.getCalc();

      this.paymentDetails = {
        monthly_payment_period,
        discount: discount.id,
        prepay,
        initial_price,
        total_discount,
        discount_per_m2,
        first_payment_date,
        payment_date,
        price_m2: other.price_m2,
        starting_price: other.starting_price,
      };
    },
    changeDiscount(discountId) {
      const { calc, id: apmId } = this.apartment;
      if (calc.discount.id !== discountId) {
        this.changeFirstAttempt({
          apmId,
          firstAttempt: false,
        });

        this.updateApmDiscount({
          apmId,
          discountId,
        });
        this.refreshFieldsValue();
      }
    },
    updateMonthlyPaymentPeriod(monthly_payment_period) {
      if (this.gtsEditFirstAttempt) {
        return;
      }
      const m = monthly_payment_period.toString().trim();
      // const lts = this.getCalc().monthly_payment_period.toString().trim();
      // if (m !== lts && m !== "") {
      this.setMonthlyPaymentPeriod({
        apmId: this.apartment.id,
        monthly_payment_period: parseInt(m),
      });
      this.refreshFieldsValue();
      // }
    },
    editPrepayHandler(prepay) {
      if (this.gtsEditFirstAttempt) {
        return;
      }

      if (this.getCalc().prepay !== prepay) {
        this.turnInitialEditStateOff({
          apmId: this.apartment.id,
        });
        this.editPrepay({
          apmId: this.apartment.id,
          prepay,
        });
        this.refreshFieldsValue();
      }
    },
    editInitialPriceHandler(initial_price) {
      if (this.gtsEditFirstAttempt) {
        return;
      }

      this.turnInitialEditStateOn({
        apmId: this.apartment.id,
      });

      if (this.getCalc().initial_price !== initial_price) {
        this.editInitialPrice({
          apmId: this.apartment.id,
          initial_price,
        });
        this.refreshFieldsValue();
      }
    },
    addDiscount(total_discount) {
      if (this.gtsEditFirstAttempt) {
        return;
      }
      if (this.getCalc().total_discount !== total_discount) {
        // const discount_per_m2 = fmd(total_discount / this.getCalc().plan.area);
        this.updateDiscountMtd({
          discount_per_m2: total_discount,
          total_discount,
        });
      }
    },
    addDiscountEachSquare(discount_per_m2) {
      if (this.gtsEditFirstAttempt) {
        return;
      }
      if (this.getCalc().discount_per_m2 !== discount_per_m2) {
        // const total_discount = fmd(discount_per_m2 * this.getCalc().plan.area);
        this.updateDiscountMtd({
          discount_per_m2,
          total_discount: discount_per_m2,
        });
      }
    },
    updateDiscountMtd({ total_discount, discount_per_m2 }) {
      this.updateDiscount({
        apmId: this.apartment.id,
        discount_per_m2,
        total_discount,
      });
      this.refreshFieldsValue();
    },
    setFirstPaymentDate(first_payment_date) {
      if (this.getCalc().first_payment_date !== first_payment_date) {
        this.updateFirstPaymentDate({
          apmId: this.apartment.id,
          first_payment_date,
        });
      }
    },
    setMonthlyPaymentDate(payment_date) {
      if (this.getCalc().payment_date !== payment_date) {
        this.updatePaymentDate({
          apmId: this.apartment.id,
          payment_date,
        });
      }
    },
    updateIndividualPrice(from = "starting_price") {
      if (this.gtsEditFirstAttempt) {
        return;
      }
      const index = this.findApmIdx(this.apartment.id);
      const { price_m2, starting_price } = this.paymentDetails;
      if (from === "price_m2") {
        if (this.apartment.price_m2 !== price_m2) {
          this.setIndividualPrice({
            index,
            price_m2,
            starting_price: fmd(price_m2 * this.apartmentArea(index)),
          });
        }
      } else {
        if (this.apartment.price !== starting_price) {
          this.setIndividualPrice({
            index,
            price_m2: fmd(starting_price / this.apartmentArea(index)),
            starting_price,
          });
        }
      }
      this.refreshFieldsValue();
    },
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
  <validation-observer
    tag="div"
    :ref="calcRef"
    class="ch-calculator-wrapper"
    :class="{
      'ch-another-price-content': showAnotherPriceFields,
    }"
  >
    <!--? PAYMENT OPTION SELECT  -->
    <validation-provider
      v-if="paymentOptions.length"
      v-slot="{ errors }"
      rules="required"
      :name="`${$t('enter_discount')}`"
      class="cw-payment-option"
    >
      <x-form-select
        :bilingual="true"
        :error="!!errors[0]"
        :options="paymentOptions"
        :placeholder="$t('enter_discount')"
        value-field="id"
        v-model="paymentDetails.discount"
        @change="changeDiscount"
      />
    </validation-provider>

    <!--! START OF ANOTHER PRICE FIELDS -->
    <!--? STARTING PRICE  -->
    <validation-provider
      v-if="showAnotherPriceFields"
      v-slot="{ errors }"
      rules="required|min_value:0"
      :name="`${$t('starting_price')}`"
      class="cw-starting-price"
    >
      <x-form-input
        type="number"
        v-model="paymentDetails.starting_price"
        :label="true"
        :precision="2"
        :currency-symbol="true"
        :error="!!errors[0]"
        :placeholder="`${$t('starting_price')}`"
        class="w-100"
        @input="updateIndividualPrice('starting_price')"
        @focus="focusOnFieldHandler('starting_price')"
      />
    </validation-provider>

    <!--? PRICE PER M2 -->
    <!--    <validation-provider-->
    <!--      v-if="showAnotherPriceFields"-->
    <!--      v-slot="{ errors }"-->
    <!--      rules="required|min_value:0"-->
    <!--      :name="`${$t('price_m2')}`"-->
    <!--      class="cw-price-m2"-->
    <!--    >-->
    <!--      <x-form-input-->
    <!--        type="number"-->
    <!--        v-model="paymentDetails.price_m2"-->
    <!--        :currency-symbol="true"-->
    <!--        :label="true"-->
    <!--        :precision="2"-->
    <!--        :error="!!errors[0]"-->
    <!--        :placeholder="`${$t('price_m2')}`"-->
    <!--        class="w-100"-->
    <!--        @input="updateIndividualPrice('price_m2')"-->
    <!--        @focus="focusOnFieldHandler('price_m2')"-->
    <!--      />-->
    <!--    </validation-provider>-->
    <!--! END OF ANOTHER PRICE FIELDS -->

    <!--? INSTALLMENT PLAN  -->
    <validation-provider
      v-slot="{ errors }"
      :rules="
        paymentDetails.prepay < 100
          ? 'required|min_value:1'
          : 'required|min_value:0'
      "
      :name="`${$t('installment')}`"
      class="cw-monthly-payment"
    >
      <x-form-input
        type="number"
        v-model="paymentDetails.monthly_payment_period"
        :currency="`${$t('month_lowercase')}`"
        :label="true"
        :max="360"
        :error="!!errors[0]"
        :placeholder="`${$t('installment')}`"
        :disable="allowToShowFullPayment"
        class="w-100"
        autocomplete="off"
        @input="updateMonthlyPaymentPeriod"
        @focus="focusOnFieldHandler('monthly_payment_period')"
      />
    </validation-provider>

    <!--? PREPAYMENT  -->
    <validation-provider
      v-if="allowToShowPrepay"
      v-slot="{ errors }"
      rules="required|min_value:0"
      :name="`${$t('prepayment')}`"
      class="cw-prepayment"
    >
      <x-form-input
        type="number"
        v-model="paymentDetails.prepay"
        currency="%"
        :precision="2"
        :label="true"
        :max="100"
        :error="!!errors[0]"
        :placeholder="`${$t('prepayment')}`"
        class="w-100"
        @input="editPrepayHandler"
        @focus="focusOnFieldHandler('prepay')"
      />
    </validation-provider>

    <!--? INITIAL_FEE  -->
    <validation-provider
      v-if="allowToShowInitialPrice"
      v-slot="{ errors }"
      rules="required|min_value:0"
      :name="`${$t('payments.initial_fee')}`"
      class="cw-initial-fee"
    >
      <x-form-input
        type="number"
        v-model="paymentDetails.initial_price"
        :currency-symbol="true"
        :label="true"
        :precision="2"
        :error="!!errors[0]"
        :placeholder="`${$t('payments.initial_fee')}`"
        class="w-100"
        :disable="disableInitialPrice"
        @input="editInitialPriceHandler"
        @focus="focusOnFieldHandler('initial_price')"
      />
    </validation-provider>

    <!--? TOTAL_DISCOUNT  -->
    <validation-provider
      v-slot="{ errors }"
      :name="`${$t('total_discount')}`"
      class="cw-total-discount"
    >
      <x-form-input
        type="number"
        v-model="paymentDetails.total_discount"
        :currency-symbol="true"
        :label="true"
        :precision="2"
        :error="!!errors[0]"
        class="w-100"
        :max="maxTotalDiscountAmount"
        :placeholder="`${$t('total_discount')}`"
        @input="addDiscount"
        @focus="focusTotalDiscount"
        @blur="blurTotalDiscount"
      />
    </validation-provider>

    <!--? DISCOUNT_PER_M2  -->
    <!--    <validation-provider-->
    <!--      v-slot="{ errors }"-->
    <!--      :name="`${$t('discount_per_m2')}`"-->
    <!--      class="cw-discount-per-m2"-->
    <!--    >-->
    <!--      <x-form-input-->
    <!--        type="number"-->
    <!--        v-model="paymentDetails.discount_per_m2"-->
    <!--        :currency-symbol="true"-->
    <!--        :label="true"-->
    <!--        :precision="2"-->
    <!--        :error="!!errors[0]"-->
    <!--        class="w-100"-->
    <!--        :max="maxDiscountEachSquare"-->
    <!--        :placeholder="`${$t('discount_per_m2')}`"-->
    <!--        @input="addDiscountEachSquare"-->
    <!--        @focus="focusDiscountEachSquare"-->
    <!--        @blur="blurDiscountEachSquare"-->
    <!--      />-->
    <!--    </validation-provider>-->

    <!--? FIRST_PAYMENT_DATE  -->
    <validation-provider
      :name="`${$t('first_payment_date')}`"
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
        :placeholder="`${$t('first_payment_date')}`"
        :icon-fill="datePickerIconFill"
        @input="setFirstPaymentDate"
      />
    </validation-provider>

    <!--? MONTHLY_PAYMENT_DATE  -->
    <validation-provider
      :name="`${$t('payment_date')}`"
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
        :placeholder="`${$t('payment_date')}`"
        :icon-fill="datePickerIconFill"
        @input="setMonthlyPaymentDate"
      />
    </validation-provider>
  </validation-observer>
</template>

<style lang="scss" scoped>
.ch-calculator-wrapper {
  display: grid;
  grid-template-areas:
    "cv-cell-1 cv-cell-1"
    "cv-cell-2 cv-cell-2"
    "cv-cell-3 cv-cell-4"
    "cv-cell-5 cv-cell-5"
    //"cv-cell-5 cv-cell-6"
    "cv-cell-7 cv-cell-7"
    "cv-cell-8 cv-cell-8";
  gap: 1rem;
  height: fit-content;

  &.ch-another-price-content {
    grid-template-areas:
      "cv-cell-1 cv-cell-1"
      "cv-cell-2 cv-cell-2"
      "cv-cell-3 cv-cell-4"
      "cv-st-price cv-cell-5"
      "cv-cell-7 cv-cell-7"
      "cv-cell-8 cv-cell-8";

    //"cv-cell-1 cv-cell-1"
    //"cv-cell-2 cv-cell-2"
    //"cv-cell-3 cv-cell-4"
    //"cv-cell-5 cv-cell-6"
    //"cv-cell-7 cv-cell-7"
    //"cv-cell-8 cv-cell-8";
  }

  //&.ch-when-full-payment {
  //  grid-template-areas:
  //    "cv-cell-1 cv-cell-1"
  //    "cv-cell-3 cv-cell-4"
  //    "cv-cell-5 cv-cell-6"
  //    "cv-cell-7 cv-cell-7"
  //    "cv-cell-8 cv-cell-8";
  //}

  &.ch-when-no-initial {
    grid-template-areas:
      "cv-cell-1 cv-cell-1"
      "cv-cell-2 cv-cell-2"
      "cv-cell-3 cv-cell-3"
      "cv-cell-5 cv-cell-6"
      "cv-cell-7 cv-cell-7"
      "cv-cell-8 cv-cell-8";
  }

  .cw-starting-price {
    grid-area: cv-st-price;
  }

  .cw-price-m2 {
    grid-area: cv-price-m2;
  }

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
