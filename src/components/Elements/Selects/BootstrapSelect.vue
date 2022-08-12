<template>
  <b-form-select
      class="bootstrap-select"
      :options="options"
      v-model="localValue"
  >
  </b-form-select>
</template>

<script>
export default {
  name: "BootstrapSelect",
  props: {
    options: {
      type: Array,
      required: true
    },
    defaultValue: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['select'],
  data() {
    return {
      localValue: null
    }
  },
  watch: {
    localValue: {
      handler(newLocalValue) {
        this.$emit('select', newLocalValue)
      },
      deep: true
    }
  },
  mounted() {
    if (this.defaultValue) {
      this.localValue = this.defaultValue
    }
  },
  methods: {
    setValue(newValue) {
      this.localValue = newValue
    }
  }
}
</script>

<style lang="scss" scoped>
.bootstrap-select {
  border: none;
  border-radius: 2rem;
  color: var(--gray-600);
  height: 56px;
  padding: 1rem 2.75rem 1rem 1.25rem;
  background: var(--gray-100) url('../../../assets/icons/icon-down.svg') right 1rem center/24px 24px no-repeat;

  &:focus {
    background-color: var(--gray-100);
    color: var(--gray-600);
  }
}
</style>