<script>
export default {
  name: "BaseFacadeIcon",
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
      d="M4.63281 7.52532C4.63281 7.37058 4.72158 7.22607 4.86938 7.14024L13.3694 2.20351C13.7224 1.99846 14.1953 2.21895 14.1953 2.5886V21.625H4.63281V7.52532Z"
      :fill="fill"
    />
    <g opacity="0.4">
      <path
        d="M19.3672 11.457C19.3672 11.3454 19.3047 11.2412 19.2006 11.1793L13.2145 7.61912C12.9658 7.47125 12.6328 7.63025 12.6328 7.89682V21.625H19.3672V11.457Z"
        :fill="fill"
      />
    </g>
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.5625 20.875C1.5625 20.3227 1.77491 19.875 2.03693 19.875H21.9631C22.2251 19.875 22.4375 20.3227 22.4375 20.875C22.4375 21.4273 22.2251 21.875 21.9631 21.875H2.03693C1.77491 21.875 1.5625 21.4273 1.5625 20.875Z"
      :fill="fill"
    />
  </svg>
</template>
