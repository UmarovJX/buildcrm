<script>
import "vue2-datepicker/index.css";
import BaseCalendarIcon from "@/components/icons/BaseCalendarIcon";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/en";
import { init } from "@sentry/vue";

export default {
  name: "BaseDatePicker",
  components: {
    DatePicker,
    BaseCalendarIcon,
  },
  emits: ["input", "select"],
  props: {
    defaultValue: {
      type: [Array, String],
      default: () => [],
    },
    range: {
      type: Boolean,
      default: () => true,
    },
    format: {
      type: String,
      default: "YYYY-MM-DD",
    },
    valueType: {
      type: String,
      default: "YYYY-MM-DD",
    },
    placeholder: {
      type: String,
      default: "Select date range",
    },
    iconSquareSize: {
      type: Number,
      default: 24,
    },
    iconFill: {
      type: String,
      default: "#9CA3AF",
    },
    error: {
      type: Boolean,
      default: () => false,
    },
    label: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      dateValue: null,
    };
  },
  watch: {
    dateValue(lastValue) {
      this.$emit("input", lastValue);
      this.$emit("select", lastValue);
    },
    defaultValue: {
      immediate: true,
      handler(nextValue) {
        this.dateValue = nextValue;
      },
    },
  },
  computed: {
    hasLabel() {
      return this.value && this.value.length && this.label;
    },
  },
  // mounted() {
  // this.initDefaultValue()
  // },
  methods: {
    togglePicker() {
      // console.log(this.$refs["data-picker"], 'this.$refs["data-picker"]');
      // if (this.$refs["data-picker"].defaultOpen) {
      //   this.$refs["data-picker"].closePopup()
      // } else {
      //   this.$refs["data-picker"].openPopup()
      // }
    },
    // initDefaultValue() {
    //   console.log(this.defaultValue, 'defaultValue');
    //   if (this.defaultValue && this.defaultValue.length) {
    //     console.log(this.defaultValue, 'ifni ichida defaultValue');
    //
    //     this.dateValue = this.defaultValue
    //   }
    // },
    clearField() {
      this.dateValue = undefined;
    },
  },
};
</script>

<template>
  <div class="base-calendar">
    <div v-if="hasLabel" class="input-label">
      <span>
        {{ placeholder }}
      </span>
    </div>
    <date-picker
      ref="data-picker"
      type="date"
      :value-type="valueType"
      :format="format"
      lang="en"
      :placeholder="placeholder"
      v-model="dateValue"
      class="date-picker"
      :class="{ error: error, label: hasLabel }"
      :range="range"
    >
      <template @click="togglePicker" class="calendar-icon" #icon-calendar>
        <base-calendar-icon
          :fill="iconFill"
          :width="iconSquareSize"
          :height="iconSquareSize"
        />
      </template>
    </date-picker>
  </div>
</template>

<style lang="scss" scoped>
.input-label {
  font-family: CraftworkSans, serif;
  position: absolute;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--gray-400);
  width: 100%;
  display: flex;
  padding-left: 1rem;
  margin-bottom: 10px;
  z-index: 3;

  span {
    font-weight: 900;
    font-size: 8px;
    line-height: 10px;
    position: absolute;
    top: 12px;
    left: 24px;
  }
}

.base-calendar {
  position: relative;

  .date-picker {
    width: 100%;

    &.error {
      ::v-deep .mx-input-wrapper .mx-input {
        border: 0.25rem solid var(--red-500) !important;
      }
    }

    &.label {
      ::v-deep .mx-input-wrapper .mx-input {
        padding-top: 23px !important;
      }
    }

    ::v-deep .mx-input-wrapper {
      .mx-input {
        font-family: Inter, sans-serif !important;
        box-shadow: none;
        border: 0.25rem solid transparent;
        font-size: 1rem;
        font-weight: 700;
        border-radius: 2rem;
        padding: 17px 20px;
        height: 56px;
        background-color: var(--gray-100);

        &:hover {
          background-color: var(--gray-200);
        }

        &:focus-within {
          font-family: Inter, sans-serif;
          border: 0.25rem solid var(--gray-200);
          background-color: var(--gray-100);
        }

        &::placeholder {
          background-color: transparent;
          color: var(--gray-400);
          font-family: Inter, sans-serif;
        }
      }

      .mx-icon-calendar,
      .mx-icon-clear {
        cursor: pointer;
        font-size: 24px;
        right: 1.25rem;
        //display: none;
      }
    }
  }

  .calendar-icon {
    ////position: relative;
    //position: absolute;
    //right: 1.25rem;
    //top: 50%;
    //transform: translateY(-50%);
  }
}
</style>
