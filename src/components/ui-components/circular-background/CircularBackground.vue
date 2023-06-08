<script>
import { makeProp as p } from "@/util/props";
import { PROP_TYPE_NUMBER_STRING, PROP_TYPE_STRING } from "@/constants/props";

export default {
  name: "CircularBackground",
  emits: ["click"],
  props: {
    padding: p(PROP_TYPE_NUMBER_STRING, 0.5),
    unit: p(PROP_TYPE_STRING, "rem"),
    bgColor: p(PROP_TYPE_STRING, "var(--violet-100)"),
    size: p(PROP_TYPE_STRING, ""),
  },
  computed: {
    circularBgStyle() {
      return {
        padding: `${this.padding}${this.unit}`,
        backgroundColor: this.bgColor,
      };
    },
  },
};
</script>

<template>
  <div
    class="circular-wrapper"
    :class="size"
    @click="$emit('click', $event)"
    :style="circularBgStyle"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.circular-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  &.small {
    width: 32px;
    height: 32px;
  }
}
</style>
