<template>
  <div class="card">
    <div class="card-title">{{ title }}</div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Номер квартиры</div>
      <div class="card-label fw700">
        {{ number }}
        <span v-if="newApartment">--> {{ newNumber }} </span>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Блок</div>
      <div class="card-label fw700">{{ block }}</div>
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
      <div class="card-label fw700">
        {{ area }}<span v-if="areaChange">--> {{ newArea }} м2 </span>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card-label">Балкон</div>
      <div class="card-label fw700">{{ balcony }} м2</div>
    </div>
    <div class="d-flex justify-content-between mt-4" v-if="type === 'swap'">
      <base-search-input
        placeholder="Поиск квартир"
        @trigger-input="searchApartments"
      ></base-search-input>
    </div>
    <div class="d-flex justify-content-between mt-4" v-else>
      <x-form-input
        v-model="areaChange"
        type="text"
        :placeholder="areaChangePlaceholder"
        class="w-100"
        :label="true"
      />
    </div>
    <x-form-select
      v-if="apartments"
      v-model="newApartment"
      class="mt-4"
      value-field="value"
      text-field="name"
      :options="apartmentOptions"
      placeholder="Новая квартира"
    />
  </div>
</template>

<script>
import api from "@/services/api";
import { computed, getCurrentInstance, ref, watch } from "vue";
import { XFormSelect } from "@/components/ui-components/form-select";

import BaseSearchInput from "@/components/Reusable/BaseSearchInput";

import { XFormInput } from "@/components/ui-components/form-input";

export default {
  components: { BaseSearchInput, XFormSelect, XFormInput },
  props: [
    "title",
    "number",
    "block",
    "floor",
    "rooms",
    "entrance",
    "type",
    "area",
    "balcony",
    "object",
  ],
  setup() {
    const vm = getCurrentInstance().proxy;
    const apartments = ref(null);
    const newApartment = ref(null);
    const areaChange = ref(null);
    watch(
      () => newApartment.value,
      (v) => {
        vm.$emit(
          "apartment-changed",
          apartments.value.find((el) => el.uuid === v)
        );
      }
    );
    watch(
      () => areaChange.value,
      (v) => vm.$emit("area-changed", parseFloat(areaChange.value))
    );
    const newNumber = computed(
      () => apartments.value.find((el) => el.uuid === newApartment.value).number
    );
    const apartmentOptions = computed(() => {
      return apartments.value.map((el) => ({
        value: el.uuid,
        name: el.number + " " + el.plan.area + " м2",
      }));
    });
    const areaChangePlaceholder = computed(() => {
      return vm.type === "add"
        ? "Увеличение площади м2"
        : "Уменьшение площади м2";
    });
    const newArea = computed(() => {
      let res = null;
      if (vm.type === "add") res = vm.area + parseFloat(areaChange.value);
      else res = vm.area - parseFloat(areaChange.value);
      return res.toFixed(1);
    });

    let oldSearch = undefined;
    function searchApartments(e) {
      if (e === oldSearch) return;
      oldSearch = e;
      const query = { limit: 50, status: ["available"], number: [e] };
      api.objectsV2
        .fetchObjectApartments(vm.object, query)
        .then((r) => (apartments.value = r.data.items));
    }

    return {
      searchApartments,
      apartmentOptions,
      apartments,
      newApartment,
      newNumber,
      areaChangePlaceholder,
      areaChange,
      newArea,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 320px;
  border: 1px var(--gray-200) solid;
  border-radius: 20px;
  padding: 20px;
  overflow: visible;
  //font-weight: 600;

  &-title {
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