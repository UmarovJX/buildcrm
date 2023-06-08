<script>
// import BaseDownIcon from "@/components/icons/BaseDownIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import { XFormSelect } from "@/components/ui-components/form-select";

export default {
  name: "BasePagination",
  components: {
    // BaseDownIcon,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    XFormSelect: XFormSelect,
  },
  props: {
    defaultCountView: {
      type: Number,
      default: undefined,
    },
    maxCountView: {
      type: Number,
      default: 50,
    },
    minCountView: {
      type: Number,
      default: 10,
    },
    stepView: {
      type: Number,
      default: 10,
    },
    paginationCount: {
      type: Number,
      required: true,
    },
    paginationCurrent: {
      type: Number,
      required: true,
    },
  },
  emits: ["change-page", "change-view"],
  data() {
    return {
      showByValue: this.defaultCountView || null,
    };
  },
  mounted() {
    this.initDefaultShowByValue();
  },
  computed: {
    showByOptions() {
      const { maxCountView, minCountView, stepView } = this;
      const options = [];

      for (
        let number = minCountView;
        number <= maxCountView;
        number += stepView
      ) {
        options.push({
          value: number,
          text: number,
        });
      }

      return options;
    },
  },
  methods: {
    initDefaultShowByValue() {
      this.showByValue = this.defaultCountView ?? this.showByOptions[0].value;
    },
    changeCurrentPage(page) {
      this.$emit("change-page", page);
    },
    changeCountView(value) {
      this.$emit("change-view", value);
    },
  },
};
</script>

<template>
  <div>
    <div class="pagination__vue">
      <!--   Pagination   -->
      <vue-paginate
        :page-count="paginationCount"
        :value="paginationCurrent"
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

      <!--      &lt;!&ndash;  Show By Select    &ndash;&gt;-->
      <!--      <div class="show__by">-->
      <!--        <span class="show__by__content">-->
      <!--          <span class="description">{{ $t('contracts.show_by') }}:</span>-->
      <!--          <b-form-select-->
      <!--              v-model="showByValue"-->
      <!--              :options="showByOptions"-->
      <!--              @input="changeCountView"-->
      <!--          ></b-form-select>-->
      <!--          <span class="arrow__down">-->
      <!--            <base-down-icon/>-->
      <!--          </span>-->
      <!--        </span>-->
      <!--      </div>-->

      <!--  Show By Select    -->
      <div class="show__by">
        <x-form-select
          :label="false"
          :options="showByOptions"
          v-model="showByValue"
          @change="changeCountView"
        >
          <template #output-prefix>
            <span class="show-by-description">
              {{ $t("contracts.show_by") }}:
            </span>
          </template>
        </x-form-select>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../assets/scss/utils/pagination";
</style>
