<script>
export default {
  name: "YandexMaps",
  props: {
    coordinates: {
      type: Array,
      required: true,
    },
    zoom: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    // Initialize Yandex Map
    ymaps.ready(() => {
      this.map = new ymaps.Map(this.$refs.map, {
        center: this.coordinates,
        zoom: this.zoom,
      });
      this.map.events.add("click", () => alert(1));

      // Add any additional map features, markers, etc., here
    });
  },
  unmounted() {
    if (this.map) {
      this.map.destroy();
    }
  },
  methods: {
    handleOpen(event) {
      console.log("Map clicked at coordinates:", event.get("coords"));
    },
  },
};
</script>
<template>
  <div ref="map" class="yandex-map"></div>
</template>

<style scoped>
/* Add any custom CSS styles for your map container here */
.yandex-map {
  width: 100%;
  height: 400px;
}
</style>
