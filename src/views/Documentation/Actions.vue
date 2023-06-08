<script>
import BaseActionList from "@/components/Reusable/Dropdown/AppDropdown";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseSearchCalendar from "@/components/Reusable/BaseCalendar";
import BaseCalendar from "@/components/Reusable/BaseCalendar";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseMultiselect from "@/components/Reusable/BaseMultiselect";
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseValidationBottomWarning from "@/components/Reusable/BaseValidationBottomWarning";
import BarsLoading from "@/components/Reusable/Animation/BarsLoading";
import BaseCalendarNavigation from "@/components/Reusable/Calendar/BaseCalendarNavigation";
import BaseStarIcon from "@/components/icons/BaseStarIcon";
import BasePagination from "@/components/Reusable/Navigation/BasePagination";

export default {
  name: "documentation",
  components: {
    BaseStarIcon,
    BasePagination,
    BaseButton,
    BaseCalendarNavigation,
    BarsLoading,
    BaseValidationBottomWarning,
    BaseSelect,
    BaseSearchInput,
    BasePriceInput,
    BaseNumericInput,
    BaseMultiselect,
    BaseLoading,
    BaseInput,
    BaseFormTagInput,
    BaseFilterTabsContent,
    BaseDatePicker,
    BaseSearchCalendar,
    BaseActionList,
    BasePlusIcon,
    BaseDeleteIcon,
    BaseCalendar,
  },
  data() {
    return {
      options: ["item1", "item2", "item3", "item4", "item5", "etc."],
      number: 0,
    };
  },
  methods: {
    consoleText() {
      console.log("consoleText");
    },
    consoleData() {
      console.log("consoleData");
    },
  },
};
</script>
<template>
  <div>
    <!--  BASE ACTION LIST-->
    <div class="item">
      <p>BaseInput {{ $t("component") }}</p>
      <BaseInput
        placeholder="number"
        type="number"
        v-model="number"
        :counter="true"
        :label="true"
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseInput.vue"
      />
    </div>
    <div class="item">
      <p>BaseActionList {{ $t("component") }}</p>
      <BaseActionList :position-right="false">
        <template #header>
          {{ $t("contracts.view.actions") }}
        </template>
        <template #list>
          <b-dropdown-item @click="consoleText">
            <BasePlusIcon fill="var(--violet-600)" />
            {{ $t("contracts.view.update_contract") }}
          </b-dropdown-item>
          <b-dropdown-item @click="consoleData">
            <BaseDeleteIcon fill="var(--violet-600)" />
            {{ $t("contracts.view.download_contract") }}
          </b-dropdown-item>
        </template>
      </BaseActionList>
    </div>
    <div class="item">
      <p>BaseButton {{ $t("component") }}</p>
      <BaseButton
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseButton.vue"
      >
        <template #left-icon>
          <BaseStarIcon />
        </template>
      </BaseButton>
    </div>
    <div class="item">
      <p>BaseButton {{ $t("component") }}</p>
      <BaseButton
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseButton.vue"
      >
        <template #right-icon>
          <BaseStarIcon />
        </template>
      </BaseButton>
    </div>
    <div class="item">
      <p>BaseCalendar {{ $t("component") }}</p>
      <BaseCalendar
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseCalendar.vue"
      />
    </div>
    <div class="item">
      <p>BaseDatePicker {{ $t("component") }}</p>
      <BaseDatePicker
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseDatePicker.vue"
      />
    </div>
    <div class="item">
      <p>BaseFormTagInput {{ $t("component") }}</p>
      <BaseFormTagInput
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseFormTagInput.vue"
      >
        <template #delete-content> deleting </template>
      </BaseFormTagInput>
    </div>
    <div class="item">
      <p>BaseInput {{ $t("component") }}</p>
      <BaseInput
        placeholder="base input"
        value="value"
        :label="true"
        :error="true"
        currency="uz"
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseInput.vue"
      />
    </div>
    <div class="item">
      <p>BaseInput Disabled {{ $t("component") }}</p>
      <BaseInput
        placeholder="base input"
        :disable="true"
        value="value"
        :label="true"
        :error="true"
        currency="uz"
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseInput.vue"
      />
    </div>
    <div class="item">
      <p>BaseLoading {{ $t("component") }}</p>
      <BaseLoading
        class="component"
        v-b-tooltip
        title="src/components/Reusable/BaseLoading.vue"
      />
    </div>
    <div class="item">
      <p>BaseMultiselect {{ $t("component") }}</p>
      <BaseMultiselect
        class="component"
        label="multiselect label"
        v-b-tooltip
        :options="options"
        title="src/components/Reusable/BaseLoading.vue"
      />
    </div>
    <div class="item">
      <p>BaseNumericInput {{ $t("component") }}</p>
      <BaseNumericInput
        class="component"
        placeholder="numberic input"
        v-b-tooltip
        title="src/components/Reusable/BaseNumericInput.vue"
      />
    </div>
    <div class="item">
      <p>BaseNumericInput Disabled {{ $t("component") }}</p>
      <BaseNumericInput
        class="component"
        disabled="true"
        placeholder="numeric input"
        v-b-tooltip
        title="src/components/Reusable/BaseNumericInput.vue"
      />
    </div>
    <div class="item">
      <p>BasePriceInput {{ $t("component") }}</p>
      <BasePriceInput
        class="component"
        :topPlaceholder="true"
        value="value"
        :precision="54"
        outputType="nuuumber"
        placeholder="price input"
        v-b-tooltip
        title="src/components/Reusable/BasePriceInput.vue"
      />
    </div>
    <div class="item">
      <p>BaseSearchInput {{ $t("component") }}</p>
      <BaseSearchInput
        class="component"
        placeholder="search input"
        v-b-tooltip
        title="src/components/Reusable/BaseSearchInput.vue"
      />
    </div>
    <div class="item">
      <p>BaseSelect {{ $t("component") }}</p>
      <BaseSelect
        name="selector"
        :noPlaceholder="false"
        :disabled="false"
        :label="true"
        :error="false"
        :options="options"
        class="component"
        placeholder="select"
        v-b-tooltip
        title="src/components/Reusable/BaseSelect.vue"
      />
    </div>
    <div class="item">
      <p>BaseSelect Disabled {{ $t("component") }}</p>
      <BaseSelect
        name="selector"
        :noPlaceholder="false"
        :disabled="true"
        :label="true"
        :error="false"
        :options="options"
        class="component"
        placeholder="select"
        v-b-tooltip
        title="src/components/Reusable/BaseSelect.vue"
      />
    </div>
    <div class="item">
      <p>BaseValidationBottomWarning {{ $t("component") }}</p>
      <BaseValidationBottomWarning
        v-b-tooltip
        title="src/components/Reusable/BaseValidationBottomWarning.vue"
      />
    </div>
    <div class="item">
      <p>BarsLoading {{ $t("component") }}</p>
      <BarsLoading
        v-b-tooltip
        title="src/components/Reusable/BarsLoading.vue"
      />
    </div>
    <div class="item">
      <p>BaseCalendarNavigation {{ $t("component") }}</p>
      <BaseCalendarNavigation
        status="successful"
        v-b-tooltip
        title="src/components/Reusable/Calendar/BaseCalendarNavigation.vue"
      />
    </div>
    <div class="item">
      <p>BaseSearchCalendar {{ $t("component") }}</p>
      <BaseSearchCalendar
        v-b-tooltip
        title="src/components/Reusable/Sidebar/BaseSearchCalendar.vue"
      />
    </div>
    <div class="item">
      <p>BaseFilterTabsContent {{ $t("component") }}</p>
      <BaseFilterTabsContent
        :filter-tab-list="options"
        v-b-tooltip
        title="src/components/Reusable/Sidebar/BaseFilterTabsContent.vue"
      />
    </div>
    <div class="item">
      <p>BasePagination {{ $t("component") }}</p>
      <BasePagination
        v-b-tooltip
        title="src/components/Reusable/Navigation/BasePagination.vue"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.search__content {
  width: 200px;
}

::v-deep #search-input {
  width: 85% !important;
}

.component {
  width: 200px;
  min-height: 50px;
}

main {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-between;
}

.item {
  padding: 0 !important;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-width: 400px;
  max-height: 400px;
  width: 250px;
  height: 100px;
  justify-content: flex-start;
}

.item:nth-last-child(2) {
  width: auto;
  margin-top: 100px !important;
  max-width: max-content;
}

.item:last-child {
  width: auto;
  max-width: max-content;
}

.search__content {
  margin-top: 0 !important;
}

p {
  margin-bottom: 0 !important;
}

.alert {
  min-height: max-content !important;
}
</style>
