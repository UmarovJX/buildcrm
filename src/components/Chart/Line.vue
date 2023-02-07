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

        const htmlLegendPlugin = {
            id: 'legend',
            afterUpdate(chart, args, options) {
                const ul = this.getOrCreateLegendList(chart, options.containerID);
                console.log(ul, 'ul');
                // Remove old legend items
                while (ul.firstChild) {
                    ul.firstChild.remove();
                }

                // Reuse the built-in legendItems generator
                const items = chart.options.plugins.legend.labels.generateLabels(chart);

                items.forEach((item) => {
                    const li = document.createElement('li');
                    li.style.alignItems = 'center';
                    li.style.cursor = 'pointer';
                    li.style.display = 'flex';
                    li.style.flexDirection = 'row';
                    li.style.marginLeft = '10px';

                    li.onclick = () => {
                        const {type} = chart.config;
                        if (type === 'pie' || type === 'doughnut') {
                            // Pie and doughnut charts only have a single dataset and visibility is per item
                            chart.toggleDataVisibility(item.index);
                        } else {
                            chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                        }
                        chart.update();
                    };

                    // Color box
                    const boxSpan = document.createElement('span');
                    boxSpan.style.background = item.fillStyle;
                    boxSpan.style.borderColor = item.strokeStyle;
                    boxSpan.style.borderWidth = item.lineWidth + 'px';
                    boxSpan.style.display = 'inline-block';
                    boxSpan.style.height = '20px';
                    boxSpan.style.marginRight = '10px';
                    boxSpan.style.width = '20px';

                    // Text
                    const textContainer = document.createElement('p');
                    textContainer.style.color = item.fontColor;
                    textContainer.style.margin = '0';
                    textContainer.style.padding = '0';
                    textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

                    const text = document.createTextNode(item.text);
                    textContainer.appendChild(text);

                    li.appendChild(boxSpan);
                    li.appendChild(textContainer);
                    ul.appendChild(li);
                });
            }
        }

        return {
            htmlLegendPlugin,
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
                        tickColor: '#000',
                        // lineWidth: 10,
                        // borderWidth: 10,
                        data: [10, 42, 39, 83, 39, 8, 40]
                    },
                    {
                        label: 'Data Two',
                        backgroundColor: '#002afd',
                        borderColor: '#002afd',
                        size: 24,

                        // drawActiveElementsOnTop: false,
                        data: [12, 32, 19, 83, 59, 81, 20]
                    }
                ]
            },
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                borderWidth: 2,
                hasAnnotationPlugin: true,
                legendCallback: function(chart) {
                    console.log(chart,'chart');
                    let legendHtml = [];
                    legendHtml.push('<ul>');
                    let item = chart.data.datasets[0];
                    for (let i=0; i < item.data.length; i++) {
                        legendHtml.push('<li>');
                        legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] +'"></span>');
                        legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - '+chart.data.labels[i]+' times</span>');
                        legendHtml.push('</li>');
                    }

                    legendHtml.push('</ul>');
                    return legendHtml.join("");
                },
                // scales: {
                //     x: {
                //         grid: {
                //             lineWidth: 3,
                //             borderWidth: 3,
                //         }
                //     }
                // }
                // pointStyle: 'rectRot',
                // pointRadius: 5,
                // pointBorderColor: 'rgb(0, 0, 0)',

                plugins: {
                    htmlLegend: {
                        // ID of the container to put the legend in
                        containerID: 'legend-container',
                    },
                    legend: {
                        labels: {
                            generateLabels: htmlLegendPlugin,
                        },
                        display: false,
                    }
                },

            },
        }
    },

    // computed: {

    mounted() {
        // console.log(this.$refs['line-chart'].chartOptions, 'LINE-CHART');
        console.log(this.$refs['line-chart'],'this.$refs[\'line-chart\']');
        // Legend.afterUpdate() {
        //     const ul = this.getOrCreateLegendList(this.$refs['line-chart']);
        //     console.log(ul, 'ul');
        //     // Remove old legend items
        //     while (ul.firstChild) {
        //         ul.firstChild.remove();
        //     }
        //
        //     // Reuse the built-in legendItems generator
        //     const items = this.$refs['line-chart'].chartOptions.plugins.legend.labels.generateLabels(this.$refs['line-chart']);
        //
        //     items.forEach((item) => {
        //         const li = document.createElement('li');
        //         li.style.alignItems = 'center';
        //         li.style.cursor = 'pointer';
        //         li.style.display = 'flex';
        //         li.style.flexDirection = 'row';
        //         li.style.marginLeft = '10px';
        //
        //         li.onclick = () => {
        //             const {type} = chart.config;
        //             if (type === 'pie' || type === 'doughnut') {
        //                 // Pie and doughnut charts only have a single dataset and visibility is per item
        //                 chart.toggleDataVisibility(item.index);
        //             } else {
        //                 chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
        //             }
        //             chart.update();
        //         };
        //
        //         // Color box
        //         const boxSpan = document.createElement('span');
        //         // boxSpan.style.background = item.fillStyle;
        //         // boxSpan.style.borderColor = item.strokeStyle;
        //         boxSpan.style.borderWidth = item.lineWidth + 'px';
        //         boxSpan.style.display = 'inline-block';
        //         boxSpan.style.height = '20px';
        //         boxSpan.style.marginRight = '10px';
        //         boxSpan.style.width = '20px';
        //
        //         // Text
        //         const textContainer = document.createElement('p');
        //         // textContainer.style.color = item.fontColor;
        //         textContainer.style.margin = '0';
        //         textContainer.style.padding = '0';
        //         textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
        //
        //         const text = document.createTextNode(item.text);
        //         textContainer.appendChild(text);
        //
        //         li.appendChild(boxSpan);
        //         li.appendChild(textContainer);
        //         ul.appendChild(li);
        //     });
        // }
    },

    methods: {
        legendCallback(chart) {
            let legendHtml = [];
            legendHtml.push('<ul>');
            let item = chart.data.datasets[0];
            for (let i=0; i < item.data.length; i++) {
                legendHtml.push('<li>');
                legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] +'"></span>');
                legendHtml.push('<span class="chart-legend-label-text">' + item.data[i] + ' person - '+chart.data.labels[i]+' times</span>');
                legendHtml.push('</li>');
            }

            legendHtml.push('</ul>');
            return legendHtml.join("");
        },
        getOrCreateLegendList(chart, id) {
            console.log(chart, 'chart');
            console.log(id, 'id');
            const legendContainer = document.getElementById(id);
            let listContainer = legendContainer.querySelector('ul');

            if (!listContainer) {
                listContainer = document.createElement('ul');
                listContainer.style.display = 'flex';
                listContainer.style.flexDirection = 'row';
                listContainer.style.margin = '0';
                listContainer.style.padding = '0';

                legendContainer.appendChild(listContainer);
            }

            return listContainer;
        }
    }
}
</script>
