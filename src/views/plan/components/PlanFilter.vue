<script>
import {computed, getCurrentInstance, ref, watch} from "vue";
import {isUndefinedOrNull} from "@/util/inspect";
import {addZero, dateProperties, monthsNameList} from "@/util/date/calendar.util";

import {XFormSelect} from "@/components/ui-components/form-select";

export default {
  components: {
    XFormSelect
  },
  props: {
    paramsList: {
      type: Array,
      default: () => []
    },
    planTypes: {
      type: Array,
      default: () => []
    }
  },
  emits: ['filter'],
  setup(props, {emit}) {
    const vm = getCurrentInstance().proxy
    const filter = ref({
      year: null,
      month: null,
      plan_type: null,
    })

    const yearOptions = computed(() => {
      return props.paramsList.map(p => ({text: p.name, value: p.name}))
    })

    const monthOptions = computed(() => {
      if (filter.value.year) {
        return props.paramsList
            .find(p => p.name.toString() === filter.value.year.toString())
            .result.map(monthObj => {
              return {
                value: monthObj.value,
                text: vm.$t(`common.month.${monthsNameList[monthObj.value]}`)
              }
            })
      }
      return []
    })

    const planOptions = computed(() => {
      return props.planTypes.map((plan) => {
        return {
          value: plan.value,
          text: plan.text[vm.$i18n.locale],
        }
      })
    })

    watch(() => filter.value.year, (year) => {
      if (
          isUndefinedOrNull(year) &&
          !isUndefinedOrNull(filter.value.month)
      ) {
        filter.value.month = null
      }
    })

    watch([
      () => filter.value.month,
      () => filter.value.plan_type
    ], ([month, type]) => {
      updateTable({
        type,
        month,
        year: filter.value.year
      })
    })

    function updateTable({type, month, year}) {
      const fCtx = {}
      if (
          !(isUndefinedOrNull(year) || isUndefinedOrNull(month))
      ) {
        const {
          year,
          month,
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
  }
}
</script>

<template>
  <div class="mb-4 plan__filter__form">
    <!--?  SELECT YEAR   -->
    <x-form-select
        :label="true"
        :options="yearOptions"
        :placeholder="$t('year')"
        v-model="filter.year"
    >
    </x-form-select>

    <!--?  SELECT MONTH   -->
    <x-form-select
        :label="true"
        :options="monthOptions"
        :placeholder="$t('month')"
        v-model="filter.month"
    >
    </x-form-select>

    <!--?  SELECT PLAN TYPE   -->
    <x-form-select
        :label="true"
        :options="planOptions"
        :placeholder="$t('plan_type')"
        v-model="filter.plan_type"
    >
    </x-form-select>
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
