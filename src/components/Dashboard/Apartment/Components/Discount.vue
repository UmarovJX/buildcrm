<template>
  <div class="object-calculator">
    <b-form-group
      class="mb-1"
      label-cols="12"
      content-cols="12"
      :label="$t('apartments.agree.placeholder.enter_discount')"
      label-for="discounts"
    >
      <b-form-select id="discounts" v-model="discount" @change="changeDiscount">
        <b-form-select-option
          v-for="(discount, index) in getApartmentDiscounts"
          :value="discount"
          :key="'discounts' + index"
        >
          {{ $t("apartments.view.variant") }}
          {{ index + 1 }} - {{ discount.prepay }}%
        </b-form-select-option>
      </b-form-select>
    </b-form-group>

    <!-- Цена продажы за м2 -->
    <b-form-group
      class="mb-1"
      label-cols="12"
      content-cols="12"
      label="Цена продажы за м2:"
      label-for="price"
    >
      <vue-numeric
        id="price"
        v-model="calc.price_for_m2"
        :currency="$t('ye')"
        :precision="2"
        class="form-control"
        currency-symbol-position="suffix"
        separator="space"
        disabled
      ></vue-numeric>
    </b-form-group>

    <!-- Скидка -->
    <b-form-group
      class="mb-1"
      v-if="discount.amount > 0"
      label-cols="12"
      content-cols="12"
      label="Скидка за м2:"
      label-for="discound-price"
    >
      <vue-numeric
        id="discound-price"
        v-model="calc.discount_price"
        @change="changeDiscount_price"
        :currency="$t('ye')"
        :precision="2"
        class="form-control"
        currency-symbol-position="suffix"
        separator="space"
      ></vue-numeric>
    </b-form-group>

    <!-- Предоплата -->
    <div>
      Предоплата: <span> {{ calc.prepay_percente }}%</span>
    </div>

    <!-- Первый взнос -->
    <b-form-group
      class="mb-1"
      v-if="discount.amount > 0"
      label-cols="12"
      content-cols="12"
      label="Первый взнос: "
      label-for="prepay_to"
    >
      <vue-numeric
        id="prepay_to"
        v-model="calc.prepay"
        class="form-control"
        :currency="$t('ye')"
        :precision="2"
        currency-symbol-position="suffix"
        disabled
        separator="space"
      ></vue-numeric>
    </b-form-group>

    <!-- Ежемесячный -->
    <b-form-group
      class="mb-1"
      v-if="discount.amount > 0"
      label-cols="12"
      content-cols="12"
      label="Ежемесячный:"
      label-for="credit_month"
    >
      <b-form-input
        id="credit_month"
        @change="changeDiscount_month"
        v-model="calc.month"
      >
      </b-form-input>
      <vue-numeric
        id="credit_price_for_month"
        v-model="monthly_price"
        class="form-control mt-2"
        :currency="$t('ye')"
        :precision="2"
        currency-symbol-position="suffix"
        separator="space"
        disabled
        read-only-class="true"
      ></vue-numeric>
      <span style="position: absolute; right: 20px; top: 6px">месяцев</span>
    </b-form-group>

    <!-- Остаток -->
    <b-form-group
      v-if="discount.amount > 0"
      class="mb-1"
      label-cols="12"
      content-cols="12"
      label="Остаток: "
      label-for="debt"
    >
      <vue-numeric
        id="debt"
        v-model="calc.debt"
        :currency="$t('ye')"
        :precision="2"
        class="form-control"
        currency-symbol-position="suffix"
        separator="space"
        disabled
      ></vue-numeric>
    </b-form-group>

    <!-- Итого -->
    <b-form-group
      class="mb-1"
      label-cols="12"
      content-cols="12"
      label="Итого: "
      label-for="total"
    >
      <vue-numeric
        id="total"
        v-model="calc.total"
        :currency="$t('ye')"
        :precision="2"
        class="form-control"
        currency-symbol-position="suffix"
        separator="space"
        disabled
      ></vue-numeric>
    </b-form-group>
  </div>
</template>

<script>
import VueNumeric from "vue-numeric";
import {mapGetters} from "vuex";
export default {
  name: "Discount",
  components: {
    VueNumeric,
  },
  props: {
    apartment: {},
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
    setTimeout(() => {
      this.discount = this.getApartmentDiscounts[0];
      this.initialCalc();
    }, 1000);
  },
  computed: {
    ...mapGetters(["getCurrency"]),
    getApartmentDiscounts() {
      let arr = this.apartment.discounts;
      if (this.apartment.object.credit_month != 0) {
        return arr.sort((a, b) => a.prepay - b.prepay);
      }

      return [];
    },
  },
  methods: {
    async initialCalc() {
      if (this.discount.type === "percent") {
        if (this.discount.prepay === 100) {
          this.calc.price_for_m2 = this.apartment.price_m2;
        } else {
          this.calc.price_for_m2 = this.getTotalForPercente() / this.apartment.plan.area;
        }
      } else {
        this.calc.price_for_m2 = this.discount.amount;
      }
      // this.calc.price_for_m2 = this.discount.amount;
      this.calc.prepay_percente = this.discount.prepay;
      this.calc.prepay = this.getPrepay();
      this.calc.month = this.apartment.object.credit_month;
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
      if (this.discount.type === "fixed") {
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

      return 1 - this.discount.amount / 100;
    },
    getMonth() {
      return (this.getTotal() - this.getPrepay()) / this.calc.month;
    },
    getDebt() {
      return this.getTotal() - this.getPrepay();
    },
    getTotal() {
      let total_discount = this.getDiscount();
      let total = 0;

      //console.log(total_discount)
      switch (this.discount.type) {
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

      //console.log(total_discount)
      switch (this.discount.type) {
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
          break;
      }

      return total;
    },
  },
};
</script>
