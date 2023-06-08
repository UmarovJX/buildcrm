<script>
export default {
  name: "CreateBranchBreadCrumbs",
};
</script>

<template>
  <div
    class="d-flex justify-content-between align-items-center flex-md-row flex-column"
  >
    <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-0">
      <ul class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'home' }">
            <i class="far fa-home"></i>
          </router-link>
        </li>

        <li class="breadcrumb-item">
          <router-link :to="{ name: 'branches' }">
            {{ $t("branches.name") }}
          </router-link>
        </li>
        <li class="breadcrumb-item active">
          {{ $t("create") }}
        </li>
      </ul>
    </div>
  </div>
</template>
