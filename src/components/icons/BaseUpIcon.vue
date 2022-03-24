<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M7.12197 15.637C6.64121 16.1183 5.86205 16.1183 5.36471 15.653C5.11604 15.4124 5 15.1075 5 14.7866C5 14.4818 5.11604 14.177 5.36471 13.9524L11.1172 8.35297C11.3493 8.12835 11.6643 8 11.9959 8C12.3274 8 12.6424 8.12835 12.8745 8.35297L18.627 13.9524C19.1243 14.4176 19.1243 15.1717 18.627 15.653C18.1462 16.1183 17.3505 16.1183 16.8697 15.637L11.9959 10.904L7.12197 15.637Z"
        :fill="fill"/>
  </svg>
</template>
<script>
export default {
  name: "BaseUpIcon",
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
