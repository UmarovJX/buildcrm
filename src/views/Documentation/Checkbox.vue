<template>
<div class="checkbox">
  <DocHeader title="checkbox"/>
  <div class="checkbox-content">
    <BaseCheckbox/>
  </div>
</div>
</template>

<script>
import DocHeader from "@/views/Documentation/DocHeader";
import BaseCheckbox from "@/components/Reusable/BaseCheckbox";
export default {
  name: "Checkbox",
  components: {BaseCheckbox, DocHeader}
}
</script>

<style scoped lang="scss">
.checkbox {
  &-content {
     padding: 0 64px 64px;
   }
}
</style>