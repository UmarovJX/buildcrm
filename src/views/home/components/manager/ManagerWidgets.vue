<script>
import { formatToPrice } from '@/util/reusable'
import { abbreviateNumber } from '@/util/numberHelper'

import BaseCard from '@/views/home/elements/BaseCard.vue'

export default {
  name: 'ManagerWidgets',
  components: {
    BaseCard,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    busy: {
      type: Boolean,
      required: true,
    },
  },
  methods: { abbreviateNumber, formatToPrice },
}
</script>

<template>
  <div class="secondary__cards">
    <div class="secondary__cards__wrapper">
      <base-card
        icon="apartment"
        :title="`${ $t('objects.title') }`"
        :multiple="false"
      >
        <template #bottom>
          <b-spinner
            v-if="busy"
            class="secondary__cards__spinner"
            small
          />
          <span v-else>
            {{ data.objects_count }}
          </span>
        </template>
      </base-card>

      <base-card
        icon="description"
        :title="`${ $t('contracts.name') }`"
        :multiple="false"
      >
        <template #bottom>
          <b-spinner
            v-if="busy"
            class="secondary__cards__spinner"
            small
          />
          <span v-else>
            {{ formatToPrice(data.contracts_count) }}
          </span>
        </template>
      </base-card>

      <base-card
        icon="price_check"
        class="widget__grow__2"
        :title="`${ $t('common.receipts') }`"
        :bottom-left="{
          title: '',
          value:abbreviateNumber(data.sales_sum)
        }"
        :bottom-right="{
          title: $t('plan.title'),
          value: `${ data.plan_percentage.toFixed(2) }%`
        }"
      />

      <base-card
        icon="event_available"
        class="widget__grow__2"
        :title="`${ $t('common.loose') }`"
        :bottom-left="{
          title: $t('common.apartments'),
          value:data.available_apartments_count
        }"
        :bottom-right="{
          title: $t('parkings'),
          value:data.available_parking_count
        }"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.secondary__cards {
  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem 1rem;
  }

  &__spinner {
    width: 2rem;
    height: 2rem;
    //border: 20px solid var(--violet-600);
  }
}

.widget__grow__2{
  flex-grow: 2;
}
</style>
