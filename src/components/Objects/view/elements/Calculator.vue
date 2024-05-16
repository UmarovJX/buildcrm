<script>
import { formatToPrice } from "@/util/reusable";
// import BaseSelect from "@/components/Reusable/BaseSelect";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import { XFormSelect } from "@/components/ui-components/form-select";
import { mapGetters } from "vuex";
import CheckoutPermission from "@/permission/checkout";
import { useShowPrice } from "@/composables/useShowPrice";
import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "Calculator",
  setup() {
    return useShowPrice();
  },
  components: {
    // BaseSelect,
    XFormSelect,
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
      installmentData: [],
      calculatedInstallments: [],
      currentInstallment: null,
      monthly_price: 0,
      discount: this.apartment.discounts[0],
      calc: {
        type: "custom",
        amount: 0,
        price_for_m2: 0,
        discount_price: 0,
        monthly_price: 0,
        last_month_price: 0,
        prepay: 0,
        debt: 0,
        total: 0,
        prepay_percente: 0,
        base_price: 0,
        month: 0,
      },
      discountPerSquare: {
        value: null,
        permissionChange: false,
      },
      discountSumSquare: {
        value: null,
        permissionChange: false,
      },
      monthlyPaymentDuration: 0,
      monthlyPermission: CheckoutPermission.getMonthlyPaymentPermission(),
    };
  },
  watch: {
    async discount() {
      if (this.calc.type === "installment") await this.getInstallmentCalcs();
      else this.upHillForPrint();
    },
    "calc.type": {
      async handler(v) {
        if (v === "installment") {
          await this.getInstallmentCalcs();
          this.upHillForPrint();
        } else this.initialCalc();
      },
    },
  },
  mounted() {
    this.calc.month = this.apartment?.discounts[0].installment_month || 12;
    this.monthlyPaymentDuration =
      this.apartment?.discounts[0].installment_month || 12;
    this.upHillForPrint();
    v3ServiceApi.installments
      .getAll({ page: 1, limit: 20 })
      .then(
        (res) =>
          (this.installmentData = res.data.result.filter(
            (el) => el.object_id.id === 2
          ))
      );
  },
  computed: {
    installmentOptions() {
      return this.calculatedInstallments.map((el) => ({
        value: el.id,
        text: el.months + " " + this.$t("month"),
      }));
    },
    calcTypes() {
      return [
        {
          value: "custom",
          text: "Custom",
        },
        {
          value: "installment",
          text: "Installment",
        },
      ];
    },
    ...mapGetters({
      permission: "getPermission",
    }),
    paymentOption() {
      const discounts = [...this.apartment.discounts];
      if (!this.hasApartment) return;
      if (this.calc.type === "custom")
        return discounts
          .sort((a, b) => a.prepay - b.prepay)
          .map((discount, index) => {
            let text = this.$t("apartments.view.variant");
            if (discount.type === "promo")
              text += " " + `( ${this.$t("promo.by_promo")} )`;
            text += ` ${index + 1} - ${discount.prepay}%`;
            return {
              text,
              value: discount,
              id: discount.id,
            };
          });

      return discounts
        .sort((a, b) => a.prepay - b.prepay)
        .filter((el) => el.prepay !== 100)
        .map((discount, index) => {
          let text = this.$t("apartments.view.variant");
          if (discount.type === "promo")
            text += " " + `( ${this.$t("promo.by_promo")} )`;
          text += ` ${index + 1} - ${discount.prepay}%`;
          return {
            text,
            value: discount,
            id: discount.id,
          };
        });
    },
    lessPrice() {
      return this.calc.total - this.calc.prepay;
    },
    totalDiscount() {
      const { calc, apartment } = this;
      const { prices, plan } = apartment;
      const discountPerSquare = calc.discount_price * plan.area;
      return (prices.price - calc.base_price + discountPerSquare).toFixed(2);
    },
    getApartmentDiscounts() {
      const hasDiscount =
        this.hasApartment && this.apartment.hasOwnProperty("discounts");
      if (!hasDiscount) return [];
      const discounts = [...this.apartment.discounts];
      return discounts.sort((a, b) => a.prepay - b.prepay);
    },
    showMonthlyCalculation() {
      return this.calc.prepay_percente !== 100;
    },
  },
  methods: {
    async getInstallmentCalcs() {
      // const resp = await v3ServiceApi.installments.calculate({
      //   discount_id: this.discount.id,
      //   amount: this.discount.amount,
      // });
      // this.calculatedInstallments = resp.data.result;
      this.calculatedInstallments = this.installmentData.map((el) => ({
        id: el.id,
        amount: (1 + el.percentage / 100) * this.discount.amount,
        months: el.months,
      }));
      setTimeout(() => {
        // this.currentInstallment = resp.data.result[0].id;
        this.currentInstallment = this.calculatedInstallments[0].id;
        this.initialCalc();
      }, 0);
    },
    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    async initialCalc() {
      if (Object.keys(this.discount).length < 1) {
        this.discount = this.getApartmentDiscounts
          ? this.getApartmentDiscounts[0]
          : { amount: 0 };
      }

      if (this.calc.type === "installment") {
        const c = this.calculatedInstallments.find(
          (el) => el.id === this.currentInstallment
        );
        this.calc.price_for_m2 = c.amount;
        this.calc.month = c.months;
      } else if (this.discount.type === "percent") {
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
      this.calc.monthly_price = this.getMonth();
      this.monthly_price = isNaN(this.calc.monthly_price)
        ? 0
        : this.calc.monthly_price;
      this.calc.last_month_price = this.getLastMonth();
      this.calc.debt = this.getDebt();
      this.calc.total = this.getTotal();
      this.calc.base_price = this.getBasePrice();
      this.calc.month =
        this.calc.type === "installment"
          ? this.calculatedInstallments.find(
              (el) => el.id === this.currentInstallment
            ).months
          : this.discount.installment_month || 12;
      this.calc.total_discount = this.totalDiscount;
      this.calc.less_price = this.lessPrice;
      if (
        this.calc.month === 0 ||
        Number.isNaN(this.calc.month) ||
        this.calc.month === null
      ) {
        this.calc.month = this.monthlyPaymentDuration;
      }
      this.upHillForPrint();
    },
    async changeDiscount(optSelect) {
      this.discount = this.paymentOption.find(
        (option) => option.value.id === optSelect.id
      ).value;
      if (this.calc.type === "custom") {
        this.calc.prepay_percente = this.discount.prepay;
        if (this.discount.type === "percent" && this.discount.prepay === 100) {
          this.calc.total = this.apartment.price;
          this.calc.prepay = 100;
          this.calc.month = 0;
          this.calc.price_for_m2 = this.apartment.price_m2;
          if (this.calc.discount_price > 0) {
            this.calc.price_for_m2 -= this.calc.discount_price;
          }
          this.calc.base_price = this.apartment.price;
        }
        await this.initialCalc();
      }
    },
    setTotalDiscountPrice(totalDiscountPrice) {
      this.calc.discount_price = totalDiscountPrice / this.apartment.plan.area;
      this.initialCalc();
      this.discountPerSquare.permissionChange = true;
      if (this.calc.discount_price) {
        this.discountPerSquare.value = this.calc.discount_price.toFixed(2);
      } else {
        this.discountPerSquare.value = null;
      }
    },
    async changeDiscount_price(discountPrice) {
      const totalDiscount = discountPrice * this.apartment.plan.area;
      this.calc.discount_price = discountPrice;
      await this.initialCalc();
      this.discountSumSquare.permissionChange = true;
      if (discountPrice) {
        this.discountSumSquare.value = totalDiscount.toFixed(2);
      } else {
        this.discountSumSquare.value = null;
      }
    },
    changeDiscount_month() {
      this.monthlyPaymentDuration = this.calc.month;
      this.monthly_price = this.getMonth();
      this.calc.last_month_price = this.getLastMonth();
      this.upHillForPrint();
    },
    changeCurrentInstallment(v) {
      if (v) this.currentInstallment = v;
      this.initialCalc();
    },
    upHillForPrint() {
      if (this.monthlyPaymentDuration === 0) {
        this.monthlyPaymentDuration = this.calc.month;
      }

      this.$emit("for-print", {
        ...this.calc,
        monthly_price: this.monthly_price,
        discount: this.discount,
        month: this.monthlyPaymentDuration,
      });
    },
    getPrepay() {
      // if (this.discount.type == 'percent')
      if (this.discount.prepay === 100) return 0;

      const total_discount = this.getDiscount();

      let total = 0;
      if (this.calc.type === "installment") {
        total =
          this.calculatedInstallments.find(
            (el) => el.id === this.currentInstallment
          ).amount * this.apartment.plan.area;
      } else
        switch (this.discount.type) {
          case "promo":
          case "fixed":
          case "addition":
            if (this.calc.discount_price) {
              total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
            } else {
              total = this.discount.amount * this.apartment.plan.area; // (this.discount.amount * this.apartment.plan.area) / total_discount;
            }
            break;
          default:
            total = this.getTotalForPercente() / total_discount;

            break;
        }

      return (this.discount.prepay * total) / 100;
    },
    getDiscount() {
      if (this.discount.type === "percent") {
        if (this.discount.prepay === 100) return 1;
      }

      return 1 - this.discount.prepay / 100;

      /* return 1 - this.discount.amount / 100; */
    },
    getMonth() {
      const degree = Math.floor(
        parseInt(this.getTotal() - this.getPrepay()).toString().length / 3
      );
      if (this.calc.month) {
        const adjustedMonthlyPayment =
          Math.ceil(
            (this.getTotal() - this.getPrepay()) /
              (Math.pow(10, degree) * this.calc.month)
          ) * Math.pow(10, degree);

        return adjustedMonthlyPayment; // (this.getTotal() - this.getPrepay()) / this.calc.month;
      }
      return 0;
    },
    getLastMonth() {
      if (this.calc.month) {
        return (
          this.getTotal() -
          this.getPrepay() -
          this.getMonth() * (this.calc.month - 1)
        );
      }
      return 0;
    },
    getDebt() {
      return this.getTotal() - this.getPrepay();
    },
    getBasePrice() {
      // let totalDiscount = this.getDiscount()
      switch (this.discount.type) {
        case "promo":
        case "fixed":
        case "addition":
          return this.discount.amount * this.apartment.plan.area;
        default:
          return this.apartment.price;
        // return totalDiscount
      }
    },
    getTotal() {
      const total_discount = this.getDiscount();
      let total = 0;
      if (this.calc.type === "custom")
        switch (this.discount.type) {
          case "promo":
          case "fixed":
          case "addition":
            if (this.calc.discount_price) {
              total =
                (this.discount.amount - parseFloat(this.calc.discount_price)) *
                this.apartment.plan.area;
            } else {
              total = this.discount.amount * this.apartment.plan.area; // (this.discount.amount * this.apartment.plan.area) / total_discount;
            }
            break;
          case "percent":
            if (this.discount.prepay === 100) {
              total = this.apartment.prices.price - this.totalDiscount;
            } else {
              total =
                this.apartment.prices.price / total_discount -
                this.totalDiscount;
              if (this.calc.discount_price) {
                total -=
                  parseFloat(this.calc.discount_price) *
                  this.apartment.plan.area;
              }
            }
            break;
          default:
            total =
              this.apartment.prices.price / total_discount - this.totalDiscount;
            if (this.calc.discount_price) {
              total -=
                parseFloat(this.calc.discount_price) * this.apartment.plan.area;
            }
            break;
        }
        else {
          total = this.calculatedInstallments.find(
            (el) => el.id === this.currentInstallment
          ).amount * this.apartment.plan.area
        }

      return total;
    },
    getTotalForPercente() {
      const total_discount = this.getDiscount();
      let total = 0;

      switch (this.discount.type) {
        case "fixed":
        case "promo":
        case "addition":
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

      return total;
    },
  },
};
</script>

<template>
  <div class="d-flex flex-wrap justify-content-between">
    <!--    INPUTS      -->
    <div class="w-100 inputs">
      <!--    PAYMENT OPTIONS       -->
      <div>
        <span class="property d-block color-gray-400 ml-2">
          {{ $t("Тип расчета") }}
        </span>
        <div class="ml-2 mt-1 mb-3">
          <b-form-radio-group
            v-model="calc.type"
            :options="calcTypes"
            name="radios-stacked"
            size="md"
          >
          </b-form-radio-group>
        </div>
      </div>
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
      <div class="mt-3">
        <x-form-select
          v-if="calc.type == 'installment'"
          :value="currentInstallment"
          :options="installmentOptions"
          :placeholder="$t('Длительность рассрочки')"
          value-field="value"
          @change="changeCurrentInstallment"
        />
      </div>
      <!--     INPUT MONTHLY PAYMENT       -->
      <div
        v-show="showMonthlyCalculation && calc.type !== 'installment'"
        class="calc_monthly"
      >
        <div class="placeholder font-weight-600">
          {{ $t("monthly_payment") }}
        </div>
        <div class="input d-flex justify-content-between">
          <input
            v-if="discount.amount > 0"
            v-model="calc.month"
            type="number"
            class="input-monthly-payment color-gray-600 w-100"
            :placeholder="$t('monthly_payment')"
            @input="changeDiscount_month"
          />
          <span v-else class="d-block">{{ $t("monthly_payment") }}</span>
          <div class="font-inter color-gray-600 font-weight-600">
            {{ $t("month") }}
          </div>
        </div>
        <div class="square-price font-inter color-gray-600 font-weight-600">
          {{ $t("by_price", { price: `${pricePrettier(monthly_price, 2)}` }) }}
        </div>
      </div>

      <div
        class="d-flex justify-content-between align-items-center"
        style="column-gap: 0.5rem"
        v-if="showPrice && calc.type === 'custom'"
      >
        <!--     DISCOUNT PER M2       -->
        <base-price-input
          ref="discount-per-square"
          class="discount-per-m2"
          :label="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('apartments.view.discount_per_m2')"
          :value="discountPerSquare.value"
          :permission-change="discountPerSquare.permissionChange"
          @input="changeDiscount_price"
        />
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
          {{ pricePrettier(apartment.prices.price, 2) }} {{ $t("ye") }}
        </span>
      </div>

      <!--      Price for meters square          -->
      <div
        v-if="!apartment.object.is_hide_m2_price && showPrice"
        class="d-flex justify-content-between"
      >
        <span class="property d-block color-gray-400">
          {{ $t("selling_price") }} m<sup>2</sup>
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(calc.price_for_m2 - calc.discount_price, 2) }}
          {{ $t("ye") }}</span
        >
      </div>

      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("apartments.view.prepayment") }} {{ calc.prepay_percente }}%
        </span>
        <span
          v-if="calc.prepay_percente === 100"
          class="price d-block color-gray-600"
        >
          {{ pricePrettier(calc.total, 2) }} {{ $t("ye") }}
        </span>
        <span v-else class="price d-block color-gray-600">
          {{ pricePrettier(calc.prepay, 2) }} {{ $t("ye") }}
        </span>
      </div>

      <!--       Monthly Payment          -->
      <div v-if="discount.prepay < 100" class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("monthly_pay") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(monthly_price, 2) }} {{ $t("ye") }}
        </span>
      </div>
      <!--       Monthly Payment          -->
      <div v-if="discount.prepay < 100" class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("Последняя") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(calc.last_month_price, 2) }} {{ $t("ye") }}
        </span>
      </div>

      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("total_discount") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(totalDiscount, 2) }} {{ $t("ye") }}
        </span>
      </div>
      <!--      Total Percent Discount          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("total_discount_percent") }}
        </span>
        <span class="price d-block color-gray-600">
          {{
            pricePrettier((totalDiscount * 100) / apartment.prices.price, 2)
          }}%
        </span>
      </div>

      <!--      Total Price          -->
      <div class="d-flex justify-content-between">
        <span class="property d-block color-violet-600">{{ $t("total") }}</span>
        <span class="price d-block color-violet-600 total-price">
          {{ pricePrettier(calc.total, 2) }} {{ $t("ye") }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.inputs
  margin-right: 2.25rem
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
