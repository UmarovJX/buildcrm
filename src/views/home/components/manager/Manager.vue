<script>
import ManagerWidgets from '@/views/home/components/manager/ManagerWidgets.vue'
import ManagerSales from '@/views/home/components/manager/ManagerSales.vue'
import HomeLineChart from '@/views/home/components/HomeLineChart.vue'
import HomePieChart from '@/views/home/components/HomePieChart.vue'

export default {
  components: {
    HomePieChart,
    ManagerWidgets,
    ManagerSales,
    HomeLineChart,
  },
  props: {
    managerWidgets: {
      type: Object,
      required: true,
    },
    managerSales: {
      type: Object,
      required: true,
    },
    managerSalesCount: {
      type:
      Object,
      required: true,
    },
    managerObjectsPie: {
      type: Object,
      required: true,
    },
    managerStatusPie: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div>
    <manager-widgets
      :busy="false"
      :data="managerWidgets"
    />

    <home-line-chart
      :busy="managerSales.busy"
      :data="managerSales.data"
      :title="$t('common.report_on_receipts')"
    />

    <home-pie-chart
      :busy="managerObjectsPie.busy"
      :items="managerObjectsPie.items"
      :data="managerObjectsPie.data"
    />

    <home-line-chart
      :busy="managerSalesCount.busy"
      :data="managerSalesCount.data"
      :title="$t('common.sales_reports')"
    />

    <home-pie-chart
      :busy="managerStatusPie.busy"
      :items="managerStatusPie.items"
      :data="managerStatusPie.data"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
