<template>
  <div class="text-fields">
    <DocHeader title="text fields"/>
    <div class="text-fields-content">
      <BaseInput/>
    </div>
  </div>
</template>

<script>

import DocHeader from "@/views/Documentation/DocHeader";
import BaseInput from "@/components/Reusable/BaseInput";
export default {
  name: 'Sidebar',
  components: {BaseInput, DocHeader},
}
</script>

<style lang="scss" scoped>
.text-fields {
  &-content {
    padding: 0 64px 64px;
  }
}

</style>
