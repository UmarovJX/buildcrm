<script>
import BranchesPermission from '@/permission/branches'

export default {
  name: 'BranchesBreadCrumbs',
  data() {
    return {
      createPermission: BranchesPermission.getBranchesCreatePermission(),
    }
  },
}
</script>

<template>
  <div
    class="d-flex justify-content-between align-items-center flex-md-row flex-column"
  >
    <div class="d-flex w-100 align-items-center flex-md-row flex-column mb-0">
      <ul class="breadcrumb ml-md-4 ml-md-3 mb-0 mb-md-0">
        <li class="breadcrumb-item">
          <router-link :to="{ name: 'home' }">
            <i class="far fa-home" />
          </router-link>
        </li>

        <li class="breadcrumb-item">
          <router-link :to="{ name: 'branches' }">
            {{ $t("branches.name") }}
          </router-link>
        </li>
        <li class="breadcrumb-item active">
          {{ $t("list") }}
        </li>
      </ul>
    </div>
    <router-link
      v-if="createPermission"
      :to="{ name: 'create-branch' }"
      :class="'btn btn-primary mr-0 mt-md-0'"
    >
      <i class="fal fa-plus mr-2" />
      {{ $t("add") }}
    </router-link>
  </div>
</template>
