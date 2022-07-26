<template>
  <main>
    <span v-for="{icon, text, path} in data"
          :key="icon"
    >
      <BaseButton :text="text" v-b-tooltip.hover :title="path">
        <template #left-icon>
          <component :is="icon"/>
        </template>
      </BaseButton>
  </span>
  </main>
</template>

<script>
import BaseHomeIcon from "@/components/icons/BaseHomeIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseSettingsIcon from "@/components/icons/BaseSettingsIcon";
import BaseFilterIcon from "@/components/icons/BaseFilterIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import BaseStarIcon from "@/components/icons/BaseStarIcon";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseWarningIcon from "@/components/icons/BaseWarningIcon";
import BaseListIcon from "@/components/icons/BaseListIcon";
export default {
  name: "icons",
  components: { BaseButton, BaseListIcon, BasePlusIcon, BaseStarIcon, BaseDownIcon, BaseFilterIcon, BaseHomeIcon, BaseSettingsIcon},
  data() {
    return {
      data: [
        {
          icon: BaseHomeIcon,
          text: 'home',
          path: 'src/components/icons/BaseHomeIcon.vue'
        },
        {
          icon: BaseSettingsIcon,
          text: 'settings',
          path: 'src/components/icons/BaseSettingsIcon.vue'
        },
        {
          icon: BaseFilterIcon,
          text: 'filter',
          path: 'src/components/icons/BaseFilterIcon.vue'
        },
        {
          icon: BaseDownIcon,
          text: 'down',
          path: 'src/components/icons/BaseDownIcon.vue'
        },
        {
          icon: BaseStarIcon,
          text: 'star',
          path: 'src/components/icons/BaseStarIcon.vue'
        },
        {
          icon: BasePlusIcon,
          text: 'plus',
          path: 'src/components/icons/BasePlusIcon.vue'
        },
        {
          icon: BaseWarningIcon,
          text: 'warning circle',
          path: 'src/components/icons/BaseWarningIcon.vue'
        },
        {
          icon: BaseListIcon,
          text: 'list',
          path: 'src/components/icons/BaseListIcon.vue'
        },
      ]
    }
  }
}
</script>

<style scoped lang="scss">
main {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  .base__button {
    width: 12em!important;
    justify-content: start;
    text-transform: capitalize;
  }
}
::v-deep .tooltip-inner {
  max-width: max-content;
  background: #F3F4F6;
  color: black;
  padding: 10px 15px;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  ::v-deep .arrow::before {
    border-top-color: #F3F4F6!important;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  }
}
</style>