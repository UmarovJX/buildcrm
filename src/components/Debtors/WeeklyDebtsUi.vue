<script>
// import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
// import BaseTimesIcon from "@/components/icons/BaseTimesIcon";
import { formatToPrice } from "@/util/reusable";
import { formatDateToYMD } from "@/util/calendar";

export default {
  name: "weekly-debts-ui",
  components: {
    // BaseTimesIcon,
    // BaseArrowRightIcon
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    getFullName: {
      type: Function,
      required: true,
    },
  },
  emits: ["show-debtor-view-modal"],
  methods: {
    showDebtInformationModal(item) {
      this.$emit("show-debtor-view-modal", item);
    },
    debtAmount(debt) {
      return (
        formatToPrice(debt.amount - debt.amount_paid) + " " + this.$t("ye")
      );
    },
    equalToTodayDate(ymd) {
      return ymd === formatDateToYMD(new Date());
    },
  },
};
</script>

<template>
  <div>
    <div class="week-content">
      <span
        class="week-content-column"
        v-for="(item, index) in items"
        :key="item.ymd + index"
      >
        <span
          class="cell-top-content content-days-of-week"
          :class="{ 'today-cell': equalToTodayDate(item.ymd) }"
        >
          <span class="day-of-month">{{ item.dayOfMonth }}</span>
          <span v-if="index < 7" class="day-of-week">{{
            $t(`weekDayAbbreviation.${item.dayOfWeek}`)
          }}</span>
        </span>
        <span
          class="week-debts-column view-all-debts-main pt-1 d-flex flex-column align-content-between"
          :class="{ 'today-cell': equalToTodayDate(item.ymd) }"
        >
          <span
            v-for="(debt, index) in item.debts"
            :key="debt.order.contract + index"
            class="debt-card mb-2"
            @click="showDebtInformationModal(debt)"
          >
            <span class="">
              {{ debt.order.contract }} · {{ getFullName(debt.client) }}
            </span>
            <span class="d-block">{{ debtAmount(debt) }}</span>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../assets/scss/reusable/debtors-ui";

.week-content {
  min-height: 45rem;
  display: grid;
  justify-items: stretch;
  grid-template-columns: repeat(7, 1fr);
  font-family: CraftworkSans, serif;
  gap: 0;

  &-column {
    justify-self: stretch;
    border: 1px solid var(--gray-100);
    //min-width: 16rem;
    min-height: 8.5rem;
    position: relative;
    overflow: hidden;

    .cell-top-content {
      //width: 100%;
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;

      .day-of-month {
        color: var(--gray-400);
      }

      .day-of-week {
        color: var(--gray-600);
      }
    }

    .cell-middle-content {
      display: block;
      background-color: var(--violet-600);
      border-radius: 0.25rem;
      margin: 0 0.25rem;
      color: white;
      padding: 0.5rem;
      font-size: 14px;
      max-height: 100px;
      text-overflow: ellipsis;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      white-space: nowrap;
      line-break: anywhere;
      overflow: hidden;
    }
  }

  .week-debts-column {
    height: 45rem;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

.today-cell {
  background-color: var(--violet-50);

  .day-of-month,
  .day-of-week {
    color: var(--violet-600) !important;
  }
}

.view-more-details {
  padding: 1rem;
  color: var(--gray-600);
  background-color: var(--gray-50);
}
</style>
