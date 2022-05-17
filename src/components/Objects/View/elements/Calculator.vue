<template>
  <div class="d-flex flex-wrap justify-content-between">
    <!--    INPUTS      -->
    <div class="w-100 inputs">

      <!--    PAYMENT OPTIONS       -->
      <div>
        <base-select
            :label="true"
            :options="paymentOption"
            :no-placeholder="true"
            :value="discount"
            value-field="id"
            @change="changeDiscount"
            :placeholder="$t('payment_discount')"
        ></base-select>
      </div>

      <!--     INPUT MONTHLY PAYMENT       -->
      <div class="monthly" v-show="showMonthlyCalculation">
        <div class="placeholder font-weight-600">{{ $t('monthly_payment') }}</div>
        <div class="input d-flex justify-content-between">
          <input
              v-if="discount.amount > 0"
              v-model="calc.month"
              @input="changeDiscount_month"
              type="number"
              class="input-monthly-payment color-gray-600 w-100"
              :placeholder="$t('monthly_payment')"
          >
          <span v-else class="d-block">{{ $t('monthly_payment') }}</span>
          <div class="font-inter color-gray-600 font-weight-600">{{ $t('month') }}</div>
        </div>
        <div class="square-price font-inter color-gray-600 font-weight-600">
          {{ $t('by_price', {price: `${pricePrettier(monthly_price, 2)}`}) }}
          <!--          По {{ pricePrettier(monthly_price, 2) }} сум-->
        </div>
      </div>

      <div class="d-flex justify-content-between align-items-center" style="column-gap: .5rem">
        <!--     DISCOUNT PER M2       -->
        <base-input
            ref="discount-per-square"
            class="discount-per-m2"
            type="number"
            :label="true"
            :currency="`${$t('ye')}`"
            :placeholder="$t('apartments.view.discount_per_m2')"
            @trigger-input="changeDiscount_price"
        />
        <!--    DISCOUNT TOTAL PRICE    -->
        <base-input
            ref="all-discount-price"
            class="discount-per-m2"
            type="number"
            :label="true"
            :currency="`${$t('ye')}`"
            :placeholder="$t('apartments.view.discount_all')"
            @trigger-input="setTotalDiscountPrice"
        />
      </div>

    </div>

    <!--     OUTPUTS     -->
    <div class="w-100 outputs font-inter">
      <!--      Initial Price          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t('starting_price') }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(apartment.prices.price, 2) }} {{ $t('ye') }}
        </span>
      </div>

      <!--      Price for meters square          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t('selling_price') }} m<sup>2</sup>
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(calc.price_for_m2 - calc.discount_price, 2) }} {{ $t('ye') }}</span>
      </div>

      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t('apartments.view.prepayment') }} {{ calc.prepay_percente }}%
        </span>
        <span v-if="calc.prepay_percente === 100"
              class="price d-block color-gray-600"
        >
          {{ pricePrettier(calc.total, 2) }} {{ $t('ye') }}
        </span>
        <span
            v-else
            class="price d-block color-gray-600"
        >
          {{ pricePrettier(calc.prepay, 2) }} {{ $t('ye') }}
        </span>
      </div>

      <!--       Monthly Payment          -->
      <div v-if="discount.amount > 0" class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t('monthly_pay') }}
        </span>
        <span
            class="price d-block color-gray-600"
        >
          {{ pricePrettier(calc.monthly_price, 2) }} {{ $t('ye') }}
        </span>
      </div>

      <!--                <div v-if="discount.amount > 0" class="d-flex justify-content-between">-->
      <!--                  <span class="property d-block color-gray-400">{{ $t('contracts.view.remainder') }}</span>-->
      <!--                  <span class="price d-block color-gray-600">{{ pricePrettier(calc.debt) }} {{ $t('ye') }}</span>-->
      <!--                </div>-->

      <!--      Total Discount          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t('total_discount') }}
        </span>
        <span
            class="price d-block color-gray-600"
        >
          {{ this.pricePrettier(totalDiscount, 2) }} {{ $t('ye') }}
        </span>
      </div>

      <!--      Total Price          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-violet-600">{{ $t('apartments.view.total') }}</span>
        <span class="price d-block color-violet-600 total-price">
          {{ pricePrettier(calc.total, 2) }}  {{ $t('ye') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import BaseInput from "@/components/Reusable/BaseInput";
import BaseSelect from "@/components/Reusable/BaseSelect";
import {formatToPrice} from "@/util/reusable";

export default {
  name: "Calculator",
  props: {
    apartment: {
      type: Object,
      required: true
    },
    hasApartment: {
      type: Boolean,
      default: true
    }
  },
  components: {
    BaseInput,
    BaseSelect
  },
  data() {
    return {
      monthly_price: 0,
      discount: {
        amount: 0
      },
      calc: {
        amount: 0,
        price_for_m2: 0,
        discount_price: 0,
        monthly_price: 0,
        prepay: 0,
        debt: 0,
        total: 0,
        prepay_percente: 0,
        base_price: 0
      },
    }
  },
  computed: {
    paymentOption() {
      const discounts = [...this.apartment.discounts]
      if (!this.hasApartment) return
      return discounts.sort((a, b) => a.prepay - b.prepay)
          .map((discount, index) => {
            let text = this.$t("apartments.view.variant")
            if (discount.type === 'promo') text += ' ' + `( ${this.$t('promo.by_promo')} )`
            text += ' ' + (index + 1) + ' - ' + discount.prepay + '%'
            return {
              text,
              value: discount,
              id: discount.id
            }
          })
    },
    totalDiscount() {
      const {calc, apartment} = this
      const {prices, plan} = apartment
      const discountPerSquare = calc.discount_price * plan.area
      return prices.price - calc.base_price + discountPerSquare
    },
    getApartmentDiscounts() {
      const hasDiscount = this.hasApartment && this.apartment.hasOwnProperty('discounts')
      if (!hasDiscount) return []
      const discounts = [...this.apartment.discounts]
      return discounts.sort((a, b) => a.prepay - b.prepay)
    },
    showMonthlyCalculation() {
      return this.calc.prepay_percente !== 100
    },
  },
  methods: {
    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    async initialCalc() {
      if (Object.keys(this.discount).length < 1) {
        this.discount = this.getApartmentDiscounts ? this.getApartmentDiscounts[0] : {amount: 0}
      }

      if (this.discount.type === "percent") {
        if (this.discount.prepay === 100) {
          this.calc.price_for_m2 = this.apartment.price_m2;
        } else {
          this.calc.price_for_m2 =
              this.getTotalForPercente() / this.apartment.plan.area;
        }
      } else {
        this.calc.price_for_m2 = this.discount.amount;
      }

      this.calc.prepay_percente = this.discount.prepay;
      this.calc.prepay = this.getPrepay();
      this.calc.month = this.apartment?.object?.credit_month;
      this.calc.monthly_price = this.getMonth();
      this.monthly_price = this.calc.monthly_price;
      this.calc.debt = this.getDebt();
      this.calc.total = this.getTotal();
      this.calc.base_price = this.getBasePrice()
    },
    async changeDiscount(discountId) {
      this.discount = this.paymentOption.find(option => option.value.id === discountId).value
      this.calc.prepay_percente = this.discount.prepay;
      if (this.discount.prepay === 100) {
        this.calc.total = this.apartment.price;
        this.calc.prepay = 100;
        this.calc.price_for_m2 = this.apartment.price_m2;
        if (this.calc.discount_price > 0) {
          this.calc.price_for_m2 -= this.calc.discount_price
        }
        this.calc.base_price = this.apartment.price
      } else {
        await this.initialCalc();
      }
    },
    setTotalDiscountPrice(totalDiscountPrice) {
      this.calc.discount_price = totalDiscountPrice / this.apartment.plan.area
      if (this.calc.discount_price) {
        this.$refs['discount-per-square'].setTriggerValue(this.calc.discount_price.toFixed(2))
        this.initialCalc()
      } else {
        this.$refs['discount-per-square'].setTriggerValue(null)
      }
    },
    async changeDiscount_price(discountPrice) {
      const totalDiscount = discountPrice * this.apartment.plan.area
      this.calc.discount_price = discountPrice
      if (discountPrice) {
        await this.initialCalc()
        this.$refs['all-discount-price'].setTriggerValue(totalDiscount.toFixed(2))
      } else {
        this.$refs['all-discount-price'].setTriggerValue(null)
      }
    },
    changeDiscount_month() {
      this.monthly_price = this.getMonth()
    },
    getPrepay() {
      if (this.discount.prepay === 100) return 0;

      let total_discount = this.getDiscount();

      let total = 0;

      switch (this.discount.type) {
        case "promo":
        case "fixed":
          if (this.calc.discount_price) {
            total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
          } else {
            total = this.discount.amount * this.apartment.plan.area; //(this.discount.amount * this.apartment.plan.area) / total_discount;
          }
          break;
        default:
          total = this.getTotalForPercente() / total_discount;

          break;
      }

      return (this.discount.prepay * total) / 100;
    },
    getDiscount() {
      if (this.discount.prepay === 100) return 1;

      return 1 - this.discount.prepay / 100

      /*return 1 - this.discount.amount / 100;*/
    },
    getMonth() {
      if (this.calc.month) {
        return (this.getTotal() - this.getPrepay()) / this.calc.month;
      }
      return 0
    },
    getDebt() {
      return this.getTotal() - this.getPrepay();
    },
    getBasePrice() {
      let totalDiscount = this.getDiscount()
      switch (this.discount.type) {
        case 'promo':
        case 'fixed':
          return this.discount.amount * this.apartment.plan.area
        default:
          return totalDiscount
      }
    },
    getTotal() {
      let total_discount = this.getDiscount();
      let total = 0;

      switch (this.discount.type) {
        case 'promo':
        case "fixed":
          if (this.calc.discount_price) {
            total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
          } else {
            total = this.discount.amount * this.apartment.plan.area; //(this.discount.amount * this.apartment.plan.area) / total_discount;
          }
          break;
        default:
          total = this.apartment.prices.price / total_discount;
          if (this.calc.discount_price) {
            total -=
                parseFloat(this.calc.discount_price) * this.apartment.plan.area;
          }
          break;
      }

      return total;
    },
    getTotalForPercente() {
      let total_discount = this.getDiscount();
      let total = 0;

      switch (this.discount.type) {
        case "fixed":
          if (this.calc.discount_price) {
            total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
          } else {
            total = this.discount.amount * this.apartment.plan.area;
          }
          break;
        default:
          total = this.apartment.prices.price / total_discount;
          break;
      }

      return total
    },
  }
}
</script>

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


.monthly
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

</style>