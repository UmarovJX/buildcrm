<template>
  <div class="object-calculator">
    <b-form-group
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="$t('apartments.view.enter_discount')"
        label-for="discounts"
    >
      <b-form-select id="discounts" v-model="discount" @change="changeDiscount">
        <b-form-select-option
            v-for="(discount, index) in getApartmentDiscounts"
            :value="discount"
            :key="'discounts' + index"
        >
          {{ $t("apartments.view.variant") }}
          <span v-if="discount.type === 'promo'">
            ({{ $t('promo.by_promo') }})
          </span>
          {{ index + 1 }} - {{ discount.prepay }}%
        </b-form-select-option>
      </b-form-select>
    </b-form-group>

    <!-- Цена продажы за м2 -->
    <b-form-group
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="$t('apartments.view.price_for_m2')"
        label-for="price"
    >
      <base-numeric-input
          id="price"
          v-model="calc.price_for_m2"
          :currency="$t('ye')"
          :precision="2"
          decimal-separator=","
          class="form-control"
          currency-symbol-position="suffix"
          separator="space"
          disabled
      ></base-numeric-input>
    </b-form-group>

    <!-- Скидка -->
    <b-form-group
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="$t('apartments.view.discount_per_m2')"
        label-for="discound-price"
    >
      <base-numeric-input
          id="discound-price"
          v-model="calc.discount_price"
          @change="changeDiscount_price"
          :currency="$t('ye')"
          :precision="2"
          class="form-control"
          currency-symbol-position="suffix"
          separator="space"
      ></base-numeric-input>
    </b-form-group>

    <!-- Предоплата -->
    <div>
      {{ $t('apartments.view.prepayment') }}: <span> {{ calc.prepay_percente }}%</span>
    </div>

    <!-- Первый взнос -->
    <b-form-group
        class="mb-1"
        v-if="discount.amount > 0"
        label-cols="12"
        content-cols="12"
        :label="$t('contracts.view.initial_payment')"
        label-for="prepay_to"
    >
      <base-numeric-input
          id="prepay_to"
          v-model="calc.prepay"
          class="form-control"
          :currency="$t('ye')"
          :precision="2"
          currency-symbol-position="suffix"
          separator="space"
          disabled
      ></base-numeric-input>
    </b-form-group>

    <!-- Ежемесячный -->
    <b-form-group
        class="mb-1"
        v-if="discount.amount > 0"
        label-cols="12"
        content-cols="12"
        :label="$t('monthly_payment')"
        label-for="credit_month"
    >
      <b-form-input
          id="credit_month"
          @change="changeDiscount_month"
          v-model="calc.month"
      >
      </b-form-input>
      <base-numeric-input
          id="credit_price_for_month"
          v-model="monthly_price"
          class="form-control mt-2"
          :currency="$t('ye')"
          :precision="2"
          currency-symbol-position="suffix"
          separator="space"
          read-only-class="true"
          disabled
      ></base-numeric-input>
      <span style="position: absolute; right: 20px; top: 6px">{{ $t('month') }}</span>
    </b-form-group>

    <!-- Остаток -->
    <b-form-group
        v-if="discount.amount > 0"
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="$t('contracts.view.remainder')"
        label-for="debt"
    >
      <base-numeric-input
          id="debt"
          v-model="calc.debt"
          :currency="$t('ye')"
          :precision="2"
          class="form-control"
          currency-symbol-position="suffix"
          separator="space"
          disabled
      ></base-numeric-input>
    </b-form-group>

    <!-- Итого -->
    <b-form-group
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="$t('apartments.view.total')"
        label-for="total"
    >
      <base-numeric-input
          id="total"
          v-model="calc.total"
          :currency="$t('ye')"
          :precision="2"
          class="form-control"
          currency-symbol-position="suffix"
          separator="space"
          disabled
      ></base-numeric-input>
    </b-form-group>
  </div>
</template>

<script>
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import {mapGetters} from "vuex";

export default {
  name: "Discount",
  components: {
    BaseNumericInput
  },
  props: {
    apartment: {
      type: Object
    },
  },

  data() {
    return {
      discount: {},
      discountWith: {},
      calc: {
        // amount: "",
        // price_for_m2: 0,
        // discount_price: 0,
        // monthly_price: 0,
        // prepay: 0,
        // debt: 0,
        // total: 0,
      },
      monthly_price: 0,
      calForPrint: {},
    };
  },

  mounted() {
    // setTimeout(() => {
    this.discount = this.getApartmentDiscounts
        ? this.getApartmentDiscounts[0]
        : [];
    this.initialCalc();
    // }, 1000);
  },
  computed: {
    ...mapGetters(["getCurrency"]),
    getApartmentDiscounts() {
      let arr = this.apartment?.discounts;
      // if (this.apartment.object.credit_month != 0) {
      return arr?.sort((a, b) => a.prepay - b.prepay);
      // } else {
      // }

      // return [];
    },
  },

  methods: {
    async initialCalc() {
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
      // this.calc.price_for_m2 = this.discount.amount;
      this.calc.prepay_percente = this.discount.prepay;
      this.calc.prepay = this.getPrepay();
      this.calc.month = this.apartment?.object?.credit_month;
      this.calc.monthly_price = this.getMonth();
      this.monthly_price = this.calc.monthly_price;
      this.calc.debt = this.getDebt();
      this.calc.total = this.getTotal();

      this.calForPrint = this.calc;
      this.$emit("getCalData", this.calForPrint);
    },
    async changeDiscount() {
      this.calc.prepay_percente = this.discount.prepay;
      this.calc.discount_price = 0;
      if (this.discount.type === "fixed" || this.discount.type === "promo") {
        await this.initialCalc();
      } else if (this.discount.prepay === 100) {
        this.calc.total = this.apartment.price;
        this.calc.prepay = this.apartment.price;
        this.calc.price_for_m2 = this.apartment.price_m2;

        this.calForPrint = this.calc;
        this.$emit("getCalData", this.calForPrint);
      } else {
        await this.initialCalc();
      }
    },
    async changeDiscount_price() {
      await this.initialCalc();
    },
    changeDiscount_month() {
      this.monthly_price = this.getMonth();

      this.calForPrint.monthly_price = this.monthly_price;
      this.$emit("getCalData", this.calForPrint);
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
          total = this.apartment.price / total_discount;
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
          total = this.apartment.price / total_discount;
          break;
      }

      return total;
    },
  },
};
</script>
