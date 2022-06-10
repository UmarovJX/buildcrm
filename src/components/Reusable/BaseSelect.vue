<template>
  <div class="filter__inputs-input select-container" :class="error ? 'error' : ''">
    <span v-if="value && label" class="input-label">{{ placeholder }}</span>
    <select
        :name="name"
        v-model="value"
        :class="{'base-select-initial':!value, 'not-label':!label}"
        class="base-select"
    >
      <option :value="null" v-if="!noPlaceholder && placeholder">{{ placeholder }}</option>
      <option
          v-for="selectOption in options"
          :value="selectOption[valueField]"
          :key="selectOption[valueField]"
      >
        {{ selectOption[textField] }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    name: {
      type: String,
      default: 'BaseSelect'
    },
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: null
    },
    noPlaceholder: {
      type: Boolean,
      default: () => false
    },
    label: {
      type: Boolean,
      default: () => false
    },
    error: {
      type: Boolean,
      default: () => false
    },
    valueField: {
      type: String,
      default: 'value'
    },
    textField: {
      type: String,
      default: 'text'
    }
  },
  emits: ['change'],
  data() {
    return {
      value: null
    }
  },
  watch: {
    value: {
      handler() {
        this.triggerEvent()
      }
    }
  },
  mounted() {
    this.settingUp()
  },
  methods: {
    triggerEvent() {
      this.$emit('change', this.value)
    },
    settingUp() {
      if (!this.placeholder || this.noPlaceholder) {
        this.value = this.options[0][this.valueField]
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.select-container
  &:after
    content: url('../../assets/icons/icon-down.svg')
    position: absolute
    right: 2%
    top: 60%
    transform: translateY(-50%)

.base-select
  border: none
  width: 95%
  height: 100%
  padding: 0.25rem 1.25rem 1rem 1.25rem
  overflow: hidden
  background-color: transparent
  -moz-appearance: none
  -webkit-appearance: none

  &.not-label
    padding: .5rem 1.25rem .5rem 1.25rem

  &::-ms-expand
    display: none

  &-initial
    padding: 0 1.25rem

.input-label
  font-weight: 900
  font-size: 8px
  line-height: 10px
  letter-spacing: 1px
  padding: 0.5rem 1.25rem 0 1.5rem
  text-transform: uppercase
  color: var(--gray-400)

.custom-select
  background: #fff url('../../assets/icons/icon-down.svg') right 0.5rem bottom 6.5px no-repeat
  transition: background .3s ease-in-out

  &:focus
    background: #fff url('../../assets/icons/icon-up.svg') right 0.5rem bottom 6.5px no-repeat


.filter__inputs
  &-input
    display: flex
    flex-direction: column
    align-items: flex-start
    justify-content: space-between
    height: 3.5rem
    background-color: var(--gray-100)
    border-radius: 2rem
    width: 100%
    border: .25rem solid transparent
    color: var(--gray-600)
    position: relative

    ::placeholder
      color: var(--gray-600)
      opacity: 1

    .placeholder
      color: var(--gray-600)

    .input__date
      margin-left: 0.5rem
      background-color: transparent
      border: none

    .inline
      background-color: transparent
      border: none
      color: var(--gray-600)
      padding: 0

      .disabled__option
        color: var(--gray-100) !important

.error
  border: .25rem solid var(--red-500) !important

</style>