<script>
import { XIcon } from "@/components/ui-components/material-icons";

export default {
  components: {
    XIcon,
  },
};
</script>

<template>
  <b-dropdown right no-caret class="b__dropdown__group">
    <template #button-content>
      <slot name="button-content" />
      <x-icon name="more_horiz" class="violet-600" />
    </template>

    <slot />
  </b-dropdown>
</template>

<style lang="scss" scoped>
.b__dropdown__group {
  ::v-deep .btn.dropdown-toggle {
    background-color: transparent !important;
    border: none !important;
    box-shadow: 0.5px 1px 0 rgba(5, 8, 9, 0.1), 0 5px 9px 1px rgba(5, 8, 9, 0.1) !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 2rem !important;
    height: 2rem !important;
    border-radius: 50% !important;
  }
}
</style>
