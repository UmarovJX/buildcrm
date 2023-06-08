<script>
export default {
  name: "BaseChessList",
  props: {
    fill: {
      type: String,
      default: "#9CA3AF",
    },
    width: {
      type: Number,
      default: 21,
    },
    height: {
      type: Number,
      default: 20,
    },
  },
};
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.5 3.25C0.5 2.55964 0.947715 2 1.5 2H19.5C20.0523 2 20.5 2.55964 20.5 3.25C20.5 3.94036 20.0523 4.5 19.5 4.5H1.5C0.947715 4.5 0.5 3.94036 0.5 3.25Z"
      :fill="fill"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.5 7.75C0.5 7.05964 0.947715 6.5 1.5 6.5H19.5C20.0523 6.5 20.5 7.05964 20.5 7.75C20.5 8.44036 20.0523 9 19.5 9H1.5C0.947715 9 0.5 8.44036 0.5 7.75Z"
      :fill="fill"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.5 12.25C0.5 11.5596 0.947715 11 1.5 11H19.5C20.0523 11 20.5 11.5596 20.5 12.25C20.5 12.9404 20.0523 13.5 19.5 13.5H1.5C0.947715 13.5 0.5 12.9404 0.5 12.25Z"
      :fill="fill"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.5 16.75C0.5 16.0596 0.947715 15.5 1.5 15.5H19.5C20.0523 15.5 20.5 16.0596 20.5 16.75C20.5 17.4404 20.0523 18 19.5 18H1.5C0.947715 18 0.5 17.4404 0.5 16.75Z"
      :fill="fill"
    />
  </svg>
</template>

<style scoped></style>
