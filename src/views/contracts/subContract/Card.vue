<template>
  <div class="card">
    <div class="card-title">{{ title }}</div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Номер квартиры</div>
      <div class="card-label fw700">{{ number }}</div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Блок</div>
      <div class="card-label fw700">entrance {{ entrance }}</div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Этаж</div>
      <div class="card-label fw700">{{ floor }}</div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Комнаты</div>
      <div class="card-label fw700">{{ rooms }}</div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Площадь</div>
      <div class="card-label fw700">NO API</div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Балкон</div>
      <div class="card-label fw700">NO API</div>
    </div>
    <div class="d-flex justify-content-between mt-4">
      <base-search-input
        placeholder="Поиск квартир"
        @trigger-input="filterBySearchContent"
      ></base-search-input>
    </div>
  </div>
</template>

<script>
import { defineProps } from "vue";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";

export default {
  components: { BaseSearchInput },
  props: ["title", "number", "floor", "rooms", "entrance"],
  setup() {},
};
</script>

<style lang="scss" scoped>
.card {
  width: 300px;
  border: 1px var(--gray-300) solid;
  box-shadow: 2px 2px 2px 1px var(--gray-200);
  border-radius: 20px;
  padding: 20px;

  &-title {
    font-weight: 700;
    font-size: 24px;
    color: var(--gray-500);
  }
  &-label {
    color: var(--gray-500);
  }
}
.fw700 {
  font-weight: 700;
}
</style>