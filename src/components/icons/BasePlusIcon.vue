<script>
export default {
  name: "BasePlusIcon",
  props: {
    fill: {
      type: String,
      default: "#9CA3AF",
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
};
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
      d="M18.6409 13.4167H13.499V18.514C13.499 19.3347 12.8279 20 12 20C11.1721 20 10.501 19.3347 10.501 18.514V13.4167H5.35909C4.58685 13.3374 4 12.6923 4 11.9226C4 11.153 4.58685 10.5079 5.35909 10.4286H10.4848V5.34731C10.5648 4.58176 11.2156 4 11.9919 4C12.7683 4 13.4191 4.58176 13.499 5.34731V10.4286H18.6409C19.4132 10.5079 20 11.153 20 11.9226C20 12.6923 19.4132 13.3374 18.6409 13.4167Z"
      :fill="fill"
    />
  </svg>
</template>
