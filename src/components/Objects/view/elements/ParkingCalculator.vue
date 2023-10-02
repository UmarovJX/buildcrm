<script>
import { formatToPrice } from "@/util/reusable";
// import BaseSelect from "@/components/Reusable/BaseSelect";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import { XFormSelect } from "@/components/ui-components/form-select";
import { mapGetters } from "vuex";
import CheckoutPermission from "@/permission/checkout";

export default {
  name: "ParkingCalculator",
  components: {
    // BaseSelect,
    XFormSelect: XFormSelect,
    BasePriceInput,
  },
  props: {
    apartment: {
      type: Object,
      required: true,
    },
    hasApartment: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["for-print"],
  data() {
    return {
      monthly_price: 0,
      discount: this.apartment.discounts[0],
      calc: {
        amount: 0,
        monthly_price: 0,
        prepay: 0,
        debt: 0,
        total: 0,
        prepay_percente: 0,
        base_price: 0,
        month: 0,
      },
      // discountPerSquare: {
      //   value: null,
      //   permissionChange: false,
      // },
      discountSumSquare: {
        value: null,
        permissionChange: false,
      },
      monthlyPaymentDuration: 0,
      monthlyPermission: CheckoutPermission.getMonthlyPaymentPermission(),
    };
  },
  mounted() {
    this.calc.month = 12; // this.apartment?.object?.credit_month;
    this.upHillForPrint();
  },
  watch: {
    discount() {
      this.upHillForPrint();
    },
  },
  computed: {
    ...mapGetters({
      permission: "getPermission",
    }),
    paymentOption() {
      const discounts = [...this.apartment.discounts];
      if (!this.hasApartment) return;
      return discounts
        .sort((a, b) => a.prepay - b.prepay)
        .map((discount, index) => {
          let text = this.$t("apartments.view.variant");
          if (discount.type === "promo")
            text += " " + `( ${this.$t("promo.by_promo")} )`;
          text += " " + (index + 1) + " - " + discount.prepay + "%";
          return {
            text,
            value: discount,
            id: discount.id,
          };
        });
    },
    prepay() {
      return (this.discount.amount / 100) * this.discount.prepay;
    },
    restAmount() {
      return this.discount.amount - this.prepay - this.discountSumSquare.value; //
    },
    monthlyPayment() {
      return this.restAmount / this.calc.month;
    },
    totalDiscount() {
      return (
        this.apartment.price -
        this.discount.amount +
        this.discountSumSquare.value
      );
    },
    totalPrice() {
      return this.discount.amount - this.discountSumSquare.value;
    },

    showMonthlyCalculation() {
      return this.discount.prepay !== 100;
    },
  },
  methods: {
    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    changeDiscount(optSelect) {
      this.discount = this.paymentOption.find(
        (option) => option.value.id === optSelect.id
      ).value;
      this.upHillForPrint();
    },
    setTotalDiscountPrice(value) {
      this.discountSumSquare.value = value;
      this.upHillForPrint();
    },
    changeDiscount_month() {
      this.upHillForPrint();
    },
    upHillForPrint() {
      if (this.monthlyPaymentDuration === 0) {
        this.monthlyPaymentDuration = this.calc.month;
      }
      const calc = {
        amount: 0,
        monthly_price: this.monthlyPayment,
        prepay: this.prepay,
        debt: this.totalPrice - this.prepay,
        total: this.totalPrice,
        prepay_percente: this.discount.prepay,
        base_price: this.apartment.price,
        month: this.calc.month,
      };

      this.$emit("for-print", {
        ...calc,
        monthly_price: this.monthlyPayment,
        discount: this.discount,
        month: this.calc.month,
      });
    },
  },
};
</script>

<template>
  <div class="d-flex flex-wrap justify-content-between mt-5">
    <!--    INPUTS      -->
    <div class="w-100 inputs">
      <!--    PAYMENT OPTIONS       -->
      <div>
        <x-form-select
          :value="discount.id"
          :options="paymentOption"
          :placeholder="$t('payment_discount')"
          getter="full"
          value-field="id"
          @change="changeDiscount"
        />
      </div>
      <!--     INPUT MONTHLY PAYMENT       -->
      <div class="calc_monthly" v-show="showMonthlyCalculation">
        <div class="placeholder font-weight-600">
          {{ $t("monthly_payment") }}
        </div>
        <div class="input d-flex justify-content-between">
          <input
            v-if="discount.amount > 0"
            v-model="calc.month"
            @input="changeDiscount_month"
            type="number"
            class="input-monthly-payment color-gray-600 w-100"
            :placeholder="$t('monthly_payment')"
            min="1"
          />
          <span v-else class="d-block">{{ $t("monthly_payment") }}</span>
          <div class="font-inter color-gray-600 font-weight-600">
            {{ $t("month") }}
          </div>
        </div>
        <div class="square-price font-inter color-gray-600 font-weight-600">
          {{ $t("by_price", { price: `${pricePrettier(monthlyPayment, 2)}` }) }}
          <!--          По {{ pricePrettier(monthly_price, 2) }} сум-->
        </div>
      </div>
      <div
        class="d-flex justify-content-between align-items-center"
        style="column-gap: 0.5rem"
      >
        <!--    DISCOUNT TOTAL PRICE    -->
        <base-price-input
          ref="all-discount-price"
          class="discount-per-m2"
          :label="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('apartments.view.discount_all')"
          :value="discountSumSquare.value"
          :permission-change="discountSumSquare.permissionChange"
          @input="setTotalDiscountPrice"
        />
      </div>
    </div>

    <!--     OUTPUTS     -->
    <div class="w-100 outputs font-inter">
      <!--      Initial Price          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("starting_price") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(apartment.price, 2) }} {{ $t("ye") }}
        </span>
      </div>
      <!--      Total Discount          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("total_discount") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(totalDiscount, 2) }} {{ $t("ye") }}
        </span>
      </div>

      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("apartments.view.prepayment") }} {{ discount.prepay }}%
        </span>
        <span
          v-if="calc.prepay_percente === 100"
          class="price d-block color-gray-600"
        >
          {{ pricePrettier(discount.amount, 2) }} {{ $t("ye") }}
        </span>
        <span v-else class="price d-block color-gray-600">
          {{ pricePrettier(prepay, 2) }} {{ $t("ye") }}
        </span>
      </div>

      <!--       Monthly Payment          -->
      <div
        v-if="discount.amount > 0 && showMonthlyCalculation"
        class="d-flex justify-content-between"
      >
        <span class="property d-block color-gray-400">
          {{ $t("monthly_pay") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(monthlyPayment, 2) }} {{ $t("ye") }}
        </span>
      </div>

      <!--                <div v-if="discount.amount > 0" class="d-flex justify-content-between">-->
      <!--                  <span class="property d-block color-gray-400">{{ $t('contracts.view.remainder') }}</span>-->
      <!--                  <span class="price d-block color-gray-600">{{ pricePrettier(calc.debt) }} {{ $t('ye') }}</span>-->
      <!--                </div>-->

      <!--      Total Price          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-violet-600">{{ $t("total") }}</span>
        <span class="price d-block color-violet-600 total-price">
          {{ pricePrettier(totalPrice, 2) }} {{ $t("ye") }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.inputs
  //margin-right: 2.25rem
  margin-bottom: 2.5rem

.outputs
  //margin-right: 2.25rem

  & > div
    margin-bottom: 2rem
    font-size: 18px
    font-weight: 600

    .total-price
      font-size: 24px

  .property
    font-size: 18px
    font-weight: 600

    sup
      color: var(--gray-400)


.calc_monthly
  background-color: var(--gray-100)
  border-radius: 1rem
  margin-top: 1.5rem

  .placeholder
    letter-spacing: 1px
    color: var(--gray-400)
    text-transform: uppercase
    line-height: 10px
    font-size: 0.6rem
    margin-bottom: 0.25rem
    padding-top: 0.75rem
    padding-left: 1.5rem

  .input
    padding: 0.25rem 1.25rem 0.75rem 0
    margin-left: 1.5rem

    &::placeholder
      padding: 0

    &-monthly-payment
      border: none
      background-color: transparent

  .square-price
    padding: 0.75rem 1.25rem
    background-color: var(--gray-200)
    border-top: 2px solid var(--gray-300)
    border-bottom-right-radius: 1rem
    border-bottom-left-radius: 1rem

.discount-per-m2
  border-radius: 2rem
  background-color: var(--gray-100)
  margin-top: 1.5rem
  width: 100%
  border: none
  padding: 0.75rem 1.25rem
</style>
