<script>
import SwitchButtonGroup from '@/views/home/elements/SwitchButtonGroup.vue'
import {
  computed, getCurrentInstance, ref, watch,
} from 'vue'

export default {
  name: 'HomeIncomeReports',
  components: {
    SwitchButtonGroup,
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
  emits: ['update'],
  setup(props, { emit }) {
    const vm = getCurrentInstance().proxy
    const periodType = ref('daily')
    const periods = computed(() => [
      {
        title: vm.$t('day'),
        value: 'daily',
      },
      {
        title: vm.$t('week'),
        value: 'weekly',
      },
      {
        title: vm.$t('month'),
        value: 'monthly',
      },
    ])

    watch(periodType, () => {
      emit('update', periodType.value)
    })

    return {
      periods,
      periodType,
    }
  },
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between flex-wrap mb-4">
      <h3 class="chart__title">
        {{ $t('common.income_reports') }}
        <b-spinner
          v-if="busy"
          class="chart__loading__spinner"
          small
        />
      </h3>
      <switch-button-group
        v-model="periodType"
        :items="periods"
      />
    </div>
    <apexchart
      height="600"
      type="line"
      class="mt-2 mb-1"
      :options="data.options"
      :series="data.series"
    />
  </div>
</template>

<style lang="scss" scoped>
.chart__loading__spinner{
  width: 1.5rem;
  height: 1.5rem;
  color: var(--violet-600);
}

.chart__title{
  color: var(--gray-600);
  font-family: Inter,sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
}
</style>
