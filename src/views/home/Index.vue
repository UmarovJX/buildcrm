<script>
import {
  computed, getCurrentInstance, ref, watch,
} from 'vue'
import { isNull } from '@/util/inspect'
import { formatYMD } from '@/util/date'
import { formatDateWithDot } from '@/util/reusable'

import Permission from '@/permission'

import useHome from '@/views/home/useHome'
import useStatistics from '@/views/home/useStatistics'
import usePieStatistics from '@/views/home/usePieStatistics'
import useWidgets from '@/views/home/useWidgets'

import AppHeader from '@/components/Header/AppHeader.vue'
import ObjectsIncomeByPeriod from '@/views/home/components/ObjectsIncomeByPeriod.vue'
import ObjectPayments from '@/views/home/components/ObjectPayments.vue'
import HomePrimaryCards from '@/views/home/components/HomePrimaryCards.vue'
import HomeSecondaryCards from '@/views/home/components/HomeSecondaryCards.vue'
import HomeBranchReports from '@/views/home/components/HomeBranchReports.vue'
import HomeFilterBy from '@/views/home/components/HomeFilterBy.vue'
import HomeIncomeReports from '@/views/home/components/HomeIncomeReports.vue'
import HomeOrderReports from '@/views/home/components/HomeOrderReports.vue'
import HomePieChart from '@/views/home/components/HomePieChart.vue'
import SwitchButtonGroup from '@/views/home/elements/SwitchButtonGroup.vue'
import Manager from '@/views/home/components/manager/Manager.vue'

export default {
  components: {
    SwitchButtonGroup,
    AppHeader,
    ObjectsIncomeByPeriod,
    ObjectPayments,
    HomePrimaryCards,
    HomeSecondaryCards,
    HomeBranchReports,
    HomeFilterBy,
    HomeIncomeReports,
    HomeOrderReports,
    HomePieChart,
    Manager,
  },
  data: () => ({
    mainPermission: Permission.getUserPermission('general.view_statistics'),
    managerPermission: Permission.getUserPermission(
      'general.view_manager_statistics',
    ),
  }),
  setup() {
    const vm = getCurrentInstance().proxy
    const tableLoaded = ref(false)
    const chartLoaded = ref(false)
    const startDate = new Date()
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    const filter = ref({
      date_from: formatYMD(startDate),
      date_to: formatYMD(new Date()),
      object_id: null,
      payment_type: null,
    })

    const typeOfView = ref('table')
    const views = computed(() => [
      {
        title: vm.$t('common.table'),
        value: 'table',
      },
      {
        title: vm.$t('common.chart'),
        value: 'chart',
      },
    ])

    const showTables = computed(() => typeOfView.value === 'table')

    const {
      objectsIncome, fetchObjectsIncomeByPeriod,
      objectPayments, fetchObjectPayments,
    } = useHome()

    const {
      periodType,
      main, fetchMainData,
      total, fetchTotalData,
      branchReports, fetchBranchReportsData,
      incomeReports, fetchIncomeReportsData,
      orderReports, fetchOrderReportsData,
      fetchAll: statisticsFetchAll,
    } = useStatistics()

    const {
      objectSales,
      tariffsPie,
      managersPie,
      fetchAll: pieFetchAll,
    } = usePieStatistics()

    const {
      widgetData,
      managerWidget,
      managerSales,
      managerObjectsPie,
      managerSalesCount,
      managerStatusPie,
      fetchAll: widgetsFetchAll,
    } = useWidgets()

    watch(typeOfView, chTypeOfView => {
      if (chTypeOfView === 'table') {
        // eslint-disable-next-line no-use-before-define
        fetchTableViewData()
      } else {
        // eslint-disable-next-line no-use-before-define
        fetchChartViewData(getBody())
      }
    })

    function getBody() {
      const body = {}

      Object.entries(filter.value).forEach(([key, value]) => {
        if (!isNull(value)) {
          body[key] = value
        }
      })

      return body
    }

    async function fetchByPeriod(pType) {
      periodType.value = pType
      const body = {
        ...getBody(),
        type: pType,
      }
      await Promise.allSettled([
        fetchIncomeReportsData(body),
        fetchBranchReportsData(body),
        fetchOrderReportsData(body),
      ])
    }

    async function fetchTableViewData(b = {}) {
      if (tableLoaded.value) {
        return
      }

      await Promise.allSettled([
        fetchObjectsIncomeByPeriod(b),
        fetchObjectPayments(b),
      ])
      tableLoaded.value = true
    }

    async function fetchChartViewData(b = {}) {
      if (chartLoaded.value) {
        return
      }

      await Promise.allSettled([
        statisticsFetchAll(b),
        pieFetchAll(b),
        widgetsFetchAll(b),
      ])
      chartLoaded.value = true
    }

    async function fetchData(b = {}) {
      if (showTables.value) {
        await fetchTableViewData(b)
      } else {
        await fetchChartViewData(b)
      }
    }

    function filterCharts(fBody) {
      Object.entries(fBody).forEach(([key, value]) => {
        if (!isNull(value)) {
          filter.value[key] = value
        }
      })

      chartLoaded.value = false
      fetchChartViewData(getBody())
    }

    fetchMainData()
    fetchData(getBody())

    return {
      views,
      typeOfView,

      showTables,

      main,
      total,
      managersPie,
      branchReports,
      incomeReports,
      orderReports,
      objectSales,
      tariffsPie,
      objectsIncome,
      objectPayments,
      widgetData,
      managerWidget,
      managerSales,
      managerObjectsPie,
      managerSalesCount,
      managerStatusPie,

      fetchTotalData,
      filterCharts,
      fetchByPeriod,
    }
  },

  methods: {
    formatDateWithDot,
    formatDate(d) {
      const y = d.getFullYear()
      let m = d.getMonth() + 1
      if (m < 10) m = `0${m}`
      let day = d.getDate()
      if (day < 10) day = `0${day}`
      return `${y}-${m}-${day}`
    },
  },
}
</script>

