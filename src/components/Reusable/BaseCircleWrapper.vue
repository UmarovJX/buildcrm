<script>
export default {
  name: "BaseCircleWrapper",
  emits: ["click"],
};
</script>

<template>
  <div class="base-circle-wrapper" @click="$emit('click', $event)">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.base-circle-wrapper {
  padding: 1rem;
  cursor: pointer;
  border-radius: 50%;
  background-color: var(--gray-100);
}
</style>
