<template>
  <div class="app-header">
    <div class="d-flex justify-content-between">
      <div class="d-flex">
        <div @click="$router.go(-1)" class="app-header-back-button d-flex justify-content-center align-items-center">
          <base-left-icon :width="32" :height="32"/>
        </div>
        <div class="app-header-page-content">
          <app-breadcrumb :page="breadcrumbPage" :breadcrumbs="breadcrumbs"/>
          <div class="app-header-page-title">
            {{ pageInfo.title }}
            <span class="app-header-page-title-active">
             {{ pageInfo.titleHighlight }}
          </span>
          </div>
        </div>
      </div>
      <div>
        <slot name="header-right"></slot>
        <app-dropdown :position-right="true">
          <template #header>
            Действия
          </template>

          <template>
            <b-dropdown-item>
              Action
            </b-dropdown-item>
          </template>
        </app-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import AppBreadcrumb from "@/components/AppBreadcrumb";
import BaseLeftIcon from "@/components/icons/BaseLeftIcon";
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";

export default {
  name: "AppHeader",
  components: {
    AppBreadcrumb,
    AppDropdown,
    BaseLeftIcon
  },
  data() {
    return {
      pageInfo: {
        title: 'Договор',
        titleHighlight: '56APL29C'
      },
      breadcrumbPage: {
        type: 'string',
        path: 'Оформление'
      },
      breadcrumbs: [
        {
          content: {
            type: 'multi_language',
            path: 'objects.title'
          },
          route: {
            name: 'objects',
            path: '/objects'
          }
        },
        {
          content: {
            type: 'string',
            path: 'Sayram'
          },
          route: {
            name: 'objects',
            path: '/objects'
          }
        },
        {
          content: {
            type: 'string',
            path: 'Квартира №34'
          },
          route: {
            name: 'objects',
            path: '/objects'
          }
        }
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.app-header {
  margin: 1rem;

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
    margin-left: 1rem;
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