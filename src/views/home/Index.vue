<script>
import { mapActions, mapGetters } from 'vuex'
import { isNull } from '@/util/inspect'
import { formatToPrice, formatDateWithDot } from '@/util/reusable'
import useStatistics from '@/views/home/useStatistics'
import { v3ServiceApi as api } from '@/services/v3/v3.service'

import Permission from '@/permission'
import ApartmentsPermission from '@/permission/apartments'

import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

import DateRangePicker from 'vue2-daterange-picker'
import { XIcon } from '@/components/ui-components/material-icons'
import AppHeader from '@/components/Header/AppHeader.vue'
import BaseLoading from '@/components/Reusable/BaseLoading2.vue'
import ObjectsIncomeByPeriod from '@/views/home/components/ObjectsIncomeByPeriod.vue'
import ObjectPayments from '@/views/home/components/ObjectPayments.vue'
import HomePrimaryCards from '@/views/home/components/HomePrimaryCards.vue'
import HomeSecondaryCards from '@/views/home/components/HomeSecondaryCards.vue'
import HomeBranchReports from '@/views/home/components/HomeBranchReports.vue'
import HomeFilterBy from '@/views/home/components/HomeFilterBy.vue'

export default {
  components: {
    DateRangePicker,
    BaseLoading,
    AppHeader,
    XIcon,

    ObjectsIncomeByPeriod,
    ObjectPayments,
    HomePrimaryCards,
    HomeSecondaryCards,
    HomeBranchReports,
    HomeFilterBy,
  },
  data: () => {
    const e = new Date()
    const s = new Date()
    s.setDate(1)
    // s.setMonth(s.getMonth() - 3)
    s.setHours(0, 0, 0, 0)

    return {
      mainPermission: Permission.getUserPermission('general.view_statistics'),
      managerPermission: Permission.getUserPermission(
        'general.view_manager_statistics',
      ),
      objectsIncome: {
        result: {},
        busy: false,
      },
      objectPayments: {
        result: {},
        busy: false,
      },

      widgetData: null,
      salesOptions: null,
      objectsPieOptions: null,
      tariffsPieOptions: null,
      managersPieOptions: null,
      ordersOptions: null,
      branchesOptions: null,

      managerWidget: null,
      managerSales: null,
      managerSalesCount: null,
      managerObjectsPie: null,
      managerStatusPie: null,

      type: 'daily',
      paymentType: '',

      dateRange: {
        startDate: s,
        endDate: e,
      },
    }
  },

  computed: {
    ranges() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      )
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)

      const quarterStart = new Date(today.getFullYear(), today.getMonth() - 2, 1)
      const halfStart = new Date(today.getFullYear(), today.getMonth() - 5, 1)

      return {
        Сегодня: [today, today],
        // Вчера: [yesterday, yesterday],
        'Этот месяц': [thisMonthStart, thisMonthEnd],
        'Прошлый месяц': [lastMonthStart, lastMonthEnd],
        Квартал: [quarterStart, today],
        '6 месяцев': [halfStart, today],
        Год: [new Date(today.getFullYear(), 0, 1), today],
        'Весь период': [new Date(2019, 0, 1), today],
      }
    },
    ...mapGetters(['getHomeCounts', 'getPermission']),
    apartmentsViewPermission() {
      return ApartmentsPermission.getApartmentsPermission('view')
    },
    typeOptions() {
      return [
        {
          text: 'Дни',
          value: 'daily',
          cls: 'rounded-left border-right-0 pointer',
        },
        {
          text: 'Недели',
          value: 'weekly',
          cls: 'border-right-0 border-left-0',
        },
        {
          text: 'Месяцы',
          value: 'monthly',
          cls: 'rounded-right border-left-0 ',
        },
      ].map(el => ({
        ...el,
        variant: el.value === this.type ? 'primary' : 'info',
        cls:
          el.value === this.type
            ? `${el.cls} background-violet-600`
            : `${el.cls} background-violet-100`,
      }))
    },
    paymentTypeOptions() {
      return [
        {
          text: 'Все',
          value: '',
          cls: 'rounded-left border-right-0 pointer',
        },
        {
          text: '1 взнос',
          value: 'initial_payment',
          cls: 'border-right-0 border-left-0',
        },
        {
          text: 'Ежемесячно',
          value: 'monthly',
          cls: 'rounded-right border-left-0 ',
        },
      ].map(el => ({
        ...el,
        variant: el.value === this.type ? 'primary' : 'info',
        cls:
          el.value === this.paymentType
            ? `${el.cls} background-violet-600`
            : `${el.cls} background-violet-100`,
      }))
    },
  },

  watch: {
    type() {
      this.fetchStats()
    },

    dateRange: {
      handler() {
        this.fetchStats()
      },
    },
    paymentType() {
      this.fetchStats()
    },
  },

  mounted() {
    this.fetchCounts(this)
  },

  created() {
    this.fetchStats()
  },

  setup() {
    const {
      main, fetchMainData,
      total, fetchTotalData,
      managersPie, fetchManagersPieData,
      branchReports, fetchBranchReportsData,
    } = useStatistics()

    async function fetchData() {
      await Promise.allSettled([
        fetchMainData(),
        fetchTotalData(),
        fetchManagersPieData(),
        fetchBranchReportsData(),
      ])
      console.log('branchReports', branchReports)
    }

    function filterCharts(filter) {
      const body = {}

      Object.entries(filter).forEach(([key, value]) => {
        if (!isNull(value)) {
          body[key] = value
        }
      })

      Promise.allSettled([
        fetchTotalData(body),
        fetchManagersPieData(body),
        fetchBranchReportsData(body),
      ])
    }

    fetchData()

    return {
      main,
      total,
      managersPie,
      branchReports,
      fetchTotalData,
      filterCharts,
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
    getQuery() {
      const query = {
        type: this.type,
      }

      if (this.dateRange.startDate) {
        query.date_from = this.formatDate(this.dateRange.startDate)
        query.date_to = this.formatDate(this.dateRange.endDate)
      }
      if (this.paymentType) {
        query.payment_type = this.paymentType
      }
      return query
    },
    finishDateSelection() {
      this.$refs.picker.togglePicker(false)
    },
    fetchStats() {
      Promise.allSettled([
        this.fetchWidgets(),
        this.fetchSales(),
        this.fetchManagerPieData(),
        this.fetchObjectPieData(),
        this.fetchTariffsPieData(),
        this.fetchOrders(),
        this.fetchManagerWidgets(),
        this.fetchManagerSales(),
        this.fetchManagerObjectsPie(),
        this.fetchManagerSalesCount(),
        this.fetchManagerStatusPie(),
        this.fetchObjectsIncomeByPeriod(),
        this.fetchObjectPayments(),
      ])
    },
    ...mapActions(['fetchCounts']),
    async fetchWidgets() {
      this.widgetData = null
      const widgetsRsp = await api.stats.getWidgets(this.getQuery())
      this.widgetData = widgetsRsp.data.result
    },
    async fetchSales() {
      this.salesOptions = null
      const salesRsp = await api.stats.getSalesData(this.getQuery())
      const d = salesRsp.data.result
      this.salesOptions = {
        chart: {
          type: 'line',
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          // range: 40,
          categories: d.label,
        },
        series: d.data.map(el => ({ name: el.label, data: el.data })),
        yaxis: {
          tickAmount: 15,
          labels: {
            formatter(v) {
              return formatToPrice(v, 2)
            },
          },
        },
        legend: {
          show: false,
        },
      }
    },
    async fetchObjectPieData() {
      this.objectsPieOptions = null
      const objectPieRsp = await api.stats.getObjectPie(this.getQuery())
      const d = objectPieRsp.data.result
      this.objectsPieOptions = {
        chart: {
          height: 300,

          type: 'pie',
        },
        dataLabels: {
          formatter(val, opts) {
            return opts.w.config.series[opts.seriesIndex]
          },
        },
        labels: d.label,
        series: d.data,
        legend: { position: 'bottom' },
      }
    },
    async fetchManagerPieData() {
      this.managersPieOptions = null
      const managersPieRsp = await api.stats.getManagersPie(this.getQuery())
      const d = managersPieRsp.data.result
      this.managersPieOptions = {
        chart: {
          height: 300,
          type: 'pie',
        },
        labels: d.label,
        series: d.data,
        legend: { position: 'bottom' },
      }
    },
    async fetchTariffsPieData() {
      this.tariffsPieOptions = null
      const tariffsRsp = await api.stats.getTariffsPie(this.getQuery())
      const d = tariffsRsp.data.result
      this.tariffsPieOptions = {
        chart: {
          height: 300,

          type: 'pie',
        },
        labels: d.label.map(el => (el === null ? 'Other' : el)),
        series: d.data,
        legend: { position: 'bottom' },
      }
    },
    async fetchOrders() {
      this.ordersOptions = null
      const ordersRsp = await api.stats.getOrdersData(this.getQuery())
      const d = ordersRsp.data.result
      this.ordersOptions = {
        chart: {
          type: 'line',
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          categories: d.label,
        },
        series: d.data.map(el => ({ name: el.label, data: el.data })),
        yaxis: {
          labels: {
            formatter(v) {
              return formatToPrice(v, 2)
            },
          },
        },
        legend: {
          show: false,
        },
      }
    },
    async fetchManagerWidgets() {
      this.managerWidget = null
      const managerWidgetRsp = await api.managerStats
        .getTotal(this.getQuery())

      this.managerWidget = managerWidgetRsp.data.result
    },
    async fetchManagerSales() {
      this.managerSales = null
      const salesRsp = await api.managerStats
        .getSales({ ...this.getQuery(), filter_type: 'sum' })
      const d = salesRsp.data.result
      this.managerSales = {
        chart: {
          type: 'line',
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          categories: d.label,
        },
        series: d.data.map(el => ({ name: el.label, data: el.data })),
        yaxis: {
          labels: {
            formatter(v) {
              return formatToPrice(v, 2)
            },
          },
        },
        legend: {
          show: false,
        },
      }
    },
    async fetchManagerSalesCount() {
      this.managerSalesCount = null
      const salesRsp = await api.managerStats
        .getSales({ ...this.getQuery(), filter_type: 'count' })

      const d = salesRsp.data.result
      this.managerSalesCount = {
        chart: {
          type: 'line',
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          categories: d.label,
        },
        series: d.data.map(el => ({ name: el.label, data: el.data })),
        yaxis: {
          labels: {
            minWidth: 60,
          },
        },
        legend: {
          show: false,
        },
      }
    },
    async fetchManagerObjectsPie() {
      this.managerObjectsPie = null
      const salesPieRsp = await api.managerStats
        .getSalesPie({ ...this.getQuery(), filter_type: 'sum' })

      const d = salesPieRsp.data.result
      this.managerObjectsPie = {
        chart: {
          height: 300,

          type: 'pie',
        },
        dataLabels: {
          formatter(val, opts) {
            return opts.w.config.series[opts.seriesIndex]
          },
        },
        labels: d.label,
        series: d.data,
        legend: { position: 'bottom' },
      }
    },
    async fetchManagerStatusPie() {
      this.managerStatusPie = null
      const managerStatusRsp = await api.managerStats
        .getStatusPie({ ...this.getQuery(), filter_type: 'sum' })
      const d = managerStatusRsp.data.result
      this.managerStatusPie = {
        chart: {
          height: 300,

          type: 'pie',
        },
        dataLabels: {
          formatter(val, opts) {
            return opts.w.config.series[opts.seriesIndex]
          },
        },
        labels: d.label,
        series: d.data,
        legend: { position: 'bottom' },
      }
    },
    async fetchObjectsIncomeByPeriod() {
      try {
        this.objectsIncome.busy = true
        const { data: { result } } = await api.stats.objectsByPeriod()
        this.objectsIncome.result = result
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.objectsIncome.busy = false
      }
    },
    async fetchObjectPayments() {
      try {
        this.objectPayments.busy = true
        const { data: { result } } = await api.stats.objectPayments()
        this.objectPayments.result = result
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.objectPayments.busy = false
      }
    },

    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    shortSum(n) {
      const str = Math.floor(n).toString()
      switch (true) {
        case str.length > 6 && str.length < 10:
          return `${(str / 1_000_000).toFixed(2)} млн`
        case str.length > 9 && str.length < 13:
          return `${(str / 1_000_000_000).toFixed(2)} млрд`
        case str.length > 12 && str.length < 16:
          return `${(str / 1_000_000_000_000).toFixed(2)} трлн`
        case str.length > 15 && str.length < 19:
          return `${(str / 1_000_000_000_000).toFixed(2)} квадрлн`
        default:
          return formatToPrice(n, 2)
      }
    },
  },
}
</script>

