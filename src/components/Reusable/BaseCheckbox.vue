<script>
export default {
  name: 'BaseCheckbox',
  components: {},
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    checked: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },
  data() {
    return {
      inlineWatcher: this.checked,
    }
  },
  watch: {
    checked(latest) {
      if (latest !== this.inlineWatcher) {
        this.inlineWatcher = latest
      }
    },
  },
}
</script>

<template>
  <div class="base-checkbox">
    <input
      v-model="inlineWatcher"
      :disabled="disabled"
      type="checkbox"
      name="checkbox"
      @input="$emit('input', $event)"
    >
  </div>
</template>

<style lang="scss" scoped>
.base-checkbox {
  :root {
    --form-control-color: rebeccapurple;
    --form-control-disabled: #959495;
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
    border: 3px solid #9ca3af;
    border-radius: 4px;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
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
    background-color: white;
  }

  input[type="checkbox"]:checked::before {
    transform: scale(1);
  }

  input[type="checkbox"]:checked {
    background-color: #7c3aed;
    border: none;
  }

  input[type="checkbox"]:checked:disabled {
    background-color: #9ca3af;
    border: none;
  }

  input[type="checkbox"]:checked:hover {
    background-color: #6d28d9;
    border: none;
  }

  input[type="checkbox"]:hover {
    border: 3px solid #7c3aed;
  }

  input[type="checkbox"]:disabled {
    --form-control-color: var(--form-control-disabled);
    border: 4px solid #e5e7eb;
    color: var(--form-control-disabled);
    cursor: not-allowed;
  }
}
</style>
