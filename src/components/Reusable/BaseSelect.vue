<template>
  <div class="filter__inputs-input" :class="error ? 'error' : ''">
    <span v-if="select && label" class="input-label">{{ placeholder }}</span>
    <b-form-select
        v-model="select"
        class="inline"
        :options="options"
        name="select"
        :placeholder="placeholder"
    >
      <template #first v-if="placeholder">
        <b-form-select-option
            :value="null"
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
    value: {
      type: [String, Number, Object],
    },
    placeholder: {
      type: String,
      default: null
    },
    label: {
      type: Boolean,
      default: () => false
    },
    error: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['change', 'select', 'input'],

  data() {
    return {
      select: null,
      initialValue: null
    }
  },

  mounted() {
    this.initDefaultValue()
  },

  watch: {
    select() {
      this.triggerEvent()
    }
  },

  methods: {
    initDefaultValue() {
      // const typeOfValue = typeof this.value
      // if (typeOfValue === 'string' && typeOfValue === 'number') {
      //   this.select = this.value
      // } else if (typeOfValue === 'object' && Object.keys(this.value).length) {
      //   this.select = this.options[0]
      //   this.initialValue = this.options[0]
      // }
      //
      // this.triggerEvent()
    },
    triggerEvent() {
      this.$emit('input', this.select)
      this.$emit('select', this.select)
      this.$emit('change', this.select)
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
  background: #fff url('../../assets/icons/icon-down.svg') right 0 bottom 6.5px no-repeat
  //background-position: top -10px right 0.75rem
  transition: background .3s ease-in-out

//&:focus
//  background: #fff url('../../assets/icons/icon-up.svg') right 0 bottom 6.5px no-repeat


.filter__inputs
  //margin-top: 2rem


  &-input
    display: flex
    flex-direction: column
    align-items: flex-start
    justify-content: space-between
    height: 3.5rem
    //min-width: 100px;
    background-color: var(--gray-100)
    border-radius: 2rem
    padding: 6px 1.25rem
    width: 100%
    //border: none
    border: .25rem solid transparent
    color: var(--gray-600)
    position: relative

    ::placeholder
      color: var(--gray-400)
      opacity: 1

    .placeholder
      color: var(--gray-400)

    .input__date
      margin-left: 0.5rem
      background-color: transparent
      border: none


    .inline
      background-color: transparent
      border: none
      color: var(--gray-600)
      //color: red;
      padding: 0

      .disabled__option
        //color: red !important
        color: var(--gray-400) !important


.error
  border: .25rem solid var(--red-500) !important

</style>