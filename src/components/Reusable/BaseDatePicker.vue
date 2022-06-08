<template>
  <div class="base-calendar">
    <date-picker
        type="date"
        value-type="format"
        :format="format"
        :placeholder="placeholder"
        v-model="dateValue"
        class="date-picker"
        range
    ></date-picker>
    <span class="calendar-icon">
      <base-calendar-icon
          :fill="iconFill"
          :width="iconSquareSize"
          :height="iconSquareSize"
      />
    </span>
  </div>
</template>

<script>
import "vue2-datepicker/index.css";
import BaseCalendarIcon from "@/components/icons/BaseCalendarIcon";
import DatePicker from "vue2-datepicker";

export default {
  name: "BaseDatePicker",
  components: {
    DatePicker,
    BaseCalendarIcon
  },
  emits: ['input'],
  props: {
    defaultValue: {
      type: Array,
      default: () => []
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
    }
  },
  mounted() {
    this.initDefaultValue()
  },
  methods: {
    initDefaultValue() {
      if (this.defaultValue.length) {
        this.dateValue = this.defaultValue
      }
    },
    clearField() {
      this.dateValue = undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.base-calendar {
  position: relative;

  .date-picker {
    width: 100%;

    ::v-deep .mx-input-wrapper {
      .mx-input {
        box-shadow: none;
        border: none;
        border-radius: 2rem;
        padding: 2rem 1.25rem;
        background-color: var(--gray-100);

        &::placeholder {
          background-color: transparent;
          color: var(--gray-400);
          font-family: CraftworkSans, serif;
        }
      }

      .mx-icon-calendar,
      .mx-icon-clear {
        display: none;
      }
    }
  }

  .calendar-icon {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>