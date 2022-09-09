<template>
  <button
      @click="triggerEvent"
      :type="type"
      :disabled="disabled"
      class="base__button"
      :class="[design, {'disabled':disabled}]"
  >
      <span v-if="hasLeftSlot" class="left__icon">
        <slot name="left-icon"/>
      </span>
    <span v-if="text" class="text">{{ text }}</span>
    <span v-if="hasRightSlot" class="right__icon">
        <slot name="right-icon"/>
      </span>
    <span v-if="appLoading" class="loading" :style="spinnerStyle">
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
    },
    type: {
      type: String,
      default: () => 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    appLoading: {
      type: Boolean,
      default: false
    },
    spinSize: {
      type: String,
      default: '1rem'
    },
    spinDuration: {
      type: String,
      default: 'infinite'
    },
    spinDelay: {
      type: String,
      default: '0.75s'
    },
    spinBorder: {
      type: String,
      default: '0.15rem'
    },
    spinBorderRight: {
      type: String,
      default: '0.25rem'
    },
    spinColor: {
      type: String,
      default: '#fff'
    },
    spinMarginLeft: {
      type: String,
      default: '0.5rem'
    },
  },
  emits: ['click'],
  computed: {
    hasLeftSlot() {
      return this.$slots['left-icon']
    },
    hasRightSlot() {
      return this.$slots['right-icon'] && !this.appLoading
    },
    spinnerStyle() {
      return {
        width: this.spinSize,
        height: this.spinSize,
        marginLeft: this.spinMarginLeft,
        border: `${this.spinBorder} solid ${this.spinColor}`,
        borderRight: `${this.spinBorderRight} solid transparent`,
        animation: `spinner-border ${this.spinDelay} linear ${this.spinDuration}`
      }
    }
  },
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
  position: relative
  background-color: var(--gray-100)

  .text
    color: inherit
    font-family: Inter, serif

  .left__icon
    display: flex
    margin-right: 1rem

  .right__icon
    display: flex
    margin-left: 1rem

.disabled
  background: var(--gray-500)
  color: var(--white) !important

.gray-button
  background-color: var(--gray-200)

.violet
  background-color: var(--violet-700)
  color: var(--white) !important

.red
  background-color: var(--red-600)
  color: var(--white) !important

.green
  background-color: var(--teal-600)
  color: var(--white) !important

.violet-gradient
  background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)
  color: var(--white) !important

  &.disabled
    background: var(--gray-100)
    color: var(--gray-400) !important

.loading
  display: inline-block
  width: 1rem
  height: 1rem
  border: 0.1em solid
  border-right: 0.25em solid transparent
  border-radius: 50%
  animation: spinner-border .75s linear infinite

@keyframes spinner-border
  to
    transform: rotate(1turn)


</style>