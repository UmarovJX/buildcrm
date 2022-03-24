<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd"
          d="M11.6333 2C6.31297 2 2 6.22292 2 11.4321C2 16.6414 6.31297 20.8643 11.6333 20.8643C13.7288 20.8643 15.6681 20.2092 17.2491 19.0967L19.8538 21.6404C20.3457 22.1208 21.1421 22.1197 21.6327 21.6381C22.1233 21.1565 22.1223 20.3767 21.6304 19.8963L19.0848 17.4104C20.4483 15.7831 21.2666 13.7012 21.2666 11.4321C21.2666 6.22292 16.9536 2 11.6333 2ZM4.51581 11.4321C4.51581 7.58335 7.70241 4.46328 11.6333 4.46328C15.5641 4.46328 18.7507 7.58335 18.7507 11.4321C18.7507 15.2809 15.5641 18.401 11.6333 18.401C7.70241 18.401 4.51581 15.2809 4.51581 11.4321Z"
          :fill="fill"/>
  </svg>
</template>
<script>
export default {
  name: "BaseSearchIcon",
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
