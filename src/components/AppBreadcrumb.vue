<script>
import BaseLeftIcon from "@/components/icons/BaseLeftIcon";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import { isFunction } from "@/util/inspect";

export default {
  name: "AppBreadcrumb",
  components: {
    BaseRightIcon,
    BaseLeftIcon,
  },
  props: {
    goBackMethod: {
      type: Function,
      default: undefined,
    },
    page: {
      type: [Object, String],
      required: true,
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
      required: true,
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
      type: [Object, String],
      default: null,
    },
  },
  computed: {
    title() {
      const { pageInfo } = this;
      if (!pageInfo) return null;
      const { title: pageTitle } = pageInfo;

      if (typeof pageInfo === "string") {
        return this.$t(pageInfo);
      }

      if (typeof pageTitle === "object") {
        if (pageTitle.type === "i18n") {
          return this.$t(pageTitle.content);
        }
      }

      return pageTitle;
    },
    highlight() {
      const { pageInfo } = this;
      if (typeof pageInfo === "string") {
        return null;
      }

      const { titleHighlight: pageHighlight } = pageInfo;
      if (typeof pageHighlight === "object") {
        if (pageHighlight.type === "i18n") {
          return this.$t(pageHighlight.content);
        }
      }

      return pageHighlight;
    },
    pageOutput() {
      const { page } = this;
      if (typeof page === "object") {
        if (page.type === "string") {
          return page.path;
        }
        return this.$t(page.path);
      }
      return this.$t(page);
    },
  },
  methods: {
    backBtnHandler() {
      if (isFunction(this.goBackMethod)) {
        this.goBackMethod();
      } else {
        this.$router.go(-1);
      }
    },
  },
};
</script>

<template>
  <div class="d-flex">
    <div
      @click="backBtnHandler"
      class="app-header-back-button d-flex justify-content-center align-items-center"
    >
      <base-left-icon :width="32" :height="32" />
    </div>
    <div class="app-header-page-content">
      <div class="app-breadcrumb d-flex align-items-center">
        <div
          v-for="(breadcrumb, index) in breadcrumbs"
          :key="index"
          :class="breadcrumb.class"
        >
          <router-link
            :to="{
              name: breadcrumb.route.name,
              params: breadcrumb.route.params,
              query: breadcrumb.route.query,
            }"
            :class="breadcrumb.route.class"
            class="app-breadcrumb-link"
          >
            <slot :name="`${breadcrumb.route.name}-left`"></slot>
            <span class="app-breadcrumb-link-content">
              {{
                breadcrumb.content.type === "string"
                  ? breadcrumb.content.path
                  : $t(breadcrumb.content.path)
              }}
            </span>
            <slot :name="`${breadcrumb.route.name}-right`"></slot>
            <span>
              <base-right-icon :width="18" :height="18" />
            </span>
          </router-link>
        </div>
        <span class="app-breadcrumb-page">
          {{ pageOutput }}
        </span>
      </div>
      <div v-if="title" class="app-header-page-title">
        <p>{{ title }}</p>
        <p v-if="highlight" class="app-header-page-title-active">
          {{ highlight }}
        </p>
      </div>
    </div>
    <!-- TODO:SLOT BREADCRUMB_RIGHT   -->
    <slot name="breadcrumb-right" />
  </div>
</template>

<style lang="scss" scoped>
.app-breadcrumb {
  color: var(--gray-400);
  font-size: 14px;
  font-weight: 600;
  font-family: Inter, sans-serif;
  display: flex;
  align-items: center;
  //justify-content: center;
  column-gap: 0.25rem;

  &-link {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 0.25rem;

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
    width: 56px;
    height: 56px;
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
    display: flex;
    column-gap: 0.5rem;
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
