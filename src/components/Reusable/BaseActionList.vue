<template>
  <div>
    <b-dropdown :right="positionRight">
      <template #button-content>
        <slot name="header">

        </slot>
      </template>

      <slot name="list">
      </slot>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: "BaseActionList",
  components: {},
  props: {
    positionRight: {
      type: Boolean,
      default: () => false
    }
  },
}
</script>

<style lang="scss" scoped>

::v-deep {
  .b-dropdown {
    width: fit-content;
  }

  .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
    font-family: Inter, serif;
    padding: 1rem 1rem 1rem 1.5rem !important;
    height: 56px;
    font-weight: 600 !important;
    line-height: 22px !important;
    border-radius: 2rem !important;
    color: var(--gray-600) !important;
    font-size: 1rem !important;
    border: none !important;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--gray-200) !important;
    margin: 0 !important;
  }

  .dropdown-toggle::after {
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    margin-left: 1rem;
    background: url("../../assets/icons/icon-down.svg");
    transition: all .2s ease-in-out;
  }

  .show .dropdown-toggle::after {
    transform: rotate(-180deg);
  }

  .dropdown-menu {
    border: 1px solid var(--gray-200);
    box-sizing: border-box;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: .5rem;


    .dropdown-item {
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      border-radius: 1rem;
      padding: 12px 17px;
      min-width: 256px;
      display: flex;
      column-gap: .5rem;

      &:hover {
        background-color: var(--gray-200);
      }
    }
  }
}


</style>