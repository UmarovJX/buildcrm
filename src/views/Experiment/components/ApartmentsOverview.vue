<template>
  <div class="position-relative">
    <b-tabs
        class="custom-tab"
        :nav-wrapper-class="[{'fixed-top':!upEvent}, 'sticky-top']"
    >
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
<!--    <ch-apartment-details-->
<!--        v-else-->
<!--        :apartment="gtsApartments[0]"-->
<!--    />-->
  </div>
</template>

<script>
import ChApartmentDetails from "@/views/Experiment/components/ApartmentDetails";
import {mapGetters} from "vuex";

export default {
  name: "ChApartmentsOverview",
  components: {
    ChApartmentDetails
  },
  data() {
    return {
      upEvent: false,
    }
  },
  computed: {
    ...mapGetters('Experiment', ['gtsApartments'])
  },
  mounted() {
    window.onwheel = e => {
      this.upEvent = e.deltaY < 0;
    }
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

::v-deep {
  .custom-tab {
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
      padding-top: 2rem;
      margin-top: -2rem;
      top: 0;
      z-index: 4;
      width: calc(100% + 6rem);
      right: auto !important;
      left: 0 !important;
      height: 100%;
      margin-left: -3rem;
      box-shadow: none;
      background-color: var(--white);
      transition: all .3s linear;

      .nav-tabs {
        background-color: var(--white);
        width: 100%;
        padding-left: 3rem;
        padding-right: 3rem;

        &:after {
          content: '';
          display: flex;
          height: 8px;
          width: calc(100% + 3rem);
          position: absolute;
          bottom: 0;
          left: -3rem;
          background-color: var(--gray-100);
        }
      }
    }

    .fixed-top {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.16);
      transition: all .3s linear;
    }
  }
}
</style>