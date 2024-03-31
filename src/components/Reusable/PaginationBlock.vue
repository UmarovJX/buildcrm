<template>
  <div class="pagination__vue">
    <!--   Pagination   -->
    <vue-paginate
      v-if="!isLoading && pagination.total > 1"
      :page-count="pagination.total"
      :value="pagination.current"
      :container-class="'container'"
      :page-class="'page-item'"
      :page-link-class="'page-link'"
      :next-class="'page-item'"
      :prev-class="'page-item'"
      :prev-link-class="'page-link'"
      :next-link-class="'page-link'"
      @change-page="changeCurrentPage"
    >
      <template #next-content>
        <span class="d-flex align-items-center justify-content-center">
          <base-arrow-right-icon />
        </span>
      </template>

      <template #prev-content>
        <span class="d-flex align-items-center justify-content-center">
          <base-arrow-left-icon />
        </span>
      </template>
    </vue-paginate>
    <!--  Show By Select    -->
    <div class="show__by" v-if="showByOptions">
      <x-form-select
        :label="false"
        :options="showByOptions"
        v-model="showByValue"
        @change="limitChanged"
      >
        <template #output-prefix>
          <span class="show-by-description">
            {{ $t("contracts.show_by") }}:
          </span>
        </template>
      </x-form-select>
    </div>
  </div>
</template>

<script>
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import { XFormSelect } from "@/components/ui-components/form-select";

export default {
  components: { BaseArrowLeftIcon, BaseArrowRightIcon, XFormSelect },
  props: {
    pagination: { required: true },
    isLoading: {
      type: Boolean,
    },
    showByOptions: {
      type: Array,
    },
  },
  methods: {
    changeCurrentPage(e) {
      this.$emit("change-page", e);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";
</style>