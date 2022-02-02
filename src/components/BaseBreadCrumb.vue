<template>
  <div
      class="d-flex justify-content-between align-items-center flex-md-row flex-column"
  >
    <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-0">
      <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
        <li
            class="breadcrumb-item"
        >
          <router-link :to="{name: 'home'}">
            <i class="far fa-home"></i>
          </router-link>
        </li>

        <li
            v-for="{routeName,textContent,} in breadCrumbs"
            :key="routeName+textContent"
            class="breadcrumb-item"
        >
          <router-link :to="{name:routeName}">
            {{ textContent }}
          </router-link>
        </li>

        <li class="breadcrumb-item active">
          {{ activeContent }}
        </li>
      </ul>
    </div>
    <slot name="extraContent"/>
  </div>
</template>

<script>
export default {
  name: "BaseBreadCrumb",
  props: {
    breadCrumbs: {
      type: Object,
      required: true
    },
    activeContent: {
      type: String,
      required: true
    }
  }
}
</script>