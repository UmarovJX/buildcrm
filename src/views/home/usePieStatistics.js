import { ref } from 'vue'
import { v3ServiceApi } from '@/services/v3/v3.service'
import { useToastError } from '@/composables/useToastError'
import { formatToPrice } from '@/util/reusable'

const pieChartOptions = {
  // colors: chartColors,
  plotOptions: {
    pie: {
      size: 600,
    },
  },
  chart: {
    height: 400,
    width: 400,
    type: 'donut',
  },
  dataLabels: {
    enabled: true,
    // formatter(val) {
    //   return `${formatToPrice(val)}`
    // },
  },
  legend: {
    show: false,
    fontFamily: 'Inter, san-serif',
    fontSize: 16,
    position: 'bottom',
    onItemHover: {
      highlightDataSeries: true,
    },
    onItemClick: {
      toggleDataSeries: true,
    },
  },
  labels: [],
}

export default function usePieStatistics() {
  const { toastError } = useToastError()

  const objectSales = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
    items: [],
  })

  const tariffsPie = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
    items: [],
  })

  const managersPie = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
    items: [],
  })

  function getPercent(a, b) {
    return `${formatToPrice((a / b) * 100)}%`
  }

  async function fetchObjectSalesData(body = {}) {
    try {
      objectSales.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.getObjectPie(
        {
          filter_type: 'sum',
          ...body,
        },
      )
      const sum = result.data.reduce((acc, a) => acc + a, 0)

      objectSales.value.items = result.label.map((label, labelIndex) => ({
        objectName: label,
        objectData: result.data[labelIndex],
        objectPercent: getPercent(result.data[labelIndex], sum),
      }))

      objectSales.value.data.options = {
        ...pieChartOptions,
        labels: result.label,
      }

      objectSales.value.data.series = result.data
    } catch (e) {
      toastError(e)
    } finally {
      objectSales.value.busy = false
    }
  }

  async function fetchTariffsPieData(body = {}) {
    try {
      tariffsPie.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.getTariffsPie(body)

      const sum = result.data.reduce((acc, a) => acc + a, 0)

      tariffsPie.value.items = result.label.map((label, labelIndex) => ({
        objectName: label,
        objectData: result.data[labelIndex],
        objectPercent: getPercent(result.data[labelIndex], sum),
      }))

      tariffsPie.value.data.options = {
        ...pieChartOptions,
        labels: result.label,
      }

      tariffsPie.value.data.series = result.data
    } catch (e) {
      toastError(e)
    } finally {
      tariffsPie.value.busy = false
    }
  }

  async function fetchManagersPieData(body = {}) {
    try {
      managersPie.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.getManagersPie(body)

      const sum = result.data.reduce((acc, a) => acc + a, 0)

      managersPie.value.items = result.label.map((label, labelIndex) => ({
        objectName: label,
        objectData: result.data[labelIndex],
        objectPercent: getPercent(result.data[labelIndex], sum),
      }))

      managersPie.value.data.options = {
        ...pieChartOptions,
        labels: result.label,
      }

      managersPie.value.data.series = result.data
    } catch (e) {
      toastError(e)
    } finally {
      managersPie.value.busy = false
    }
  }

  return {
    objectSales,
    fetchObjectSalesData,

    tariffsPie,
    fetchTariffsPieData,

    managersPie,
    fetchManagersPieData,
  }
}
