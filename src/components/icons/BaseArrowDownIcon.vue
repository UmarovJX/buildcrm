<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M4.38837 13.4153L11.054 19.6486C11.5555 20.1171 12.4429 20.1171 12.9462 19.6486L19.6119 13.4153C20.1312 12.9286 20.1294 12.1422 19.6065 11.6587C19.0837 11.1753 18.2407 11.1753 17.7196 11.6621L13.3322 15.7629V5.24169C13.3322 4.55462 12.7346 4 11.9983 4C11.2621 4 10.6645 4.55462 10.6645 5.24169V15.7629L6.27886 11.6621C6.01743 11.4187 5.67596 11.2978 5.33272 11.2978C4.99304 11.2978 4.65158 11.4187 4.39193 11.6587C3.87084 12.1422 3.86906 12.9286 4.38837 13.4153Z"
        :fill="fill"/>
  </svg>

</template>
<script>
export default {
  name: "BaseArrowDownIcon",
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

