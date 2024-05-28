<script>
import { formatToPrice } from "@/util/reusable";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import { XFormSelect } from "@/components/ui-components/form-select";
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
      calc: {
        discount: this.apartment.discounts[0].id,
        type: "custom",
        month: 0,
        full_discount: 0,
      },
    };
  },
  watch: {
    async discount() {
      if (this.calc.type === "installment") await this.getInstallmentCalcs();
      else this.upHillForPrint();
    },
    calc: {
      handler() {
        this.upHillForPrint();
      },
      deep: true,
    },
    calc: {
      handler() {
        this.upHillForPrint();
      },
      deep: true,
    },
    currentInstallment: {
      handler() {
        this.upHillForPrint();
      },
    },
    "calc.type": {
      async handler(v) {
        if (v === "installment") {
          await this.getInstallmentCalcs();
          this.upHillForPrint();
        }
      },
    },
  },
  mounted() {
    this.calc.month = this.apartment?.discounts[0].installment_month || 12;

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
    currentInstallmentObj() {
      return (
        this.calculatedInstallments.find(
          (el) => el.id === this.currentInstallment
        ) || {}
      );
    },
    m2Price() {
      if (this.calc.type === "installment") {
        return this.currentInstallmentObj.amount;
      } else if (this.discount.type === "percent") {
        if (this.discount.prepay === 100) {
          return this.apartment.price_m2;
        } else {
          return this.totalForPercente / this.apartment.plan.area;
        }
      } else {
        return this.discount.amount;
      }
    },
    calcTypes() {
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
    monthlyPayment() {
      const degree = Math.floor(
        parseInt(this.totalPayment - this.prepay).toString().length / 3
      );
      if (this.calc.type === "custom") {
        if (this.calc.month) {
          return (
            Math.ceil(
              (this.totalPayment - this.prepay) /
                (Math.pow(10, degree) * this.calc.month)
            ) * Math.pow(10, degree)
          );
        }
      } else {
        return (
          Math.ceil(
            (this.totalPayment - this.prepay) /
              (Math.pow(10, degree) * this.currentInstallmentObj.months)
          ) * Math.pow(10, degree)
        );
      }
      return 0;
    },
    lastMonthPayment() {
      return (
        this.totalPayment -
        this.prepay -
        this.monthlyPayment *
          (this.calc.type === "custom"
            ? this.calc.month - 1
            : this.currentInstallmentObj.months - 1)
      );
    },
    prepay() {
      if (this.discount.prepay === 100) return 0;

      const total_discount = this.minusDiscount;
      let total = 0;
      if (this.calc.type === "installment") {
        total = this.discount.amount * this.apartment.plan.area;
      } else {
        switch (this.discount.type) {
          case "percent":
            total = this.totalForPercente / total_discount;
            break;
          default:
            total =
              this.discount.amount * this.apartment.plan.area -
              (this.calc.full_discount || 0);
        }
      }
      return (this.discount.prepay * total) / 100;
    },
    totalForPercente() {
      const total_discount = this.minusDiscount;
      let total = 0;

      if (this.discount.type === "percent") {
        return this.apartment.prices.price / total_discount;
      }
      return (
        this.discount.amount * this.apartment.plan.area -
        (this.calc.full_discount || 0)
      );
    },
    discount() {
      return this.apartment.discounts.find(
        (el) => el.id === this.calc.discount
      );
    },
    basePrice() {
      if (this.discount.type === "percent") return this.apartment.price;
      return this.discount.amount * this.apartment.plan.area;
    },
    totalDiscount() {
      const { calc, apartment } = this;
      const { prices, plan } = apartment;
      const fullDiscount = this.calc.full_discount;
      if (this.calc.type === "custom") {
        return (prices.price - this.basePrice + fullDiscount).toFixed(2);
      }
      return prices.price - this.totalPayment;
    },
    m2Discount: {
      get() {
        return (
          Math.floor(
            (this.calc.full_discount / this.apartment.plan.area) * 100
          ) / 100
        );
      },
      set(v) {
        this.calc.full_discount =
          Math.ceil(v * this.apartment.plan.area * 100) / 100;
      },
    },
    minusDiscount() {
      if (this.discount.type === "percent") {
        return 1;
      }

      return 1 - this.discount.prepay / 100;
    },
    totalPayment() {
      const total_discount = this.minusDiscount;
      let total = 0;
      if (this.calc.type === "custom")
        switch (this.discount.type) {
          case "percent":
            total = this.apartment.prices.price - this.totalDiscount;
            break;
          default:
            total =
              this.discount.amount * this.apartment.plan.area -
              (this.calc.full_discount || 0);
            break;
        }
      else {
        total = this.currentInstallmentObj.amount * this.apartment.plan.area;
      }
      return total;
    },
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
              ...discount,
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

    showMonthlyCalculation() {
      return this.calc.prepay_percente !== 100;
    },
  },
  methods: {
    async getInstallmentCalcs() {
      this.calculatedInstallments = [];
      const resp = await v3ServiceApi.installments.calculate({
        discount_id: this.discount.id,
        amount: this.discount.amount,
      });
      this.calculatedInstallments = resp.data.result;
      // this.calculatedInstallments = this.installmentData.map((el) => ({
      //   id: el.id,
      //   amount: (1 + el.percentage / 100) * this.discount.amount,
      //   months: el.months,
      // }));
      setTimeout(() => {
        // this.currentInstallment = resp.data.result[0].id;
        this.currentInstallment = this.calculatedInstallments[0].id;
      }, 0);
    },
    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),

    upHillForPrint() {
      this.$emit("for-print", {
        ...this.calc,
        monthly_price: this.monthly_price,
        discount: this.discount,
        price_for_m2: this.m2Price,
        monthly_price: this.monthlyPayment,
        last_month_price: this.lastMonthPayment,
        prepay: this.prepay,
        debt: this.totalPayment - this.prepay,
        total: this.totalPayment,
        prepay_percente: this.discount.prepay,
        base_price: this.basePrice,
        total_discount: this.totalDiscount,
      });
    },
    changeCurrentInstallment(v) {
      if (v) this.currentInstallment = v;
    },
  },
};
</script>

