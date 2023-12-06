<script>
import { mapActions, mapGetters } from "vuex";
import AppHeader from "@/components/Header/AppHeader";
import ApartmentsPermission from "@/permission/apartments";
// import home from '../../services/home'
import { v3ServiceApi as api } from "@/services/v3/v3.service";
import { XIcon } from "@/components/ui-components/material-icons";
import { formatToPrice, formatDateWithDot } from "@/util/reusable";
import BaseLoading from "@/components/Reusable/BaseLoading2.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  components: {
    DateRangePicker,
    BaseLoading,
    AppHeader,
    XIcon,
  },
  data: () => {
    const e = new Date();
    const s = new Date();
    s.setMonth(s.getMonth() - 3);
    s.setHours(0, 0, 0, 0);

    return {
      widgetData: null,
      salesOptions: null,
      objectsPieOptions: null,
      tariffsPieOptions: null,
      managersPieOptions: null,
      ordersOptions: null,
      branchesOptions: null,

      type: "daily",
      paymentType: "",

      dateRange: {
        startDate: s,
        endDate: e,
      },
    };
  },

  mounted() {
    this.fetchStats();

    this.fetchCounts(this);
  },

  computed: {
    ...mapGetters(["getHomeCounts", "getPermission"]),
    apartmentsViewPermission() {
      return ApartmentsPermission.getApartmentsPermission("view");
    },
    typeOptions() {
      return [
        {
          text: "Дни",
          value: "daily",
          cls: "rounded-left border-right-0 pointer",
        },
        {
          text: "Недели",
          value: "weekly",
          cls: "border-right-0 border-left-0",
        },
        {
          text: "Месяцы",
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
    paymentTypeOptions() {
      return [
        {
          text: "Все",
          value: "",
          cls: "rounded-left border-right-0 pointer",
        },
        {
          text: "1 взнос",
          value: "initial_payment",
          cls: "border-right-0 border-left-0",
        },
        {
          text: "Ежемесячно",
          value: "monthly",
          cls: "rounded-right border-left-0 ",
        },
      ].map((el) => ({
        ...el,
        variant: el.value === this.type ? "primary" : "info",
        cls:
          el.value === this.paymentType
            ? el.cls + " background-violet-600"
            : el.cls + " background-violet-100",
      }));
    },
  },
  watch: {
    type() {
      this.fetchStats();
    },

    dateRange: {
      handler() {
        this.fetchStats();
      },
    },
    paymentType() {
      this.fetchStats();
    },
  },

  methods: {
    formatDateWithDot,
    getQuery() {
      const query = {
        type: this.type,
      };

      if (this.dateRange.startDate) {
        query.date_from = this.dateRange.startDate.toISOString().split("T")[0];
        query.date_to = this.dateRange.endDate.toISOString().split("T")[0];
      }
      if (this.paymentType) {
        query.payment_type = this.paymentType;
      }
      return query;
    },
    finishDateSelection() {
      this.$refs.picker.togglePicker(false);
    },
    fetchStats() {
      this.fetchWidgets();
      this.fetchSales();
      this.fetchManagerPieData();
      this.fetchObjectPieData();
      this.fetchTariffsPieData();
      this.fetchOrders();
      this.fetchBranches();
    },
    ...mapActions(["fetchCounts"]),
    fetchWidgets() {
      this.widgetData = null;
      api.stats
        .getWidgets(this.getQuery())
        .then((res) => (this.widgetData = res.data.result));
    },
    fetchSales() {
      this.salesOptions = null;
      api.stats.getSalesData(this.getQuery()).then((res) => {
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
      this.objectsPieOptions = null;
      api.stats.getObjectPie(this.getQuery()).then((res) => {
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
      this.managersPieOptions = null;
      api.stats.getManagersPie(this.getQuery()).then((res) => {
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
      this.tariffsPieOptions = null;
      api.stats.getTariffsPie(this.getQuery()).then((res) => {
        const d = res.data.result;
        this.tariffsPieOptions = {
          chart: {
            height: 300,

            type: "pie",
          },
          labels: d.label.map((el) => (el === null ? "Other" : el)),
          series: d.data,
          legend: { position: "bottom" },
        };
      });
    },
    fetchOrders() {
      this.ordersOptions = null;
      api.stats.getOrdersData(this.getQuery()).then((res) => {
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
      this.branchesOptions = null;
      api.stats.getBranchesData(this.getQuery()).then((res) => {
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
    <div class="container-fluid px-0 mx-0 mb-4">
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div
              class="col-lg-3 col-md-6 mb-md-0 mb-3"
              v-if="getPermission.objects && getPermission.objects.view"
            >
              <router-link :to="{ name: 'objects' }">
                <div class="card-counter primary">
                  <i class="far fa-building"></i>
                  <span
                    class="count-numbers"
                    v-if="getHomeCounts.counts && getHomeCounts"
                    >{{ getHomeCounts.counts.objects }}</span
                  >
                  <span class="count-name">{{ $t("objects.title") }}</span>
                </div>
              </router-link>
            </div>

            <!-- <div class="col-lg-3 col-md-6 mb-md-0 mb-3" v-if="getPermission.clients.view">
                    <router-link :to="{name: 'clients'}">
                      <div class="card-counter danger">
                        <i class="far fa-users-class"></i>
                        <span class="count-numbers">{{
                          getHomeCounts.counts.clients
                        }}</span>
                        <span class="count-name">{{ $t("clients.title") }}</span>
                      </div>
                    </router-link>
                  </div> -->

            <div
              class="col-lg-3 col-md-6 mb-md-0 mb-3"
              v-if="getPermission.users && getPermission.users.view"
            >
              <router-link :to="{ name: 'users' }">
                <div class="card-counter success">
                  <i class="far fa-users"></i>
                  <span class="count-numbers" v-if="getHomeCounts.counts">{{
                    getHomeCounts.counts.users
                  }}</span>
                  <span class="count-name">{{ $t("users.title") }}</span>
                </div>
              </router-link>
            </div>

            <!--                <div class="col-lg-3 col-md-6 mb-md-0 mb-3">-->
            <!--                    <div class="card-counter info">-->
            <!--                        <i class="far fa-cogs"></i>-->
            <!--                        <span class="count-numbers"></span>-->
            <!--                        <span class="count-name">{{ $t('settings.title') }}</span>-->
            <!--                    </div>-->
            <!--                </div>-->

            <div
              class="col-lg-3 col-md-6 mb-md-0 mb-3"
              v-if="apartmentsViewPermission"
            >
              <router-link :to="{ name: 'objects-filter' }">
                <div class="card-counter apartments">
                  <i class="far fa-home"></i>
                  <span class="count-numbers" v-if="getHomeCounts.counts">{{
                    getHomeCounts.counts.apartments
                  }}</span>
                  <span class="count-name">{{ $t("objects.apartments") }}</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="d-flex align-items-center justify-content-end mb-3">
          <date-range-picker
            ref="picker"
            placeholder="Select Dates"
            :locale-data="{ firstDay: 1, format: 'dd.mm.yyyy' }"
            v-model="dateRange"
            :auto-apply="true"
          >
            <template #input="picker" style="min-width: 350px">
              <div class="flex align-items-center">
                <x-icon
                  v-if="picker.startDate == null"
                  name="date_range"
                  :size="28"
                  class="violet-600 mr-4"
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
            </template></date-range-picker
          >

          <div class="d-flex ml-4">
            <div
              v-for="r in paymentTypeOptions"
              :key="r.value"
              class="border px-4 py-2"
              :class="r.cls"
              @click="paymentType = r.value"
              role="button"
            >
              {{ r.text }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- WIDGETS -->
    <div class="row">
      <!--  -->
      <div class="col-sm-6 col-md-3 col-12">
        <div class="">
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
        <div class="">
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
        <div class="">
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
        <div class="">
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
              <div>{{ widgetData.paid_percentage.toFixed(2) }}%</div>
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
