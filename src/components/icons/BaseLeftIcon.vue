<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M14.7975 19C14.491 19 14.1829 18.879 13.9486 18.6368L8.35303 12.8828C8.12677 12.649 8 12.3323 8 12.0006C8 11.6706 8.12677 11.3539 8.35303 11.1201L13.9486 5.36274C14.4188 4.87854 15.1794 4.87854 15.6496 5.36605C16.1181 5.85357 16.1165 6.64123 15.6464 7.12543L10.9077 12.0006L15.6464 16.8758C16.1165 17.36 16.1181 18.146 15.6496 18.6335C15.4153 18.8789 15.1056 19 14.7975 19Z"
        :fill="fill"/>
  </svg>

</template>
<script>
export default {
  name: "BaseLeftIcon",
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
