import { computed, ref } from 'vue'
import { formatToPrice } from '@/util/reusable'
import { v3ServiceApi as api } from '@/services/v3/v3.service'

export default function useWidgets() {
  const widgetData = ref(null)
  const managerWidget = ref(null)
  const managerSales = ref(null)
  const managerObjectsPie = ref(null)
  const managerSalesCount = ref(null)
  const managerStatusPie = ref(null)

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
    managerSales.value = null
    const salesRsp = await api.managerStats.getSales({ ...b, filter_type: 'sum' })
    const d = salesRsp.data.result
    managerSales.value = {
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
  }

  async function fetchManagerObjectsPie(b = {}) {
    managerObjectsPie.value = null
    const salesPieRsp = await api.managerStats.getSalesPie({ ...b, filter_type: 'sum' })

    const d = salesPieRsp.data.result
    managerObjectsPie.value = {
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
  }

  async function fetchManagerSalesCount(b = {}) {
    managerSalesCount.value = null
    const salesRsp = await api.managerStats.getSales({ ...b, filter_type: 'count' })

    const d = salesRsp.data.result
    managerSalesCount.value = {
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
    managerStatusPie.value = null
    const managerStatusRsp = await api.managerStats.getStatusPie({ ...b, filter_type: 'sum' })
    const d = managerStatusRsp.data.result
    managerStatusPie.value = {
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