<template>
  <div>
    <app-header class="home__section">
      <template #header-actions>
        <switch-button-group
          v-model="typeOfView"
          class="mr-4"
          :items="views"
        />
      </template>

      <template #header-title>
        {{ $t("home.title") }}
      </template>
    </app-header>

    <home-primary-cards
      v-if="mainPermission"
      :data="main.result"
      :busy="main.busy"
    />

    <home-filter-by
      v-if="!showTables && (mainPermission || managerPermission)"
      class="home__filter__section"
      @filter-by="filterCharts"
    />

    <template v-if="mainPermission">
      <section
        v-if="!showTables"
        class="home__section"
      >

        <home-secondary-cards
          :data="total.result"
          :busy="total.busy"
        />

        <home-income-reports
          :busy="incomeReports.busy"
          :data="incomeReports.data"
          @update="fetchByPeriod"
        />

        <div class="home__pie__section">
          <home-pie-chart
            :title="$t('common.sales_by_objects')"
            :busy="objectSales.busy"
            :data="objectSales.data"
            :items="objectSales.items"
            class="home__pie__section__objects "
          />

          <home-pie-chart
            :title="$t('common.sales_by_tariffs')"
            :busy="tariffsPie.busy"
            :data="tariffsPie.data"
            :items="tariffsPie.items"
            class="home__pie__section__tariffs"
            body-class="flex-column align-items-center"
          />

          <home-pie-chart
            :title="$t('common.sales_by_managers')"
            :busy="managersPie.busy"
            :data="managersPie.data"
            :items="managersPie.items"
            class="home__pie__section__managers"
            body-class="flex-column align-items-center"
          />
        </div>

        <home-order-reports
          :busy="orderReports.busy"
          :data="orderReports.data"
        />

        <home-branch-reports
          :busy="branchReports.busy"
          :data="branchReports.data"
        />
      </section>
      <section
        v-else
        class="home__section"
      >
        <objects-income-by-period
          :busy="objectsIncome.busy"
          :data="objectsIncome.result"
        />

        <object-payments
          :busy="objectPayments.busy"
          :data="objectPayments.result"
        />
      </section>
    </template>

    <!-- MANAGER -->
    <manager
      v-if="!showTables && managerPermission"
      class="home__section"
      :manager-widgets="managerWidget"
      :manager-sales="managerSales"
      :manager-sales-count="managerSalesCount"
      :manager-objects-pie="managerObjectsPie"
      :manager-status-pie="managerStatusPie"
    />
  </div>
</template>

<style>
.home__section {
  padding: 2rem 3rem 0 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.home__filter__section{
  padding: 2rem 3rem 0;
}

.home__pie__section {
  display: grid;
  grid-template-areas:
    "objects objects"
    "tariffs managers";
  gap: 2rem;
}

.home__pie__section__objects{
  grid-area: objects;
}

.home__pie__section__tariffs{
  grid-area: tariffs;
}

.home__pie__section__tariffs{
  grid-area: managers;
}

.card-counter i {
  font-size: 6rem;
  opacity: 0.2;
  position: absolute;
  bottom: 0;
}

.card-counter .count-numbers {
  position: absolute;
  right: 35px;
  top: 20px;
  font-size: 42px;
  display: block;
}

.card-counter .count-name {
  position: absolute;
  right: 35px;
  top: 75px;
  font-style: italic;
  text-transform: capitalize;
  opacity: 0.5;
  display: block;
  font-size: 22px;
}

@media screen and (max-width: 960px) {
  .home__pie__section{
    grid-template-areas:
    "objects"
    "tariffs"
    "managers";
  }
}
</style>
