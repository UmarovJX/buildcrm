<script>
import { formatToPrice } from '@/util/reusable'

import BaseCard from '@/views/home/elements/BaseCard.vue'
import ManagersPieChart from '@/views/home/components/ManagersPieChart.vue'

export default {
  name: 'PrimaryCards',
  components: {
    BaseCard,
    ManagersPieChart,
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
    managerData: {
      type: Object,
      required: true,
    },
    managerBusy: {
      type: Boolean,
      required: true,
    },
  },
  methods: { formatToPrice },
}
</script>

<template>
  <div class="secondary__cards">
    <div class="secondary__cards__wrapper">
      <base-card
        icon="task"
        :title="`${ $t('report.orders') }`"
        :multiple="false"
      >
        <template #bottom>
          <b-spinner
            v-if="busy"
            class="secondary__cards__spinner"
            small
          />
          <span v-else>
            {{ data.orders_count }}
          </span>
        </template>
      </base-card>
      <base-card
        icon="finance_mode"
        :title="`${ $t('common.sales') }`"
        :multiple="false"
      >
        <template #bottom>
          <b-spinner
            v-if="busy"
            class="secondary__cards__spinner"
            small
          />
          <span v-else>
            {{ formatToPrice(data.sales_sum) }}
          </span>
        </template>
      </base-card>
      <base-card
        icon="payments"
        :title="`${ $t('common.sold_area') }`"
        :multiple="false"
      >
        <template #bottom>
          <b-spinner
            v-if="busy"
            class="secondary__cards__spinner"
            small
          />
          <span v-else>
            {{ formatToPrice(data.area_sum) }} M<sup>2</sup>
          </span>
        </template>
      </base-card>
      <base-card
        icon="database"
        :title="`${ $t('common.sales_receipts') }`"
        :multiple="false"
      >
        <template #bottom>
          <b-spinner
            v-if="busy"
            class="secondary__cards__spinner"
            small
          />
          <span v-else>
            {{ formatToPrice(data.paid_percentage,2) }} %
          </span>
        </template>
      </base-card>

      <managers-pie-chart
        class="manager__pie__chart"
        :busy="managerBusy"
        :data="managerData"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.secondary__cards {
  //padding: 2rem 3rem 0 3rem;

  &__wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  &__spinner{
    width: 2rem;
    height: 2rem;
    //border: 20px solid var(--violet-600);
  }
}

.manager__pie__chart{
  grid-column: 1/3;
}
</style>
