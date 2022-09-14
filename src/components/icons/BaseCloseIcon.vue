<template>
  <svg class="close-icon" :width="width" :height="height" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="28" r="28" :fill="fill"/>
    <path d="M36 20L20 36" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 20L36 36" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>
<script>
export default {
  name: "BaseCloseIcon",
  props: {
    fill: {
      type: String,
      default: "#F3F4F6"
    },
    width: {
      type: Number,
      default: 56
    },
    height: {
      type: Number,
      default: 56
    }
  }
}
</script>
