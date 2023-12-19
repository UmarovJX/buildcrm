<script>
export default {
  name: 'BaseDoorIcon',
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
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M6.25785 2H17.7425C18.4362 2 19 2.51433 19 3.14676V20.8532C19 21.486 18.4362 22 17.7425 22H6.25785C5.58362 22 5.02819 21.5128 5.00138 20.8988L5.00103 20.8976V20.8923L5.00069 20.8891V20.8827H5.00034V20.8698L5 20.8683V3.13248L5.00034 3.13092V3.11806H5.00069V3.11147L5.00103 3.10833V3.10332L5.00138 3.10175C5.02872 2.48814 5.58327 2.00091 6.25785 2.00091V2ZM10.2535 10.5532H11.642V13.4472H10.2535V10.5532ZM8.1425 3.36732L13.0134 5.73098C13.265 5.85361 13.4088 6.08867 13.4088 6.3319C13.4123 10.1106 13.4118 13.8891 13.4118 17.6679C13.4118 17.9509 13.2227 18.1938 12.9534 18.2976L8.14192 20.6324H17.5006V3.36716L8.1425 3.36732Z"
      :fill="fill"
    />
  </svg>
</template>
