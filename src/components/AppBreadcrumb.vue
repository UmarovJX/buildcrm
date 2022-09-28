<template>
  <div class="d-flex">
    <div @click="$router.go(-1)" class="app-header-back-button d-flex justify-content-center align-items-center">
      <base-left-icon :width="32" :height="32"/>
    </div>
    <div class="app-header-page-content">
      <div class="app-breadcrumb d-flex align-items-center">
        <div v-for="(breadcrumb,index) in breadcrumbs" :key="index" :class="breadcrumb.class">
          <router-link
              :to="{
                name:breadcrumb.route.name,
                params:breadcrumb.route.params,
                query:breadcrumb.route.query
              }"
              :class="breadcrumb.route.class"
              class="app-breadcrumb-link"
          >
            <slot :name="`${breadcrumb.route.name}-left`"></slot>
            <span class="app-breadcrumb-link-content">
              {{ (breadcrumb.content.type === 'string') ? breadcrumb.content.path : $t(breadcrumb.content.path) }}
            </span>
            <slot :name="`${breadcrumb.route.name}-right`"></slot>
            <span>
              <base-right-icon :width="18" :height="18"/>
            </span>
          </router-link>
        </div>
        <span class="app-breadcrumb-page">
          {{ (page.type === 'string') ? page.path : $t(page.path) }}
        </span>
      </div>
      <div class="app-header-page-title">
        <p>{{ pageInfo.title }}</p>
        <p class="app-header-page-title-active">
          {{ pageInfo.titleHighlight }}
        </p>
      </div>
    </div>
    <!-- TODO:SLOT BREADCRUMB_RIGHT   -->
    <slot name="breadcrumb-right" />
  </div>
</template>

<script>
import BaseLeftIcon from "@/components/icons/BaseLeftIcon";
import BaseRightIcon from "@/components/icons/BaseRightIcon";

export default {
  name: "AppBreadcrumb",
  components: {
    BaseRightIcon,
    BaseLeftIcon
  },
  props: {
    page: {
      type: Object,
      required: true
      /*
      *
      * Structure
      * {
      *   type:'',
      *   path:''
      * }
      *
      * */
    },
    breadcrumbs: {
      type: Array,
      required: true
      /*
      *
      * Structure
      * [
      *   {
      *     content:{
      *       type:'string',
      *       path:''
      *     },
      *     route:{
      *       name:'',
      *       path:'',
      *       params:'',
      *       query:'',
      *       class:'',
      *     }
      *     class:''
      *   }
      * ]
      *
      * */
    },
    pageInfo: {
      type: Object,
      required: true
    },
  },

}
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  color: var(--gray-400);
  font-size: 14px;
  font-weight: 600;
  font-family: Inter, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: .25rem;

  &-link {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: .25rem;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:hover {
      color: var(--violet-600);
    }

    &-content:not(:first-child) {
      padding-right: 10px;
      padding-left: 10px;
    }
  }

  &-page {
    //padding-left: 10px;
    //padding-right: 10px;
  }
}

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