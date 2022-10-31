<template>
  <div class="position-relative">
    <div>
      <b-tabs class="custom-tab" nav-class="sticky-top">
        <div class="ch-bottom__line"></div>
        <b-tab
            v-for="(apartment) in gtsApartments"
            :key="apartment.id"
            :title="apnName(apartment.number)"
        >
          <div>
            <ch-apartment-details :apartment="apartment"/>
          </div>
        </b-tab>
      </b-tabs>

    </div>
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
  },
  methods: {
    apnName(number) {
      return this.$t('apartment') + ' №' + number
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/utils/tab";

::v-deep .custom-tab {
  margin-top: 0;
  position: relative;

  .ch-bottom__line {
    display: flex;
    height: 8px;
    width: calc(100% + 6rem);
    position: absolute;
    top: -8px;
    left: -3rem;
    background-color: var(--gray-100);
  }

  .sticky-top {
    position: -webkit-sticky !important; /* Safari */
    position: sticky !important;
    top: 0;
    background-color: green;
    padding-top: 2rem;
  }
}
</style>