<script>
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";

const {
  getTotal,
  getMonth,
  getPrice,
  getPricePerM2,
  getPrepay,
  editedCreditMonths,
  getDebt,
  CreditMonths,
  getTotalDiscount,
} = require("../../../../util/calculator");
import { mapGetters } from "vuex";
import Vue from "vue";
import CheckoutPermission from "@/permission/checkout";

export default {
  name: "Calculator",
  components: {
    BaseNumericInput,
  },
  props: {
    client: {},
    apartments: {},
    contract: {},
    discounts: {
      type: Array,
      required: true,
    },
    schedule: {
      type: Object,
      required: true,
    },
    paymentDetails: {
      type: Object,
      required: true,
    },
  },

  watch: {
    "contract.credit_months": {
      handler() {
        if (parseInt(this.contract.month) > 0) this.InitialCalc();
      },
      deep: true,
    },

    "contract.initial_payments": {
      handler() {
        this.InitialCalc();
      },
      deep: true,
    },

    "contract.month": function () {
      this.InitialCalc();
    },

    "contract.edited": function () {
      this.InitialCalc();
    },
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
        prepay: false,
      },
      markPricePermission: CheckoutPermission.getMarkPricePermission(),
      monthlyPermission: CheckoutPermission.getMonthlyPaymentPermission(),
    };
  },

  computed: {
    ...mapGetters(["getPermission", "getMe", "getCalcData"]),
  },

  created() {
    this.setInitialValues();
    this.InitialCalc();
  },

  methods: {
    setInitialValues() {
      const hasLength = Object.keys(this.getCalcData).length > 0;
      if (hasLength) {
        const { month, discount, discount_price } = this.getCalcData;
        this.contract.discount = this.getDiscount(discount.id);
        this.contract.discount_amount =
          discount_price * this.apartments[0].plan.area;
        this.contract.discount_square = discount_price;
        this.contract.month = parseInt(month);
      } else {
        if (this.paymentDetails?.discount) {
          this.contract.discount = this.getDiscount(
            this.paymentDetails.discount.id
          );
        } else {
          this.contract.discount = this.discounts[0];
        }
      }
    },
    getDiscount(id) {
      if (id) {
        return this.discounts.find(({ id: discountId }) => discountId === id);
      }

      return this.discounts[0];
    },
    InitialCalc() {
      getTotalDiscount(this.apartments, this.contract);
      getPrice(this.apartments, this.contract);
      this.total = getTotal(this.apartments, this.contract);
      this.monthly = getMonth(this.apartments, this.contract);
      this.per_square = getPricePerM2(this.apartments, this.contract);
      this.contract.prepay_amount = getPrepay(this.apartments, this.contract);
      this.calc.debt = getDebt(this.apartments, this.contract);
      editedCreditMonths(this.apartments, this.contract);
    },

    changeDiscount() {
      // this.contract.discount_amount = 0;
      // this.contract.discount_square = 0;
      this.contract.prepay_edited = false;
      this.InitialCalc();
      CreditMonths(this.apartments, this.contract);
      Vue.set(this.contract, "discount", this.contract.discount);
      this.$emit("changeDiscount", {});
    },

    changeDiscountMonth() {
      this.InitialCalc();
    },

    changeDiscountPriceForM2() {
      this.contract.discount_amount = 0;
      this.InitialCalc();
    },

    changeTotalDiscountPrice() {
      this.contract.discount_square = 0;
      this.InitialCalc();
    },

    changePrepayAmount() {
      this.contract.prepay_edited = true;
      this.InitialCalc();
    },
  },
};
</script>

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
            <span v-if="discount.type === 'promo'">
              ({{ $t("promo.by_promo") }})
            </span>
            {{ index + 1 }} - {{ discount.prepay }}%
          </b-form-select-option>

          <b-form-select-option
            v-if="markPricePermission"
            :value="{
              id: 'other',
              type: 'percent',
              currency: null,
              amount: 0,
              prepay: 30,
            }"
          >
            {{ $t("apartments.view.other_variant") }}
          </b-form-select-option>
        </b-form-select>
      </b-form-group>

      <!-- Цена продажы за м2 -->
      <b-form-group
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="`${$t('apartments.view.price_for_m2')}`"
        label-for="price"
      >
        <base-numeric-input
          id="price"
          v-model="per_square"
          :currency="$t('ye')"
          :precision="2"
          class="form-control"
          currency-symbol-position="suffix"
          separator="space"
          disabled
        ></base-numeric-input>
      </b-form-group>

      <!-- Скидка when apartment count = 1 -->
      <b-form-group
        v-if="apartments && apartments.length > 1"
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="`${$t('apartments.view.discount_price')}:`"
        label-for="total-discound-price"
      >
        <base-numeric-input
          id="total-discount-price"
          v-model="contract.discount_amount"
          :currency="$t('ye')"
          :precision="2"
          class="form-control"
          currency-symbol-position="suffix"
          separator="space"
          @change="changeTotalDiscountPrice"
        ></base-numeric-input>
        <!--        @change="changeTotalDiscountPrice($event)"-->
      </b-form-group>

      <!-- Скидка от общей суммы | Скидка за м2 -->
      <b-tabs pills v-else class="mb-1 mt-2">
        <!-- Скидка от общей суммы -->
        <b-tab :title="`${$t('apartments.view.discount_price')}:`" active>
          <b-card-text>
            <base-numeric-input
              v-model="contract.discount_amount"
              :currency="$t('ye')"
              :precision="2"
              class="form-control mt-1"
              currency-symbol-position="suffix"
              separator="space"
              @change="changeTotalDiscountPrice"
            ></base-numeric-input>
            <!--            -->
          </b-card-text>
        </b-tab>
        <!-- Скидка за м2 -->
        <b-tab :title="$t('apartments.view.discount_per_m2')">
          <b-card-text>
            <base-numeric-input
              v-model="contract.discount_square"
              :currency="$t('ye')"
              :precision="2"
              class="form-control mt-1"
              currency-symbol-position="suffix"
              separator="space"
              @change="changeDiscountPriceForM2"
            ></base-numeric-input>
            <!--            @change="changeDiscountPriceForM2($event)"-->
          </b-card-text>
        </b-tab>
      </b-tabs>

      <!-- Предоплата -->
      <div>
        {{ $t("apartments.view.prepayment") }}:
        <span> {{ calc.prepay_percente }}%</span>
      </div>

      <!-- Первый взнос -->
      <b-form-group
        class="mb-1"
        v-if="
          (contract.discount && contract.discount.amount > 0) ||
          contract.discount.id === 'other'
        "
        label-cols="12"
        content-cols="12"
        :label="`${$t('apartments.first_payment')}:`"
        label-for="prepay_to"
      >
        <base-numeric-input
          id="prepay_to"
          v-model="contract.prepay_amount"
          class="form-control"
          :currency="$t('ye')"
          :precision="2"
          currency-symbol-position="suffix"
          separator="space"
          @change="changePrepayAmount($event)"
        ></base-numeric-input>
      </b-form-group>

      <!-- Ежемесячный -->
      <b-form-group
        class="mb-1"
        v-if="
          (contract.discount && contract.discount.amount > 0) ||
          contract.discount.id === 'other'
        "
        label-cols="12"
        content-cols="12"
        :label="`${$t('monthly_pay')}:`"
        label-for="credit_month"
      >
        <b-form-input
          id="credit_month"
          min="0"
          type="number"
          :disabled="!monthlyPermission"
          v-model="contract.month"
          @change="changeDiscountMonth"
        >
          <!--          -->
        </b-form-input>
        <base-numeric-input
          id="credit_price_for_month"
          v-model="monthly"
          class="form-control mt-2"
          :currency="$t('ye')"
          :precision="2"
          currency-symbol-position="suffix"
          separator="space"
          disabled
          read-only-class="true"
        ></base-numeric-input>
        <span style="position: absolute; right: 40px; top: 6px">{{
          $t("month")
        }}</span>
      </b-form-group>

      <!-- Остаток -->
      <b-form-group
        v-if="
          (contract.discount && contract.discount.amount > 0) ||
          contract.discount.id === 'other'
        "
        class="mb-1"
        label-cols="12"
        content-cols="12"
        :label="`${$t('payments.balance')}:`"
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
        :label="`${$t('total')}:`"
        label-for="total"
      >
        <base-numeric-input
          id="total"
          v-model="total"
          :currency="$t('ye')"
          :precision="2"
          class="form-control"
          currency-symbol-position="suffix"
          separator="space"
          disabled
        ></base-numeric-input>
      </b-form-group>
    </div>
  </div>
</template>
