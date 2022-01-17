<template>
  <!-- Apartments -->
  <div class="new-object p-0">
    <div v-b-toggle.collapse-apartments block class="d-flex p-3">
      <span>Список квартир:</span>
      <strong
          v-if="isVisibleApartments"
          aria-hidden="true"
          class="ml-auto"
      >
        <i class="fal fa-chevron-up"></i>
      </strong>
      <strong v-else aria-hidden="true" class="ml-auto">
        <i class="fal fa-chevron-down"></i>
      </strong>
    </div>
    <b-collapse
        id="collapse-apartments"
        v-model="isVisibleApartments"
        class="px-3 pb-3"
    >
      <QuickViewApartments
          v-for="(apartment, index) in apartments"
          :key="apartment.id"
          :apartment="apartment"
          :contract="contract"
          :index="index"
          @changedApartmentPrice="changedApartmentPrice"
      />

    </b-collapse>
  </div>
</template>

<script>
import QuickViewApartments from "../Components/QuickViewApartments";

export default {
  name: "ApartmentsList",

  props: {
    apartments: {},
    contract: {}
  },

  components: {
    QuickViewApartments,
  },

  data() {
    return {
      isVisibleApartments: true
    }
  },

  mounted() {
    // console.log("TEST 1")
  },

  methods: {
    changedApartmentPrice() {
      this.$emit("changePrice", {})
    }
  }
}
</script>

<style scoped>

</style>