<script>
import BaseCard from '@/views/home/elements/BaseCard.vue'

export default {
  name: 'PrimaryCards',
  components: {
    BaseCard,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    busy: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<template>
  <div class="home__primary__cards">
    <base-card
      icon="location_city"
      :title="`${ $t('objects.title') }`"
      :multiple="false"
      :bottom="data.object_count"
    />

    <base-card
      icon="group"
      :title="`${ $t('report.clients') }`"
      :multiple="false"
      :bottom="data.client_count"
    />

    <base-card
      class="base__card__multiple"
      icon="door_open"
      :title="$t('common.apartments')"
      :bottom-left="{
        title: $t('common.overall'),
        value: data.apartments.total
      }"
      :bottom-center="{
        title: $t('common.sold'),
        value: data.apartments.sold
      }"
      :bottom-right="{
        title: $t('common.loose'),
        value: data.apartments.available
      }"
    />

    <base-card
      class="base__card__multiple"
      icon="directions_car"
      :title="$t('parkings')"
      :bottom-left="{
        title: $t('common.overall'),
        value: data.parking.total
      }"
      :bottom-center="{
        title: $t('common.sold'),
        value: data.parking.sold
      }"
      :bottom-right="{
        title: $t('common.loose'),
        value: data.parking.available
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
.home__primary__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem 1rem;
  border-bottom: 6px solid var(--gray-100);
  padding: 0 3rem 2rem;
}

.base__card__multiple {
  flex-grow: 2;
}
</style>
