<template>
  <main class="app-content">
    <ObjectSort/>
    <!--    <div class="object-cards">-->
    <!--      <object-card v-for="index in 10" :key="index"/>-->
    <!--    </div>-->
    <object-block :apartments="apartments" @show-express-sidebar="apartmentExpressReview"/>

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
import api from "@/services/api";

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
      },
      getLoading: false,
      apartments: []
    }
  },
  async mounted() {
    this.getLoading = true
    await this.getApartments()
  },
  methods: {
    async getApartments() {
      await api.objectsV2.getApartments(14).then((res) => {
        this.apartments = res.data.data
        this.getLoading = false
      }).catch(err => {
        this.getLoading = false
        return err
      })
    },
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