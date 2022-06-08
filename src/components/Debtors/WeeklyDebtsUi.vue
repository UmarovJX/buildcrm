<template>
  <div>
    <div class="week-content">
      <span
          class="week-content-column"
          v-for="(item,index) in items"
          :key="item.ymd + index"
      >
        <span
            class="cell-top-content content-days-of-week"
            :class="{'today-cell': equalToTodayDate(item.ymd)}"
        >
          <span class="day-of-month">{{ item.dayOfMonth }}</span>
          <span v-if="index < 7" class="day-of-week">{{ $t(`weekDayAbbreviation.${item.dayOfWeek}`) }}</span>
        </span>
        <span
            class="week-debts-column view-all-debts-main h-100 pt-1 d-flex flex-column align-content-between"
            :class="{'today-cell': equalToTodayDate(item.ymd)}"
        >
          <span
              v-for="(debt,index) in item.debts"
              :key="debt.order.contract + index"
              class="debt-card mb-2"
              @click="showDebtInformationModal(debt)"
          >
            <span class="full-name text-truncate">
              {{ debt.order.contract }} · {{ getFullName(debt.client) }}
            </span>
            <span class="d-block">{{ debtAmount(debt) }}</span>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
// import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
// import BaseTimesIcon from "@/components/icons/BaseTimesIcon";
import {formatToPrice} from "@/util/reusable";
import {formatDateToYMD} from "@/util/calendar";

export default {
  name: "weekly-debts-ui",
  components: {
    // BaseTimesIcon,
    // BaseArrowRightIcon
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    getFullName: {
      type: Function,
      required: true
    }
  },
  emits: ['show-debtor-view-modal'],
  methods: {
    showDebtInformationModal(item) {
      this.$emit('show-debtor-view-modal', item)
    },
    debtAmount(debt) {
      return formatToPrice(debt.amount - debt.amount_paid) + ' ' + this.$t('ye')
    },
    equalToTodayDate(ymd) {
      return ymd === formatDateToYMD(new Date())
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/reusable/debtors-ui";

.week-content {
  display: grid;
  justify-items: stretch;
  grid-template-columns: repeat(7, 1fr);
  font-family: CraftworkSans, serif;
  gap: 0;
  height: 80vh;

  //&-column {
  //  border: 2px solid var(--gray-100);
  //}
}

.content-days-of-week {
  border-bottom: 1px solid var(--gray-100);
  border-left: 2px solid var(--gray-100);
  border-right: 2px solid var(--gray-100);
  border-top: 2px solid var(--gray-100);
}

.week-debts-column{
  border-bottom: 2px solid var(--gray-100);
  border-left: 2px solid var(--gray-100);
  border-right: 2px solid var(--gray-100);
  border-top: 1px solid var(--gray-100);
}

.today-cell {
  background-color: var(--violet-50);

  .day-of-month,
  .day-of-week {
    color: var(--violet-600) !important;
  }
}
</style>