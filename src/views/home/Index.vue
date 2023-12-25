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

import { XIcon } from '@/components/ui-components/material-icons'
import AppHeader from '@/components/Header/AppHeader.vue'
import BaseLoading from '@/components/Reusable/BaseLoading2.vue'
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
    BaseLoading,
    AppHeader,
    XIcon,

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
      shortSum,
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
      shortSum,
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
    />

    <div
      v-if="!showTables && managerPermission"
      class="home__section"
    >
      <!-- WIDGETS -->
      <div class="row">
        <!--  -->
        <div class="col-sm-6 col-md-3 col-12">
          <div class="h-100">
            <div class="card border-0 rounded pb-1 bg-primary shadow h-100">
              <div
                v-if="managerWidget"
                class="bg-white p-3 h-100 d-flex flex-column justify-content-between"
              >
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="d-flex mr-4 p-1 rounded"
                    style="background-color: var(--violet-100)"
                  >
                    <x-icon
                      name="apartment"
                      :size="28"
                      class="violet-600"
                      color="var(--violet-600)"
                    />
                  </div>
                  <div>Объекты</div>
                </div>
                <div>{{ managerWidget.objects_count }}</div>
              </div>
              <base-loading
                v-else
                :container-height="108"
                class="bg-white"
              />
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-md-3 col-12">
          <div class="h-100">
            <div class="card border-0 rounded pb-1 bg-info shadow h-100">
              <div
                v-if="managerWidget"
                class="bg-white p-3 h-100 d-flex flex-column justify-content-between"
              >
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="d-flex mr-4 p-1 rounded"
                    style="background-color: var(--violet-100)"
                  >
                    <x-icon
                      name="description"
                      :size="28"
                      class="violet-600"
                      color="var(--violet-600)"
                    />
                  </div>
                  <div>Договоры</div>
                </div>
                <div>
                  {{ managerWidget.contracts_count }}
                </div>
              </div>
              <base-loading
                v-else
                :container-height="108"
                class="bg-white"
              />
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-md-3 col-12">
          <div class="h-100">
            <div class="card border-0 rounded pb-1 bg-danger shadow h-100">
              <div
                v-if="managerWidget"
                class="bg-white p-3 h-100 d-flex flex-column justify-content-between"
              >
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="d-flex mr-4 p-1 rounded"
                    style="background-color: var(--violet-100)"
                  >
                    <x-icon
                      name="price_check"
                      :size="28"
                      class="violet-600"
                      color="var(--violet-600)"
                    />
                  </div>
                  <div>Поступления</div>
                </div>
                <div>
                  {{ shortSum(managerWidget.sales_sum) }} {{ $t("ye") }}
                </div>
                <div>План:{{ managerWidget.plan_percentage.toFixed(2) }} %</div>
              </div>
              <base-loading
                v-else
                :container-height="108"
                class="bg-white"
              />
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-md-3 col-12">
          <div class="h-100">
            <div class="card border-0 rounded pb-1 bg-warning shadow h-100">
              <div
                v-if="managerWidget"
                class="bg-white p-3 h-100 d-flex flex-column justify-content-between"
              >
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="d-flex mr-4 p-1 rounded"
                    style="background-color: var(--violet-100)"
                  >
                    <x-icon
                      name="event_available"
                      :size="28"
                      class="violet-600"
                      color="var(--violet-600)"
                    />
                  </div>
                  <div>Свободные</div>
                </div>
                <div>
                  Квартиры: {{ managerWidget.available_apartments_count }}
                </div>
                <div>Парковки: {{ managerWidget.available_parking_count }}</div>
              </div>
              <base-loading
                v-else
                :container-height="108"
                class="bg-white"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5">
        Отчеты по Поступлениям
      </div>
      <div class="row">
        <div class="col-9">
          <apexchart
            v-if="managerSales"
            type="line"
            :options="managerSales"
            :series="managerSales.series"
            :height="300"
          />
          <base-loading
            v-else
            :container-height="315"
            class="bg-white"
          />
        </div>
        <div class="col-3">
          <div class="mr-3 shadow p-3">
            <apexchart
              v-if="managerObjectsPie"
              :options="managerObjectsPie"
              :series="managerObjectsPie.series"
              :height="250"
            />
            <base-loading
              v-else
              :container-height="218"
              class="bg-white"
            />
          </div>
        </div>
      </div>
      <div class="mt-5">
        Отчеты по Продажам
      </div>
      <div class="row">
        <div class="col-9">
          <apexchart
            v-if="managerSalesCount"
            type="line"
            :options="managerSalesCount"
            :series="managerSalesCount.series"
            :height="300"
          />
          <base-loading
            v-else
            :container-height="315"
            class="bg-white"
          />
        </div>
        <div class="col-3">
          <div class="mr-3 shadow p-3">
            <apexchart
              v-if="managerStatusPie"
              :options="managerStatusPie"
              :series="managerStatusPie.series"
              :height="250"
            />
            <base-loading
              v-else
              :container-height="218"
              class="bg-white"
            />
          </div>
        </div>
      </div>
    </div>
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
