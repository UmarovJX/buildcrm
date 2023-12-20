<script>
import { ref } from 'vue'

export default {
  name: 'ManagerPieChart',
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
  setup() {
    const managerPieRef = ref(null)

    // watch(() => props.data.series, series => {
    //   if (isArray(series) && series.length) {
    //     console.log(managerPieRef)
    //     managerPieRef.value.updateOptions()
    //     managerPieRef.value.refresh()
    //     managerPieRef.value.updateSeries()
    //   }
    // })

    return {
      managerPieRef,
    }
  },
}
</script>

<template>
  <b-card
    no-body
    class="manager__pie__card"
  >
    <b-card-title class="manager__pie__card__title">
      {{ $t('common.branch_reports') }}
      <b-spinner
        v-if="busy"
        class="manager__spinner"
        small
      />
    </b-card-title>

    <b-card-body class="p-0">
      <apexchart
        height="400"
        type="bar"
        class="mt-2 mb-1"
        :options="data.options"
        :series="data.series"
      />
    </b-card-body>
  </b-card>
</template>

<style lang="scss" scoped>
.manager__pie__card {
  //max-width: 38.5rem;
  background-color: var(--gray-100);
  border-radius: 2rem;
  border: 2px solid var(--gray-200);
  padding: 2rem;
  color: var(--gray-600);

  &__title {
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.manager__spinner{
  width: 2rem;
  height: 2rem;
  color: var(--violet-600);
}
</style>
