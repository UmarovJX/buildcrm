<template>
  <div class="text-fields">
    <DocHeader title="text fields"/>
    <div class="text-fields-content">
      asdfd
    </div>
  </div>
</template>

<script>

import DocHeader from "@/views/Documentation/DocHeader";
export default {
  name: 'Sidebar',
  components: {DocHeader},
}
</script>

<style lang="scss" scoped>
.text-fields {
  &-content {
    padding: 0 64px 64px;
  }
}

</style>
