<script>
import BasePriceInput from '@/components/Reusable/BasePriceInput'

export default {
  name: 'InputPriceFromTo',
  components: {
    BasePriceInput,
  },
  emits: ['input'],
  props: {
    defaultFrom: {
      type: [String, Number],
      default: null,
    },
    defaultTo: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      price: {
        from: null,
        to: null,
      },
    }
  },
  watch: {
    price: {
      handler(value) {
        this.$emit('input', value)
      },
      deep: true,
    },
  },
  created() {
    this.setDefaultFields()
  },
  methods: {
    setDefaultFields() {
      this.price.to = this.defaultTo
      this.price.from = this.defaultFrom
    },
    resetFields() {
      this.$refs['input-price-from'].clearPriceAmountValue()
      this.$refs['input-price-to'].clearPriceAmountValue()
    },
  },
}
</script>

<template>
  <div class="input-price-group">
    <!-- PRICE FROM   -->
    <base-price-input
      ref="input-price-from"
      :currency="`${$t('ye')}`"
      :placeholder="$t('base_price_from')"
      :value="defaultFrom"
      :permission-change="true"
      :top-placeholder="true"
      class="price-from"
      @input="price.from = $event"
    />
    <!--  PRICE TO  -->
    <base-price-input
      ref="input-price-to"
      :currency="`${$t('ye')}`"
      :placeholder="$t('base_price_to')"
      :value="defaultTo"
      :top-placeholder="true"
      :permission-change="true"
      class="price-to"
      @input="price.to = $event"
    />
  </div>
</template>

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
