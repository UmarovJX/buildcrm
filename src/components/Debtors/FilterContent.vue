<script>
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseRightModal from "@/components/Reusable/BaseRightModal";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import InputPriceFromTo from "@/components/Elements/Inputs/InputPriceFromTo";
// import BootstrapSelect from "@/components/elements/Selects/BootstrapSelect";
import CalendarNavigation from "@/components/Debtors/Elements/CalendarNavigation";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseFilterIcon from "@/components/icons/BaseFilterIcon";
import { XFormSelect } from "@/components/ui-components/form-select";
import api from "@/services/api";
import { isUndefinedOrNullOrEmpty } from "@/util/inspect";
// import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";

export default {
  name: "FilterContent",
  components: {
    // BaseArrowDownIcon,
    BaseSearchInput,
    BaseRightModal,
    BaseDatePicker,
    InputPriceFromTo,
    // BootstrapSelect,
    CalendarNavigation,
    BaseButton,
    BaseFilterIcon,
    XFormSelect: XFormSelect,
  },
  props: {
    defaultTypeOfView: {
      type: String,
      default: "list",
    },
    query: {
      type: Object,
      default: () => ({
        date: null,
        price_from: null,
        price_to: null,
        client_type: null,
      }),
    },
  },
  emits: [
    "reset-filter-fields",
    "change-view-type",
    "sort-by-search",
    "change-date",
    "sort-items",
    "go-to-today",
  ],
  data() {
    return {
      filter: {
        date: null,
        price_from: null,
        price_to: null,
        client_type: null,
        object_id: null,
      },
      typeOfView: null,
      objectOptions: [],
      clientTypeOptions: [],
    };
  },
  computed: {
    clientTypes() {
      return [
        {
          value: null,
          text: this.$t("client_type"),
        },
        {
          value: "friend",
          text: this.$t("familiar"),
        },
        {
          value: "unknown",
          text: this.$t("unfamiliar"),
        },
      ];
    },
    showTodayButtonLink() {
      const allowedToShow = ["month", "week", "day"];
      return allowedToShow.includes(this.typeOfView);
    },
    showSearchContent() {
      return this.typeOfView === "list";
    },
    showCalendarNavigation() {
      return !this.showSearchContent;
    },
    showDatePicker() {
      return this.typeOfView === "list";
    },
    viewTypes() {
      return [
        {
          id: 0,
          value: "list",
          text: this.$t("list"),
        },
        {
          id: 1,
          value: "month",
          text: this.$t("month"),
        },
        {
          id: 2,
          value: "week",
          text: this.$t("week"),
        },
        {
          id: 3,
          value: "day",
          text: this.$t("day"),
        },
      ];
    },
  },
  created() {
    this.initTypeOfView();
    this.fetchObjectsOption();
  },
  methods: {
    // openImportModal() {
    //     this.$emit('import-excel')
    // },
    inputFilterObject() {
      // if (selectOption.length) {
      //   this.filter.object_id = selectOption.map(option => parseInt(option.value))
      // }
    },
    async fetchObjectsOption() {
      await api.contractV2
        .fetchObjectsOption()
        .then((response) => {
          const { objects, "client-types": table } = response.data;
          this.clientTypeOptions = table.map((clientType) => ({
            value: clientType.id,
            text: clientType.name,
          }));
          this.objectOptions = objects.map(({ id, name }) => ({
            value: id,
            text: name,
          }));
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
    },
    setFilterPrice({ from, to }) {
      this.filter.price_from = from;
      this.filter.price_to = to;
    },
    initTypeOfView() {
      this.typeOfView = this.defaultTypeOfView;
    },
    openFilterContent() {
      this.$refs["filter-modal"].show();
    },
    changeTypeOfView(type) {
      this.typeOfView = type;
      this.$emit("change-view-type", type);
    },
    showTodayEvent() {
      this.$refs["calendar-navigation"].setMomentToCurrent();
      this.$emit("go-to-today");
    },
    changeCalendarDate(currentDate) {
      this.$emit("change-date", currentDate);
    },
    filterItems() {
      this.$emit("sort-items", this.filter);
    },
    resetFilterFields() {
      this.$refs["filter-date-picker"].clearField();
      this.$refs["input-price-from-to"].resetFields();
      this.filter.client_type = null;
      this.filter.object_id = null;
      if (this.typeOfView === "list") {
        this.filter.date = null;
      }
      this.$emit("reset-filter-fields");
    },
    setFilterProperties() {
      this.filter.date = this.query.date;
      this.filter.price_to = this.query.price_to;
      this.filter.price_from = this.query.price_from;
      if (!isUndefinedOrNullOrEmpty(this.query.client_type)) {
        this.filter.client_type = parseInt(this.query.client_type);
      }
      if (this.query.object_id) {
        if (typeof this.query.object_id === "string") {
          this.filter.object_id = [parseInt(this.query.object_id)];
        } else {
          this.filter.object_id = this.query.object_id.map((objectId) =>
            parseInt(objectId)
          );
        }
      }
    },
    filterBySearchContent(searchingValue) {
      this.$emit("sort-by-search", searchingValue);
    },
    setViewType(viewType) {
      this.typeOfView = viewType;
      this.$refs["client-type-select"].setValue(viewType);
    },
    setCalendarDate(moment) {
      this.$refs["calendar-navigation"].setCalendarMoment(moment);
    },
  },
};
</script>

<template>
  <div>
    <div
      class="d-flex align-items-center justify-content-between flex-wrap"
      style="row-gap: 0.5rem"
    >
      <base-button
        v-if="showTodayButtonLink"
        :text="`${$t('today')}`"
        @click="showTodayEvent"
      />
      <calendar-navigation
        ref="calendar-navigation"
        v-if="showCalendarNavigation"
        :type-of-view="typeOfView"
        @change-date="changeCalendarDate"
      />
      <div>
        <BaseSearchInput
          v-if="showSearchContent"
          class="base-search-input"
          style="min-width: 25rem"
          :placeholder="`${$t('contract_number_or_full_name')}`"
          @trigger-input="filterBySearchContent"
        />
      </div>

      <div class="d-flex align-items-center" style="gap: 0.5rem">
        <base-button @click="openFilterContent" :text="$t('contracts.filter')">
          <template #left-icon>
            <base-filter-icon fill="var(--violet-600)" />
          </template>
        </base-button>
        <x-form-select
          :value="defaultTypeOfView"
          :options="viewTypes"
          @change="changeTypeOfView"
        />
        <!--                <bootstrap-select-->
        <!--                    ref="status-type-select"-->
        <!--                    class="status-type"-->
        <!--                    :default-value="defaultTypeOfView"-->
        <!--                    :options="viewTypes"-->
        <!--                    @select="changeTypeOfView"-->
        <!--                />-->
      </div>
    </div>

    <!--  FILTER MODAL  -->
    <base-right-modal
      ref="filter-modal"
      @reset-fields="resetFilterFields"
      @start-filtering="filterItems"
      @show="setFilterProperties"
    >
      <div class="filter-modal-content">
        <x-form-select
          class="mb-4"
          v-model="filter.object_id"
          :multiple="true"
          :options="objectOptions"
          :placeholder="$t('contracts.object_name')"
          @change="inputFilterObject"
        />
        <base-date-picker
          ref="filter-date-picker"
          v-show="showDatePicker"
          icon-fill="#7C3AED"
          :default-value="filter.date"
          :placeholder="`${$t('date')}`"
          @input="filter.date = $event"
          class="mb-4"
        />
        <input-price-from-to
          ref="input-price-from-to"
          class="mb-4"
          :default-from="filter.price_from"
          :default-to="filter.price_to"
          @input="setFilterPrice"
        />
        <!--        <bootstrap-select-->
        <!--            :class="{ 'status-type-selection' : !filter.client_type_id }"-->
        <!--            :options="table"-->
        <!--            :default-value="filter.client_type_id"-->
        <!--            @select="(newValue) => filter.client_type_id = newValue"-->
        <!--        />-->
        <x-form-select
          :options="clientTypeOptions"
          :placeholder="$t('client_type')"
          :multilingual="true"
          v-model="filter.client_type"
        />
      </div>
    </base-right-modal>
  </div>
</template>

<style lang="scss" scoped>
.base-select {
  max-width: 16rem;
}

.base-search-input {
  width: 60%;
  max-width: 85rem;
  min-width: 32rem;
  row-gap: 0.5rem;
}

.filter-modal-content {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.client-type {
  max-width: 15rem;
  width: auto;
}

.client-type-selection {
  color: var(--gray-400) !important;
}
</style>
