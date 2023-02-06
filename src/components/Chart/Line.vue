<template>
    <LineChartGenerator
        ref="line-chart"
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="chartId"
        :dataset-id-key="datasetIdKey"
        :plugins="plugins"
        :css-classes="cssClasses"
        :styles="styles"
        :width="width"
        :height="height"
    />
</template>


<script>
import {Line as LineChartGenerator} from 'vue-chartjs/legacy'

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement
)

export default {
    name: 'LineChart',
    components: {
        LineChartGenerator
    },
    props: {
        chartId: {
            type: String,
            default: 'line-chart'
        },
        datasetIdKey: {
            type: String,
            default: 'label'
        },
        width: {
            type: Number,
            default: 400
        },
        height: {
            type: Number,
            default: 400
        },
        cssClasses: {
            default: '',
            type: String
        },
        styles: {
            type: Object,
            default: () => {
            }
        },
        plugins: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            chartData: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July'
                ],
                datasets: [
                    {
                        label: 'Data One',
                        backgroundColor: '#e86464',
                        borderColor: '#e86464',
                        data: [40, 39, 10, 40, 39, 80, 40]
                    },
                    {
                        label: 'Data Two',
                        backgroundColor: '#7c64e8',
                        borderColor: '#7c64e8',
                        // tickWidth: '3',
                        tickColor:'#000',
                        // lineWidth: 10,
                        // borderWidth: 10,
                        data: [10, 42, 39, 83, 39, 8, 40]
                    },
                    {
                        label: 'Data Two',
                        backgroundColor: '#002afd',
                        borderColor: '#002afd',
                        size: 24,
                        data: [12, 32, 19, 83, 59, 81, 20]
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                borderWidth: 2,
                // scales: {
                //     x: {
                //         grid: {
                //             lineWidth: 3,
                //             borderWidth: 3,
                //         }
                //     }
                // }
            }
        }
    },
    mounted() {
        console.log(this.$refs['line-chart'].chartOptions, 'LINE-CHART');
    }
}
</script>
