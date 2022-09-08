<template>
  <main class="loader">
    <DocHeader title="loader"/>
    <div class="loader-content">
      <BaseLoading/>
      <BaseLoading width="40" height="40"/>
      <BaseLoading width="24" height="24"/>
    </div>
  </main>
</template>

<script>
import DocHeader from "@/views/Documentation/DocHeader";
import BaseLoading from "@/components/Reusable/BaseLoading";
export default {
  name: "Loader",
  components: {BaseLoading, DocHeader}
}
</script>

<style lang="scss" scoped>
.loader {
  &-content {
    display: flex;
    gap: 64px;
    ::v-deep .loading__content {
      min-height: auto;
    }
   }
}

</style>