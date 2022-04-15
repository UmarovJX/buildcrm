<template>
  <div class="base__multiselect">
    <multiselect
        v-model="value"
        :options="options"
        :track-by="trackBy"
        :label="label"
        :multiple="multiple"
        :taggable="taggable"
        :searchable="searchable"
        :placeholder="placeholder"
        class="inline__multiselect"
    />
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";

export default {
  name: "BaseMultiselect",
  components: {
    Multiselect
  },
  props: {
    options: {
      type: Array,
      required: true
    },
    trackBy: {
      type: String,
      default: 'id'
    },
    label: {
      type: String,
      default: 'name'
    },
    multiple: {
      type: Boolean,
      default: true
    },
    taggable: {
      type: Boolean,
      default: true
    },
    searchable: {
      type: Boolean,
      default: true
    },
    defaultValues: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: 'Select option'
    }
  },
  emits: ['input'],
  data() {
    return {
      value: []
    }
  },
  created() {
    this.initializeValue()
  },
  watch: {
    value() {
      this.inputEventTrigger()
    },
    defaultValues(lastValue) {
      if (!Array.isArray(lastValue)) {
        this.value = []
      }
    }
  },
  methods: {
    initializeValue() {
      const {trackBy} = this
      const isInitialized = Array.isArray(this.defaultValues)
      if (isInitialized) {
        this.value = this.defaultValues.map((defaultValue) => {
          return this.options.find(option => option[trackBy] === defaultValue)
        })
      }
    },
    inputEventTrigger() {
      this.$emit('input', this.value)
    }
  }
}
</script>

<style>
::v-deep .base__multiselect .inline__multiselect .multiselect__tags {
  border: none !important;
  background: red !important;
}
</style>