<script>
export default {
  name: 'BaseChessTwo',
  props: {
    fill: {
      type: String,
      default: '#9CA3AF',
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
}
</script>

<template>
  <svg
    :width="width"
    :height="height"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2.16669"
      y="1.66675"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      x="2.16669"
      y="7.7085"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      x="2.16669"
      y="13.75"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      x="8.20837"
      y="1.66675"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      x="8.20837"
      y="7.7085"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      opacity="0.4"
      x="8.20837"
      y="13.75"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      opacity="0.4"
      x="14.25"
      y="1.66675"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      opacity="0.4"
      x="14.25"
      y="7.7085"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
    <rect
      x="14.25"
      y="13.75"
      width="4.58333"
      height="4.58333"
      rx="1.5"
      :fill="fill"
    />
  </svg>
</template>

<style scoped></style>
