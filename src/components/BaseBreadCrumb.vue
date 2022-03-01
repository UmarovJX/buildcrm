<template>
  <div
      class="d-flex justify-content-between align-items-center flex-md-row flex-column"
  >
    <div class="d-flex w-100 align-items-center justify-content-between flex-md-row flex-column mb-0 pl-0">
      <ul class="breadcrumb mb-0 mb-md-0">
        <li
            class="breadcrumb-item"
        >
          <router-link :to="{name: 'home'}">
            <i class="far fa-home"></i>
          </router-link>
        </li>

        <template>
          <li
              v-for="{ routeName,textContent, params } in breadCrumbs"
              :key="routeName+textContent"
              class="breadcrumb-item"
          >
            <router-link :to="{ name:routeName,params }">
              {{ textContent }}
            </router-link>
          </li>
        </template>


        <li v-if="activeContent" class="breadcrumb-item active">
          {{ activeContent }}
        </li>
      </ul>

      <slot name="extra-content"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseBreadCrumb",
  props: {
    breadCrumbs: {
      type: Array,
      default: () => ([])
    },
    activeContent: {
      type: String,
      required: true
    },
  },
  computed: {
    showBreadCrumbList() {
      return this.breadCrumbs.length > 0
    }
  }

}
</script>