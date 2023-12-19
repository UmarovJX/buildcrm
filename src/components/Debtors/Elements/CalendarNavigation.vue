<script>
import BaseLeftIcon from '@/components/icons/BaseLeftIcon'
import BaseRightIcon from '@/components/icons/BaseRightIcon'
import BaseLeftDoubleIcon from '@/components/icons/BaseLeftDoubleIcon'
import BaseRightDoubleIcon from '@/components/icons/BaseRightDoubleIcon'
import CircleButtonGenerator from '@/components/Elements/Buttons/CircleButtonGenerator'
import BaseDownIcon from '@/components/icons/BaseDownIcon'
import DatePicker from 'vue2-datepicker'
import { dateConvertor, monthsNameList } from '@/util/calendar'

export default {
  name: 'CalendarNavigation',
  components: {
    BaseLeftDoubleIcon,
    BaseLeftIcon,
    CircleButtonGenerator,
    BaseRightIcon,
    BaseRightDoubleIcon,
    DatePicker,
    BaseDownIcon,
  },
  emits: ['change-date'],
  props: {
    typeOfView: {
      type: String,
      default: 'month',
    },
  },
  data() {
    const hasStarterMoment = this.$route.query.hasOwnProperty('starter_moment')
    let navigationDate = new Date()
    if (hasStarterMoment) {
      navigationDate = dateConvertor(this.$route.query.starter_moment)
    }
    return {
      navigationDate,
      months: monthsNameList,
    }
  },
  computed: {
    dayFormat() {
      const date = new Date(this.navigationDate)
      const day = date.getDate()
      const month = date.getMonth()
      const monthToText = this.months[month]
      const translateMonth = this.$t(monthToText)
      const year = date.getFullYear()
      return {
        day,
        month: translateMonth,
        year,
      }
    },
    dateCount() {
      return new Date(this.navigationDate).getDate()
    },
    datePickerType() {
      if (this.typeOfView === 'month') {
        return 'month'
      }
      return 'date'
    },
  },
  watch: {
    navigationDate(lastValue) {
      this.$emit('change-date', dateConvertor(lastValue))
    },
    '$route.query.starter_moment': function (lastMoment, oldMoment) {
      if (lastMoment !== oldMoment && lastMoment !== undefined) {
        this.navigationDate = lastMoment
      }
    },
  },
  methods: {
    setCalendarMoment(moment) {
      this.navigationDate = dateConvertor(moment)
    },
    setMomentToCurrent() {
      this.navigationDate = new Date()
    },
    buttonDoubleIconsTrigger(count) {
      const lastDate = new Date(this.navigationDate)
      const date = lastDate.getDate()
      const month = lastDate.getMonth()
      const fullYear = lastDate.getFullYear()
      switch (this.typeOfView) {
        case 'day': {
          this.navigationDate = lastDate.setDate(this.dateCount + count * 7)
          break
        }
        case 'week': {
          this.navigationDate = new Date(fullYear, month + count, date)
          break
        }
        case 'month': {
          this.navigationDate = new Date(fullYear + count, month, date)
        }
      }
    },
    buttonIconsTrigger(count) {
      const lastDate = new Date(this.navigationDate)
      const date = lastDate.getDate()
      const month = lastDate.getMonth()
      const fullYear = lastDate.getFullYear()
      switch (this.typeOfView) {
        case 'day': {
          this.navigationDate = lastDate.setDate(this.dateCount + count)
          break
        }
        case 'week': {
          this.navigationDate = lastDate.setDate(this.dateCount + count * 7)
          break
        }
        case 'month': {
          this.navigationDate = new Date(fullYear, month + count, date)
        }
      }
    },
  },
}
</script>

<template>
  <div class="navigation-content d-flex">
    <div class="navigation-content-head w-100">
      <div class="d-flex align-items-center justify-content-center">
        <!--    LEFT DOUBLE ICON    -->
        <circle-button-generator @click="buttonDoubleIconsTrigger(-1)">
          <base-left-double-icon />
        </circle-button-generator>

        <!--    LEFT ICON    -->
        <circle-button-generator
          class="ml-3"
          @click="buttonIconsTrigger(-1)"
        >
          <base-left-icon />
        </circle-button-generator>

        <!--   MAIN CONTENT     -->
        <div class="pr-4 pl-4 cursor-pointer">
          <div class="navigation-date-picker">
            <div
              class="output-content d-flex justify-content-center align-items-center"
            >
              <div class="d-flex align-items-center justify-content-center">
                <!--       VIEW BY DAY         -->
                <template v-if="typeOfView === 'day'">
                  <span class="d-flex output-content-text">
                    <span class="d-block">{{ dayFormat.day }}</span>
                    <span class="d-block mr-2 ml-2">{{ dayFormat.month }}</span>
                    <span class="d-block">{{ dayFormat.year }}</span>
                  </span>
                  <span class="d-block ml-2">
                    <base-down-icon />
                  </span>
                </template>
                <template v-else>
                  <span class="d-flex output-content-text">
                    <span class="d-block mr-2">{{ dayFormat.month }}</span>
                    <span class="d-block">{{ dayFormat.year }}</span>
                  </span>
                </template>
              </div>
            </div>
            <date-picker
              v-model="navigationDate"
              :type="datePickerType"
            />
          </div>
        </div>

        <!--   RIGHT ICON     -->
        <circle-button-generator
          class="mr-3"
          @click="buttonIconsTrigger(1)"
        >
          <base-right-icon />
        </circle-button-generator>

        <!--    RIGHT DOUBLE ICON    -->
        <circle-button-generator @click="buttonDoubleIconsTrigger(1)">
          <base-right-double-icon />
        </circle-button-generator>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navigation-content {
  display: flex;
  //position: absolute;
  //left: 50%;
  //transform: translateX(-50%);
}

::v-deep .navigation-date-picker {
  position: relative;
  width: 100%;

  .mx-icon-calendar,
  .mx-icon-clear,
  .mx-input {
    visibility: hidden;
  }

  .output-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    &-text {
      font-family: CraftworkSans, serif;
      color: var(--gray-600);
      font-size: 1.5rem;
      white-space: nowrap;
    }
  }
}
</style>
