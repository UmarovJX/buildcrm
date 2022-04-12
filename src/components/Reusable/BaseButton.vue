<template>
  <button
      @click="triggerEvent"
      class="base__button"
      :class="design"
  >
    <span class="left__icon">
      <slot name="left-icon"/>
    </span>
    <span class="text">{{ text }}</span>
    <span class="right__icon">
      <slot name="right-icon"/>
    </span>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    text: {
      type: String,
      default: () => ('Button')
    },
    design: {
      type: String,
      default: () => ('')
    },
  },
  emits: ['click'],
  methods: {
    triggerEvent() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="sass" scoped>
.base__button
  font-family: Inter, serif
  padding: 1rem 1.5rem 1rem 1rem
  border-radius: 2rem
  color: var(--gray-600)
  font-size: 1rem
  border: none
  outline: none
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer

  .text
    color: inherit
    font-family: Inter, serif

  .left__icon
    margin-right: 1rem

  .right__icon
    margin-left: 1rem

</style>