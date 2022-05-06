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
    size: {
      type: String,
      default: () => 'lg'
    }
  },
  emits: ['click'],
  computed: {},
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
  padding: 1rem 1.25rem
  max-height: 56px
  border-radius: 2rem
  color: var(--gray-600)
  font-size: 1rem
  border: none
  outline: none
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  background-color: var(--gray-100)

  .text
    color: inherit
    font-family: Inter, serif

  .left__icon
  //margin-right: .5rem

  .right__icon
//margin-left: .5rem

.gray-button
  background-color: var(--gray-200)

.violet
  background-color: var(--violet-700)
  color: var(--white)

.violet-gradient
  background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)
  color: var(--white)

</style>