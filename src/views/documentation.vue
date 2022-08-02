<template>
  <main>
    <!--  BASE ACTION LIST-->
    <div class="item">
      <p>BaseActionList {{ $t('component') }}</p>
      <BaseActionList :position-right="true">
        <template #header>
          {{ $t('contracts.view.actions') }}
        </template>
        <template #list>
          <b-dropdown-item @click="consoleText">
            <BasePlusIcon fill="var(--violet-600)"/>
            {{ $t('contracts.view.update_contract') }}
          </b-dropdown-item>
          <b-dropdown-item @click="consoleData">
            <BaseDeleteIcon fill="var(--violet-600)"/>
            {{ $t('contracts.view.download_contract') }}
          </b-dropdown-item>
        </template>
      </BaseActionList>
    </div>
    <div class="item" v-for="{name, component, path, options, placeholder, status} in data" :key="name">
      <p>{{ name }} {{$t('component')}}</p>
      <component class="component" :status="status" :is="component" :options="options" :placeholder="placeholder" v-b-tooltip.hover :title="path"/>
    </div>
  </main>
</template>

<script>
import BaseActionList from "@/components/Reusable/BaseActionList";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseContractsIcon from "@/components/icons/BaseContractsIcon";
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
import WarningSuccess from "@/components/Reusable/WarningSuccess";
import BarsLoading from "@/components/Reusable/Animation/BarsLoading";
import BaseCalendarNavigation from "@/components/Reusable/Calendar/BaseCalendarNavigation";
import SidebarMenu from "@/components/Reusable/Sidebar/SidebarMenu";

export default {
  name: "documentation",
  components: {
    BaseButton,
    SidebarMenu,
    BaseCalendarNavigation,
    BarsLoading,
    WarningSuccess,
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
    BaseContractsIcon,
    BaseCalendar
  },
  data(){
    return {
      data: [
        {
          name: 'BaseButton',
          component: BaseButton,
          path: 'src/components/Reusable/BaseButton.vue'
        },
        {
          name: 'BaseCalendar',
          component: BaseCalendar,
          path: 'src/components/Reusable/BaseCalendar.vue'
        },
        {
          name: 'BaseDatePicker',
          component: BaseDatePicker,
          path: 'src/components/Reusable/BaseDatePicker.vue'
        },
        {
          name: 'BaseFormTagInput',
          component: BaseFormTagInput,
          path: 'src/components/Reusable/BaseFormTagInput.vue'
        },
        {
          name: 'BaseInput',
          component: BaseInput,
          path: 'src/components/Reusable/BaseInput.vue'
        },
        {
          name: 'BaseDatePicker',
          component: BaseLoading,
          path: 'src/components/Reusable/BaseLoading.vue'
        },
        {
          name: 'BaseMultiselect',
          component: BaseMultiselect,
          path: 'src/components/Reusable/BaseMultiselect.vue',
          options: ["item1", "item2", "item3", "etc."],
          placeholder: "multiselect"
        },
        {
          name: 'BaseNumericInput',
          component: BaseNumericInput,
          path: 'src/components/Reusable/BaseNumericInput.vue',
          placeholder: "numeric input"
        },
        {
          name: 'BasePriceInput',
          component: BasePriceInput,
          path: 'src/components/Reusable/BasePriceInput.vue',
          placeholder: "price input"
        },
        {
          name: 'BaseSearchInput',
          component: BaseSearchInput,
          path: 'src/components/Reusable/BaseSearchInput.vue',
          placeholder: "search input"
        },
        {
          name: 'BaseSelect',
          component: BaseSelect,
          path: 'src/components/Reusable/BaseSelect.vue',
          placeholder: "select",
          options: ["item", "item"]
        },
        {
          name: 'BaseValidationBottomWarning',
          component: BaseValidationBottomWarning,
          path: 'src/components/Reusable/BaseValidationBottomWarning.vue',
          placeholder: "select",
          options: ["item", "item"]
        },
        {
          name: 'BarsLoading',
          component: BarsLoading,
          path: 'src/components/Reusable/Animation/BarsLoading.vue',
        },
        // {
        //   name: 'WarningSuccess',
        //   component: WarningSuccess,
        //   path: 'src/components/Reusable/WarningSuccess.vue',
        //   status: "successful"
        // },
        // {
        //   name: 'BaseCalendarNavigation',
        //   component: BaseCalendarNavigation,
        //   path: 'src/components/Reusable/Calendar/BaseCalendarNavigation.vue',
        // },
        // {
        //   name: 'SidebarMenu',
        //   component: SidebarMenu,
        //   path: 'src/components/Reusable/Sidebar/SidebarMenu.vue',
        // },
      ]
    }
  },
  methods: {
    consoleText() {
      console.log('consoleText');
    },
    consoleData() {
      console.log('consoleData');
    }
  },
}
</script>

<style scoped lang="scss">
.search__content {
  width: 200px;
}
::v-deep #search-input {
  width: 85%!important;
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
  padding: 0!important;
  margin: 0!important;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-width: 400px;
  max-height: 400px;
  width: 250px;
  height: 100px;
  justify-content: flex-start;
}
.search__content {
  margin-top: 0!important;
}
p {
  margin-bottom: 0!important;
}
.alert {
  min-height: max-content!important;
}
</style>