<template>
  <div class="d-flex flex-wrap justify-content-between">
    <!--    INPUTS      -->
    <div class="w-100 inputs">
      <!--    PAYMENT OPTIONS       -->
      <div class="mb-3">
        <x-form-select
          v-model="calc.type"
          :options="calcTypes"
          :placeholder="$t('plan_type')"
          value-field="value"
        />
      </div>
      <div>
        <x-form-select
          v-model="calc.discount"
          :options="paymentOption"
          :placeholder="$t('payment_discount')"
          value-field="id"
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
            v-model="calc.month"
            type="number"
            class="input-monthly-payment color-gray-600 w-100"
            :placeholder="$t('monthly_payment')"
          />
          <span v-if="false" class="d-block">{{ $t("monthly_payment") }}</span>
          <div class="font-inter color-gray-600 font-weight-600">
            {{ $t("month") }}
          </div>
        </div>
        <div class="square-price font-inter color-gray-600 font-weight-600">
          {{ $t("by_price", { price: `${pricePrettier(monthlyPayment, 2)}` }) }}
        </div>
      </div>

      <div
        class="d-flex justify-content-between align-items-center"
        style="column-gap: 0.5rem"
        v-if="showPrice && calc.type === 'custom'"
      >
        <base-price-input
          ref="discount-per-square"
          class="discount-per-m2"
          :label="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('apartments.view.discount_per_m2')"
          v-model="m2Discount"
          :permission-change="true"
        />
        <base-price-input
          ref="all-discount-price"
          class="discount-per-m2"
          :label="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('apartments.view.discount_all')"
          :permission-change="true"
          v-model="calc.full_discount"
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
          {{
            pricePrettier(m2Price - calc.full_discount / apartment.plan.area, 2)
          }}
          {{ $t("ye") }}</span
        >
      </div>

      <div class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("apartments.view.prepayment") }} {{ discount.prepay }}%
        </span>
        <span
          v-if="discount.prepay === 100"
          class="price d-block color-gray-600"
        >
          {{ pricePrettier(totalPayment, 2) }} {{ $t("ye") }}
        </span>
        <span v-else class="price d-block color-gray-600">
          {{ pricePrettier(prepay, 2) }} {{ $t("ye") }}
        </span>
      </div>

      <!--       Monthly Payment          -->
      <div v-if="discount.prepay < 100" class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("monthly_pay") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(monthlyPayment, 2) }} {{ $t("ye") }}
        </span>
      </div>
      <!--       Monthly Payment          -->
      <div v-if="discount.prepay < 100" class="d-flex justify-content-between">
        <span class="property d-block color-gray-400">
          {{ $t("Последняя") }}
        </span>
        <span class="price d-block color-gray-600">
          {{ pricePrettier(lastMonthPayment, 2) }} {{ $t("ye") }}
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
          {{ pricePrettier(totalPayment, 2) }} {{ $t("ye") }}
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
