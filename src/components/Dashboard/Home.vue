<script>
// import { mapActions, mapGetters } from "vuex";
import AppHeader from "@/components/Header/AppHeader";
// import ApartmentsPermission from "@/permission/apartments";
// import home from '../../services/home'
import { Statistics } from "@/services/home";
import { XIcon } from "@/components/ui-components/material-icons";
import { formatToPrice, phonePrettier } from "@/util/reusable";
import BaseLoading from "@/components/Reusable/BaseLoading2.vue";

const api = new Statistics();
export default {
  components: {
    BaseLoading,
    AppHeader,
    XIcon,
  },
  data: () => ({
    widgetData: null,
    salesOptions: null,
    objectsPieOptions: null,
    tariffsPieOptions: null,
    managersPieOptions: null,
    ordersOptions: null,
    branchesOptions: null,

    type: "weekly",
  }),

  async mounted() {
    await this.fetchWidgets();
    await this.fetchSales();
    this.fetchManagerPieData();
    this.fetchObjectPieData();
    this.fetchTariffsPieData();
    this.fetchOrders();
    this.fetchBranches();
  },

  computed: {
    typeOptions() {
      return [
        {
          text: "Daily",
          value: "daily",
          cls: "rounded-left border-right-0 pointer",
        },
        {
          text: "Weekly",
          value: "weekly",
          cls: "border-right-0 border-left-0",
        },
        {
          text: "Monthly",
          value: "monthly",
          cls: "rounded-right border-left-0 ",
        },
      ].map((el) => ({
        ...el,
        variant: el.value === this.type ? "primary" : "info",
        cls:
          el.value === this.type
            ? el.cls + " background-violet-600"
            : el.cls + " background-violet-100",
      }));
    },
  },

  methods: {
    fetchWidgets() {
      api.getWidgets().then((res) => (this.widgetData = res.data.result));
    },
    fetchSales() {
      api.getSalesData().then((res) => {
        const d = res.data.result;
        this.salesOptions = {
          chart: {
            type: "line",
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: d.label,
          },
          series: d.data.map((el) => ({ name: el.label, data: el.data })),
          yaxis: {
            labels: {
              formatter: function (v) {
                return formatToPrice(v, 2);
              },
            },
          },
          legend: {
            show: false,
          },
        };
      });
    },
    fetchObjectPieData() {
      api.getObjectPie().then((res) => {
        const d = res.data.result;
        this.objectsPieOptions = {
          chart: {
            height: 300,

            type: "pie",
          },
          dataLabels: {
            formatter: function (val, opts) {
              return opts.w.config.series[opts.seriesIndex];
            },
          },
          labels: d.label,
          series: d.data,
          legend: { position: "bottom" },
        };
      });
    },
    fetchManagerPieData() {
      api.getManagersPie().then((res) => {
        const d = res.data.result;
        this.managersPieOptions = {
          chart: {
            height: 300,
            type: "pie",
          },
          labels: d.label,
          series: d.data,
          legend: { position: "bottom" },
        };
      });
    },
    fetchTariffsPieData() {
      api.getTariffsPie().then((res) => {
        const d = res.data.result;
        this.tariffsPieOptions = {
          chart: {
            height: 300,

            type: "pie",
          },
          labels: d.label,
          series: d.data,
          legend: { position: "bottom" },
        };
      });
    },
    fetchOrders() {
      api.getOrdersData({ type: "weekly" }).then((res) => {
        const d = res.data.result;
        this.ordersOptions = {
          chart: {
            type: "line",
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: d.label,
          },
          series: d.data.map((el) => ({ name: el.label, data: el.data })),
          yaxis: {
            labels: {
              formatter: function (v) {
                return formatToPrice(v, 2);
              },
            },
          },
          legend: {
            show: false,
          },
        };
      });
    },
    fetchBranches() {
      api.getBranchesData({ type: "weekly" }).then((res) => {
        const d = res.data.result;
        this.branchesOptions = {
          chart: {
            type: "line",
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: d.label,
          },
          series: d.data.map((el) => ({ name: el.label, data: el.data })),
          yaxis: {
            labels: {
              formatter: function (v) {
                return formatToPrice(v, 2);
              },
            },
          },
          legend: {
            show: false,
          },
        };
      });
    },

    pricePrettier: (price, decimalCount) => formatToPrice(price, decimalCount),
    shortSum(n) {
      const str = (~~n).toString();
      switch (true) {
        case str.length > 6 && str.length < 10:
          return (str / 1_000_000).toFixed(2) + " млн";
        case str.length > 9 && str.length < 13:
          return (str / 1_000_000_000).toFixed(2) + " млрд";
        case str.length > 12 && str.length < 16:
          return (str / 1_000_000_000_000).toFixed(2) + " трлн";
        default:
          return formatToPrice(n, 2);
      }
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("home.title") }}
      </template>
    </app-header>
    <!-- WIDGETS -->
    <div class="row">
      <!--  -->
      <div class="col-sm-6 col-md-3 col-12">
        <div class="mr-2">
          <div class="card border-0 rounded pb-1 bg-primary shadow">
            <div class="bg-white p-3" v-if="widgetData">
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
            ></base-loading>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-md-3 col-12">
        <div class="mr-2">
          <div class="card border-0 rounded pb-1 bg-info shadow">
            <div class="bg-white p-3" v-if="widgetData">
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
              <div>{{ shortSum(widgetData.sales_sum, 2) }} {{ $t("ye") }}</div>
            </div>
            <base-loading
              v-else
              :container-height="108"
              class="bg-white"
            ></base-loading>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-md-3 col-12">
        <div class="mr-2">
          <div class="card border-0 rounded pb-1 bg-danger shadow">
            <div class="bg-white p-3" v-if="widgetData">
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
            ></base-loading>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-md-3 col-12">
        <div class="mr-2">
          <div class="card border-0 rounded pb-1 bg-warning shadow">
            <div class="bg-white p-3" v-if="widgetData">
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
              <div>{{ widgetData.paid_percentage }}%</div>
            </div>
            <base-loading
              v-else
              :container-height="108"
              class="bg-white"
            ></base-loading>
          </div>
        </div>
      </div>
    </div>
    <!-- SALES -->
    <div class="d-flex justify-content-between mt-5 align-items-center">
      <div class="">Отчеты по поступлениям</div>
      <div class="d-flex">
        <div
          v-for="r in typeOptions"
          :key="r.value"
          class="border px-4 py-2"
          :class="r.cls"
          @click="type = r.value"
          role="button"
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
            :height="300"
          ></apexchart>
          <base-loading
            v-else
            :container-height="315"
            class="bg-white"
          ></base-loading>
        </div>
      </div>
    </div>
    <!-- PIE CHARTS -->
    <div class="row">
      <div class="col-4 text-center">Продажи по обьектам</div>
      <div class="col-4 text-center">Продажи по тарифам</div>
      <div class="col-4 text-center">Продажи агентов</div>
    </div>
    <div class="row mt-2 mb-5">
      <div class="col-4">
        <div class="mr-3 shadow p-3">
          <apexchart
            v-if="objectsPieOptions"
            :options="objectsPieOptions"
            :series="objectsPieOptions.series"
            :height="300"
          ></apexchart>
          <base-loading
            v-else
            :container-height="268"
            class="bg-white"
          ></base-loading>
        </div>
      </div>
      <div class="col-4">
        <div class="mr-3 shadow p-3">
          <apexchart
            v-if="tariffsPieOptions"
            :options="tariffsPieOptions"
            :series="tariffsPieOptions.series"
            :height="300"
          ></apexchart>
          <base-loading
            v-else
            :container-height="268"
            class="bg-white"
          ></base-loading>
        </div>
      </div>
      <div class="col-4">
        <div class="mr-3 shadow p-3">
          <apexchart
            v-if="managersPieOptions"
            :options="managersPieOptions"
            :series="managersPieOptions.series"
            :height="300"
          ></apexchart>
          <base-loading
            v-else
            :container-height="268"
            class="bg-white"
          ></base-loading>
        </div>
      </div>
    </div>
    <div class="mt-5">Отчеты по Договорам</div>
    <!-- Orders -->
    <div class="row mt-2 mb-5">
      <div class="col-12">
        <apexchart
          v-if="ordersOptions"
          type="line"
          :options="ordersOptions"
          :series="ordersOptions.series"
          :height="300"
        ></apexchart>
        <base-loading
          v-else
          :container-height="315"
          class="bg-white"
        ></base-loading>
      </div>
    </div>
    <div class="mt-5">Отчеты по Филиалам</div>
    <!-- Orders -->
    <div class="row mt-2 mb-5">
      <div class="col-12">
        <apexchart
          v-if="branchesOptions"
          type="line"
          :options="branchesOptions"
          :series="branchesOptions.series"
          :height="300"
        ></apexchart>
        <base-loading
          v-else
          :container-height="315"
          class="bg-white"
        ></base-loading>
      </div>
    </div>
  </div>
</template>

<style>
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
</style>
