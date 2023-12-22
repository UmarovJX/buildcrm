<script>
export default {
  name: 'HomeOrderReports',
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
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <h3 class="chart__title">
        {{ $t('common.report_on_contracts') }}
        <b-spinner
          v-if="busy"
          class="chart__loading__spinner"
          small
        />
      </h3>
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
