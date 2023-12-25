<script>
import { computed, getCurrentInstance, ref } from 'vue'

import BaseLoading from '@/components/Reusable/BaseLoading.vue'
import { formatToPrice } from '@/util/reusable'

export default {
  name: 'HomePieChart',
  components: {
    BaseLoading,
  },
  props: {
    title: {
      type: [String, Object],
      default: '',
    },
    data: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    busy: {
      type: Boolean,
      required: true,
    },
    bodyClass: {
      type: [String, Object, Array],
      default: '',
    },
  },
  setup() {
    const vm = getCurrentInstance().proxy
    const pieChartRef = ref(null)
    const tableFields = computed(() => [
      {
        key: 'objectName',
        label: vm.$t('title'),
      },
      {
        key: 'objectData',
        label: vm.$t('sum'),
        formatter: x => formatToPrice(x, 2),
      },
      {
        key: 'objectPercent',
        label: '%',
      },
    ])

    return {
      tableFields,
      pieChartRef,
    }
  },
}
</script>

<template>
  <b-card
    no-body
    class="home__pie__card"
  >
    <b-card-title class="home__pie__card__title">
      {{ title }}
      <b-spinner
        v-if="busy"
        class="loading__spinner"
        small
      />
    </b-card-title>

    <b-card-body
      class="p-0 home__pie__card__body"
      :class="bodyClass"
    >
      <apexchart
        id="apexChartSales"
        ref="pieChartRef"
        type="donut"
        height="400"
        width="400"
        :options="data.options"
        :series="data.series"
      />

      <b-table
        id="my-table"
        ref="apartment-list-table"
        thead-tr-class="table__head__tr"
        tbody-tr-class="table__body__tr"
        class="home__table__list"
        sticky-header
        borderless
        show-empty
        responsive
        sort-icon-left
        :items="items"
        :fields="tableFields"
        :busy="busy"
        :empty-text="$t('no_data')"
      >
        <template #table-busy>
          <base-loading />
        </template>

        <template #empty="scope">
          <span class="d-flex justify-content-center align-items-center">
            {{ scope["emptyText"] }}
          </span>
        </template>
      </b-table>

    </b-card-body>
  </b-card>
</template>

<style lang="scss" scoped>
.home__pie__card {
  //width: max-content;
  background-color: var(--gray-50);
  border-radius: 2rem;
  padding: 1.5rem;
  border: none;
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

  &__body {
    display: flex;
    //flex-wrap: wrap;
    //flex-direction: column;
    //justify-content: center;
    gap: 3rem;
    margin: 2rem;
    //margin: 1.5rem 1.5rem 2rem 2rem;
  }
}

.loading__spinner {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--violet-600);
}

@mixin th__base {
  color: #9CA3AF;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  background-color: transparent;
}

::v-deep .home__table__list {
  //max-width: 30rem;
  width: 100%;
  overflow-y: hidden;

  .table__head__tr {
    border-bottom: 2px solid var(--gray-200);

    th.table-b-table-default {
      @include th__base
    }
  }

  .table__body__tr {
    @include th__base
  }
}

@media screen and (max-width: 1200px) {
  .home__pie__card {
    &__body {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
