<script>
import BaseCard from "@/views/home/elements/BaseCard.vue";
import { formatToPrice } from "../../../util/reusable";
import useWidgets from "@/views/home/useWidgets";
const { shortSum } = useWidgets();
/*
* {
  "total": 0,
  "area": 0,
  "apartments_count": 0,
  "parking_count": 0,
  "avg_area_cost": 0,
  "avg_cost": 0
}
* */
export default {
  components: {
    BaseCard,
  },
  props: {
    title: {
      type: [String, Object],
      default: "Title",
    },
    name: {
      type: [String],
      default: "Title",
    },
    total: {
      type: Number,
      default: 0,
    },
    area: {
      type: Number,
      default: 0,
    },
    apartmentsCount: {
      type: Number,
      default: 0,
    },
    avgAreaCost: {
      type: Number,
      default: 0,
    },
    avgCost: {
      type: Number,
      default: 0,
    },
  },
  methods: { formatToPrice, shortSum },
};
</script>

<template>
  <base-card icon="attach_money" class="w-100">
    <template #title>
      <span class="font-weight-bold">{{ title }}</span>
    </template>

    <template #bottom>
      <div class="sales__details">
        <div class="d-flex flex-column">
          <span class="item__title">{{ $t("sum") }}</span>
          <span class="item__value" :id="name + 'sum'">{{
            shortSum(total)
          }}</span>
          <b-tooltip
            :target="name + 'sum'"
            triggers="hover"
            variant="secondary"
          >
            {{ formatToPrice(total) }}
          </b-tooltip>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{ $t("common.square_meters") }}</span>
          <span class="item__value">{{ formatToPrice(area) }}</span>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{
            $t("statistics.numbers_of_apartments")
          }}</span>
          <span class="item__value">{{ formatToPrice(apartmentsCount) }}</span>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{
            $t("statistics.average_price_per_m2")
          }}</span>
          <span class="item__value" :id="name + 'areacost'">{{
            shortSum(avgAreaCost)
          }}</span>
          <b-tooltip
            :target="name + 'areacost'"
            triggers="hover"
            variant="secondary"
          >
            {{ formatToPrice(avgAreaCost) }}
          </b-tooltip>
        </div>

        <div class="d-flex flex-column">
          <span class="item__title">{{ $t("common.average_check") }}</span>
          <span class="item__value" :id="name + 'avgcost'">{{
            shortSum(avgCost)
          }}</span>
          <b-tooltip
            :target="name + 'avgcost'"
            triggers="hover"
            variant="secondary"
          >
            {{ formatToPrice(avgCost) }}
          </b-tooltip>
        </div>
      </div>
    </template>
  </base-card>
</template>

<style lang="scss" scoped>
.sales__details {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  font-family: Inter, sans-serif;
  font-weight: 700;

  .item__title {
    color: var(--gray-400);
  }

  .item__value {
    color: var(--gray-600);
    font-weight: 600;
  }
}
</style>
