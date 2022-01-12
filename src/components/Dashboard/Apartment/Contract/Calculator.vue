<template>
  <!-- Calc -->
  <div class="new-object p-3">
    <div class="object-calculator">
      <!-- Select percente -->
      <b-form-group
          class="mb-1"
          label-cols="12"
          content-cols="12"
          :label="$t('apartments.agree.placeholder.enter_discount')"
          label-for="discounts"
      >
        <b-form-select
            id="discounts"
            v-model="contract.discount"
            @input="changeDiscount"
        >
<!--                       -->
          <b-form-select-option
              v-for="(discount, index) in discounts"
              :value="discount"
              :key="'discount-' + index"
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
            v-model="per_square"
            :currency="$t('ye')"
            :precision="2"
            class="form-control"
            currency-symbol-position="suffix"
            separator="space"
            disabled
        ></vue-numeric>
      </b-form-group>

      <!-- Скидка when apartment count = 1 -->
      <b-form-group
          v-if="apartments && apartments.length > 1"
          class="mb-1"
          label-cols="12"
          content-cols="12"
          label="Скидка от общей суммы:"
          label-for="total-discound-price"
      >
        <vue-numeric
            id="total-discound-price"
            v-model="contract.discount_amount"

            :currency="$t('ye')"
            :precision="2"
            class="form-control"
            currency-symbol-position="suffix"
            separator="space"
            @change="changeTotalDiscountPrice"
        ></vue-numeric>
<!--        @change="changeTotalDiscountPrice($event)"-->
      </b-form-group>

      <!-- Скидка от общей суммы | Скидка за м2 -->
      <b-tabs pills v-else class="mb-1 mt-2">
        <!-- Скидка от общей суммы -->
        <b-tab title="Скидка от общей суммы:" active>
          <b-card-text>
            <vue-numeric
                v-model="contract.discount_amount"
                :currency="$t('ye')"
                :precision="2"
                class="form-control mt-1"
                currency-symbol-position="suffix"
                separator="space"
                @change="changeTotalDiscountPrice"
            ></vue-numeric>
<!--            -->

          </b-card-text>
        </b-tab>
        <!-- Скидка за м2 -->
        <b-tab title="Скидка за м2:">
          <b-card-text>
            <vue-numeric
                v-model="contract.discount_square"
                :currency="$t('ye')"
                :precision="2"
                class="form-control mt-1"
                currency-symbol-position="suffix"
                separator="space"
                @change="changeDiscountPriceForM2"
            ></vue-numeric>
<!--            @change="changeDiscountPriceForM2($event)"-->

          </b-card-text>
        </b-tab>
      </b-tabs>

      <!-- Предоплата -->
      <div>
        Предоплата: <span> {{ calc.prepay_percente }}%</span>
      </div>

      <!-- Первый взнос -->
      <b-form-group
          class="mb-1"
          v-if="contract.discount && contract.discount.amount > 0"
          label-cols="12"
          content-cols="12"
          label="Первый взнос: "
          label-for="prepay_to"
      >
        <vue-numeric
            id="prepay_to"
            v-model="contract.prepay_amount"
            class="form-control"
            :currency="$t('ye')"
            :precision="2"
            currency-symbol-position="suffix"
            separator="space"
            @change="changePrepayAmount($event)"
        ></vue-numeric>
      </b-form-group>


      <!-- Ежемесячный -->
      <b-form-group
          class="mb-1"
          v-if="contract.discount && contract.discount.amount > 0"
          label-cols="12"
          content-cols="12"
          label="Ежемесячный:"
          label-for="credit_month"
      >
        <b-form-input
            id="credit_month"
            min="1"
            type="number"
            v-model="contract.month"
            @change="changeDiscountMonth"
        >
<!--          -->

        </b-form-input>
        <vue-numeric
            id="credit_price_for_month"
            v-model="monthly"
            class="form-control mt-2"
            :currency="$t('ye')"
            :precision="2"
            currency-symbol-position="suffix"
            separator="space"
            disabled
            read-only-class="true"
        ></vue-numeric>
        <span style="position: absolute; right: 40px; top: 6px"
        >месяцев</span
        >
      </b-form-group>

      <!-- Остаток -->
      <b-form-group
          v-if="contract.discount && contract.discount.amount > 0"
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
            v-model="total"
            :currency="$t('ye')"
            :precision="2"
            class="form-control"
            currency-symbol-position="suffix"
            separator="space"
            disabled
        ></vue-numeric>
      </b-form-group>
    </div>
  </div>
</template>

<script>
import VueNumeric from "vue-numeric";
const { getTotal, getMonth, getPrice, getPricePerM2, getPrepay, editedCreditMonths, getDebt, CreditMonths, getTotalDiscount } = require("../../../../util/calculator");

export default {
  name: "Calculator",
  props: {
    client: {},
    apartments: {},
    contract: {},
    discounts: {}
  },

  watch: {
    // apartments: {
    //   handler() {
    //     this.InitialCalc();
    //   },
    //   deep: true
    // },

    'contract.credit_months': {
      handler() {
        this.InitialCalc();
      },
      deep: true
    },

    'contract.initial_payments': {
      handler() {
        this.InitialCalc();
      },
      deep: true
    },

    // 'contract.discount_amount': function () {
    //
    // },
    //
    // 'contract.discount_square': function () {
    //
    // },

  },

  data() {
    return {
      calc: {
        prepay: 0,
        debt: 0,
      },

      per_square: 0,
      total: 0,
      monthly: 0,

      edited: {
        prepay: false
      }
    }
  },

  components: {
    VueNumeric,
  },

  mounted() {
    // console.log(this.apartments.length)
      this.InitialCalc()
  },

  methods: {
      InitialCalc() {
          console.log("EDITED " + this.contract.prepay_edited)
          getTotalDiscount(this.apartments, this.contract)
          getPrice(this.apartments, this.contract)
          this.total = getTotal(this.apartments, this.contract)
          this.monthly = getMonth(this.apartments, this.contract)
          this.per_square = getPricePerM2(this.apartments, this.contract)

          // let prepay =
          // if (!this.contract.prepay_edited)
          this.contract.prepay_amount = getPrepay(this.apartments, this.contract);
          // else
          //   getPrepay(this.apartments, this.contract);

          this.calc.debt = getDebt(this.apartments, this.contract)

          // this.contract.discount_amount = 0 //getTotalDiscount(this.apartments);

          editedCreditMonths(this.apartments, this.contract)
      },

      changeDiscount() {
          this.contract.discount_amount = 0;
          this.contract.discount_square = 0;

          this.contract.prepay_edited = false;
          this.InitialCalc();
          CreditMonths(this.apartments, this.contract)
          this.$emit("changeDiscount", {})
      },

      changeDiscountMonth() {
        this.InitialCalc();
      },

      changeDiscountPriceForM2() {
        this.contract.discount_amount = 0;
        this.InitialCalc()
      },

      changeTotalDiscountPrice() {
        this.contract.discount_square = 0;
        this.InitialCalc()
      },

      changePrepayAmount() {
        this.contract.prepay_edited = true;
        this.InitialCalc();
      }
  }
}
</script>

<style scoped>

</style>