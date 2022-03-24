<template>
  <div class="currency__chart">
    <span class="title">{{ context.title }}</span>
    <span class="price">{{ context.price }} сум</span>
    <span class="bottom__info">{{ context.bottom }}</span>
    <span class="chart__list" :class="firstChartLineClass">
      <span class="d-flex align-items-center">
        <b-progress class="progress" :value="context.progress" :max="100"></b-progress>
        <span class="percent__value" v-show="context.index > 0">{{ context.progress }} %</span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "CurrencyChart",
  props: {
    context: {
      type: Object,
      required: true
    }
  },
  computed: {
    firstChartLineClass() {
      return {
        'first__chart': this.context.index === 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  line-height: 14px;
  color: var(--violet-600);
  display: block;
  margin-bottom: 1rem;
}

.price {
  font-size: 24px;
  line-height: 28px;
  color: var(--gray-600);
}

.bottom__info {
  display: block;
  color: var(--gray-400);
  margin-top: 4px;
}

.chart__list {
  display: block;
  margin-bottom: 24px;
  margin-top: 16px;

  & > span {
    height: 28px;
  }

  .progress {
    width: 75%;
    height: 6px;
    border-radius: 1rem;
    background-color: var(--gray-200);
  }

  ::v-deep .progress-bar {
    background-color: var(--violet-600) !important;
  }

  .percent__value {
    display: block;
    margin-left: 8px;
    color: var(--gray-600);
    font-size: 16px;
    line-height: 22px;
  }
}

.first__chart {
  .progress {
    width: 100%;
    height: 6px;
    border-radius: 1rem;
    background-color: var(--gray-200);
  }
}
</style>