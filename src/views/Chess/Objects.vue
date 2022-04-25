<template>
  <main class="app-content">
    <ObjectSort/>
    <ObjectBlock :apartments="apartments"/>
  </main>
</template>

<script>

// import ObjectCard from "@/components/Objects/ObjectCard";
import ObjectSort from "@/components/Objects/ObjectSort";
import ObjectBlock from "@/components/Objects/ObjectBlock";
import api from "@/services/api";

export default {
  name: "Objects",
  components: {
    // ObjectCard,
    ObjectSort,
    ObjectBlock
  },
  data() {
    return {
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