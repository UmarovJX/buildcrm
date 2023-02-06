<template>
  <div class="apartment-details-content">
    <div class="apd-overview-titles">
      <span class="apd-section-name gray-600">
        {{ apartment.object.name }}
      </span>
      <span class="apd-section-slash gray-400">/</span>
      <span class="apd-section-name gray-600">
        {{ apartment.building.name }}
      </span>
      <span class="apd-section-slash gray-400">/</span>
      <span class="apd-section-name gray-600">
        {{ apartment.block.name }}
      </span>
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
          :content="apartment.block.floors"
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

    <!--    <base-button-->
    <!--        v-if="remove"-->
    <!--        :text="`${ $t('remove_apartment') }`"-->
    <!--        @click="removeApartment({apmId:apartment.id})"-->
    <!--    >-->
    <!--      <template #left-icon>-->
    <!--        <x-icon name="remove" color="var(&#45;&#45;violet-600)"></x-icon>-->
    <!--      </template>-->
    <!--    </base-button>-->
  </div>
</template>

<script>
import FieldInformation from "@/views/CheckoutV2/elements/FieldInformation";
import {hasChild} from "@/util/object";
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_BOOLEAN, PROP_TYPE_OBJECT} from "@/constants/props";
import {dateProperties} from "@/util/calendar";
import BaseButton from "@/components/Reusable/BaseButton";
import {XIcon} from "@/components/ui-components/material-icons";
import {mapActions} from "vuex";


export default {
  name: "ChPlanDetails",
  components: {
    FieldInformation,
    BaseButton,
    XIcon
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, {}),
    remove: p(PROP_TYPE_BOOLEAN(), false)
  },
  computed: {
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
  },
  methods: {
    ...mapActions('CheckoutV2', {
      removeApartment: 'removeApartment'
    })
  }
}
</script>

<style lang="scss" scoped>
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

</style>