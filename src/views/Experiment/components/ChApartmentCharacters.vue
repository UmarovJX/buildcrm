<template>
    <div>
        <section-title :bilingual="true" title="characteristics_of_the_apartment" class="km-b-2"/>
        <div class="apd-characters-wrapper">
            <swiper-slider class="apartment-details-slider" :items="swiperItems"/>
            <ch-plan-details :apartment="apartment"/>
        </div>
    </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_OBJECT} from "@/constants/props";
import {hasChild} from "@/util/object";
import SwiperSlider from "@/views/Experiment/elements/SwiperSlider";
import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import ChPlanDetails from "@/views/Experiment/components/ChPlanDetails";

export default {
    name: "ChApartmentDetails",
    components: {
        SwiperSlider,
        SectionTitle,
        ChPlanDetails
    },
    props: {
        apartment: p(PROP_TYPE_OBJECT, {})
    },
    computed: {
        swiperItems() {
            if (hasChild(this.apartment)) {
                return this.apartment.plan.image.map(img => ({image: img}))
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
}
</style>