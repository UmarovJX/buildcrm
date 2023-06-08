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
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 5.25C2 4.55964 2.44772 4 3 4H21C21.5523 4 22 4.55964 22 5.25C22 5.94036 21.5523 6.5 21 6.5H3C2.44772 6.5 2 5.94036 2 5.25Z"
      :fill="fill"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 9.75C2 9.05964 2.44772 8.5 3 8.5H21C21.5523 8.5 22 9.05964 22 9.75C22 10.4404 21.5523 11 21 11H3C2.44772 11 2 10.4404 2 9.75Z"
      :fill="fill"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 14.25C2 13.5596 2.44772 13 3 13H21C21.5523 13 22 13.5596 22 14.25C22 14.9404 21.5523 15.5 21 15.5H3C2.44772 15.5 2 14.9404 2 14.25Z"
      :fill="fill"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M2 18.75C2 18.0596 2.44772 17.5 3 17.5H21C21.5523 17.5 22 18.0596 22 18.75C22 19.4404 21.5523 20 21 20H3C2.44772 20 2 19.4404 2 18.75Z"
      :fill="fill"
    />
  </svg>
</template>
