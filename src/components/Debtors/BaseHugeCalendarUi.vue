<template>
  <div class="calendar-layout">
    <div class="calendar-content">
      <span
          class="calendar-content-cell"
          :class="{ 'disable-cell' : !equalMonth(item.ymd), 'today-cell': equalToTodayDate(item.ymd) }"
          v-for="(item,index) in items"
          :key="item.ymd + index"
      >
      <span :class="{ 'hide-content': item.show }">
        <span class="cell-top-content">
          <span class="day-of-month">{{ item.dayOfMonth }}</span>
          <span v-if="index < 7" class="day-of-week">{{ $t(`weekDayAbbreviation.${item.dayOfWeek}`) }}</span>
        </span>
        <span v-if="item.debts && item.debts.length" @click="showDebtInformationModal(item.debts[0])"
              class="cell-middle-content">
          <span class="full-name text-truncate">
            {{ item.debts[0].order.contract }} · {{ getFullName(item.debts[0].client) }}
          </span>
          <span class="d-block">{{ debtAmount(item.debts[0]) }}</span>
        </span>
        <span v-if="item.debts && item.debts.length > 1" class="d-block">
          <button @click="showDebtCard(item)" class="more-button">
            {{ $t('more') }} {{ item.debts.length - 1 }}
          </button>
        </span>
      </span>
      <span v-if="item.show" class="view-all-debts">
        <span class="view-all-debts-head">
          <span class="day-of-month">{{ item.dayOfMonth }}</span>
          <span @click="item.show = false" class="cursor-pointer">
            <base-times-icon/>
          </span>
        </span>
        <span class="view-all-debts-main d-flex flex-column align-content-between">
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
          <span class="view-all-debts-footer d-flex justify-content-between cursor-pointer">
            <span>{{ $t('go_to_day') }}</span>
            <base-arrow-right-icon/>
          </span>
        </span>
      </span>
    </span>
    </div>
  </div>
</template>

<script>
import {dateConvertor, formatDateToYMD} from "@/util/calendar";
import {formatToPrice} from "@/util/reusable";
import BaseTimesIcon from "@/components/icons/BaseTimesIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";

export default {
  name: "BaseHugeCalendarUI",
  components: {
    BaseTimesIcon,
    BaseArrowRightIcon
  },
  emits: ['show-debtor-view-modal'],
  props: {
    items: {
      type: Array,
      required: true
    },
    starter: {
      type: String,
      required: true
    },
    getFullName: {
      type: Function,
      required: true
    }
  },
  methods: {
    equalMonth(itemMonth) {
      return dateConvertor(itemMonth).getMonth() === dateConvertor(this.starter).getMonth()
    },
    equalToTodayDate(ymd) {
      return ymd === formatDateToYMD(new Date())
    },
    debtAmount(debt) {
      return formatToPrice(debt.amount - debt.amount_paid) + ' ' + this.$t('ye')
    },
    showDebtCard({ymd}) {
      this.items.forEach((item) => {
        item.show = item.ymd === ymd
      })
    },
    showDebtInformationModal(item) {
      this.$emit('show-debtor-view-modal', item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/reusable/debtors-ui";
.calendar-layout {
  overflow-x: scroll;
}

.calendar-content {
  height: 54rem;
  display: grid;
  justify-items: stretch;
  grid-template-columns: repeat(7, 1fr);
  font-family: CraftworkSans, serif;
  gap: 0;

  &-cell {
    justify-self: stretch;
    border: 1px solid var(--gray-100);
    min-width: 16rem;
    min-height: 8.5rem;
    position: relative;

    .cell-top-content {
      width: 100%;
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
    }
  }
}
</style>