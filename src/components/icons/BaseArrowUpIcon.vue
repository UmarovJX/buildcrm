<script>
export default {
  name: 'BaseArrowUpIcon',
  props: {
    fill: {
      type: String,
      default: '#9CA3AF',
    },
    width: {
      type: Number,
      default: 24,
    },
    height: {
      type: Number,
      default: 24,
    },
  },
}
</script>
<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.6116 10.5847L12.946 4.3514C12.4445 3.88287 11.5571 3.88287 11.0538 4.3514L4.38815 10.5847C3.86884 11.0714 3.87062 11.8578 4.39349 12.3413C4.91635 12.8247 5.75933 12.8247 6.28041 12.3379L10.6678 8.23706L10.6678 18.7583C10.6678 19.4454 11.2654 20 12.0017 20C12.7379 20 13.3355 19.4454 13.3355 18.7583L13.3355 8.23706L17.7211 12.3379C17.9826 12.5813 18.324 12.7022 18.6673 12.7022C19.007 12.7022 19.3484 12.5813 19.6081 12.3413C20.1292 11.8578 20.1309 11.0714 19.6116 10.5847Z"
      :fill="fill"
    />
  </svg>
</template>
