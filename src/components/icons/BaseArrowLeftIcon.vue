<template>
  <svg :width="width" :height="height" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M12.3309 15.8332C12.0755 15.8332 11.8187 15.7323 11.6235 15.5305L6.96053 10.7355C6.77198 10.5407 6.66634 10.2767 6.66634 10.0004C6.66634 9.72537 6.77198 9.46143 6.96053 9.26659L11.6235 4.46879C12.0153 4.06528 12.6492 4.06528 13.041 4.47155C13.4315 4.87782 13.4301 5.5342 13.0383 5.9377L9.08943 10.0004L13.0383 14.063C13.4301 14.4665 13.4315 15.1215 13.041 15.5278C12.8457 15.7323 12.5877 15.8332 12.3309 15.8332Z"
        :fill="fill"/>
  </svg>
</template>
<script>
export default {
  name: "BaseArrowLeftIcon",
  props: {
    fill: {
      type: String,
      default: "#9CA3AF"
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    }
  }
}
</script>

