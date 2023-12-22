<script>
import {
  computed, ref, watch,
} from 'vue'
import { formatDateWithDot } from '@/util/reusable'

import { XIcon } from '@/components/ui-components/material-icons'
import DateRangePicker from 'vue2-daterange-picker'
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import { formatYMD } from '@/util/date'

export default {
  name: 'StatisticsDatePicker',
  components: {
    XIcon,
    DateRangePicker,
  },
  emits: ['input'],
  setup(props, { emit }) {
    const startDate = new Date()
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    const dateRange = ref({
      startDate,
      endDate: new Date(),
    })

    const dateRangeList = computed(() => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)

      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      const lastMonthStart = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      )
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
      const quarterStart = new Date(today.getFullYear(), today.getMonth() - 2, 1)
      const halfStart = new Date(today.getFullYear(), today.getMonth() - 5, 1)
      const startOfTheYear = new Date(today.getFullYear(), 0, 1)
      const theWholePeriod = [
        new Date(2019, 0, 1),
        today,
      ]

      return {
        today: [today, today],
        'common.this_month': [thisMonthStart, thisMonthEnd],
        'common.last_month': [lastMonthStart, lastMonthEnd],
        quarter: [quarterStart, today],
        'common.six_months': [halfStart, today],
        year: [startOfTheYear, today],
        'common.the_whole_period': theWholePeriod,
      }
    })

    watch(() => dateRange.value, rangePair => {
      emit('input', {
        date_from: formatYMD(rangePair.startDate),
        date_to: formatYMD(rangePair.endDate),
      })
    }, {
      deep: true,
    })

    return {
      dateRange,
      dateRangeList,
    }
  },
  methods: { formatDateWithDot },
}
</script>

<template>
  <date-range-picker
    ref="picker"
    v-model="dateRange"
    placeholder="Select Dates"
    :locale-data="{ firstDay: 1, format: 'dd.mm.yyyy' }"
    auto-apply
    show-dropdowns
    :ranges="dateRangeList"
    class="date__range__picker"
  >
    <template #input="picker">
      <span class="date__range__wrapper">
        <span class="date__content date__content__start">
          <span class="date__content__field">
            <span class="date__content__title">
              {{ $t("from_the_date_of") }}
            </span>
            <span class="date__content__value">
              {{ formatDateWithDot(picker.startDate) }}
            </span>
          </span>
          <span class="date__content__icon">
            <x-icon
              name="date_range"
              color="#9CA3AF"
              size="24"
            />
          </span>
        </span>

        <span class="date__content">
          <span class="date__content__field">
            <span class="date__content__title">
              {{ $t("to_the_date_of") }}
            </span>
            <span class="date__content__value">
              {{ formatDateWithDot(picker.endDate) }}
            </span>
          </span>
          <span class="date__content__icon">
            <x-icon
              name="date_range"
              color="#9CA3AF"
              size="24"
            />
          </span>
        </span>
      </span>
    </template>

    <template #ranges="ranges">
      <div class="ranges">
        <ul>
          <li
            v-for="(range, rangeTitle) in ranges.ranges"
            :key="rangeTitle"
            @click="ranges.clickRange(range)"
          >
            <span class="ranges__item">
              {{ $t(rangeTitle) }}
            </span>
          </li>
        </ul>
      </div>
    </template>
  </date-range-picker>
</template>

<style lang="scss" scoped>
.date__range__picker {
  min-width: 360px;

  ::v-deep .form-control {
    border: none;
    border-radius: 2rem;
    background-color: var(--gray-100);
    height: auto;
    padding: 0;
  }
}

.date__range__wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-family: Inter, sans-serif;

  .date__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem 0.75rem 1.25rem;

    &__start {
      border-right: 2px solid var(--gray-300);
    }

    &__title {
      color: var(--gray-400);
      font-size: 0.5rem;
      font-style: normal;
      font-weight: 600;
      line-height: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    &__value {
      color: var(--gray-600);
      font-size: 1rem;
      font-style: normal;
      font-weight: 600;
      line-height: 22px;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__field {
      display: flex;
      flex-direction: column;
    }
  }
}

.ranges__item {
  color: var(--gray-600);
  font-family: Inter, sans-serif;
  font-size: 0.8rem;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
}
</style>
