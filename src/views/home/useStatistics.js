import { ref } from 'vue'
import { v3ServiceApi } from '@/services/v3/v3.service'
import { useToastError } from '@/composables/useToastError'
import { abbreviateNumber } from '@/util/numberHelper'
import { formatToPrice } from '@/util/reusable'

export const chartColors = [
  '#7C3AED',
  '#0D9488',
  '#60A5FA',
  '#FACC15',
  '#4ADE80',
  '#CA8A04',
  '#FCA5A5',
  '#F472B6',
  '#9CA3AF',
]

export const barChartOptions = {
  colors: chartColors,
  chart: {
    type: 'bar',
    height: 600,
    chart: {
      type: 'bar',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 24,
    colors: ['transparent'],
  },
  markers: {
    radius: 2,
    colors: chartColors,
  },
  grid: {
    show: true,
  },
  xaxis: {
    tooltip: {
      enabledOnSeries: true,
    },
    axisTicks: {
      show: true,
    },
    categories: [],
    labels: {
      colors: chartColors,
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        lineHeight: '20px',
        fontStyle: 'normal',
        colors: ['#4B5563'],
      },
    },
  },
  yaxis: {
    axisTicks: {
      show: true,
    },
    tickAmount: 15,
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        lineHeight: '20px',
        fontStyle: 'normal',
        colors: ['#4B5563'],
      },
      formatter: x => abbreviateNumber(x),
    },
  },
  tooltip: {
    y: {
      formatter: item => {
        if (item) {
          return formatToPrice(item, 0)
        }

        return '\0 0'
      },
    },
    shared: true,
    intersect: false,
  },
}
export default function useStatistics() {
  const { toastError } = useToastError()

  const main = ref({
    busy: false,
    result: {
      object_count: 0,
      client_count: 0,
      apartments: {
        available: 0,
        sold: 0,
        total: 0,
      },
      parking: {
        available: 0,
        sold: 0,
        total: 0,
      },
    },
  })

  const total = ref({
    busy: false,
    result: {
      orders_count: 0,
      sales_sum: 0,
      area_sum: 0,
      paid_percentage: 0,
    },
  })

  const branchReports = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
  })

  const incomeReports = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
  })

  const orderReports = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
  })

  const periodType = ref('daily')

  async function fetchMainData() {
    try {
      main.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.main()
      main.value.result = result
    } catch (e) {
      toastError(e)
    } finally {
      main.value.busy = false
    }
  }

  async function fetchTotalData(b = {}) {
    try {
      total.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.total(b)
      total.value.result = result
    } catch (e) {
      toastError(e)
    } finally {
      total.value.busy = false
    }
  }

  async function fetchIncomeReportsData(b) {
    try {
      incomeReports.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.getSalesData(b)
      incomeReports.value.data.series = result.data.map(item => ({
        name: item.label,
        data: item.data,
      }))

      incomeReports.value.data.options = {
        colors: chartColors,
        chart: {
          height: 600,
          type: 'line',
          zoom: {
            enabled: true,
          },
        },
        dataLabels: {
          // enabled: true,
        },
        stroke: {
          width: 2,
          curve: 'smooth',
        },
        markers: {
          radius: 2,
          colors: chartColors,
        },
        grid: {
          show: true,
          // xaxis: {
          //   lines: {
          //     show: true,
          //   },
          // },
          // yaxis: {
          //   lines: {
          //     show: true,
          //   },
          // },
          row: {
            colors: undefined,
            opacity: 0.5,
          },
          column: {
            colors: undefined,
            opacity: 0.5,
          },
          // row: {
          // colors: chartColors,
          // opacity: 0.5,
          // },
        },
        xaxis: {
          tickPlacement: 'on',
          tickAmount: 20,
          categories: result.label,
          labels: {
            colors: chartColors,
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              lineHeight: '20px',
              fontStyle: 'normal',
              colors: ['#4B5563'],
            },
          },
        },
        yaxis: {
          tickAmount: 15,
          labels: {
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              lineHeight: '20px',
              fontStyle: 'normal',
              colors: ['#4B5563'],
            },
            formatter: x => abbreviateNumber(x),
          },
          // min: 5,
          // max: 40,
        },
        tooltip: {
          y: {
            formatter: item => {
              if (item) {
                return formatToPrice(item, 0)
              }

              return '\0 0'
            },
          },
          shared: true,
          intersect: false,
        },
      }
    } catch (e) {
      toastError(e)
    } finally {
      incomeReports.value.busy = false
    }
  }

  async function fetchBranchReportsData(b) {
    try {
      branchReports.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.getBranchesData(b)

      branchReports.value.data.series = result.data.map(item => ({
        name: item.label,
        data: item.data,
      }))

      branchReports.value.data.options = {
        ...barChartOptions,
        xaxis: {
          ...barChartOptions.xaxis,
          categories: result.label,
        },
      }
    } catch (e) {
      toastError(e)
    } finally {
      branchReports.value.busy = false
    }
  }

  async function fetchOrderReportsData(b) {
    try {
      orderReports.value.busy = true
      const { data: { result } } = await v3ServiceApi.stats.getOrdersData(b)
      orderReports.value.data.series = result.data.map(item => ({
        name: item.label,
        data: item.data,
      }))

      orderReports.value.data.options = {
        ...barChartOptions,
        xaxis: {
          ...barChartOptions.xaxis,
          categories: result.label,
        },
      }
    } catch (e) {
      toastError(e)
    } finally {
      orderReports.value.busy = false
    }
  }

  async function fetchAll(body = {}) {
    const lineChartBody = {
      type: periodType.value,
      ...body,
    }
    await Promise.allSettled([
      fetchTotalData(body),
      fetchBranchReportsData(lineChartBody),
      fetchIncomeReportsData(lineChartBody),
      fetchOrderReportsData(lineChartBody),
    ])
  }

  return {
    periodType,

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

    fetchAll,
  }
}
