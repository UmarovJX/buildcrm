<template>
  <main class="app-content">
    <ObjectSort @current-tab="changeTab"/>

    <component :is="currentTab" :apartments="apartments" @show-express-sidebar="apartmentExpressReview"/>

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
import ObjectBlock from "@/components/Objects/View/Tabs/ObjectBlock";
import ApartmentExpressView from "@/components/Objects/View/elements/ApartmentExpressView";
import api from "@/services/api";
import ChessSquareCard from "@/components/Objects/View/Tabs/ChessSquareCard";
import ObjectTable from "@/components/Objects/ObjectTable";

export default {
  name: "Objects",
  components: {
    ChessSquareCard,
    ObjectTable,
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
      apartments: [],
      currentTab: 'ObjectTable',
    }
  },
  async mounted() {
    this.getLoading = true
    await this.getApartments()
  },
  methods: {
    changeTab(name) {
      this.currentTab = name.name
    },
    async getApartments() {
      const id = this.$route.params.objectId
      await api.objectsV2.getApartments(id).then((res) => {

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