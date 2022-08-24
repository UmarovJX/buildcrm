<template>
  <div class="base-timer" :style="{background: background}">
    <span class="base-timer-time">{{minute}} : {{second}}</span>
  </div>
</template>

<script>
export default {
  name: "BaseTimer",
  components: {},
  props: {
    background: {
      type: String,
      required: false,
      default: "#7C3AED"
    },
    minute: {
      type: Number,
      required: true
    },
    second: {
      type: Number,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.base-timer {
  display: flex;
  justify-content: center;
  width: max-content;
  align-items: center;
  padding: 13px 17px;
  border-radius: 28px;
  margin-top: 2rem;
  font-family: "Inter", serif;
  &-time {
    color: white;
    font-weight: 600;
    font-size: 24px;
    line-height: 30px;
  }
}
</style>