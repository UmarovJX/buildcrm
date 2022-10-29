<template>
  <div>
    <ch-apartment-details
        v-for="apartment in gtsApartments"
        :key="apartment.id"
        :apartment="apartment"
    />
  </div>
</template>

<script>
import ChApartmentDetails from "@/views/Experiment/components/ChApartmentDetails";
import {mapGetters} from "vuex";

export default {
  name: "ChApartmentsOverview",
  components: {
    ChApartmentDetails
  },
  computed: {
    ...mapGetters('Experiment', ['gtsApartments'])
  }
}
</script>

<style lang="scss" scoped>

</style>