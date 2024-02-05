<script>
import { computed, getCurrentInstance, ref, watch } from "vue";
import { isNull } from "@/util/inspect";
import { formatYMD } from "@/util/date";
import { formatDateWithDot } from "@/util/reusable";

import Permission from "@/permission";

import useHome from "@/views/home/useHome";
import useStatistics from "@/views/home/useStatistics";
import usePieStatistics from "@/views/home/usePieStatistics";
import useWidgets from "@/views/home/useWidgets";

import AppHeader from "@/components/Header/AppHeader.vue";
// import ObjectsIncomeByPeriod from '@/views/home/components/ObjectsIncomeByPeriod.vue'
// import ObjectPayments from '@/views/home/components/ObjectPayments.vue'
import HomePrimaryCards from "@/views/home/components/HomePrimaryCards.vue";
import HomeSecondaryCards from "@/views/home/components/HomeSecondaryCards.vue";
import HomeBranchReports from "@/views/home/components/HomeBranchReports.vue";
import HomeFilterBy from "@/views/home/components/HomeFilterBy.vue";
import HomeIncomeReports from "@/views/home/components/HomeIncomeReports.vue";
import HomeOrderReports from "@/views/home/components/HomeOrderReports.vue";
import HomePieChart from "@/views/home/components/HomePieChart.vue";
import SwitchButtonGroup from "@/views/home/elements/SwitchButtonGroup.vue";
import Manager from "@/views/home/components/manager/Manager.vue";
import HomeInitialPaymentReports from "@/views/home/components/HomeInitialPaymentReports.vue";
import HomeDebtorReports from "@/views/home/components/HomeDebtorReports.vue";
import HomeSalesReports from "@/views/home/components/HomeSalesReports.vue";

