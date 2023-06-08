<script>
export default {
  name: "BaseArrowDownIcon",
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
      d="M14.5122 7.84003H3.66166C2.74083 7.84003 2 8.58001 2 9.50007V20.34C2 21.2599 2.7407 22 3.66166 22H14.5122C15.433 22 16.1739 21.26 16.1739 20.34V9.50007C16.1739 8.57997 15.4332 7.84003 14.5122 7.84003Z"
      :fill="fill"
    />
    <path
      d="M19.0969 2.00021H8.24632C6.62468 2.00021 5.32346 3.30016 5.32346 4.92021V6.16024H16.174C17.0948 6.16024 17.8357 6.90022 17.8357 7.82028V18.6602H19.0769C20.6986 18.6602 21.9998 17.3602 21.9998 15.7402V4.92C22.0197 3.29995 20.7185 2 19.0969 2V2.00021Z"
      :fill="fill"
    />
  </svg>
</template>
