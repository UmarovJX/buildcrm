<template>
  <div class="filter__inputs-input">
    <span v-if="value && label" class="input-label">{{ placeholder }}</span>
    <b-form-select v-model="value" class="inline" :options="options" name="select">
      <template #first v-if="placeholder">
        <b-form-select-option
            :value="null"
            disabled
        >
          <span class="disabled__option">
            {{ placeholder }}
          </span>
        </b-form-select-option>
      </template>
    </b-form-select>
  </div>
</template>

<script>
export default {
  name: "BaseSelect",
  props: {
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: null
    },
    label: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['change'],
  data() {
    return {
      value: null
    }
  },
  watch: {
    value() {
      this.triggerEvent()
    }
  },
  methods: {
    triggerEvent() {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="sass" scoped>
.input-label
  font-weight: 900
  font-size: 8px
  line-height: 10px
  margin-bottom: 2px
  letter-spacing: 1px
  text-transform: uppercase
  color: var(--gray-400)

.custom-select
  background: #fff url('../../assets/icons/icon-down.svg') right 0.5rem bottom 3px no-repeat
  //background-position: top -10px right 0.75rem
  transition: background .3s ease-in-out

  &:focus
    background: #fff url('../../assets/icons/icon-up.svg') right 0.5rem bottom 3px no-repeat

.filter__inputs
  //margin-top: 2rem

  &-input
    display: flex
    flex-direction: column
    align-items: flex-start
    justify-content: space-between
    //min-width: 20rem
    height: 3.5rem
    background-color: var(--gray-100)
    border-radius: 2rem
    padding: 11px 1.25rem
    //margin-top: 1.5rem
    width: 100%
    border: none
    color: var(--gray-600)
    position: relative

    ::placeholder
      color: var(--gray-600)
      opacity: 1

    .placeholder
      color: var(--gray-600)
      //padding-left: 1rem

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
</style>