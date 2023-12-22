<script>
import { computed } from 'vue'

export default {
  name: 'SwitchButtonGroup',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const selected = computed({
      get() {
        return props.value
      },
      set(sv) {
        emit('input', sv)
      },
    })

    return {
      selected,
    }
  },
}
</script>

<template>
  <ul class="switch__group">
    <li
      v-for="item in items"
      :key="item.value"
      class="switch__group__item"
    >
      <button
        class="switch__button"
        :class="{'switch__button__active': selected === item.value}"
        @click="selected = item.value"
      >
        {{ $t(item.title) }}
      </button>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.switch__group {
  margin: 0;
  padding: 0.25rem;
  border-radius: 1rem;
  background-color: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  list-style-type: none;
  overflow: hidden;
  min-height: 2.5rem;

  &__item {
    height: 100%;

    .switch__button {
      height: 100%;
      padding: 0 1rem;
      margin: 0;
      border-radius: 0;
      outline: none;
      border: none;
      color: var(--gray-600);
      text-align: center;
      font-family: Inter, sans-serif;
      font-size: 1rem;
      font-style: normal;
      font-weight: 600;
      line-height: 22px;
      background-color: transparent;

      &__active {
        background-color: white;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
        border-radius: 0.75rem;
      }
    }
  }
}
</style>
