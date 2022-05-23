<template>
  <div>
    <base-pagination
        :pagination-current="1"
        :pagination-count="10"
    />
  </div>
</template>

<script>
import BasePagination from "@/components/Reusable/Navigation/BasePagination";

export default {
  name: "BaseTableList",
  components: {
    BasePagination
  }
}
</script>

<style scoped>

</style>