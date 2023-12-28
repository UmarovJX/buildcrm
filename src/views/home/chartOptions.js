import { formatToPrice } from '@/util/reusable'
import { abbreviateNumber } from '@/util/numberHelper'

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

export const chartTooltip = {
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
}

export const chartLabels = {
  colors: chartColors,
  style: {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
    lineHeight: '20px',
    fontStyle: 'normal',
    colors: ['#4B5563'],
  },
  // formatter: x => abbreviateNumber(x),
}

export const barChartOptions = {
  colors: chartColors,
  chart: {
    type: 'bar',
    height: 600,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
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
    labels: chartLabels,
  },
  yaxis: {
    axisTicks: {
      show: true,
    },
    tickAmount: 15,
    labels: {
      ...chartLabels,
      formatter: x => abbreviateNumber(x),
    },
  },
  tooltip: chartTooltip,
}

export const lineChartOptions = {
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
    // row: {
    //   colors: undefined,
    //   opacity: 0.5,
    // },
    // column: {
    //   colors: undefined,
    //   opacity: 0.5,
    // },
    // row: {
    // colors: chartColors,
    // opacity: 0.5,
    // },
  },
  xaxis: {
    tickPlacement: 'on',
    tickAmount: 20,
    categories: [],
    labels: chartLabels,
  },
  yaxis: {
    tickAmount: 15,
    labels: {
      ...chartLabels,
      formatter: x => abbreviateNumber(x),
    },
    // min: 5,
    // max: 40,
  },
  tooltip: chartTooltip,
}

export const pieChartOptions = {
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

export function getPercent(a, b) {
  return `${formatToPrice((a / b) * 100, 1)}%`
}
