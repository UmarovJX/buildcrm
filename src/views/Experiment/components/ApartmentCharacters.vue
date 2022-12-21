<template>
  <div>
    <section-title :bilingual="true" title="characteristics_of_the_apartment" class="km-b-2"/>
    <div class="apd-characters-wrapper">
      <swiper-slider
          v-if="check && swiperItems.length"
          :items="swiperItems"
          class="apartment-details-slider"

      />
      <ch-plan-details :apartment="apartment"/>
    </div>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {hasChild} from "@/util/object";
import {PROP_TYPE_OBJECT} from "@/constants/props";
import SwiperSlider from "@/views/Experiment/elements/SwiperSlider";
import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import ChPlanDetails from "@/views/Experiment/components/PlanDetails";

export default {
  name: "ChApartmentDetails",
  components: {
    SwiperSlider,
    SectionTitle,
    ChPlanDetails
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, null)
  },
  data() {
    return {
      check: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.check = true
    })
  },
  computed: {
    swiperItems() {
      if (this.apartment && hasChild(this.apartment)) {
        return this.apartment.plan.images.map(img => ({image: img}))
      }
      return []
    },
  }
}
</script>

<style lang="scss" scoped>
.apd-characters-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;

  .apartment-details-slider {
    width: calc(50vw - 1.5rem);
  }
}
</style>