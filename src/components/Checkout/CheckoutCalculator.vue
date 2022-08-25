<template>
  <div class="checkout">
    <div class="calculator-wrapper mb-4">
      <!--  Вариант оплаты  -->
      <base-select
          v-model="calc.discount"
          :label="true"
          :noPlaceholder="true"
          :options="paymentOptions"
          :placeholder="`${ $t('enter_discount') }`"
          class="discount-select"
      />
      <!--  Предоплата  -->
      <base-price-input
          v-model="calc.prepay_percentage"
          :value="calc.prepay_percentage"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('prepayment')"
          class="prepay-percentage-input w-100"
      />
      <!--  Рассрочка (monthly)  -->
      <base-price-input
          v-model="calc.monthly_payment_period"
          :value="calc.monthly_payment_period"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :placeholder="$t('installment')"
          currency="месяцев"
          class="checkout-initial-price-input w-100"
      />
      <!--  Первоначальный взнос    -->
      <base-price-input
          v-model="calc.initial_price"
          :value="calc.initial_price"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('payments.initial_fee')"
          class="checkout-initial-price-input w-100"
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
    discountOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      calc: {
        discount: null,
        prepay_percentage: null,
        monthly_payment_period: 20,
        initial_price: 0,
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
  computed: {
    paymentOptions() {
      return this.discountOptions.map((discount, index) => {
        let text = this.$t("apartments.view.variant")
        if (discount.type === 'promo') {
          text += this.$t('promo.by_promo')
        }
        text += ` ${index + 1} - ${discount.prepay}%`
        return {
          text,
          value: discount.id,
          ...discount,
        }
      })
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