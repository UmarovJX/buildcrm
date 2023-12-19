<script>
export default {
  name: 'PeculiarityBox',
  props: {
    background: {
      required: false,
      type: String,
      default: '#C4B5FD',
    },
    name: {
      required: true,
      type: String,
    },
  },
}
</script>

<template>
  <div class="d-flex flex-column box-container align-items-center">
    <div
      class="box"
      :style="{ background: background }"
    />
    <p class="name-box">
      {{ name }}
    </p>
  </div>
</template>

<style scoped>
.box-container {
  margin-right: 43.5px;
}
.box {
  margin-bottom: 12px;
  width: 64px;
  height: 64px;
}
.name-box {
  font-family: "Inter", serif;
  font-weight: 600;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 20px;
  color: #4b5563;
}
</style>
