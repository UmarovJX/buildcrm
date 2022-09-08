<template>
  <main>
    <div class="input-number-content">
      <base-price-input
          class="input-component"
          placeholder="input price"
          value="100,2121.2121"
          :precision="2"
      />
      <div class="base-calendar">
        <date-picker
            type="date"
            value-type="format"
            :format="format"
            :placeholder="placeholder"
            v-model="dateValue"
            class="date-picker"
            :range="range"
        ></date-picker>
      <span class="calendar-icon">
      <base-calendar-icon
          :fill="iconFill"
          :width="iconSquareSize"
          :height="iconSquareSize"
      />
    </span>
      </div>
    </div>
  </main>
</template>

<script>
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import "vue2-datepicker/index.css";
import BaseCalendarIcon from "@/components/icons/BaseCalendarIcon";
import DatePicker from "vue2-datepicker";

export default {
  name: "Experiment",
  components: {
    BasePriceInput,
    DatePicker,
    BaseCalendarIcon
  },
  emits: ['input'],
  props: {
    defaultValue: {
      type: [Array, String],
      default: () => []
    },
    range: {
      type: Boolean,
      default: () => true
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    placeholder: {
      type: String,
      default: 'Select date range'
    },
    iconSquareSize: {
      type: Number,
      default: 24
    },
    iconFill: {
      type: String,
      default: '#9CA3AF'
    }
  },
  data() {
    return {
      dateValue: null
    }
  },
  watch: {
    dateValue(lastValue) {
      this.$emit('input', lastValue)
    },
    defaultValue: {
      immediate: true,
      handler() {
        if (this.defaultValue && this.defaultValue.length) {
          this.dateValue = this.defaultValue
        }
      }
    }
  },
  // mounted() {
  // this.initDefaultValue()
  // },
  methods: {
    // initDefaultValue() {
    //   console.log(this.defaultValue, 'defaultValue');
    //   if (this.defaultValue && this.defaultValue.length) {
    //     console.log(this.defaultValue, 'ifni ichida defaultValue');
    //
    //     this.dateValue = this.defaultValue
    //   }
    // },
    clearField() {
      this.dateValue = undefined
    }
  }
}
</script>

<style scoped>
.input-number-content {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-component {
  padding: 0.5rem 1rem;
  width: 200px;
}
.base-calendar {
  position: relative;
}
.base-calendar .date-picker {
  width: 100%;
}
.base-calendar .date-picker ::v-deep .mx-input-wrapper .mx-input {
  box-shadow: none;
  border: none;
  border-radius: 2rem;
  padding: 2rem 1.25rem;
  background-color: var(--gray-100);
}
.base-calendar .date-picker ::v-deep .mx-input-wrapper .mx-input .popup-style {
  background: #000;
}
.base-calendar .date-picker ::v-deep .mx-input-wrapper .mx-input::placeholder {
  background-color: transparent;
  color: var(--gray-400);
  font-family: CraftworkSans, serif;
}
.base-calendar .date-picker ::v-deep .mx-input-wrapper .mx-icon-calendar, .base-calendar .date-picker ::v-deep .mx-input-wrapper .mx-icon-clear {
  display: none;
}
.base-calendar .calendar-icon {
  position: absolute;
  right: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
}
</style>