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
      <base-numeric-input
        id="price"
        v-model="calc.price_for_m2"
        :currency="$t('ye')"
        :precision="2"
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
      label="Скидка за м2:"
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
        disabled
      ></base-numeric-input>
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
      <base-numeric-input
        id="prepay_to"
        v-model="calc.prepay"
        class="form-control"
        :currency="$t('ye')"
        :precision="2"
        currency-symbol-position="suffix"
        separator="space"
      ></base-numeric-input>
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
      <base-numeric-input
        id="credit_price_for_month"
        v-model="monthly_price"
        class="form-control mt-2"
        :currency="$t('ye')"
        :precision="2"
        currency-symbol-position="suffix"
        separator="space"
        disabled
        read-only-class="true"
      ></base-numeric-input>
      <span style="position: absolute; right: 20px; top: 6px">{{$t('month')}}</span>
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
      label="Итого: "
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
    apartments: {
      type: Array,
    },
    
  },

  data() {
    return {
      discount: {},
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
      getThisApartmentForTable: [],
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
      let arr = this.apartments[0]?.discounts;
      return arr?.sort((a, b) => a.prepay - b.prepay);
    },
  },
  methods: {
    getPrice() {
      var price = [];
      switch (this.discount.type) {
        case "fixed":
          for (let i = 0; this.apartments.length > i; i++) {
            const amountApartment = this.apartments[i].discounts.find(
              (val) => val.prepay == this.discount.prepay
            ).amount;
            const totalAmount = parseFloat(
              amountApartment * this.apartments[i].plan.area
            );
            price.push(parseFloat(totalAmount));
            this.getThisApartmentForTable[i] = {
              number: this.apartments[i].number,
              price: totalAmount,
            };
          }
          break;
        default:
          for (let i = 0; this.apartments.length > i; i++) {
            price.push(parseFloat(this.apartments[i].price));
          }
          break;
      }
      return price.reduce((a, b) => a + b, 0);
    },
    planAreas() {
      var planAreas = 0;
      for (let i = 0; this.apartments.length > i; i++) {
        planAreas += this.apartments[i].plan.area;
      }
      return planAreas;
    },

    async initialCalc() {
      if (this.discount.type === "percent") {
        if (this.discount.prepay === 100) {
          let price = 0;
          let area = 0;
          for (let index = 0; index < this.apartments.length; index++) {
            price += this.apartments[index]?.price;
            area += this.apartments[index]?.plan.area
          }
          this.calc.price_for_m2 = price / area;
        } else {
          this.calc.price_for_m2 =
            this.getTotalForPercente() / this.planAreas;
        }
      } else {
        this.calc.price_for_m2 = this.getPrice() / this.planAreas();
      }
      this.calc.prepay_percente = this.discount.prepay;
      this.calc.prepay = this.getPrepay();
      this.calc.month = this.apartments[0]?.object.credit_month;
      this.calc.monthly_price = this.getMonths();
      this.monthly_price = this.calc.monthly_price;
      this.calc.debt = this.getDebt();
      this.calc.total = this.getTotal();

      this.calForPrint = this.calc;
      this.$emit("getCalData", this.calForPrint);
      this.$emit("getDiscount", this.discount);
    },

    async changeDiscount() {
      this.calc.prepay_percente = this.discount.prepay;
      this.calc.discount_price = 0;
      if (this.discount.type === "fixed") {
        await this.initialCalc();
      } else if (this.discount.prepay === 100) {
        this.calc.total = this.getTotal();
        this.calc.prepay = this.getTotal();
        this.calc.price_for_m2 = this.getTotal() / this.planAreas();

        this.calForPrint = this.calc;
        this.$emit("getCalData", this.calForPrint);
        this.$emit("getDiscount", this.discount);
      } else {
        await this.initialCalc();
      }
    },

    async changeDiscount_price() {
      await this.initialCalc();
    },

    changeDiscount_month() {
      this.monthly_price = this.getMonths();

      this.calForPrint.monthly_price = this.monthly_price;
      this.$emit("getCalData", this.calForPrint);
      this.$emit("getDiscountData", this.discount);
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
              this.planAreas();
          } else {
            total = this.getPrice();
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

    getMonths() {
      return (this.getTotal() - this.getPrepay()) / this.calc.month;
    },

    getDebt() {
      return this.getTotal() - this.getPrepay();
    },

    getTotal() {
      let total_discount = this.getDiscount();
      // let price = this.getPrice();
      let total = 0;

      switch (this.discount.type) {
        case "fixed":
          if (this.calc.discount_price) {
            total =
              (this.discount.price_for_m2 - parseFloat(this.calc.discount_price)) *
              this.planAreas;
          } else {
            total = this.getPrice();
          }
          break;
        default:
          total = this.getPrice() / total_discount;
          if (this.calc.discount_price) {
            total -=
              parseFloat(this.calc.discount_price) *
              this.planAreas;
          }
          break;
      }
      
      return total;
    },

    getTotalMultiple() {
      let total_discount = this.getDiscount();
      let price = this.getPrice();
      let total = 0;

      if (this.client.discount.id === "other")
        total = this.apartment_edit.price / total_discount;
      else {
        switch (this.client.discount.type) {
          case "fixed":
            total = price;
            break;
          default:
            total = price / total_discount;
            break;
        }
      }

      return total;
    },

    getTotalForPercente() {
      let total_discount = this.getDiscount();
      let total = 0;
      let price = 0;
      switch (this.discount.type) {
        case "fixed":
          if (this.calc.discount_price) {
            total =
              (this.discount.amount - parseFloat(this.calc.discount_price)) *
              this.planAreas();
          } else {
            total = this.getPrice(); //(this.discount.amount * this.apartments.plan.area) / total_discount;
          }
          break;
        default:
          for (let index = 0; index < this.apartments.length; index++) {
            price += this.apartments[index]?.price_m2;
          }
          total = price / (total_discount * this.apartments.length);
          break;
      }

      return total;
    },
  },
};
</script>
