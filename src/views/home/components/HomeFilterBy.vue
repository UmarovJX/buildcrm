<script>
import {
  computed, getCurrentInstance, onMounted, ref, watch,
} from 'vue'
import useObject from '@/composables/xonsaroy/useObject'

import { XFormSelect } from '@/components/ui-components/form-select'
import BaseDatePicker from '@/components/Reusable/BaseDatePicker.vue'

export default {
  name: 'HomeFilterBy',
  components: {
    XFormSelect,
    BaseDatePicker,
  },
  emits: ['filter-by'],
  setup(props, { emit }) {
    const vm = getCurrentInstance().proxy
    const { objects, fetchObjects } = useObject()
    const filter = ref({
      payment_type: null,
      date_from: null,
      date_to: null,
      object_id: null,
    })

    const paymentOptions = computed(() => [
      {
        text: vm.$t('initial_payment'),
        value: 'initial',
      },
      {
        text: vm.$t('monthly_pay'),
        value: 'monthly',
      },
    ])

    watch(() => filter.value, () => {
      emit('filter-by', filter.value)
    }, {
      deep: true,
    })

    onMounted(() => {
      fetchObjects()
    })

    return {
      filter,
      objects,
      paymentOptions,
    }
  },
}
</script>

<template>
  <section class="home__filter__by d-flex justify-content-end flex-wrap">
    <x-form-select
      v-model="filter.object_id"
      :multiple="true"
      value-field="id"
      text-field="name"
      :options="objects.list"
      :placeholder="$t('contracts.object_name')"
    />
    <div class="filter__date__wrapper">
      <base-date-picker
        v-model="filter.date_from"
        class="filter__date__picker filter__start__date"
        :range="false"
        :label="true"
        :placeholder="`${ $t('from_the_date_of') }`"
      />
      <base-date-picker
        v-model="filter.date_to"
        class="filter__date__picker filter__end__date"
        :range="false"
        :label="true"
        :placeholder="`${ $t('to_the_date_of') }`"
      />
    </div>
    <x-form-select
      v-model="filter.payment_type"
      :placeholder="$t('payment_type')"
      :options="paymentOptions"
    />
  </section>
</template>

<style lang="scss" scoped>
.home__filter__by{
  margin-bottom: 2rem;
  gap: 1rem;
}

.filter__date__wrapper {
  display: flex;
  width: 26rem;

  .filter__start__date {
    ::v-deep .mx-input-wrapper {
      .mx-input {
        border-right: 2px solid var(--gray-300);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  .filter__end__date{
    ::v-deep .mx-input-wrapper {
      .mx-input {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
