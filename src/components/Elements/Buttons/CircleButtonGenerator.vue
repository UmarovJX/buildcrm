<script>
export default {
  name: 'CircleButtonGenerator',
  props: {
    background: {
      type: String,
      default: 'gray-100',
    },
    bgByVariable: {
      type: Boolean,
      default: true,
    },
    circleLength: {
      type: Number,
      default: 3.5,
    },
    lengthBy: {
      type: String,
      default: 'rem',
    },
  },
  emits: ['click'],
  computed: {
    circleStyle() {
      let generateStyle = ''
      if (this.bgByVariable) {
        generateStyle += `background-color:var(--${this.background});`
      } else {
        generateStyle += `background-color:${this.background};`
      }
      generateStyle += `
        width:${this.circleLength}${this.lengthBy};
        height:${this.circleLength}${this.lengthBy};`
      return generateStyle
    },
  },
  methods: {
    triggerClick() {
      this.$emit('click')
    },
  },
}
</script>

<template>
  <button
    class="circle-button d-flex justify-content-center align-items-center"
    :style="circleStyle"
    @click="triggerClick"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.circle-button {
  cursor: pointer;
  background-color: var(--gray-100);
  border-radius: 50%;
  border: none;
}
</style>
