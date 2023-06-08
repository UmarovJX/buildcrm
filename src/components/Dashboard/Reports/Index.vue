<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,

  data() {},
  mounted() {
    this.chart();
  },
  methods: {
    chart() {
      this.renderChart(
        {
          labels: ["TEST", "TEST 2"],
          datasets: [
            {
              label: "Data One",
              backgroundColor: "#f87979",
              data: [1, 2, 3, 4, 5],
            },
            {
              label: "Data One",
              backgroundColor: "#f87979",
              data: [1, 2, 3, 4, 5],
            },
          ],
        },
        {
          responsive: true,
          maintainAspectRatio: false,
        }
      );
    },
  },
};
</script>

<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped></style>
