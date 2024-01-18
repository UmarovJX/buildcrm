<script>
import {
  computed, getCurrentInstance,
} from 'vue'
import BaseCard from '@/views/home/elements/BaseCard.vue'
import { formatToPrice } from '@/util/reusable'

export default {
  name: 'HomeInitialPaymentReports',
  components: {
    BaseCard,
  },
  props: {
    busy: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const vm = getCurrentInstance().proxy
    function showPlanPercentage(type) {
      return ['this_month', 'last_month'].includes(type)
    }

    function showOrders(type) {
      return type !== 'today'
    }

    function showAverageCheck(type) {
      return type === 'this_month'
    }

    const emptyProp = {
      title: '',
      value: '',
    }

    const reportItems = computed(() => props.items.map(({
      type, plan_percentage, orders, amount, sale_avg,
    }) => {
      const left = showPlanPercentage(type) ? {
        title: vm.$t('plan.title'),
        value: `${formatToPrice(plan_percentage, 2)}%`,
      } : emptyProp

      const center = showOrders(type) ? {
        title: '',
        value: vm.$t('common.paid_for', {
          paid: orders.paid,
          total: orders.total,
        }),
      } : emptyProp

      const extra = showAverageCheck(type) ? {
        title: vm.$t('common.average_check'),
        value: `${formatToPrice(sale_avg)}`,
      } : emptyProp

      return {
        type,
        title: vm.$t(`common.${type}`),
        left,
        center,
        right: {
          title: '',
          value: `${formatToPrice(amount)}`,
        },
        extra,
      }
    }))

    return {
      reportItems,
    }
  },
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between">
      <h3 class="gray-600 font-craftworksans">
        {{ $t('common.prepayment_report') }}
        <b-spinner
          v-if="busy"
          class="loading__spinner"
          small
        />
      </h3>
    </div>

    <div class="section__wrapper">
      <base-card
        v-for="(reportItem,index) in reportItems"
        :key="index"
        class="w-100"
        bottom-flex-column
        :has-icon="false"
        :bottom-left="reportItem.left"
        :bottom-right="reportItem.right"
        :bottom-center="reportItem.center"
        :bottom-extra="reportItem.extra"
      >
        <template #bottom-center>
          <span class="gray-400">{{ reportItem.center.value }}</span>
        </template>

        <template #title>
          <span class="font-weight-bold">{{ reportItem.title }}</span>
        </template>
      </base-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section__wrapper {
  display: flex;
  //flex-wrap: wrap;
  gap: 2rem 1rem;
  //min-height: 250px;
  margin-top: 1rem;
  //border-bottom: 6px solid var(--gray-100);
}

.loading__spinner{
  width: 1.5rem;
  height: 1.5rem;
  color: var(--violet-600);
}
</style>
