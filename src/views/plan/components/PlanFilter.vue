<script>
import {
  computed, getCurrentInstance, ref, watch,
} from 'vue'
import { isUndefinedOrNull } from '@/util/inspect'
import { addZero, dateProperties, monthsNameList } from '@/util/date/calendar.util'

import { XFormSelect } from '@/components/ui-components/form-select'

export default {
  components: {
    XFormSelect,
  },
  props: {
    paramsList: {
      type: Array,
      default: () => [],
    },
    planTypes: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['filter'],
  setup(props, { emit }) {
    const vm = getCurrentInstance().proxy
    const filter = ref({
      year: null,
      month: null,
      plan_type: null,
    })

    const yearOptions = computed(() => props.paramsList.map(p => ({ text: p.name, value: p.name })))

    const monthOptions = computed(() => {
      if (filter.value.year) {
        return props.paramsList
          .find(p => p.name.toString() === filter.value.year.toString())
          .result.map(month => ({
            value: month,
            text: vm.$t(`common.month.${monthsNameList[month]}`),
          }))
      }
      return []
    })

    const planOptions = computed(() => props.planTypes.map(plan => ({
      value: plan.value,
      text: plan.text[vm.$i18n.locale],
    })))

    watch(() => filter.value.year, year => {
      if (
        isUndefinedOrNull(year)
          && !isUndefinedOrNull(filter.value.month)
      ) {
        filter.value.month = null
      }
    })

    watch([
      () => filter.value.month,
      () => filter.value.plan_type,
    ], ([month, type]) => {
      updateTable({
        type,
        month: month + 1,
        year: filter.value.year,
      })
    })

    function updateTable({ type, month, year }) {
      const fCtx = {}
      if (
        !(isUndefinedOrNull(year) || isUndefinedOrNull(month))
      ) {
        const {
          dayOfMonth,
          lastDateOfMonth,
        } = dateProperties(`${year}-${month}-1`)

        fCtx.date_from = `${year}-${addZero(month)}-${addZero(dayOfMonth)}`
        fCtx.date_to = `${year}-${addZero(month)}-${addZero(lastDateOfMonth)}`
      }

      if (!isUndefinedOrNull(type)) {
        fCtx.type = type
      }

      emit('filter', fCtx)
    }

    return {
      filter,
      yearOptions,
      monthOptions,
      planOptions,
    }
  },
}
</script>

<template>
  <div class="mb-4 plan__filter__form">
    <!--?  SELECT YEAR   -->
    <x-form-select
      v-model="filter.year"
      :label="true"
      :options="yearOptions"
      :placeholder="$t('year')"
    />

    <!--?  SELECT MONTH   -->
    <x-form-select
      v-model="filter.month"
      :label="true"
      :options="monthOptions"
      :placeholder="$t('month')"
    />

    <!--?  SELECT PLAN TYPE   -->
    <x-form-select
      v-model="filter.plan_type"
      :label="true"
      :options="planOptions"
      :placeholder="$t('plan_type')"
    />
  </div>
</template>

<style lang="scss" scoped>
.plan__filter__form {
  display: grid;
  gap: 1rem 2rem;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  max-width: 75rem;
}
</style>