export default {
  components: {
    SwitchButtonGroup,
    AppHeader,
    // ObjectsIncomeByPeriod,
    // ObjectPayments,
    HomePrimaryCards,
    HomeSecondaryCards,
    HomeBranchReports,
    HomeFilterBy,
    HomeIncomeReports,
    HomeOrderReports,
    HomePieChart,
    Manager,
    HomeInitialPaymentReports,
    HomeDebtorReports,
    HomeSalesReports,
  },
  data: () => ({
    mainPermission: Permission.getUserPermission("general.view_statistics"),
    managerPermission: Permission.getUserPermission(
      "general.view_manager_statistics"
    ),
  }),
  setup() {
    const permissionFounderGraph = Permission.getUserPermission(
      "statistics.view-founder-graph",
      true
    );
    const permissionFounderTable = Permission.getUserPermission(
      "statistics.view-founder-table",
      true
    );
    const permissionManagerGraph = Permission.getUserPermission(
      "statistics.view-manager-graph",
      true
    );

    let defaultTypeOfView = "table";
    console.log("permissionFounderTable", permissionFounderTable);
    if (!permissionFounderTable) {
      if (permissionFounderGraph) {
        defaultTypeOfView = "chart";
      } else {
        defaultTypeOfView = "manager";
      }
    }

    const typeOfView = ref(defaultTypeOfView);
    const vm = getCurrentInstance().proxy;
    const tableLoaded = ref(false);
    const chartLoaded = ref(false);
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const filter = ref({
      date_from: formatYMD(startDate),
      date_to: formatYMD(new Date()),
      object_id: null,
      payment_type: null,
    });

    const views = computed(() => [
      {
        title: vm.$t("reports.title"),
        value: "table",
      },
      {
        title: vm.$t("common.chart"),
        value: "chart",
      },
    ]);

    const showTables = computed(() => typeOfView.value === "table");
    let objectsIncome /* fetchObjectsIncomeByPeriod */,
      objectPayments /* fetchObjectPayments */,
      initialPayments,
      fetchInitialPayments,
      salesMain,
      fetchSalesMain,
      debtorMain,
      fetchDebtorMain;
    console.log("permissionFounderTable", permissionFounderTable);
    if (permissionFounderTable) {
      const d = useHome();
      objectsIncome = d.objectsIncome;
      objectPayments = d.objectPayments;
      initialPayments = d.initialPayments;
      fetchInitialPayments = d.fetchInitialPayments;
      salesMain = d.salesMain;
      fetchSalesMain = d.fetchSalesMain;
      debtorMain = d.debtorMain;
      fetchDebtorMain = d.fetchDebtorMain;
    }
    // const {
    //   objectsIncome /* fetchObjectsIncomeByPeriod */,
    //   objectPayments /* fetchObjectPayments */,

    //   initialPayments,
    //   fetchInitialPayments,

    //   salesMain,
    //   fetchSalesMain,

    //   debtorMain,
    //   fetchDebtorMain,
    // } = useHome(); //founder

    let periodType,
      main,
      fetchMainData,
      total,
      fetchTotalData,
      branchReports,
      fetchBranchReportsData,
      incomeReports,
      fetchIncomeReportsData,
      orderReports,
      fetchOrderReportsData,
      statisticsFetchAll; // fetchAll:
    console.log("permissionFounderGraph", permissionFounderGraph);
    if (permissionFounderGraph) {
      const d = useStatistics();
      periodType = d.periodType;
      main = d.main;
      fetchMainData = d.fetchMainData;
      total = d.total;
      fetchTotalData = d.fetchTotalData;
      branchReports = d.branchReports;

      fetchBranchReportsData = d.fetchBranchReportsData;
      incomeReports = d.incomeReports;
      fetchIncomeReportsData = d.fetchIncomeReportsData;
      orderReports = d.orderReports;
      fetchOrderReportsData = d.fetchOrderReportsData;
      statisticsFetchAll = d.fetchAll;
    }
    // const {
    //   periodType,
    //   main,
    //   fetchMainData,
    //   total,
    //   fetchTotalData,
    //   branchReports,
    //   fetchBranchReportsData,
    //   incomeReports,
    //   fetchIncomeReportsData,
    //   orderReports,
    //   fetchOrderReportsData,
    //   fetchAll: statisticsFetchAll,
    // } = useStatistics();

    let objectSales, tariffsPie, managersPie, pieFetchAll;
    if (permissionFounderGraph) {
      const d = usePieStatistics();
      objectSales = d.objectSales;
      tariffsPie = d.tariffsPie;
      managersPie = d.managersPie;
      pieFetchAll = d.fetchAll;
    }
    // const {
    //   objectSales,
    //   tariffsPie,
    //   managersPie,
    //   fetchAll: pieFetchAll,
    // } = usePieStatistics();
    let managerWidget,
      managerSales,
      managerObjectsPie,
      managerSalesCount,
      managerStatusPie,
      widgetsFetchAll;
    if (permissionManagerGraph) {
      const d = useWidgets();
      managerWidget = d.managerWidget;
      managerSales = d.managerSales;
      managerObjectsPie = d.managerObjectsPie;
      managerSalesCount = d.managerSalesCount;
      managerStatusPie = d.managerStatusPie;
      widgetsFetchAll = d.fetchAll;
    }
    // const {
    //   managerWidget,
    //   managerSales,
    //   managerObjectsPie,
    //   managerSalesCount,
    //   managerStatusPie,
    //   fetchAll: widgetsFetchAll,
    // } = useWidgets();

    watch(typeOfView, (chTypeOfView) => {
      if (chTypeOfView === "table") {
        // eslint-disable-next-line no-use-before-define
        fetchTableViewData();
      } else {
        // eslint-disable-next-line no-use-before-define
        fetchChartViewData(getBody());
      }
    });

    function getBody() {
      const body = {};

      Object.entries(filter.value).forEach(([key, value]) => {
        if (!isNull(value)) {
          body[key] = value;
        }
      });

      return body;
    }

    async function fetchByPeriod(pType) {
      periodType.value = pType;
      const body = {
        ...getBody(),
        type: pType,
      };
      if (permissionFounderGraph)
        await Promise.allSettled([
          fetchIncomeReportsData(body),
          fetchBranchReportsData(body),
          fetchOrderReportsData(body),
        ]);
    }

    async function fetchTableViewData() {
      if (tableLoaded.value) {
        return;
      }
      if (permissionFounderTable)
        await Promise.allSettled([
          // fetchObjectsIncomeByPeriod(b),
          // fetchObjectPayments(b),
          fetchInitialPayments(),
          fetchSalesMain(),
          fetchDebtorMain(),
        ]);

      tableLoaded.value = true;
    }

    async function fetchChartViewData(b = {}) {
      if (chartLoaded.value) {
        return;
      }

      // const pList = []
      //
      // if (permissionFounderGraph) {
      //   pList.push(
      //     statisticsFetchAll(b),
      //   )
      //   pList.push(
      //     pieFetchAll(b),
      //   )
      // }
      const requests = [];
      if (permissionFounderGraph) {
        requests.push(statisticsFetchAll(b));
        requests.push(pieFetchAll(b));
      }
      if (permissionManagerGraph) {
        requests.push(
          widgetsFetchAll(b) //manager
        );
      }
      if (!requests.length) return;

      await Promise.allSettled(requests);
      chartLoaded.value = true;
    }

    async function fetchData(b = {}) {
      if (showTables.value) {
        await fetchTableViewData(b);
      } else {
        await fetchChartViewData(b);
      }
    }

    function filterCharts(fBody) {
      Object.entries(fBody).forEach(([key, value]) => {
        if (!isNull(value)) {
          filter.value[key] = value;
        }
      });

      chartLoaded.value = false;
      fetchChartViewData(getBody());
    }
    if (permissionFounderGraph) fetchMainData();
    fetchData(getBody());

    return {
      permissionFounderGraph,
      permissionFounderTable,
      permissionManagerGraph,

      initialPayments,
      salesMain,
      debtorMain,

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
      managerWidget,
      managerSales,
      managerObjectsPie,
      managerSalesCount,
      managerStatusPie,

      fetchTotalData,
      filterCharts,
      fetchByPeriod,
    };
  },

  methods: {
    formatDateWithDot,
    formatDate(d) {
      const y = d.getFullYear();
      let m = d.getMonth() + 1;
      if (m < 10) m = `0${m}`;
      let day = d.getDate();
      if (day < 10) day = `0${day}`;
      return `${y}-${m}-${day}`;
    },
  },
};
</script>

