<script>
import {
  computed, getCurrentInstance,
} from 'vue'
import SalesCard from '@/views/home/elements/SalesCard.vue'

export default {
  name: 'HomeInitialPaymentReports',
  components: {
    SalesCard,
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

    const reportItems = computed(() => props.items.map(({
      type, area, apartments_count, avg_area_cost, avg_cost,
    }) => ({
      title: vm.$t(`common.${type}`),
      area,
      apartmentsCount: apartments_count,
      avgAreaCost: avg_area_cost,
      avgCost: avg_cost,
    })))

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
        {{ $t('statistics.debtor_reports_title') }}
        <b-spinner
          v-if="busy"
          class="loading__spinner"
          small
        />
      </h3>
    </div>

    <div class="section__wrapper">
      <sales-card
        v-for="(item,index) in reportItems"
        :key="index"
        :title="item.title"
        :total="item.total"
        :area="item.area"
        :apartments-count="item.apartmentsCount"
        :avg-area-cost="item.avgAreaCost"
        :avg-cost="item.avgCost"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section__wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem 1rem;
  min-height: 250px;
  margin-top: 1rem;
  //border-bottom: 6px solid var(--gray-100);
}

.loading__spinner{
  width: 1.5rem;
  height: 1.5rem;
  color: var(--violet-600);
}
</style>
