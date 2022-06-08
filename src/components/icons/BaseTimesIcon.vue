<template>
  <svg :width="length" :height="length" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12" :stroke="fill" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 4L12 12" :stroke="fill" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script>
export default {
  name: "BaseTimesIcon",
  props: {
    length: {
      type: Number,
      default: 16
    },
    fill: {
      type: String,
      default: '#9CA3AF'
    }
  }
}
</script>
