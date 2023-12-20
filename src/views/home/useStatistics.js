import { ref } from 'vue'
import { v3ServiceApi } from '@/services/v3/v3.service'
import { useToastError } from '@/composables/useToastError'
import { formatToPrice } from '@/util/reusable'

const chartColors = [
  '#60A5FA',
  '#FACC15',
  '#7C3AED',
  '#0D9488',
  '#4ADE80',
  '#CA8A04',
  '#FCA5A5',
  '#F472B6',
  '#9CA3AF',
]
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

  const managersPie = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
  })

  const branchReports = ref({
    busy: false,
    data: {
      series: [],
      options: {},
    },
  })

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

  async function fetchManagersPieData(b = {}) {
    try {
      managersPie.value.busy = true
      const { data: { result } } = await v3ServiceApi.managerStats.getManagersPie(b)
      managersPie.value.data.options = {
        colors: chartColors,
        chart: {
          height: 500,
          type: 'pie',
        },
        dataLabels: {
          formatter(val) {
            return `${formatToPrice(val)}`
          },
        },
        legend: {
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
        labels: result.label,
      }
      managersPie.value.data.series = result.data
    } catch (e) {
      toastError(e)
    } finally {
      managersPie.value.busy = false
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
        chart: {
          toolbar: {
            show: true,
            tools: {
              enabled: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
            },
          },
          type: 'bar',
          height: 350,
          zoom: {
            enabled: true,
          },
          autoSelected: 'zoom',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            // columnWidth: '55%',
            endingShape: 'rounded',
            borderRadius: 4,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 5,
          stroke: {
            curve: 'smooth',
          },
          // colors: ['transparent'],
        },
        xaxis: {
          categories: result.label,
          tickPlacement: 'on',
          tickAmount: 40,

        },
        yaxis: {
          // title: {
          //   text: '$ (thousands)',
          // },
          tickAmount: 15,

          tickPlacement: 'on',
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          y: {
            // formatter(val) {
            //   return `$ ${val} thousands`
            // },
          },
        },
      }

      console.log('result', result)
    } catch (e) {
      toastError(e)
    } finally {
      branchReports.value.busy = false
    }
  }

  return {
    main,
    fetchMainData,

    total,
    fetchTotalData,

    managersPie,
    fetchManagersPieData,

    branchReports,
    fetchBranchReportsData,
  }
}
