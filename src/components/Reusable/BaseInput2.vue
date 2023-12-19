<script>
import BaseTimesCircleIcon from '@/components/icons/BaseTimesCircleIcon'
import { debounce } from '@/util/reusable'
import BaseUpIcon from '@/components/icons/BaseUpIcon'
import BaseDownIcon from '@/components/icons/BaseDownIcon'

const cssDefaultProperty = {
  type: String,
  default: '',
}
export default {
  name: 'BaseInput',
  components: {
    BaseUpIcon,
    BaseDownIcon,
    BaseTimesCircleIcon,
    BaseNumericInput: () => import('@/components/Reusable/BaseNumericInput'),
  },
  emits: ['input', 'trigger-input', 'search-by-filter', 'replace-router'],
  props: {
    placeholder: {
      type: String,
    },
    value: {
      type: [String, Number, Array],
      default: () => null,
    },
    type: {
      type: String,
      default: () => 'text',
    },
    counter: {
      type: Boolean,
      default: () => false,
    },
    label: {
      type: Boolean,
      default: () => false,
    },
    error: {
      type: Boolean,
      default: () => false,
    },
    currency: {
      type: String,
      default: ' ',
    },
    mask: {
      type: String,
      default: '',
    },
    disable: {
      type: Boolean,
      default: () => false,
    },
    margin: cssDefaultProperty,
    padding: cssDefaultProperty,
    paddingLeft: cssDefaultProperty,
    paddingRight: cssDefaultProperty,
    paddingBottom: cssDefaultProperty,
    paddingTop: cssDefaultProperty,
    marginTop: cssDefaultProperty,
    marginBottom: cssDefaultProperty,
    marginLeft: cssDefaultProperty,
    marginRight: cssDefaultProperty,
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
      },
    },
    inputFieldStyle() {
      const {
        margin,
        padding,
        paddingLeft,
        paddingRight,
        paddingBottom,
        paddingTop,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      } = this
      return {
        margin,
        padding,
        paddingLeft,
        paddingRight,
        paddingBottom,
        paddingTop,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      }
    },
  },
  watch: {
    searchInput: debounce(function (newValue) {
      this.debounceInput = newValue
    }, 350),
    debounceInput() {
      setTimeout(() => {
        this.focusOnSearchInput()
      }, 100)
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
    triggerNumberEvent($event) {
      this.debounceInput = $event
      this.$emit('trigger-input', this.debounceInput)
    },
    increment() {
      // const myArray = this.searchInput.split(/([0-9]+)/)
      // console.log(myArray, 'myArray before');
      // myArray.filter(item => item !== '')
      // console.log(myArray, 'myArray after');
      this.searchInput++
    },
    decrement() {
      if (this.searchInput > 0) {
        this.searchInput--
      }
    },
  },
}
</script>

<template>
  <div
    class="base-input"
    :class="{ error: error, label: value && label }"
  >
    <div
      v-if="value && label"
      class="input-label"
    >
      <span>
        {{ placeholder }}
      </span>
    </div>
    <input
      v-if="counter"
      id="base-input"
      ref="base-input"
      v-model="searchInput"
      :type="type"
      :disabled="disable"
      :placeholder="placeholder"
      @input="triggerInputEvent"
    >

    <base-numeric-input
      v-else-if="type === 'number'"
      ref="base-input"
      :currency="currency"
      :minus="false"
      :value="null"
      :disabled="disable"
      currency-symbol-position="suffix"
      separator="space"
      :placeholder="placeholder"
      :field-style="inputFieldStyle"
      @input="triggerNumberEvent"
    />
    <input
      v-else-if="!mask"
      id="base-input"
      ref="base-input"
      v-model="searchInput"
      :type="type"
      :disabled="disable"
      :style="inputFieldStyle"
      :placeholder="placeholder"
      @input="triggerInputEvent"
    >

    <input
      v-else
      id="base-input-mask"
      ref="base-input"
      v-model="searchInput"
      v-mask="mask"
      :type="type"
      :disabled="disable"
      :style="inputFieldStyle"
      :placeholder="placeholder"
      @input="triggerInputEvent"
    >
    <span
      v-if="showClearIcon && !disable"
      class="clear__icon"
      @click="clearSearchInput"
    >
      <base-times-circle-icon />
    </span>
    <div
      v-if="counter"
      class="spin__icon"
    >
      <div @click="increment">
        <base-up-icon />
      </div>
      <div @click="decrement">
        <base-down-icon />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-label {
  font-family: CraftworkSans, serif;
  position: relative;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--gray-400);
  width: 100%;
  display: flex;
  padding-left: 1rem;
  margin-bottom: 6px;

  span {
    font-weight: 900;
    font-size: 8px;
    line-height: 8px;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.base-input {
  width: 75%;
  height: 3.5rem;
  padding: 13px 20px 13px 1.25rem;
  border: 0.25rem solid transparent;
  border-radius: 2rem;
  background-color: var(--gray-100);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: relative;

  &.label {
    padding: 8px 20px 8px 1.25rem;
  }

  // &:focus-within {
  //   border: 0.25rem solid var(--gray-200);
  //   background-color: var(--gray-100);
  // }

  input {
    width: 100%;
    background-color: transparent;
    height: 100%;
    outline: none;
    border: none;
    font-weight: 700;
    color: var(--gray-600);
    padding: 0 !important;

    &::placeholder {
      font-weight: 600;
      color: var(--gray-400);
    }
  }

  // &:hover {
  //   background-color: var(--gray-200);

  //   input {
  //     background-color: var(--gray-200) !important;
  //   }
  // }

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

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 60%;
  right: 2rem;
  transform: translateY(-60%);
}

.error {
  border: 0.25rem solid var(--red-500) !important;
}

@media (max-width: 996px) {
  .search__content-input {
    width: 60%;
  }
}

.spin__icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
</style>
