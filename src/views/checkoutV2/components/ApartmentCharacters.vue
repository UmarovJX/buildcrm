<script>
import { makeProp as p } from "@/util/props";
import { hasChild, hasOwnProperty } from "@/util/object";
import { PROP_TYPE_OBJECT } from "@/constants/props";
import SwiperSlider from "@/views/checkoutV2/elements/SwiperSlider";
import SectionTitle from "@/views/checkoutV2/elements/SectionTitle";
import ChPlanDetails from "@/views/checkoutV2/components/PlanDetails";

export default {
  name: "ChApartmentDetails",
  components: {
    SwiperSlider,
    SectionTitle,
    ChPlanDetails,
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, null),
  },
  data() {
    return {
      check: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.check = true;
    });
  },
  computed: {
    swiperItems() {
      if (this.apartment && hasChild(this.apartment)) {
        const { plan } = this.apartment;
        if (hasOwnProperty(plan, "images")) {
          return this.apartment.plan.images.map((img) => ({ image: img }));
        } else if (hasOwnProperty(plan, "image")) {
          return this.apartment.plan.image.map((img) => ({ image: img }));
        }
      }
      return [];
    },
  },
};
</script>

<template>
  <div>
    <section-title
      :bilingual="true"
      title="characteristics_of_the_apartment"
      class="km-b-2"
    />
    <div class="apd-characters-wrapper">
      <swiper-slider
        v-if="check && swiperItems.length"
        :items="swiperItems"
        class="apartment-details-slider"
      />
      <ch-plan-details :apartment="apartment" />
    </div>
  </div>
</template>

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
