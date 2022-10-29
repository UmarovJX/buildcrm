<template>
  <button
      @click="triggerEvent"
      :type="type"
      :disabled="disabled"
      class="base__button"
      :class="[design,
        {'disabled':disabled},
        {'loading':loading},
        {'fixed':fixed}]"
  >
    <span v-if="loading" class="loading-item">
        <div class="loading__content">
            <span class="loading__content-main">
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM8.96 32C8.96 44.7246 19.2754 55.04 32 55.04C44.7246 55.04 55.04 44.7246 55.04 32C55.04 19.2754 44.7246 8.96 32 8.96C19.2754 8.96 8.96 19.2754 8.96 32Z"
                    :fill="loadingColor.fill"/>
                <path
                    d="M32 4.48C32 2.00577 34.0154 -0.0321753 36.4654 0.313092C39.1321 0.688898 41.7468 1.40069 44.2459 2.43586C48.1283 4.04401 51.6559 6.40111 54.6274 9.37259C57.5989 12.3441 59.956 15.8717 61.5641 19.7541C62.5993 22.2532 63.3111 24.8679 63.6869 27.5346C64.0322 29.9846 61.9942 32 59.52 32V32C57.0458 32 55.0839 29.9758 54.6058 27.5482C54.3121 26.0566 53.8707 24.5942 53.2862 23.183C52.1283 20.3876 50.4312 17.8477 48.2917 15.7083C46.1523 13.5688 43.6124 11.8717 40.817 10.7138C39.4058 10.1293 37.9434 9.68792 36.4519 9.39419C34.0242 8.91611 32 6.95423 32 4.48V4.48Z"
                    :fill="loadingColor.stroke"/>
              </svg>
            </span>
        </div>
    </span>
    <span v-if="hasLeftSlot" class="left__icon">
      <slot name="left-icon"/>
    </span>
    <slot name="default"></slot>
    <span v-if="hasNotDefaultSlot && text" class="text">
      <span v-if="bilingual">{{ $t(text) }}</span>
      <span v-else>{{ text }}</span>
    </span>
    <span v-if="hasRightSlot" class="right__icon">
      <slot name="right-icon"/>
    </span>
  </button>
</template>

<script>

export default {
  name: "BaseButton",
  components: {},
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
      default: () => false
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    fixed: {
      type: Boolean,
      default: () => false
    },
    bilingual: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['click'],
  data() {
    return {
      loadingColor: {
        fill: '',
        stroke: ''
      }
    }
  },
  computed: {
    hasLeftSlot() {
      return this.$slots.hasOwnProperty('left-icon')
    },
    hasRightSlot() {
      return this.$slots.hasOwnProperty('right-icon')
    },
    hasNotDefaultSlot() {
      return !this.$slots.hasOwnProperty('default')
    }
  },
  mounted() {
    this.loadingColorRender()
  },
  methods: {
    loadingColorRender() {
      switch (this.design) {
        case 'violet-gradient':
          this.loadingColor = {
            fill: 'var(--violet-700)',
            stroke: 'var(--white)'
          }
          break;
        default:
          this.loadingColor = {
            fill: 'var(--gray-200)',
            stroke: 'var(--violet-600)'
          }
      }
    },
    triggerEvent() {
      if (!this.loading) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.base__button
  font-family: Inter, serif
  padding: 1rem 1.25rem
  max-height: 56px
  min-width: fit-content
  border-radius: 2rem
  color: var(--gray-600)
  font-size: 1rem
  line-height: 22px
  font-weight: 600
  border: none
  outline: none
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer
  background: var(--gray-100)
  transition: all .3s linear

  &.fixed
    width: 100%

  .text
    color: inherit
    font-family: Inter, serif

  .left__icon
    display: flex
    margin-right: 1rem

  .right__icon
    display: flex
    margin-left: 1rem

  &:hover
    background: var(--gray-200)
    color: var(--gray-600)

  &:disabled
    background: var(--gray-100)
    color: var(--gray-400)


//.disabled
//    background: var(--gray-500)
//    color: var(--white) !important

.transparent
  background: transparent
  color: var(--gray-600)

  &:hover
    background: var(--gray-200)

  &.disabled
    background: transparent !important
    color: var(--gray-400)


.violet
  background: var(--violet-700)
  color: var(--white) !important

  &:hover
    background: var(--violet-700)

  &.disabled
    background: var(--gray-100)
    color: var(--gray-400) !important

.red
  background: var(--red-600)
  color: var(--white) !important

.green
  background: var(--teal-600)
  color: var(--white) !important


.violet-gradient
  background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)
  color: var(--white) !important

  &:hover
    background: linear-gradient(88.25deg, var(--violet-700) 0%, var(--violet-700) 100%)

  &.disabled
    background: var(--gray-100)
    color: var(--gray-400) !important


.loading
  .text, .left__icon, .right__icon
    opacity: 0

  &-item
    position: absolute
    display: flex
    align-items: center
    z-index: 2
    justify-content: center

  &:hover
    background: var(--gray-100)

  &.transparent-button:hover
    background: transparent

  &.violet:hover
    background: var(--violet-700)

  &.violet-gradient:hover
    background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)


.loading__content
  display: flex
  justify-content: center
  align-items: center
  min-height: 40rem

  &-main
    animation: 1.5s spin infinite linear


@keyframes spin
  to
    transform: rotate(360deg)


</style>