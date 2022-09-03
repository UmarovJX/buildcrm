<template>
  <div
      class="filter__inputs-input select-container"
      :class="[{'error':error,'justify-content-center align-items-center':!label}]"
  >
    <div v-if="inlineValue && label" class="input-label">
      <span>
        {{ placeholder }}
      </span>
    </div>
    <select
        :name="name"
        :disabled="disabled"
        v-model="inlineValue"
        :class="{'base-select-initial':!value, 'not-label':!label}"
        class="base-select"
        @click="openSelect"
    >
      <option
          disabled
          :value="null"
          v-if="!noPlaceholder && placeholder"
      >
        {{ placeholder }}
      </option>
      <option
          v-for="(selectOption,index) in options"
          :value="selectOption[valueField]"
          :key="index"
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
    },
    value: {
      type: [String, Object, Array, Number, Boolean],
      default: () => null
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['change'],
  data() {
    return {
      open: false,
      inlineValue: Object.assign({}, this.value)
    }
  },
  watch: {
    inlineValue: {
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
      this.$emit('change', this.inlineValue)
    },
    settingUp() {
      if (!this.placeholder || this.noPlaceholder) {
        this.inlineValue = this.options[0][this.valueField]
      }
    },
    openSelect() {
      this.open = true
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
  width: 100%
  height: 100%
  //padding: 0.25rem 1.25rem 1rem 1.25rem
  padding-right: 0.5rem
  overflow: hidden
  background-color: transparent
  -moz-appearance: none
  -webkit-appearance: none

  //&.not-label
  //padding: .5rem 1.25rem .5rem 1.25rem

  &::-ms-expand
    display: none

//&-initial
//padding: 0 1.25rem

.input-label
  font-family: CraftworkSans, serif
  position: relative
  //margin-bottom: 2px;
  letter-spacing: 1px
  text-transform: uppercase
  color: var(--gray-400)
  width: 100%
  display: flex
  padding-left: 1rem
  margin-bottom: 6px

  span
    font-weight: 900
    font-size: 8px
    line-height: 10px
    position: absolute
    top: 6px
    left: 0

//
//.input-label
//  font-weight: 900
//  font-size: 8px
//  line-height: 10px
//  letter-spacing: 1px
//  padding: 0.5rem 1.25rem 0 1.5rem
//  //padding-top: 0.5rem
//  //padding-bottom: 0.5rem
//  text-transform: uppercase
//  color: var(--gray-400)


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
    //width: 100%
    border: .25rem solid transparent
    color: var(--gray-600)
    position: relative
    padding-left: 1.5rem
    padding-right: 1.5rem

    &:hover
      background-color: var(--gray-200)

    &:focus-within
      border: 0.25rem solid var(--gray-200)
      background-color: var(--gray-100)

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