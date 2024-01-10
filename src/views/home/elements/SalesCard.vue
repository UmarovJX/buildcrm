<script>
import BaseCard from '@/views/home/elements/BaseCard.vue'
import { formatToPrice } from '../../../util/reusable'
/*
* {
  "total": 0,
  "area": 0,
  "apartments_count": 0,
  "parking_count": 0,
  "avg_area_cost": 0,
  "avg_cost": 0
}
* */
export default {
  components: {
    BaseCard,
  },
  props: {
    title: {
      type: [String, Object],
      default: 'Title',
    },
    total: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number,
      default: 0,
    },
    apartmentsCount: {
      type: Number,
      default: 0,
    },
    avgAreaCost: {
      type: Number,
      default: 0,
    },
    avgCost: {
      type: Number,
      default: 0,
    },
  },
  methods: { formatToPrice },
}
</script>

<template>
  <base-card
    :title="title"
    icon="attach_money"
    class="w-100"
  >
    <template #bottom>
      <div class="sales__details">
        <div class="d-flex flex-column">
          <span class="item__title">{{ $t('sum') }}</span>
          <span class="item__value">{{ formatToPrice(total) }}</span>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{ $t('common.square_meters') }}</span>
          <span class="item__value">{{ formatToPrice(area) }}</span>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{ $t('statistics.numbers_of_apartments') }}</span>
          <span class="item__value">{{ formatToPrice(apartmentsCount) }}</span>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{ $t('statistics.average_price_per_m2') }}</span>
          <span class="item__value">{{ formatToPrice(avgAreaCost) }}</span>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{ $t('common.average_check') }}</span>
          <span class="item__value">{{ formatToPrice(avgCost) }}</span>
        </div>
      </div>
    </template>
  </base-card>
</template>

<style lang="scss" scoped>
.sales__details {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  font-family: Inter, sans-serif;
  font-weight: 700;

  .item__title {
    color: var(--gray-400);
  }

  .item__value{
    color: var(--gray-600);
    font-weight: 600;
  }
}
</style>
