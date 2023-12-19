<script>
import BaseFilterIcon from '@/components/icons/BaseFilterIcon'

export default {
  name: 'FilterButton',
  components: {
    BaseFilterIcon,
  },
  props: {
    iconFill: {
      type: String,
      default: '#7C3AED',
    },
    buttonText: {
      type: String,
      default: 'contracts.filter',
    },
  },
  emits: ['click'],
  methods: {
    showFilterInterface() {
      this.$emit('click')
    },
  },
}
</script>

<template>
  <div
    class="filter-button d-flex align-items-center"
    @click="showFilterInterface"
  >
    <span class="filter-icon">
      <base-filter-icon :fill="iconFill" />
    </span>
    <span>{{ $t(buttonText) }}</span>
  </div>
</template>

<style lang="scss" scoped>
.filter-button {
  height: 100%;
  width: auto;
  border-radius: 2rem;
  padding: 1rem 1.5rem;
  background-color: var(--gray-100);
  margin-left: 0.5rem;
  cursor: pointer;

  .filter-icon {
    margin-right: 1.25rem;
  }
}
</style>
