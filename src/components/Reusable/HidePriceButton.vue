<script>
import { computed } from "vue";
import { useHideM2 } from "@/composables/useHideM2";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";

export default {
  name: "HidePriceButton",

  components: {
    XIcon,
    XCircularBackground,
  },
  setup() {
    const { showPrice, changeHide } = useHideM2();
    const iconName = computed(() =>
      showPrice.value ? "visibility" : "visibility_off"
    );
    return { iconName, changeHide };
  },
};
</script>
<template>
  <x-circular-background
    class="bg-violet-500"
    :padding="0.5"
    @click="changeHide"
    style="user-select: none; cursor: pointer"
  >
    <x-icon
      :name="iconName"
      :size="24"
      class=""
      color="white"
      style="user-select: none"
    />
  </x-circular-background>
</template>

<style lang="scss" scoped></style>
