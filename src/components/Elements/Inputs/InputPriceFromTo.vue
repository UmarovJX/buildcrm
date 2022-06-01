<template>
  <div class="input-price-group">
    <!-- PRICE FROM   -->
    <base-price-input
        :currency="`${$t('ye')}`"
        :placeholder="$t('base_price_from')"
        :value="defaultFrom"
        :top-placeholder="true"
        @input="price.from = $event"
        class="price-from"
    />
    <!--  PRICE TO  -->
    <base-price-input
        :currency="`${$t('ye')}`"
        :placeholder="$t('base_price_to')"
        :value="defaultTo"
        :top-placeholder="true"
        @input="price.to = $event"
        class="price-to"
    />
  </div>
</template>

<script>
import BasePriceInput from "@/components/Reusable/BasePriceInput";

export default {
  name: "InputPriceFromTo",
  components: {
    BasePriceInput
  },
  emits: ['input'],
  props: {
    defaultFrom: {
      type: String,
      default: null
    },
    defaultTo: {
      type: String,
      default: null
    },
  },
  data() {
    return {
      price: {
        from: null,
        to: null
      }
    }
  },
  watch: {
    price: {
      handler(value) {
        this.$emit('input', value)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.input-price-group {
  height: 3.5rem;
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  border-radius: 2rem;
  background-color: var(--gray-100);
  color: var(--gray-600);

  .price-from,
  .price-to {
    height: 100%;
    padding: 0 1.25rem;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    border: none;
    font-family: inherit;
    color: inherit;

    &::placeholder {
      font-family: Inter, sans-serif;
      color: var(--gray-400);
      font-weight: 600;
    }
  }

  .price-from {
    border-right: 1px solid var(--gray-300);
  }

  .price-to {
    border-left: 1px solid var(--gray-300);
  }
}
</style>