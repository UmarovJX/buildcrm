<template>
  <div class="checkout">
    <div class="calculator-wrapper mb-4">
      <!--  Вариант оплаты  -->
      <base-select
          v-model="checkout.calc.discount"
          :label="true"
          :noPlaceholder="true"
          :options="paymentOptions"
          :placeholder="`${ $t('enter_discount') }`"
          class="discount-select"
          @change="changeDiscount"
      />
      <!--  Предоплата  -->
      <base-price-input
          v-model="checkout.month"
          :value="checkout.month"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('prepayment')"
          class="prepay-percentage-input w-100"
      />
      <!--  Рассрочка (monthly)  -->
      <base-price-input
          v-model="checkout.calc.monthly_payment_period"
          :value="checkout.calc.monthly_payment_period"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :placeholder="$t('installment')"
          currency="месяцев"
          class="checkout-initial-price-input w-100"
      />
      <!--  Первоначальный взнос    -->
      <base-price-input
          v-model="checkout.calc.initial_price"
          :value="checkout.calc.initial_price"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('payments.initial_fee')"
          class="checkout-initial-price-input w-100"
      />
      <!--  Дата первого платежа  -->
      <base-date-picker
          v-model="checkout.calc.contract_date"
          :range="false"
          class="data-picker contract-date-picker"
          format="DD.MM.YYYY"
          :icon-fill="datePickerIconFill"
          :placeholder="`${ $t('apartments.agree.first_payment_date') }`"
      />
      <!--  Дата ежемесячного платежа   -->
      <base-date-picker
          v-model="checkout.calc.payment_date"
          :range="false"
          class="data-picker payment-date-picker"
          format="DD.MM.YYYY"
          :icon-fill="datePickerIconFill"
          :placeholder="`${ $t('apartments.agree.payment_date') }`"
      />
    </div>
    <div class="calculator-result">
      <span>Начальная общая цена</span>
      <span>{{ prettier(checkout.calc.initial_price) }}</span>
      <span>Остаток</span>
      <span>{{ prettier(checkout.calc.remainder) }}</span>
      <span>Итого</span>
      <span>{{ prettier(checkout.calc.total) }}</span>
    </div>
  </div>
</template>

<script>
import BaseSelect from "@/components/Reusable/BaseSelect";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import {formatToPrice} from "@/util/reusable";
import {mapGetters} from 'vuex'

export default {
  name: "CheckoutCalculator",
  components: {
    BaseSelect,
    BasePriceInput,
    BaseDatePicker
  },
  props: {
    apartments: {
      type: Array,
      required: true
    },
    order: {
      type: Object,
      required: true
    },
    paymentOptions: {
      type: Array,
      required: true
    },
    discountOptions: {
      type: Array,
      required: true
    },
    datePickerIconFill: {
      type: String,
      required: true
    }
  },
  emits: ['change-discount'],
  data() {
    return {
      monthly: null,
      options: [
        {
          value: '1',
          text: 'sultonov komron'
        },
        {
          value: '2',
          text: 'jaxon gafurov'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      checkout: 'getCheckoutContext'
    })
  },
  methods: {
    prettier: formatToPrice,
    changeDiscount(discount) {
      this.$emit('change-discount', discount)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;

  .calculator-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    grid-template-areas:
    "one one"
    "two two"
    "three four"
    "five six"
    "seven seven"
    "eight eight";

    .discount-select {
      grid-area: one;
    }

    .monthly-payment-period-select {
      grid-area: two;
    }

    .prepay-percentage-input {
      grid-area: three;
    }

    .checkout-initial-price-input {
      grid-area: four;
    }

    .checkout-total-discount-input {
      grid-area: five;
    }

    .checkout-discount-per-m2-input {
      grid-area: six;
    }

    .contract-date-picker {
      grid-area: seven;
    }

    .payment-date-picker {
      grid-area: eight;
    }
  }

  .calculator-result {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 1.5rem);
    row-gap: 1.5rem;
  }

  &-initial-price-input,
  &-total-discount-input,
  &-discount-per-m2-input,
  .prepay-percentage-input {
    height: 56px;
    display: flex;
    width: 229.5px;
    border-radius: 32px;
    flex-direction: column;
    background-color: var(--gray-100);
    padding-left: 20px;
  }
}
</style>