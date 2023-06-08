<script>
import { XIcon } from "@/components/ui-components/material-icons";
import {
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_BOOLEAN_STRING,
  PROP_TYPE_STRING,
} from "@/constants/props";
import { makeProp as p } from "@/util/props";

export default {
  name: "FormButton",
  components: {
    XIcon,
  },
  props: {
    text: p(PROP_TYPE_STRING, "Button"),
    variant: p(PROP_TYPE_STRING, "primary", false, (v) => {
      return ["primary", "secondary", "tertiary"].includes(v);
    }),
    disabled: p(PROP_TYPE_BOOLEAN_STRING, false),
    loading: p(PROP_TYPE_BOOLEAN_STRING, false),
    fixed: p(PROP_TYPE_BOOLEAN_STRING, false),
    leftIcon: p(PROP_TYPE_STRING, ""),
    rightIcon: p(PROP_TYPE_STRING, ""),
    colorIcon: p(PROP_TYPE_STRING, "var(--white)"),
    bgColor: p(PROP_TYPE_STRING, ""),
    bilingual: p(PROP_TYPE_BOOLEAN, false),
  },
  emits: ["click"],
  computed: {
    hasLeftSlot() {
      return this.$slots.hasOwnProperty("left-icon");
    },
    hasRightSlot() {
      return this.$slots.hasOwnProperty("right-icon");
    },
    renderIconColor() {
      if (this.disabled) {
        return "var(--gray-400)";
      }
      return this.colorIcon;
    },
    renderClass() {
      return [this.variant, { disabled: this.disabled }, { fixed: this.fixed }];
    },
    btnStyle() {
      return {
        background: this.bgColor.length ? `var(--${this.bgColor})` : "",
      };
    },
  },
  methods: {
    triggerEvent() {
      if (!this.loading) {
        this.$emit("click");
      }
    },
  },
};
</script>

<template>
  <button
    @click="triggerEvent"
    :disabled="disabled"
    class="x-button"
    :class="renderClass"
    :style="btnStyle"
  >
    <!-- LEFT SLOT-->
    <span v-if="hasLeftSlot && !loading" class="left-icon">
      <slot name="left-icon" />
    </span>

    <x-icon
      v-else-if="leftIcon && !loading && !rightIcon"
      :name="leftIcon"
      :color="renderIconColor"
      class="left-icon"
    />

    <!-- TEXT -->
    <span v-if="text" class="text">
      {{ bilingual ? $t(text) : text }}
    </span>

    <!-- RIGHT SLOT -->
    <span v-if="loading" class="loading-item">
      <span class="loader"></span>
    </span>
    <span v-else-if="hasRightSlot" class="right-icon">
      <slot name="right-icon" />
    </span>
    <x-icon
      v-else-if="rightIcon && !leftIcon"
      :name="rightIcon"
      class="right-icon"
      :color="renderIconColor"
    />
  </button>
</template>

<style lang="scss" src="./form-button.scss" scoped />
