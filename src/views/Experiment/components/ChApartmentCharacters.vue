<template>
  <div>
    <section-title :bilingual="true" title="characteristics_of_the_apartment" class="km-b-2"/>
    <div class="apd-characters-wrapper">
      <swiper-slider class="apartment-details-slider" :items="swiperItems"/>
      <div class="apartment-details-content">
        <div class="apd-overview-titles">
          <span class="apd-section-name gray-600">Object</span>
          <span class="apd-section-slash gray-400">/</span>
          <span class="apd-section-name gray-600">Building</span>
          <span class="apd-section-slash gray-400">/</span>
          <span class="apd-section-name gray-600">Block</span>
        </div>
        <div class="apd-information">
          <field-information
              :bilingual="true"
              :content="apartment.number"
              title="apartment_number"
              icon-name="door_open"
          />
          <field-information
              :bilingual="true"
              :content="apartment.floor"
              title="floor"
              icon-name="stairs"
          />
          <field-information
              :bilingual="true"
              :content="apartment.rooms"
              title="number_of_rooms"
              icon-name="door_front"
          />
          <field-information
              :bilingual="true"
              :content="apartment.floor"
              title="number_of_blocks"
              icon-name="domain"
          />
          <field-information
              :bilingual="true"
              title="area"
              icon-name="activity_zone"
          >
            <template #content>
              {{ apartment.plan.area }} M<sup>2</sup>
            </template>
          </field-information>
          <field-information
              :bilingual="true"
              :content="apartment.floor"
              title="balcony"
              icon-name="balcony"
          >
            <template #content>
              {{ apartment.plan.balcony_area }} M<sup>2</sup>
            </template>
          </field-information>
          <field-information
              :bilingual="true"
              title="object.complete"
              icon-name="precision_manufacturing"
          >
            <template #content>
              {{ buildDate }}
            </template>
          </field-information>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_OBJECT} from "@/constants/props";
import {hasChild} from "@/util/object";
import {dateProperties} from "@/util/calendar";

import SwiperSlider from "@/views/Experiment/elements/SwiperSlider";
import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import FieldInformation from "@/views/Experiment/elements/FieldInformation";

export default {
  name: "ChApartmentDetails",
  components: {
    SwiperSlider,
    SectionTitle,
    FieldInformation
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
    buildDate() {
      if (hasChild(this.apartment)) {
        const {build_date} = this.apartment.object
        const {month, year} = dateProperties(build_date, 'string')
        const value = Math.ceil((month + 1) / 3)
        let outputValue = ` ${this.$t('quarter')}, ${year}`
        const romeNmb = {
          1: 'I',
          2: 'II',
          3: 'III',
          4: 'IV'
        }
        return romeNmb[value] + outputValue
      }
      return this.$t('not_found')
    }
  }
}
</script>

<style lang="scss" scoped>
.apd-characters-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;

  .apartment-details-content {
    display: flex;
    flex-direction: column;
    row-gap: 2rem;
  }

  .apd-overview-titles {
    display: flex;
    column-gap: 0.5rem;

    .apd-section-name,
    .apd-section-slash {
      font-family: CraftworkSans, serif;
      font-style: normal;
      font-weight: 900;
      font-size: 24px;
      line-height: 28px;
    }
  }

  .apd-information {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 1rem;
    row-gap: 1.5rem;
  }
}
</style>