<script>
export default {
  name: 'AppDropdown',
  props: {
    positionRight: {
      type: Boolean,
      default: () => false,
    },
    collapseArrow: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>

<template>
  <div>
    <b-dropdown
      :right="positionRight"
      :class="{ notArrow: collapseArrow }"
    >
      <template #button-content>
        <slot name="header" />
      </template>
      <slot name="list" />
    </b-dropdown>
  </div>
</template>

<style lang="scss" scoped>
::v-deep {
  .b-dropdown {
    width: fit-content;
  }

  .b-dropdown .btn:not(.dropdown-item),
  .btn-secondary:not(.dropdown-item) {
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
    background-color: var(--gray-100) !important;
    box-shadow: none !important;
    margin: 0 !important;

    &:hover {
      background-color: var(--gray-200) !important;
    }
  }

  .dropdown-toggle::after {
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    margin-left: 1rem;
    background: url("../../../assets/icons/icon-down.svg");
    transition: all 0.2s ease-in-out;
  }

  .show {
    .b-dropdown .btn:not(.dropdown-item),
    .btn-secondary:not(.dropdown-item) {
      background-color: var(--gray-200) !important;
    }

    .dropdown-toggle {
      &::after {
        transform: rotate(-180deg);
      }
    }
  }

  .dropdown-menu {
    flex-direction: column;
    border: 1px solid var(--gray-200);
    box-sizing: border-box;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: 0.5rem;
    row-gap: 0.5rem;
    column-gap: 0.5rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    //transition: all .2s linear;

    li {
      margin-bottom: 0.5rem;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      border-radius: 1rem;
      padding: 16px 16px;
      min-width: 256px;
      height: 52px !important;
      column-gap: 0.5rem;

      &:hover {
        background-color: var(--gray-200);
      }
    }
  }

  .notArrow {
    .b-dropdown .btn:not(.dropdown-item),
    .btn-secondary:not(.dropdown-item) {
      height: auto;
      min-height: 24px;
      width: auto;
      border: none !important;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background-color: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      border-radius: 1rem !important;

      &:hover {
        //background-color: transparent !important;
        //-webkit-box-shadow: 0 8px 25px -8px var(--gray-400) !important;
        //box-shadow: 0 8px 25px -8px var(--gray-400) !important;
      }
    }

    .dropdown-item {
      height: 56px;
      display: flex;
      align-items: center;
    }

    .dropdown-toggle::after {
      display: none;
    }
  }
}
</style>
