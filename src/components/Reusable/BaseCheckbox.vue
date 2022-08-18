<template>
  <div class="base-checkbox">
    <div class="base-checkbox-row">
      <input type="checkbox" name="checkbox" />
      <input type="checkbox" name="checkbox-checked" />
      <input type="checkbox" name="checkbox-disabled" disabled />
    </div>
    <div class="base-checkbox-row">
      <input type="checkbox" name="checkbox-disabled-checked" checked />
      <input type="checkbox" name="checkbox-checked" checked />
      <input type="checkbox" name="checkbox-disabled" checked disabled />
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseCheckbox",
  components: {},
  props: {
    border: {
      type: String,
      required: false,
      default: () => "#9CA3AF"
    },
    disabled: {
      type: Boolean,
      required: false,
      default: () => false
    }
  }
}
</script>

<style lang="scss" scoped>
  .base-checkbox {
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-sizing: border-box;
    padding: 20px;
    width: max-content;
    border: 1px dashed #7B61FF;
    border-radius: 5px;
    &-row {
      display: flex;
      gap: 16px;
    }
    :root {
      --form-control-color: rebeccapurple;
      --form-control-disabled: #959495;
    }

    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }

    body {
      margin: 0;
    }

    form {
      display: grid;
      place-content: center;
      min-height: 100vh;
    }

    .form-control {
      font-family: system-ui, sans-serif;
      font-size: 2rem;
      font-weight: bold;
      line-height: 1.1;
      display: grid;
      grid-template-columns: 1em auto;
      gap: 0.5em;
    }

    .form-control--disabled {
      color: var(--form-control-disabled);
      cursor: not-allowed;
    }

    input[type="checkbox"] {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
      font: inherit;
      color: currentColor;
      width: 1em;
      height: 1em;
      border: 3px solid #9CA3AF;
      border-radius: 4px;
      transform: translateY(-0.075em);

      display: grid;
      place-content: center;
    }
    &-row:first-child{
      input[type="checkbox"]:nth-child(2) {
        border: 3px solid #7C3AED;
      }
    }
    &-row:last-child{
      input[type="checkbox"]:nth-child(2) {
        background-color: #6D28D9;
      }
    }


    input[type="checkbox"]::before {
      content: "";
      width: 8px;
      height: 6px;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transform-origin: bottom left;
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1em 1em var(--form-control-color);
      /* Windows High Contrast Mode */
      background-color: white;
    }

    input[type="checkbox"]:checked::before {
      transform: scale(1);
    }
    input[type="checkbox"]:checked {
      background-color: #7C3AED;
      border: none;
    }
    input[type="checkbox"]:checked:disabled {
      background-color: #9CA3AF;
      border: none;
    }

    input[type="checkbox"]:hover {
      border: 3px solid #7C3AED;
    }

    input[type="checkbox"]:disabled {
      --form-control-color: var(--form-control-disabled);
      border: 4px solid #E5E7EB;
      color: var(--form-control-disabled);
      cursor: not-allowed;
    }
  }
</style>