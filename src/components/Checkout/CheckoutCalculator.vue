<template>
  <div class="checkout">
    <div class="calculator-wrapper">
      <!--  Вариант оплаты  -->
      <base-select
          :value="discount"
          :label="true"
          :noPlaceholder="true"
          value-field="id"
          :options="paymentOptions"
          :placeholder="`${ $t('enter_discount') }`"
          class="discount-select"
          @change="updateDiscount"
      />
      <!--  Рассрочка (monthly)  -->
      <base-price-input
          v-model="calc.monthly_payment_period"
          :value="calc.monthly_payment_period"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :placeholder="$t('installment') + ' month'"
          currency="месяцев"
          class="checkout-monthly-payment-period"
          @input="mutateMonthlyPaymentPeriod"
      />
      <!--  Предоплата  -->
      <base-price-input
          v-model="calc.prepay"
          :value="calc.prepay"
          :permission-change="true"
          :label="true"
          :top-placeholder="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('prepayment') + ' %'"
          class="checkout-prepay-percentage"
          @input="mutatePrepayment"
      />
      <!--  Первоначальный взнос    -->
      <base-price-input
          v-model="calc.initial_price"
          :value="calc.initial_price"
          :permission-change="true"
          @input="mutateInitialPrice"
          :label="true"
          :top-placeholder="true"
          :currency="`${$t('ye')}`"
          :placeholder="$t('payments.initial_fee')"
          class="checkout-initial-price-input w-100"
      />
      <!--  Общая скидка    -->
      <!--      <base-price-input
                :label="true"
                :top-placeholder="true"
                :currency="`${ $t('ye') }`"
                :placeholder="$t('total_discount')"
                class="checkout-total-discount-input w-100"
            />-->
      <!--  Скидка за М2    -->
      <!--      <base-price-input
                :label="true"
                :top-placeholder="true"
                :currency="`${ $t('ye') }`"
                :placeholder="$t('discount_per_m2')"
                class="checkout-discount-per-m2-input w-100"
            />-->
      <!--  Дата первого платежа  -->
      <base-date-picker
          v-model="calc.first_payment_date"
          :range="false"
          class="data-picker contract-date-picker"
          format="DD.MM.YYYY"
          :icon-fill="datePickerIconFill"
          :placeholder="`${ $t('apartments.agree.first_payment_date') }`"
          @select="changeFirstPaymentDate"
      />
      <!--  Дата ежемесячного платежа   -->
      <base-date-picker
          v-model="calc.payment_date"
          :range="false"
          class="data-picker payment-date-picker"
          format="DD.MM.YYYY"
          :icon-fill="datePickerIconFill"
          :placeholder="`${ $t('apartments.agree.payment_date') }`"
          @select="changePaymentDate"
      />
    </div>
    <div class="calculator-result">
      <div class="apartment-item">
        <span class="apartment-label">
         Начальная цена
        </span>
        <p class="apartment-value">
          {{ prettier(calc.initial_price) }}
        </p>
      </div>
      <div class="apartment-item">
        <span class="apartment-label">
         Остаток
        </span>
        <p class="apartment-value">
          {{ prettier(calc.remainder) }}
        </p>
      </div>
      <!--
        <div class="apartment-item">
          <span class="apartment-label">
           Ежемесячно оплата
          </span>
          <p class="apartment-value">
            {{ prettier(calc.monthly_payment) }}
          </p>
        </div>
      -->
      <div class="apartment-item">
        <span class="apartment-label">
         Скидка от общей суммы
        </span>
        <p class="apartment-value">
          {{ prettier(calc.total_discount) }}
        </p>
      </div>
      <div class="apartment-item">
        <span class="apartment-label">
          Итого
        </span>
        <p class="apartment-value">
          {{ prettier(calc.total) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSelect from "@/components/Reusable/BaseSelect";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import {formatToPrice} from "@/util/reusable";
import {mapActions, mapMutations, mapState} from 'vuex'

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
    datePickerIconFill: {
      type: String,
      required: true
    }
  },
  emits: ['update'],
  computed: {
    ...mapState('checkout', {
      calc: 'calc',
      discount: 'discount'
    })
  },
  methods: {
    ...mapMutations('checkout', {
      editState: 'editState'
    }),
    ...mapActions('checkout', {
      changeDiscount: 'changeDiscount',
      changePaymentDate: 'changePaymentDate',
      changeFirstPaymentDate: 'changeFirstPaymentDate'
    }),
    prettier: formatToPrice,
    mutateInitialPrice() {
      this.editState('initial_price')
      this.update()
    },
    mutateMonthlyPaymentPeriod() {
      this.editState('monthly_payment_period')
      this.update()
    },
    mutatePrepayment() {
      this.editState('prepayment')
      this.update()
    },
    updateDiscount(id) {
      const currentDiscount = this.paymentOptions.find(pmOp => pmOp.id === id)
      if (currentDiscount) {
        this.update(this.calc, currentDiscount)
        this.changeDiscount(currentDiscount)
      }
    },
    update(calc = null, discount = null) {
      if (calc && discount) {
        this.$emit('update', {
          calc, discount,
        })
      } else {
        this.$emit('update', {
          calc: this.calc,
          discount: this.discount
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  margin-bottom: 3rem;

  .calculator-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: 1rem;
    column-gap: .5rem;
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

    .checkout-monthly-payment-period {
      grid-area: two;
    }

    .checkout-prepay-percentage {
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
    display: flex;
    flex-direction: column;
    row-gap: 1.5rem;
  }

  &-initial-price-input,
  &-total-discount-input,
  &-discount-per-m2-input,
  &-prepay-percentage,
  &-monthly-payment-period {
    height: 56px;
    display: flex;
    min-width: 229.5px;
    border-radius: 32px;
    flex-direction: column;
    background-color: var(--gray-100);
    padding-left: 20px;
  }
}


.apartment-item {
  display: flex;
  column-gap: 24px;
  justify-content: space-between;
  align-items: center;
  font-family: Inter, sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
}

.apartment-label {
  color: var(--gray-400);
  margin-right: 1rem;
}

.apartment-value {
  margin: 0;
  color: var(--gray-600);
}


</style>