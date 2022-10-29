<template>
  <div class="ch-payment-result">
    <div class="ch-payment-information">
      <span class="gray-400">{{ $t('starting_price') }}</span>
      <span class="ch-price-cell gray-400">{{ prettier(apm.calc.base_price) }} сум</span>

      <span class="gray-400">{{ $t('price_m') }}<sup>2</sup></span>
      <span class="ch-price-cell gray-400">{{ prettier(apm.calc.price_m2) }} сум</span>

      <span class="gray-400">{{ $t('contracts.view.initial_fee') }}</span>
      <span class="ch-price-cell gray-400">{{ prettier(apm.calc.initial_price) }} сум</span>

      <span class="gray-400">{{ $t('remainder') }}</span>
      <span class="ch-price-cell gray-400">{{ prettier(apm.calc.remainder) }} сум</span>

      <span class="teal-500">{{ $t('total_discount') }}</span>
      <span class="ch-price-cell teal-500">{{ prettier(apm.calc.total_discount) }} сум</span>

      <span class="teal-500">{{ $t('discount_per_m') }}<sup>2</sup></span>
      <span class="ch-price-cell teal-500">{{ prettier(apm.calc.discount_per_m2) }} сум</span>
    </div>
    <div class="ch-border-dashed"></div>
    <div class="ch-total-price">
      <span class="violet-500 ch-price-total-cell">{{ $t('total') }}</span>
      <span class="ch-price-cell violet-700 ch-price-total-cell ch-price-total">
        {{ prettier(apm.calc.total) }} сум
      </span>
    </div>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_NUMBER_STRING, PROP_TYPE_OBJECT} from "@/constants/props";
import {formatToPrice} from "@/util/reusable";

export default {
  name: "ChPaymentResult",
  props: {
    apartmentId: p(PROP_TYPE_NUMBER_STRING, undefined),
    apm: p(PROP_TYPE_OBJECT, {})
  },
  methods: {
    prettier: formatToPrice
  }
}
</script>

<style lang="scss" scoped>
.ch-payment-result {
  border-radius: 2rem;
  border: 2px solid var(--gray-200);
  padding: 1.5rem;
  font-family: Inter, sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;

  .ch-payment-information {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: space-between;
    justify-items: stretch;
    row-gap: 1.5rem;
  }

  .ch-border-dashed {
    border-top: 2px dashed var(--gray-200);
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .ch-total-price {
    display: grid;
    grid-template-columns: auto auto;
    align-items: end;
  }

  .ch-price-cell {
    justify-self: end;
  }

  .ch-price-total-cell {
    align-self: end;
  }

  .ch-price-total {
    font-size: 24px;
    line-height: 30px;
  }
}
</style>