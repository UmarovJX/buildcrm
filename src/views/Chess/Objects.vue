<template>
  <main class="app-content">
    <object-sort/>
    <object-block @show-express-sidebar="apartmentExpressReview"/>

    <!-- APARTMENT QUICK VIEW   -->
    <apartment-express-view :visible="expressView.toggle"/>
  </main>
</template>

<script>
import ObjectSort from "@/components/Objects/ObjectSort";
import ObjectBlock from "@/components/Objects/ObjectBlock";
import ApartmentExpressView from "@/components/Objects/View/elements/ApartmentExpressView";

export default {
  name: "Objects",
  components: {
    ObjectSort,
    ObjectBlock,
    ApartmentExpressView
  },
  data() {
    return {
      expressView: {
        toggle: false,
        item: {}
      }
    }
  },
  methods: {
    apartmentExpressReview(item) {
      this.expressView.item = item
      this.expressView.toggle = true
    }
  }
}
</script>

<style scoped>
.object-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
</style>