<template>
  <div class="apartment-block">

    <div v-for="apartment in apartments" :key="apartment.id" class="apartment-card">
      <div class="apartment-item">
      <span class="apartment-label">
        {{ $t("apartments.view.number") }}
      </span>
        <p class="apartment-value">
          {{ apartment.number }}
        </p>
      </div>
      <div class="apartment-item">
      <span class="apartment-label">
       {{ $t("completion_date") }}
      </span>
        <p class="apartment-value">
          {{ momentQuarter(apartment.building.build_date) }}
        </p>
      </div>
      <div class="apartment-item">
      <span class="apartment-label">
        {{ $t('plan_area') }}
      </span>
        <p class="apartment-value">
          {{ apartment.plan.area }} м²
        </p>
      </div>
      <div class="apartment-item">
      <span class="apartment-label">
        {{ $t("apartments.list.balcony") }}
      </span>
        <p class="apartment-value">
          <template v-if="apartment.plan.balcony">
            {{ apartment.plan.balcony_area }} м²
          </template>
          <template v-else>-</template>
        </p>
      </div>
      <div class="apartment-item">
      <span class="apartment-label">
        {{ $t("apartments.view.rooms") }}
      </span>
        <p class="apartment-value">
          {{ apartment.rooms }}
        </p>
      </div>
      <div class="apartment-item">
      <span class="apartment-label">
       {{ $t("apartments.view.floor") }}
      </span>
        <p class="apartment-value">
          {{ apartment.floor }}
        </p>
      </div>
      <div class="apartment-item">
        <span class="apartment-label">
      {{ $t("apartments.view.number_of_blocks") }}
      </span>
        <p class="apartment-value">
          <!--          {{ apartment.block }}-->
        </p>

      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: "ApartmentItem",
  props: {
    apartments: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    momentQuarter(val) {
      return this.$moment(val).quarter();
    },
  }
}
</script>

<style lang="scss" scoped>
.apartment-block {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  gap: 2rem;

}

.apartment-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  gap: 24px;
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 2rem;
  flex: calc(50% - 2rem);
  max-width: calc(50% - 1rem);
}

.apartment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Inter, sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 24px;
}

.apartment-label {
  color: var(--gray-400);
  margin-right: 1rem;
}

.apartment-value {
  margin: 0;
  color: var(--gray-600);
}
</style>