<template>
  <div class="card1">
    <div class="card1-title">{{ title }}</div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card1-label">Номер квартиры</div>
      <div class="card1-value fw700">
        {{ number }}
        <span v-if="newApartment">--> {{ newNumber }} </span>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card1-label">Блок</div>
      <div class="card1-value fw700">
        {{ block }} <span v-if="newApartment">--> {{ newBlock }} </span>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card1-label">Этаж</div>
      <div class="card1-value fw700">
        {{ floor }} <span v-if="newApartment">--> {{ newFloor }} </span>
      </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card1-label">Комнаты</div>
      <div class="card1-value fw700">{{ rooms }}</div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card1-label">Площадь</div>
      <div class="card1-value fw700">
        {{ area }}<span v-if="areaChange">--> {{ newArea }} </span> м<sup
          >2</sup
        >
      </div>
    </div>
    <div class="d-flex justify-content-between mt-2">
      <div class="card1-label">Балкон</div>
      <div class="card1-value fw700">{{ balcony }} м<sup>2</sup></div>
    </div>
    <div
      class="d-flex justify-content-between mt-4"
      v-if="type === 'swap' || type === 'kadastr'"
    >
      <base-search-input
        style="width: 100%"
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
      :placeholder="selectPlaceholder"
      :is-loading="isSearching"
    />
  </div>
</template>

<script>
import api from "@/services/api";
import { computed, getCurrentInstance, ref, watch } from "vue";
import { XFormSelect } from "@/views/contracts/subContract/form-select";

import BaseSearchInput from "@/views/contracts/subContract/BaseSearchInput";

import { XFormInput } from "@/views/contracts/subContract/form-input";
import { v3ServiceApi } from "@/services/v3/v3.service";

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
    "uuid",
  ],
  setup() {
    const vm = getCurrentInstance().proxy;
    const apartments = ref(null);
    const newApartment = ref(null);
    const areaChange = ref(null);
    console.log(vm.uuid);
    watch(
      () => newApartment.value,
      (v) => {
        if (!v) vm.$emit("apartment-changed", null);
        else
          vm.$emit(
            "apartment-changed",
            apartments.value.find((el) => el.id === v)
          );
      }
    );
    watch(
      () => areaChange.value,
      (v) => vm.$emit("area-changed", parseFloat(areaChange.value))
    );
    const newNumber = computed(
      () => apartments.value.find((el) => el.id === newApartment.value).number
    );
    const newBlock = computed(
      () =>
        apartments.value.find((el) => el.id === newApartment.value).block.name
    );
    const newFloor = computed(
      () => apartments.value.find((el) => el.id === newApartment.value).floor
    );
    const apartmentOptions = computed(() => {
      return apartments.value.map((el) => ({
        value: el.id,
        name: el.number,
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

    const isSearching = ref(false);
    let oldSearch = undefined;
    function searchApartments(e) {
      if (e === oldSearch) return;
      if (e === "") {
        newApartment.value = null;
        apartments.value = null;
        return;
      }
      oldSearch = e;
      isSearching.value = true;
      apartments.value = [];
      let r;
      const fd = new FormData();
      fd.append("uuid", vm.uuid);
      if (vm.type === "swap") r = v3ServiceApi.subOrder.getSwapList(fd);
      if (vm.type === "kadastr") r = v3ServiceApi.subOrder.getKadastrList(fd);
      r.then((r) => {
        apartments.value = r.data.result.filter((el) =>
          el.number.toLowerCase().includes(e.toLowerCase())
        );
      }).finally(() => (isSearching.value = false));
    }
    const selectPlaceholder = computed(() => {
      if (isSearching.value) return "Ищем...";
      if (apartments.value.length === 0) return "Не найдено";
      return "Новая квартира";
    });

    return {
      searchApartments,
      apartmentOptions,
      apartments,
      newApartment,
      newNumber,
      newBlock,
      newFloor,
      areaChangePlaceholder,
      areaChange,
      newArea,
      isSearching,
      selectPlaceholder,
    };
  },
};
</script>

<style lang="scss" scoped>
.card1 {
  background-color: var(--gray-100);
  width: 360px;
  border-radius: 32px;
  padding: 20px;
  overflow: visible;
  //font-weight: 600;

  &-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--gray-500);
  }
  &-label {
    font-weight: 600;
    color: #9ca3af;
  }
  &-value {
    color: #4b5563;
  }
}
.fw700 {
  font-weight: 700;
}
</style>