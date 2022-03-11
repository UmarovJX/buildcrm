<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.4"
          d="M22 11.9998C22 17.5238 17.523 21.9998 12 21.9998C6.477 21.9998 2 17.5238 2 11.9998C2 6.47782 6.477 1.99982 12 1.99982C17.523 1.99982 22 6.47782 22 11.9998Z"
          :fill="fill"/>
    <path fill-rule="evenodd" clip-rule="evenodd"
          d="M12.9886 12.6675C12.9886 13.1834 12.542 13.604 11.9943 13.604C11.4466 13.604 11 13.1834 11 12.6675V7.93655C11 7.42065 11.4466 7 11.9943 7C12.542 7 12.9886 7.42065 12.9886 7.93655V12.6675ZM11.0056 16.0635C11.0056 15.5476 11.4499 15.1269 11.9943 15.1269C12.5545 15.1269 12.9999 15.5476 12.9999 16.0635C12.9999 16.5794 12.5545 17 12.0056 17C11.4545 17 11.0056 16.5794 11.0056 16.0635Z"
          :fill="fill"/>
  </svg>

</template>
<script>
export default {
  name: "BaseWarningIcon",
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
