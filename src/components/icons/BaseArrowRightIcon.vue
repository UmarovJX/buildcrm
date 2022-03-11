<template>
  <svg :width="width" :height="height" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M1.20252 0C1.50902 0 1.81712 0.12105 2.0514 0.363152L7.64697 6.1172C7.87323 6.35101 8 6.66773 8 6.99938C8 7.32936 7.87323 7.64609 7.64697 7.8799L2.0514 13.6373C1.58123 14.1215 0.820602 14.1215 0.350427 13.6339C-0.118143 13.1464 -0.116539 12.3588 0.353637 11.8746L5.0923 6.99938L0.353637 2.12419C-0.116539 1.63999 -0.118143 0.853988 0.350427 0.366469C0.584712 0.121052 0.894418 0 1.20252 0Z"
        :fill="fill"
    />
  </svg>
</template>
<script>
export default {
  name: "BaseArrowRightIcon",
  props: {
    fill: {
      type: String,
      default: "#9CA3AF"
    },
    width: {
      type: Number,
      default: 14
    },
    height: {
      type: Number,
      default: 8
    }
  },
  computed: {
    viewBox() {
      return `0 0 ${ this.height } ${ this.width }`
    }
  }
}
</script>