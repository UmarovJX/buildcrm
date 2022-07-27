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
import BaseRightDoubleIcon from "@/components/icons/BaseRightDoubleIcon";
import BaseDoorIcon from "@/components/icons/BaseDoorIcon";
import BaseAreaIcon from "@/components/icons/BaseAreaIcon";
import BaseLocationIcon from "@/components/icons/BaseLocationIcon";
import BaseObjectsIcon from "@/components/icons/BaseObjectsIcon";
import BaseNotificationsIcon from "@/components/icons/BaseNotificationsIcon";
import BaseDotsIcon from "@/components/icons/BaseDotsIcon";
import BaseUpIcon from "@/components/icons/BaseUpIcon";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BaseClose from "@/components/icons/BaseClose";
import BaseFilterAltIcon from "@/components/icons/BaseFilterAltIcon";
import BaseLeftDoubleIcon from "@/components/icons/BaseLeftDoubleIcon";
import BaseFloorIcon from "@/components/icons/BaseFloorIcon";
import BaseConstructionIcon from "@/components/icons/BaseConstructionIcon";
import BaseDocumentIcon from "@/components/icons/BaseDocumentIcon";
import BaseContractsIcon from "@/components/icons/BaseContractsIcon";
import BaseQuestionsIcon from "@/components/icons/BaseQuestionsIcon";
import BaseCollapseLeftIcon from "@/components/icons/BaseCollapseLeftIcon";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import BaseArrowUpIcon from "@/components/icons/BaseArrowUpIcon";
import BaseTimesCircleIcon from "@/components/icons/BaseTimesCircleIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BaseLinkIcon from "@/components/icons/BaseLinkIcon";
import BaseCameraIcon from "@/components/icons/BaseCameraIcon";
import BaseCheckIcon from "@/components/icons/BaseCheckIcon";
import BaseFlatIcon from "@/components/icons/BaseFlatIcon";
import BaseFacadeIcon from "@/components/icons/BaseFacadeIcon";
import BasePaperIcon from "@/components/icons/BasePaperIcon";
import BaseUsersIcon from "@/components/icons/BaseUsersIcon";
import BaseSearchIcon from "@/components/icons/BaseSearchIcon";
import BaseCollapseRightIcon from "@/components/icons/BaseCollapseRightIcon";
import BaseLeftIcon from "@/components/icons/BaseLeftIcon";
import BaseCalendarIcon from "@/components/icons/BaseCalendarIcon";
import BasePublishIcon from "@/components/icons/BasePublishIcon";
import BaseDragIcon from "@/components/icons/BaseDragIcon";
import BasePriceIcon from "@/components/icons/BasePriceIcon";
import BaseRoomIcon from "@/components/icons/BaseRoomIcon";
import BaseCompactGridIcon from "@/components/icons/BaseCompactGridIcon";
import BasePaperFailIcon from "@/components/icons/BasePaperFailIcon";
export default {
  name: "icons",
  components: { BasePaperFailIcon, BaseCompactGridIcon, BaseRoomIcon, BasePriceIcon, BaseDragIcon, BasePublishIcon, BaseCalendarIcon, BaseLeftIcon, BaseCollapseRightIcon, BaseSearchIcon, BaseUsersIcon, BasePaperIcon, BaseFacadeIcon, BaseFlatIcon, BaseCheckIcon, BaseCameraIcon, BaseLinkIcon, BaseDeleteIcon, BaseTimesCircleIcon, BaseArrowUpIcon, BaseRightIcon, BaseCollapseLeftIcon, BaseQuestionsIcon, BaseContractsIcon, BaseDocumentIcon, BaseConstructionIcon, BaseFloorIcon, BaseLeftDoubleIcon, BaseFilterAltIcon, BaseClose, BaseEditIcon, BaseArrowDownIcon, BaseUpIcon, BaseDotsIcon, BaseNotificationsIcon, BaseObjectsIcon, BaseLocationIcon, BaseDoorIcon, BaseAreaIcon, BaseButton, BaseRightDoubleIcon, BaseListIcon, BasePlusIcon, BaseStarIcon, BaseDownIcon, BaseFilterIcon, BaseHomeIcon, BaseSettingsIcon},
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
        {
          icon: BaseRightDoubleIcon,
          text: 'right double',
          path: 'src/components/icons/BaseRightDoubleIcon.vue'
        },
        {
          icon: BaseDoorIcon,
          text: 'door',
          path: 'src/components/icons/BaseDoorIcon.vue'
        },
        {
          icon: BaseAreaIcon,
          text: 'area',
          path: 'src/components/icons/BaseAreaIcon.vue'
        },
        {
          icon: BaseLocationIcon,
          text: 'location',
          path: 'src/components/icons/BaseLocationIcon.vue'
        },
        {
          icon: BaseObjectsIcon,
          text: 'objects',
          path: 'src/components/icons/BaseObjectsIcon.vue'
        },
        {
          icon: BaseNotificationsIcon,
          text: 'notifications',
          path: 'src/components/icons/BaseNotificationsIcon.vue'
        },
        {
          icon: BaseDotsIcon,
          text: 'dots',
          path: 'src/components/icons/BaseDotsIcon.vue'
        },
        {
          icon: BaseUpIcon,
          text: 'up',
          path: 'src/components/icons/BaseUpIcon.vue'
        },
        {
          icon: BaseArrowDownIcon,
          text: 'arrow down',
          path: 'src/components/icons/BaseArrowDownIcon.vue'
        },
        {
          icon: BaseEditIcon,
          text: 'edit',
          path: 'src/components/icons/BaseEditIcon.vue'
        },
        {
          icon: BaseClose,
          text: 'close',
          path: 'src/components/icons/BaseClose.vue'
        },
        {
          icon: BaseFilterAltIcon,
          text: 'filter alt',
          path: 'src/components/icons/BaseFilterAltIcon.vue'
        },
        {
          icon: BaseLeftDoubleIcon,
          text: 'left double',
          path: 'src/components/icons/BaseLeftDoubleIcon.vue'
        },
        {
          icon: BaseFloorIcon,
          text: 'floor',
          path: 'src/components/icons/BaseFloorIcon.vue'
        },
        {
          icon: BaseConstructionIcon,
          text: 'construction',
          path: 'src/components/icons/BaseConstructionIcon.vue'
        },
        {
          icon: BaseDocumentIcon,
          text: 'document',
          path: 'src/components/icons/BaseDocumentIcon.vue'
        },
        {
          icon: BaseContractsIcon,
          text: 'contracts',
          path: 'src/components/icons/BaseContractsIcon.vue'
        },
        {
          icon: BaseQuestionsIcon,
          text: 'questions',
          path: 'src/components/icons/BaseQuestionsIcon.vue'
        },
        {
          icon: BaseCollapseLeftIcon,
          text: 'collapse left',
          path: 'src/components/icons/BaseCollapseLeftIcon.vue'
        },
        {
          icon: BaseRightIcon,
          text: 'right',
          path: 'src/components/icons/BaseRightIcon.vue'
        },
        {
          icon: BaseArrowUpIcon,
          text: 'arrow up',
          path: 'src/components/icons/BaseArrowUpIcon.vue'
        },
        {
          icon: BaseTimesCircleIcon,
          text: 'times circle',
          path: 'src/components/icons/BaseTimesCircleIcon.vue'
        },
        {
          icon: BaseDeleteIcon,
          text: 'delete',
          path: 'src/components/icons/BaseDeleteIcon.vue'
        },
        {
          icon: BaseLinkIcon,
          text: 'link',
          path: 'src/components/icons/BaseLinkIcon.vue'
        },
        {
          icon: BaseCameraIcon,
          text: 'camera',
          path: 'src/components/icons/BaseCameraIcon.vue'
        },
        {
          icon: BaseCheckIcon,
          text: 'check',
          path: 'src/components/icons/BaseCheckIcon.vue'
        },
        {
          icon: BaseFlatIcon,
          text: 'flat',
          path: 'src/components/icons/BaseFlatIcon.vue'
        },
        {
          icon: BaseFacadeIcon,
          text: 'facade',
          path: 'src/components/icons/BaseFacadeIcon.vue'
        },
        {
          icon: BasePaperIcon,
          text: 'paper',
          path: 'src/components/icons/BasePaperIcon.vue'
        },
        {
          icon: BaseUsersIcon,
          text: 'users',
          path: 'src/components/icons/BaseUsersIcon.vue'
        },
        {
          icon: BaseSearchIcon,
          text: 'search',
          path: 'src/components/icons/BaseSearchIcon.vue'
        },
        {
          icon: BaseCollapseRightIcon,
          text: 'collapse right',
          path: 'src/components/icons/BaseCollapseRightIcon.vue'
        },
        {
          icon: BaseLeftIcon,
          text: 'left',
          path: 'src/components/icons/BaseLeftIcon.vue'
        },
        {
          icon: BaseCalendarIcon,
          text: 'calendar',
          path: 'src/components/icons/BaseCalendarIcon.vue'
        },
        {
          icon: BasePublishIcon,
          text: 'publish',
          path: 'src/components/icons/BasePublishIcon.vue'
        },
        {
          icon: BaseDragIcon,
          text: 'drag',
          path: 'src/components/icons/BaseDragIcon.vue'
        },
        {
          icon: BasePriceIcon,
          text: 'price',
          path: 'src/components/icons/BasePriceIcon.vue'
        },
        {
          icon: BaseRoomIcon,
          text: 'room',
          path: 'src/components/icons/BaseRoomIcon.vue'
        },
        {
          icon: BaseCompactGridIcon,
          text: 'compact grid',
          path: 'src/components/icons/BaseCompactGridIcon.vue'
        },
        {
          icon: BasePaperFailIcon,
          text: 'paper fail',
          path: 'src/components/icons/BasePaperFailIcon.vue'
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
  margin-bottom: 2rem;
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
}
::v-deep .arrow::before {
  border-top-color: #F3F4F6!important;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>