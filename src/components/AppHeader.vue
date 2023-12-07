<script>
import AppBreadcrumb from "@/components/AppBreadcrumb";
// import BaseLeftIcon from "@/components/icons/BaseLeftIcon";
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";
import AppNotificationIcon from "@/components/Reusable/Notification/AppNotificationIcon";
import AppQuestionIcon from "@/components/Reusable/Question/AppQuestionIcon";

export default {
  name: "AppHeader",

  components: {
    AppDropdown,
    // BaseLeftIcon,
    AppBreadcrumb,
    AppQuestionIcon,
    AppNotificationIcon,
  },

  props: {
    pageInfo: {
      type: Object,
      required: true,
    },
    breadcrumbs: {
      type: Array,
      required: true,
    },
    page: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },
};
</script>

<template>
  <div class="app-header">
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex">
        <!--                <div @click="$router.go(-1)"-->
        <!--                     class="app-header-back-button d-flex justify-content-center align-items-center">-->
        <!--                    <base-left-icon :width="32" :height="32"/>-->
        <!--                </div>-->
        <div class="app-header-page-content">
          <app-breadcrumb
            :page="page"
            :page-info="pageInfo"
            :breadcrumbs="breadcrumbs"
          />
          <!--                    <div class="app-header-page-title">-->
          <!--                        <span>-->
          <!--                          {{ pageInfo.title }}-->
          <!--                        </span>-->
          <!--                        <span class="app-header-page-title-active">-->
          <!--                          {{ pageInfo.titleHighlight }}-->
          <!--                        </span>-->
          <!--                    </div>-->
        </div>
        <slot name="header-status"></slot>
      </div>
      <div class="d-flex align-items-center">
        <!--   Slot For Addition Actions     -->
        <slot name="header-right"></slot>
        <app-dropdown :position-right="true">
          <template #header> {{ $t('actions')  }} </template>

          <!--          <template>-->
          <!--            <b-dropdown-item> Action </b-dropdown-item>-->
          <!--          </template>-->
        </app-dropdown>
        <app-notification-icon class="ml-1" />
        <app-question-icon class="ml-1" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  font-family: Inter, sans-serif;

  &-back-button {
    padding: 12px;
    cursor: pointer;
    border-radius: 50%;
    background-color: var(--gray-100);

    &:hover {
      background-color: var(--gray-200);
    }
  }

  &-page-content {
    //margin-left: 1rem;
  }

  &-page-title {
    font-size: 24px;
    font-weight: 900;
    color: var(--gray-600);
    font-family: CraftworkSans, serif;

    &-active {
      color: var(--violet-600);
    }
  }
}
</style>
