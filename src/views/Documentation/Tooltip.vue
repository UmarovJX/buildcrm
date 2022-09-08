<template>
  <main class="tooltip-container">
    <DocHeader title="tooltip"/>
    <div class="tooltip-container-content">
      <div class="tooltip-container-content-row">
        <span id="target1">Trigger top</span>
        <BaseTooltip target="target1" text="Tooltip on top"/>
        <span id="target2">Trigger bottom</span>
        <BaseTooltip target="target2" text="Tooltip on bottom" placement="bottom"/>
      </div>
    </div>
  </main>
</template>

<script>
import DocHeader from "@/views/Documentation/DocHeader";
import BaseTooltip from "@/components/Reusable/BaseTooltip";
export default {
  name: "Tooltip",
  components: {BaseTooltip, DocHeader},
}
</script>

<style lang="scss" scoped>
.tooltip-container {
  &-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding-left: 10rem;
    &-row {
      display: flex;
      gap: 3rem;
    }
  }
}
</style>