<template>
  <div>
    <app-header class="home__section">
      <template #header-title>
        {{ $t("home.title") }}
      </template>
    </app-header>

    <home-primary-cards
      :data="main.result"
      :busy="main.busy"
    />

    <section class="home__section">
      <home-filter-by
        @filter-by="filterCharts"
      />

      <home-secondary-cards
        :data="total.result"
        :busy="total.busy"
        :manager-busy="managersPie.busy"
        :manager-data="managersPie.data"
      />

      <home-branch-reports
        :busy="branchReports.busy"
        :data="branchReports.data"
        class="mt-4"
      />
    </section>

    <template v-if="mainPermission">
      <objects-income-by-period
        :busy="objectsIncome.busy"
        :data="objectsIncome.result"
        class="home__table home__section"
      />
      <object-payments
        :busy="objectPayments.busy"
        :data="objectPayments.result"
        class="home__table home__section"
      />
    </template>

    <div
      v-if="mainPermission || managerPermission"
      class="row home__section"
    >
      <div class="col-12">
        <div class="d-flex align-items-center justify-content-end mb-3">
          <date-range-picker
            ref="picker"
            v-model="dateRange"
            placeholder="Select Dates"
            :locale-data="{ firstDay: 1, format: 'dd.mm.yyyy' }"
            auto-apply
            show-dropdowns
            :ranges="ranges"
          >
            <template
              #input="picker"
              style="min-width: 350px"
            >
              <div class="d-flex align-items-center">
                <x-icon
                  name="date_range"
                  :size="24"
                  class="violet-600 mr-2"
                  color="var(--violet-600)"
                />
                <span>{{
                  picker.startDate
                    ? formatDateWithDot(picker.startDate) +
                      " - " +
                      formatDateWithDot(picker.endDate)
                    : "Выберите даты"
                }}</span>
              </div>
            </template>
          </date-range-picker>

          <div class="d-flex ml-4">
            <div
              v-for="r in paymentTypeOptions"
              :key="r.value"
              class="border px-4 py-2"
              :class="r.cls"
              role="button"
              @click="paymentType = r.value"
            >
              {{ r.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Common stats -->
    <div
      v-if="mainPermission"
      class="home__section"
    >
      <!-- WIDGETS -->
      <div class="row">
        <!--  -->
        <div class="col-sm-6 col-md-3 col-12">
          <div class="">
            <div class="card border-0 rounded pb-1 bg-primary shadow">
              <div
                v-if="widgetData"
                class="bg-white p-3"
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
                  <div>Заказы</div>
                </div>
                <div>{{ widgetData.orders_count }}</div>
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
          <div class="">
            <div class="card border-0 rounded pb-1 bg-info shadow">
              <div
                v-if="widgetData"
                class="bg-white p-3"
              >
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="d-flex mr-4 p-1 rounded"
                    style="background-color: var(--violet-100)"
                  >
                    <x-icon
                      name="add_shopping_cart"
                      :size="28"
                      class="violet-600"
                      color="var(--violet-600)"
                    />
                  </div>
                  <div>Продажи</div>
                </div>
                <div>
                  {{ shortSum(widgetData.sales_sum, 2) }} {{ $t("ye") }}
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
          <div class="">
            <div class="card border-0 rounded pb-1 bg-danger shadow">
              <div
                v-if="widgetData"
                class="bg-white p-3"
              >
                <div class="d-flex align-items-center mb-3">
                  <div
                    class="d-flex mr-4 p-1 rounded"
                    style="background-color: var(--violet-100)"
                  >
                    <x-icon
                      name="crop_5_4"
                      :size="28"
                      class="violet-600"
                      color="var(--violet-600)"
                    />
                  </div>
                  <div>Проданная площадь</div>
                </div>
                <div>
                  {{ pricePrettier(widgetData.area_sum, 2) }} м<sup>2</sup>
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
          <div class="">
            <div class="card border-0 rounded pb-1 bg-warning shadow">
              <div
                v-if="widgetData"
                class="bg-white p-3"
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
                  <div>Поступления по продажам</div>
                </div>
                <div>{{ widgetData.paid_percentage.toFixed(2) }}%</div>
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
      <!-- SALES -->
      <div class="d-flex justify-content-between mt-5 align-items-center">
        <div class="">
          Отчеты по поступлениям
        </div>
        <div class="d-flex">
          <div
            v-for="r in typeOptions"
            :key="r.value"
            class="border px-4 py-2"
            :class="r.cls"
            role="button"
            @click="type = r.value"
          >
            {{ r.text }}
          </div>
        </div>
      </div>
      <div class="mt-2 mb-5">
        <div class="row">
          <div class="col-12">
            <apexchart
              v-if="salesOptions"
              type="line"
              :options="salesOptions"
              :series="salesOptions.series"
              :height="500"
            />
            <base-loading
              v-else
              :container-height="315"
              class="bg-white"
            />
          </div>
        </div>
      </div>
      <!-- PIE CHARTS -->
      <div class="row">
        <div class="col-4 text-center">
          Продажи по обьектам
        </div>
        <div class="col-4 text-center">
          Продажи по тарифам
        </div>
        <div class="col-4 text-center">
          Продажи агентов
        </div>
      </div>
      <div class="row mt-2 mb-5">
        <div class="col-4">
          <div class="mr-3 shadow p-3">
            <apexchart
              v-if="objectsPieOptions"
              :options="objectsPieOptions"
              :series="objectsPieOptions.series"
              :height="300"
            />
            <base-loading
              v-else
              :container-height="268"
              class="bg-white"
            />
          </div>
        </div>
        <div class="col-4">
          <div class="mr-3 shadow p-3">
            <apexchart
              v-if="tariffsPieOptions"
              :options="tariffsPieOptions"
              :series="tariffsPieOptions.series"
              :height="300"
            />
            <base-loading
              v-else
              :container-height="268"
              class="bg-white"
            />
          </div>
        </div>
        <div class="col-4">
          <div class="mr-3 shadow p-3">
            <apexchart
              v-if="managersPieOptions"
              :options="managersPieOptions"
              :series="managersPieOptions.series"
              :height="300"
            />
            <base-loading
              v-else
              :container-height="268"
              class="bg-white"
            />
          </div>
        </div>
      </div>
      <div class="mt-5">
        Отчеты по Договорам
      </div>
      <!-- Orders -->
      <div class="row mt-2 mb-5">
        <div class="col-12">
          <apexchart
            v-if="ordersOptions"
            type="line"
            :options="ordersOptions"
            :series="ordersOptions.series"
            :height="300"
          />
          <base-loading
            v-else
            :container-height="315"
            class="bg-white"
          />
        </div>
      </div>
    </div>

    <!-- MANAGER -->
    <div
      v-if="managerPermission"
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
  padding: 3rem 3rem 0 3rem;
}

.card-counter {
  /*box-shadow: 2px 2px 10px #dadada;*/
  padding: 25px 16px;
  background-color: var(--background-color-nav);
  height: 200px;
  transition: 0.3s linear all;
  border-radius: 0.428rem;
  box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
}

.card-counter:hover {
  transition: 0.3s linear all;
}

.card-counter.primary {
  background-color: #0068d6;
  color: #fff;
}

.card-counter.danger {
  background-color: #ff5c59;
  color: #fff;
}

.card-counter.success {
  background-color: #52a756;
  color: #fff;
}

.card-counter.info {
  background-color: #2daebe;
  color: #fff;
}

.card-counter.apartments {
  background-color: #9267d6;
  color: #fff;
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

.home__table {
  //margin: 4rem 0;
}
</style>
