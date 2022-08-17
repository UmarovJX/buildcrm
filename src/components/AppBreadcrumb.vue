<template>
  <div class="app-breadcrumb d-flex align-items-center">
    <div v-for="(breadcrumb,index) in breadcrumbs" :key="index" :class="breadcrumb.class">
      <router-link :to="{name:breadcrumb.route.name}" :class="breadcrumb.route.class" class="app-breadcrumb-link">
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
</template>

<script>
import BaseRightIcon from "@/components/icons/BaseRightIcon";

export default {
  name: "AppBreadcrumb",
  components: {
    BaseRightIcon
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
    }
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
</style>