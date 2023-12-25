import { computed, ref } from 'vue'
import { formatToPrice } from '@/util/reusable'
import { v3ServiceApi as api } from '@/services/v3/v3.service'
import { useToastError } from '@/composables/useToastError'
import { getPercent, lineChartOptions, pieChartOptions } from '@/views/home/chartOptions'

export default function useWidgets() {
  const { toastError } = useToastError()

  const widgetData = ref(null)
  const managerWidget = ref(null)
  const managerStatusPie = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
    items: [],
  })

  const managerObjectsPie = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
    items: [],
  })

  const managerSales = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
  })
  const managerSalesCount = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
  })

  const paymentType = ref('')
  const paymentTypeOptions = computed(() => [
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
    variant: 'primary',
    cls:
          el.value === paymentType.value
            ? `${el.cls} background-violet-600`
            : `${el.cls} background-violet-100`,
  })))

  async function fetchWidgets(b = {}) {
    widgetData.value = null
    const widgetsRsp = await api.stats.getWidgets(b)
    widgetData.value = widgetsRsp.data.result
  }

  async function fetchManagerWidgets(b = {}) {
    managerWidget.value = null
    const managerWidgetRsp = await api.managerStats.getTotal(b)
    managerWidget.value = managerWidgetRsp.data.result
  }

  async function fetchManagerSales(b = {}) {
    try {
      managerSales.value.busy = true
      const { data: { result } } = await api.managerStats.getSales({ ...b, filter_type: 'sum' })

      managerSales.value.data.series = result.data.map(item => ({
        name: item.label,
        data: item.data,
      }))

      managerSales.value.data.options = {
        ...lineChartOptions,
        xaxis: {
          ...lineChartOptions.xaxis,
          categories: result.label,
        },
        legend: {
          show: true,
        },
      }
    } catch (e) {
      toastError(e)
    } finally {
      managerSales.value.busy = false
    }
  }

  async function fetchManagerSalesCount(b = {}) {
    try {
      managerSalesCount.value.busy = true

      const { data: { result } } = await api.managerStats.getSales({ ...b, filter_type: 'count' })

      managerSalesCount.value.data.series = result.data.map(item => ({
        name: item.label,
        data: item.data,
      }))

      managerSalesCount.value.data.options = {
        ...lineChartOptions,
        xaxis: {
          ...lineChartOptions.xaxis,
          categories: result.label,
        },
        legend: {
          show: true,
        },
      }
    } catch (e) {
      toastError(e)
    } finally {
      managerSalesCount.value.busy = false
    }
  }

  async function fetchManagerObjectsPie(b = {}) {
    try {
      managerObjectsPie.value.busy = true
      const { data: { result } } = await api.managerStats.getSalesPie({ ...b, filter_type: 'sum' })

      const sum = result.data.reduce((acc, a) => acc + a, 0)

      managerObjectsPie.value.items = result.label.map((label, labelIndex) => ({
        objectName: label ?? `N/A (${labelIndex + 1})`,
        objectData: result.data[labelIndex],
        objectPercent: getPercent(result.data[labelIndex], sum),
      }))

      managerObjectsPie.value.data.options = {
        ...pieChartOptions,
        labels: result.label.map((label, index) => {
          if (label) {
            return label
          }

          return `N/A (${index + 1})`
        }),
      }

      managerObjectsPie.value.data.series = result.data
    } catch (e) {
      toastError(e)
    } finally {
      managerObjectsPie.value.busy = false
    }
  }

  function shortSum(n) {
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
  }

  async function fetchManagerStatusPie(b = {}) {
    try {
      managerStatusPie.value.busy = true
      const { data: { result } } = await api.managerStats.getStatusPie({ ...b, filter_type: 'sum' })

      const sum = result.data.reduce((acc, a) => acc + a, 0)

      managerStatusPie.value.items = result.label.map((label, labelIndex) => ({
        objectName: label ?? `N/A (${labelIndex + 1})`,
        objectData: result.data[labelIndex],
        objectPercent: getPercent(result.data[labelIndex], sum),
      }))

      managerStatusPie.value.data.options = {
        ...pieChartOptions,
        labels: result.label.map((label, index) => {
          if (label) {
            return label
          }

          return `N/A (${index + 1})`
        }),
      }

      managerStatusPie.value.data.series = result.data
    } catch (e) {
      toastError(e)
    } finally {
      managerStatusPie.value.busy = false
    }
  }

  async function fetchAll(body = {}) {
    await Promise.allSettled([
      fetchWidgets(body),
      fetchManagerWidgets(body),
      fetchManagerSales(body),
      fetchManagerObjectsPie(body),
      fetchManagerSalesCount(body),
      fetchManagerStatusPie(body),
    ])
  }

  return {
    paymentType,
    paymentTypeOptions,
    shortSum,
    fetchAll,

    widgetData,
    fetchWidgets,

    managerWidget,
    fetchManagerWidgets,

    managerSales,
    fetchManagerSales,

    managerObjectsPie,
    fetchManagerObjectsPie,

    managerSalesCount,
    fetchManagerSalesCount,

    managerStatusPie,
    fetchManagerStatusPie,
  }
}
