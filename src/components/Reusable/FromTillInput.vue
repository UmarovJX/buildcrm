<script>
import BaseInput from "@/components/Reusable/BaseInput";
export default {
  name: "FromTillInput",
  components: { BaseInput },
  props: {
    error: {
      type: Boolean,
      default: () => false,
    },
    from_label: {
      type: String,
      required: false,
      default: () => "От",
    },
    till_label: {
      type: String,
      required: false,
      default: () => "До",
    },
  },
};
</script>

<template>
  <div class="from-till-input" :class="error ? 'error' : ''">
    <BaseInput :placeholder="from_label" :label="true" type="number" />
    <BaseInput :placeholder="till_label" :label="true" type="number" />
  </div>
</template>

<style lang="scss" scoped>
.from-till-input {
  display: flex;
  width: 320px;
  input {
    border: none;
    background: #f3f4f6;
    padding: 17px 20px;
    font-family: "Inter", serif;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    color: #9ca3af;
  }
  .base-input:first-child {
    display: flex;
    border-radius: 0;
    border-bottom-left-radius: 32px;
    border-top-left-radius: 32px;
    width: 50%;
    border-right: 3px solid #d1d5db;
    &:focus {
      border: 4px solid #e5e7eb;
      border-right-width: 3px;
    }
  }
  .base-input:nth-child(2) {
    border-radius: 0;
    width: 50%;
    border-bottom-right-radius: 32px;
    border-top-right-radius: 32px;
    &:focus {
      border: 4px solid #e5e7eb;
      border-left-style: none;
    }
  }
}
.error {
  border: 0.25rem solid var(--red-500) !important;
}
.from-till-input:hover {
  input {
    background: #e5e7eb;
  }
}
</style>