<template>
  <div>
    <app-header class="home__section">
      <template #header-actions>
        <switch-button-group
          v-if="permissionFounderGraph && permissionFounderTable"
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
      v-if="permissionFounderGraph || permissionFounderTable"
      :data="main.result"
      :busy="main.busy"
    />

    <home-filter-by
      v-if="!showTables && (permissionFounderGraph || permissionManagerGraph)"
      class="home__filter__section"
      :class="{
        home__manager__filter:
          permissionManagerGraph && !permissionFounderGraph,
      }"
      @filter-by="filterCharts"
    />

    <template v-if="permissionFounderGraph || permissionFounderTable">
      <section
        v-if="showTables && permissionFounderTable"
        class="home__section"
      >
        <home-initial-payment-reports
          :items="initialPayments.result"
          :busy="initialPayments.busy"
          class="mb-4"
        />

        <home-debtor-reports
          :items="debtorMain.result"
          :busy="debtorMain.busy"
          class="mb-4"
        />

        <home-sales-reports :items="salesMain.result" :busy="salesMain.busy" />

        <!--        <objects-income-by-period-->
        <!--          :busy="objectsIncome.busy"-->
        <!--          :data="objectsIncome.result"-->
        <!--        />-->
        <!--        <object-payments-->
        <!--          :busy="objectPayments.busy"-->
        <!--          :data="objectPayments.result"-->
        <!--        />-->
      </section>

      <section v-else-if="permissionFounderGraph" class="home__section">
        <home-secondary-cards :data="total.result" :busy="total.busy" />

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
            class="home__pie__section__objects"
          />

          <home-pie-chart
            :title="$t('common.sales_by_tariffs')"
            :busy="tariffsPie.busy"
            :data="tariffsPie.data"
            :items="tariffsPie.items"
            class="home__pie__section__tariffs"
            body-class="flex-column align-items-center"
            :table-sort-desc="false"
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
    </template>

    <!-- MANAGER -->
    <manager
      v-if="!showTables && permissionManagerGraph"
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
  gap: 1rem;
}

.home__filter__section {
  padding: 2rem 3rem 0;
}

.home__manager__filter {
  padding: 0 3rem 0;
}

.home__pie__section {
  display: grid;
  grid-template-areas:
    "objects objects"
    "tariffs managers";
  gap: 2rem;
}

.home__pie__section__objects {
  grid-area: objects;
}

.home__pie__section__tariffs {
  grid-area: tariffs;
}

.home__pie__section__tariffs {
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
  .home__pie__section {
    grid-template-areas:
      "objects"
      "tariffs"
      "managers";
  }
}
</style>
