<template>
  <div class="checkout">
    <div class="calculator-wrapper">
      <!--  Вариант оплаты  -->
      <base-select
          v-model="calc.discount"
          :label="true"
          :noPlaceholder="true"
          :options="options"
          :placeholder="`${ $t('enter_discount') }`"
          class="discount-select"
      />
      <!--  Рассрочка (monthly)  -->
      <base-select
          v-model="calc.monthly_payment_period"
          :label="true"
          :noPlaceholder="true"
          :options="options"
          :placeholder="`${ $t('installment') }`"
          class="monthly-payment-period-select"
      />
      <!--  Предоплата  -->
      <base-select
          v-model="calc.prepay_percentage"
          :label="true"
          :noPlaceholder="true"
          :options="options"
          :placeholder="`${ $t('prepayment') }`"
          class="prepay-percentage-select w-100"
      />
      <!--  Первоначальный взнос    -->
      <base-price-input
          v-model="calc.initial_price"
          :label="true"
          :top-placeholder="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('payments.initial_fee')"
          class="checkout-initial-price-input w-100"
      />
      <!--  Общая скидка    -->
      <base-price-input
          v-model="calc.total_discount"
          :label="true"
          :top-placeholder="true"
          :currency="`${ $t('ye') }`"
          :placeholder="$t('total_discount')"
          class="checkout-total-discount-input w-100"
      />
      <!--  Скидка за М2    -->
      <base-price-input
          v-model="calc.discount_per_m2"
          :label="true"
          :top-placeholder="true"
          :currency="`${ $t('ye') }`"
          :placeholder="$t('discount_per_m2')"
          class="checkout-discount-per-m2-input w-100"
      />
      <!--  Дата первого платежа  -->
      <base-date-picker
          v-model="calc.contract_date"
          :range="false"
          class="data-picker contract-date-picker"
          format="DD.MM.YYYY"
          :icon-fill="datePickerIconFill"
          :placeholder="`${ $t('apartments.agree.first_payment_date') }`"
      />
      <!--  Дата ежемесячного платежа   -->
      <base-date-picker
          v-model="calc.payment_date"
          :range="false"
          class="data-picker payment-date-picker"
          format="DD.MM.YYYY"
          :icon-fill="datePickerIconFill"
          :placeholder="`${ $t('apartments.agree.payment_date') }`"
      />
    </div>
    <div class="calculator-result">
      <span>Начальная цена</span>
      <span>600 000 000 сум</span>
      <span>Цена за М2</span>
      <span>8 000 000 сум</span>
      <span>Остаток</span>
      <span>360 000 000 сум</span>
      <span>Итого</span>
      <span>720 000 000 сум</span>
    </div>
  </div>
</template>

<script>
import BaseSelect from "@/components/Reusable/BaseSelect";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";

export default {
  name: "CheckoutCalculator",
  components: {
    BaseSelect,
    BasePriceInput,
    BaseDatePicker
  },
  props: {
    datePickerIconFill: {
      type: String,
      required: true
    },
    checkoutInformation: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      calc: {
        discount: null,
        prepay_percentage: null,
        monthly_payment_period: null,
        initial_price: 0,
        total_discount: 0,
        discount_per_m2: 0,
        first_payment_date: null,
        payment_date: null
      },
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

    .prepay-percentage-select {
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
  &-discount-per-m2-input {
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