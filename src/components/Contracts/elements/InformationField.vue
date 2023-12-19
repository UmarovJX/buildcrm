<script>
export default {
  name: 'InformationField',
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <li class="information__field">
    <span class="information__field__label">
      <slot name="label">{{ label }}</slot>
    </span>
    <span class="information__field__value">
      <slot name="value">{{ value }}</slot>
    </span>
  </li>
</template>

<style lang="scss" scoped>
.information__field {
  font-family: CraftworkSans, serif;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 2rem;
  border: 2px solid var(--gray-200);
  padding: 1rem;

  &__label {
    color: var(--gray-400);
  }

  &__value {
    color: var(--gray-600);
    font-size: 1.125rem;
    line-height: 22px;
    font-weight: 900;
    text-align: end;
  }
}
</style>
