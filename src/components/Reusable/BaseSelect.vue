<template>
  <div class="filter__inputs-input">
    <b-form-select v-model="value" class="inline" :options="options">
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
.filter__inputs
  //margin-top: 2rem

  &-input
    display: flex
    align-items: center
    justify-content: space-between
    //min-width: 20rem
    min-height: 4rem
    background-color: var(--gray-100)
    border-radius: 2rem
    padding: 1rem 1.25rem
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
      padding-left: 1rem

    .input__date
      margin-left: 0.5rem
      background-color: transparent
      border: none


    .inline
      background-color: transparent
      border: none
      color: var(--gray-600)
      padding: 0 0 0 1rem

      .disabled__option
        color: var(--gray-100) !important
</style>