<script>
import QuickViewApartments from "../Components/QuickViewApartments";

export default {
  name: "ApartmentsList",

  props: {
    apartments: {},
    contract: {},
  },

  components: {
    QuickViewApartments,
  },

  data() {
    return {
      isVisibleApartments: true,
    };
  },

  mounted() {
    // console.log("TEST 1")
  },

  methods: {
    changedApartmentPrice() {
      this.$emit("changePrice", {});
    },
  },
};
</script>

<template>
  <!-- Apartments -->
  <div className="new-object p-0">
    <div v-b-toggle.collapse-apartments block className="d-flex p-3">
      <span>{{ $t("apartment_list") }}:</span>
      <strong v-if="isVisibleApartments" aria-hidden="true" className="ml-auto">
        <i className="fal fa-chevron-up"></i>
      </strong>
      <strong v-else aria-hidden="true" className="ml-auto">
        <i className="fal fa-chevron-down"></i>
      </strong>
    </div>
    <b-collapse
      id="collapse-apartments"
      v-model="isVisibleApartments"
      className="px-3 pb-3"
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

<style scoped></style>
