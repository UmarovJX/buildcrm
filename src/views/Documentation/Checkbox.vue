<template>
<div class="checkbox">
  <DocHeader title="checkbox"/>
  <div class="checkbox-content">
    <div class="checkbox-content-box">
      <div class="checkbox-content-box-row">
        <BaseCheckbox/>
        <BaseCheckbox/>
        <BaseCheckbox disabled/>
      </div>
      <div class="checkbox-content-box-row">
        <BaseCheckbox checked/>
        <BaseCheckbox checked/>
        <BaseCheckbox disabled checked/>
      </div>
    </div>
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
    &-box {
      padding: 20px;
      border: 1px dashed #7B61FF;
      border-radius: 5px;
      width: max-content;
      display: flex;
      gap: 16px;
      flex-direction: column;
      &-row {
        display: flex;
        gap: 16px;
        ::v-deep .base-checkbox:nth-child(2) > input[type="checkbox"] {
          border: 3px solid #7C3AED;
        }
      }
    }
   }
}
</style>