<template>
  <div class="base-input" :class="error ? 'error' : ''">
    <span v-if="searchInput && label" class="input-label">{{ placeholder }}</span>
    <input
        v-model="searchInput"
        :type="type"
        id="base-input"
        ref="base-input"
        :placeholder="placeholder"
        @input="triggerInputEvent"
    />
    <span
        v-if="showClearIcon"
        class="clear__icon"
        @click="clearSearchInput"
    >
        <base-times-circle-icon/>
      </span>
  </div>
</template>


<script>
import BaseTimesCircleIcon from "@/components/icons/BaseTimesCircleIcon";
import {debounce} from "@/util/reusable";

export default {
  name: "BaseInput",
  components: {
    BaseTimesCircleIcon,
  },
  emits: ['trigger-input', 'search-by-filter', 'replace-router'],
  props: {
    placeholder: {
      type: String,
    },
    value: {
      type: String, Number
    },
    type: {
      type: String,
      default: () => 'text'
    },
    label: {
      type: Boolean,
      default: () => false
    },
    error: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      debounceInput: this.value,
      showClearIcon: false,
    }
  },
  computed: {
    searchInput: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    searchInput: debounce(function (newValue) {
      this.debounceInput = newValue
    }, 350),
    debounceInput() {
      if (this.type === 'text' || this.type === 'search') {
        this.toggleClearIcon()
        this.triggerInputEvent()
      }
    },
  },
  mounted() {
    if (this.searchInput?.length) {
      this.toggleClearIcon()
    }
  },
  methods: {
    focusOnSearchInput() {
      this.$refs['base-input'].focus()
    },
    clearSearchInput() {
      this.searchInput = ''
    },
    toggleClearIcon() {
      this.showClearIcon = !!this.searchInput.length
    },
    triggerInputEvent() {
      this.$emit('trigger-input', this.debounceInput)
    },
  }
}
</script>


<style lang="scss" scoped>
.input-label {
  font-weight: 900;
  font-size: 8px;
  line-height: 10px;
  margin-bottom: 2px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--gray-400);
}

.base-input {
  width: 75%;
  height: 3.5rem;
  padding: 10px 20px 10px 1.25rem;
  border: 0.25rem solid transparent;
  border-radius: 2rem;
  background-color: var(--gray-100);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: relative;

  &:focus-within {
    border: 0.25rem solid var(--gray-200);
    background-color: var(--gray-100);
  }

  &:hover {
    background-color: var(--gray-200);
  }

  input {
    width: 95%;
    background-color: transparent;
    height: 100%;
    outline: none;
    border: none;
    font-weight: 700;
    color: var(--gray-600);

    &::placeholder {
      font-weight: 600;
      color: var(--gray-400);
    }
  }

  &-icon {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

}

.clear__icon {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  transition: transform 100ms ease-in;

  &:hover {
    transform: scale(1.1);
  }
}


::placeholder {
  color: var(--gray-600);
  opacity: 1;
}

input[type="date"] {
  padding-right: 2rem;
}

input[type="date"]::-webkit-datetime-edit-text,
input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: var(--gray-600);
}

::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 60%;
  right: 2rem;
  transform: translateY(-60%);
}

.error {
  border: .25rem solid var(--red-500) !important
}


@media (max-width: 996px) {
  .search__content-input {
    width: 60%;
  }
}
</style>