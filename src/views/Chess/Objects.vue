<template>
  <main class="app-content">
    <ObjectSort/>
    <!--    <div class="object-cards">-->
    <!--      <object-card v-for="index in 10" :key="index"/>-->
    <!--    </div>-->
    <object-block @show-express-sidebar="apartmentExpressReview"/>
    <object-block/>

    <!-- APARTMENT QUICK VIEW   -->
    <apartment-express-view
        :visible="expressView.toggle"
        @hide-apartment-sidebar-view="hideApartmentSidebarView"
    />
  </main>
</template>

<script>
// import ObjectCard from "@/components/Objects/ObjectCard";
import ObjectSort from "@/components/Objects/ObjectSort";
import ObjectBlock from "@/components/Objects/ObjectBlock";
import ApartmentExpressView from "@/components/Objects/View/elements/ApartmentExpressView";

export default {
  name: "Objects",
  components: {
    // ObjectCard,
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
    },
    hideApartmentSidebarView() {
      this.expressView.item = {}
      this.expressView.toggle = false
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