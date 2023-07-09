<script>
import "vue2-datepicker/index.css";
import DatePicker from "vue2-datepicker";
import DocHeader from "@/views/documentation/DocHeader";
export default {
  name: "Experiment",
  components: {
    DocHeader,
    DatePicker,
  },
  props: {
    range: {
      type: Boolean,
      default: () => true,
    },
  },
};
</script>

<template>
  <main class="calendar">
    <DocHeader title="calendar" />
    <div class="calendar-content">
      <date-picker
        class="date-picker"
        :range="false"
        :open="true"
      ></date-picker>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.calendar {
  position: relative;
  &-content {
    margin-top: 20rem;
    margin-left: 17rem;
    .date-picker {
      visibility: hidden;
    }
  }
}
</style>
