<script>
import { dateConvertor, formatDateToYMD } from "@/util/calendar";
import { formatToPrice } from "@/util/reusable";
import BaseTimesIcon from "@/components/icons/BaseTimesIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseStarIcon from "@/components/icons/BaseStarIcon";

export default {
  name: "BaseHugeCalendarUI",
  components: {
    BaseStarIcon,
    BaseTimesIcon,
    BaseArrowRightIcon,
  },
  emits: ["show-debtor-view-modal", "go-more-detail"],
  props: {
    items: {
      type: Array,
      required: true,
    },
    starter: {
      type: String,
      required: true,
    },
    getFullName: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      showBottomToTop: false,
      showRightToLeft: false,
      calendarCellHeight: 0,
      calendarCellWidth: 0,
    };
  },
  computed: {
    allDebtCardStyle() {
      const style = {};
      if (this.showBottomToTop) {
        style.top = "auto";
        style.bottom = `-${this.calendarCellHeight}px`;
      }

      if (this.showRightToLeft) {
        style.left = "auto";
        style.right = `-${this.calendarCellWidth}px`;
      }

      if (this.showBottomToTop || this.showRightToLeft) {
        return style;
      }

      return {};
    },
  },
  methods: {
    equalMonth(itemMonth) {
      return (
        dateConvertor(itemMonth).getMonth() ===
        dateConvertor(this.starter).getMonth()
      );
    },
    equalToTodayDate(ymd) {
      return ymd === formatDateToYMD(new Date());
    },
    debtAmount(debt) {
      return (
        formatToPrice(debt.amount - debt.amount_paid) + " " + this.$t("ye")
      );
    },
    showDebtCard({ ymd }) {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const calendarCell =
        this.$refs[`calendar-content-cell-${ymd}`][0].getBoundingClientRect();
      const distanceCellBetweenBottom = windowHeight - calendarCell.bottom;
      const distanceCellBetweenRight = windowWidth - calendarCell.right;
      this.calendarCellHeight = calendarCell.height;
      this.calendarCellWidth = calendarCell.width;
      this.showRightToLeft = distanceCellBetweenRight < calendarCell.width * 1;
      this.showBottomToTop =
        distanceCellBetweenBottom < calendarCell.height * 2;
      this.items.forEach((item) => {
        item.show = item.ymd === ymd;
      });
    },
    showDebtInformationModal(item) {
      this.$emit("show-debtor-view-modal", item);
    },
    goMoreDetail(ymd) {
      this.$emit("go-more-detail", ymd);
    },
  },
};
</script>

<template>
  <div class="calendar-layout">
    <div class="calendar-content">
      <!--            :style="item.show ? 'overflow-x: visible' : ''"    -->
      <span
        class="calendar-content-cell"
        :ref="`calendar-content-cell-${item.ymd}`"
        :class="{
          'overflow-visible': item.show,
          'disable-cell': !equalMonth(item.ymd),
          'today-cell': equalToTodayDate(item.ymd),
        }"
        v-for="(item, index) in items"
        :key="item.ymd + index"
      >
        <span>
          <span v-show="item.show" style="position: relative">
            <span class="view-all-debts" :style="allDebtCardStyle">
              <span class="view-all-debts-head">
                <span class="day-of-month">{{ item.dayOfMonth }}</span>
                <span @click="item.show = false" class="cursor-pointer">
                  <base-times-icon />
                </span>
              </span>
              <span
                class="view-all-debts-main d-flex flex-column align-content-between"
              >
                <span class="debt-card-content">
                  <span
                    v-for="(debt, index) in item.debts"
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
                <span
                  @click="goMoreDetail(item.ymd)"
                  class="view-all-debts-footer d-flex justify-content-between cursor-pointer"
                >
                  <span>{{ $t("go_to_day") }}</span>
                  <base-arrow-right-icon />
                </span>
              </span>
            </span>
          </span>
          <span
            :ref="`debt-card-top-content-${item.ymd}`"
            class="cell-top-content"
          >
            <span class="day-of-month">{{ item.dayOfMonth }}</span>
            <span v-if="index < 7" class="day-of-week">{{
              $t(`weekDayAbbreviation.${item.dayOfWeek}`)
            }}</span>
          </span>
          <span
            v-if="item.debts && item.debts.length"
            @click="showDebtInformationModal(item.debts[0])"
            class="cell-middle-content"
            :class="{ 'd-none': item.show }"
          >
            <span class="overflow-hidden">
              <span v-if="item.debts[0].order.friends" class="debtor">
                <span class="d-flex overflow-hidden friend">
                  {{ item.debts[0].order.contract }} ·
                  {{ getFullName(item.debts[0].client) }}
                </span>
                <BaseStarIcon fill="#ffff" />
              </span>
              <span v-else class="debtor">
                <span class="d-flex overflow-hidden">
                  {{ item.debts[0].order.contract }} ·
                  {{ getFullName(item.debts[0].client) }}
                </span>
              </span>
              <span class="overflow-hidden">{{
                debtAmount(item.debts[0])
              }}</span>
            </span>
          </span>
          <span v-if="item.debts && item.debts.length > 1" class="d-block">
            <button @click="showDebtCard(item)" class="more-button">
              {{ $t("more") }} {{ item.debts.length - 1 }}
            </button>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../assets/scss/reusable/debtors-ui";

//.calendar-layout {
//  overflow-x: scroll;
//}

.calendar-content {
  height: 54rem;
  display: grid;
  justify-items: stretch;
  grid-template-columns: repeat(7, 1fr);
  font-family: CraftworkSans, serif;
  gap: 0;

  &-cell {
    overflow-y: hidden;
    justify-self: stretch;
    border: 1px solid var(--gray-100);
    //min-width: 16rem;
    min-height: 8.5rem;
    position: relative;
    overflow-x: hidden;

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
}

.content-no-wrap {
  overflow-x: visible !important;
}

.overflow-visible {
  overflow: visible !important;
}
.debtor {
  display: flex;
  position: relative;
  justify-content: space-between;
  .friend {
    width: 85%;
  }
  svg {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translate(-100%, -50%);
    height: 15px;
    width: 15px;
  }
}
</style>
