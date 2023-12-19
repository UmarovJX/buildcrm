<script>
export default {
  name: 'BaseTooltip',
  props: {
    text: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
    placement: {
      type: String,
      required: false,
      default: () => 'top',
    },
    show: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    triggers: {
      type: String,
      required: false,
      default: () => 'hover',
    },
    variant: {
      type: String,
      required: false,
    },
    custom_class: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
}
</script>

<template>
  <b-tooltip
    :target="target"
    :title="text"
    :variant="variant"
    :triggers="triggers"
    :custom-class="custom_class"
    :disabled="disabled"
    :show="show"
    :placement="placement"
  >
    {{ text }}
  </b-tooltip>
</template>

<style scoped>
::v-deep .tooltip-inner {
  background: #e5e7eb;
  color: #4b5563;
  border-radius: 16px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  font-family: "Inter", serif;
}
::v-deep .arrow::before {
  border-bottom-color: #e5e7eb;
  border-top-color: #e5e7eb;
}
</style>
