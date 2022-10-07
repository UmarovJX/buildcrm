<template>
  <svg
      :fill="fill"
      :width="width"
      :height="height"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
  >
    <path
        d="M9.9587 19C9.47888 19 8.99906 18.8168 8.63277 18.4483L3.54968 13.3345C2.8171 12.5975 2.8171 11.4036 3.54968 10.6687C4.28226 9.93173 5.46682 9.92958 6.1994 10.6666L9.9587 14.4486L18.8011 5.55276C19.5337 4.81575 20.7182 4.81575 21.4508 5.55276C22.1834 6.28977 22.1834 7.48365 21.4508 8.22066L11.2846 18.4483C10.9183 18.8168 10.4385 19 9.9587 19Z"
        :fill="fill"
    />
  </svg>
</template>
<script>
export default {
  name: "BaseCheckIcon",
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

