<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M5.50125 11C4.67293 11 4 11.6729 4 12.4987C4 13.3258 4.67293 14 5.50125 14C6.32957 14 7.00251 13.3258 7.00251 12.4987C7.00251 11.6729 6.32957 11 5.50125 11Z"
        :fill="fill"/>
    <path
        d="M11.5013 11C10.6729 11 10 11.6729 10 12.4987C10 13.3258 10.6729 14 11.5013 14C12.3296 14 13.0025 13.3258 13.0025 12.4987C13.0025 11.6729 12.3296 11 11.5013 11Z"
        :fill="fill"/>
    <path
        d="M16 12.4987C16 11.6729 16.6729 11 17.5013 11C18.3296 11 19.0025 11.6729 19.0025 12.4987C19.0025 13.3258 18.3296 14 17.5013 14C16.6729 14 16 13.3258 16 12.4987Z"
        :fill="fill"/>
  </svg>
</template>
<script>
export default {
  name: "BaseDotsIcon",
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
