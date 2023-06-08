<script>
export default {
  name: "BaseCompactGridIcon",
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
    <rect x="2" y="2" width="5.5" height="5.5" rx="1.5" :fill="fill" />
    <rect x="2" y="9.25" width="5.5" height="5.5" rx="1.5" :fill="fill" />
    <rect x="2" y="16.5" width="5.5" height="5.5" rx="1.5" :fill="fill" />
    <rect x="9.25" y="2" width="5.5" height="5.5" rx="1.5" :fill="fill" />
    <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1.5" :fill="fill" />
    <rect
      opacity="0.4"
      x="9.25"
      y="16.5"
      width="5.5"
      height="5.5"
      rx="1.5"
      :fill="fill"
    />
    <rect
      opacity="0.4"
      x="16.5"
      y="2"
      width="5.5"
      height="5.5"
      rx="1.5"
      :fill="fill"
    />
    <rect
      opacity="0.4"
      x="16.5"
      y="9.25"
      width="5.5"
      height="5.5"
      rx="1.5"
      :fill="fill"
    />
    <rect x="16.5" y="16.5" width="5.5" height="5.5" rx="1.5" :fill="fill" />
  </svg>
</template>
