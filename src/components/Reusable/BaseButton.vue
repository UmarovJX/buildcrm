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
            default: () => false
        },
    },
    emits: ['click'],
    computed: {
        hasLeftSlot() {
            return this.$slots['left-icon']
        },
        hasRightSlot() {
            return this.$slots['right-icon']
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


</style>