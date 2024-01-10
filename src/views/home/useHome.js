import { ref } from 'vue'
import { v3ServiceApi, v3ServiceApi as api } from '@/services/v3/v3.service'

export default function useHome() {
  const objectsIncome = ref({
    result: {},
    busy: false,
  })

  const objectPayments = ref({
    result: {},
    busy: false,
  })

  const initialPayments = ref({
    result: [],
    busy: false,
  })

  const salesMain = ref({
    result: [],
    busy: false,
  })

  const debtorMain = ref({
    result: [],
    busy: false,
  })

  async function fetchInitialPayments() {
    try {
      initialPayments.value.busy = true

      const initialRsp = await Promise.allSettled([
        v3ServiceApi.home.stat.initialPayments({ type: 'today' }),
        v3ServiceApi.home.stat.initialPayments({ type: 'this_week' }),
        v3ServiceApi.home.stat.initialPayments({ type: 'last_week' }),
        v3ServiceApi.home.stat.initialPayments({ type: 'this_month' }),
        v3ServiceApi.home.stat.initialPayments({ type: 'last_month' }),
      ])

      initialRsp.forEach(initialRaw => {
        if (initialRaw.status === 'fulfilled') {
          initialPayments.value.result.push(initialRaw.value.data)
        }
      })
    } finally {
      initialPayments.value.busy = false
    }
  }

  async function fetchSalesMain() {
    try {
      salesMain.value.busy = true

      const initialRsp = await Promise.allSettled([
        v3ServiceApi.home.stat.sales({ type: 'today' }),
        v3ServiceApi.home.stat.sales({ type: 'this_week' }),
        v3ServiceApi.home.stat.sales({ type: 'last_week' }),
        v3ServiceApi.home.stat.sales({ type: 'this_month' }),
        v3ServiceApi.home.stat.sales({ type: 'last_month' }),
      ])

      const types = [
        'today',
        'this_week',
        'last_week',
        'this_month',
        'last_month',
      ]

      initialRsp.forEach((initialRaw, index) => {
        if (initialRaw.status === 'fulfilled') {
          salesMain.value.result.push({
            ...initialRaw.value.data.result,
            type: types[index],
          })
        }
      })
    } finally {
      salesMain.value.busy = false
    }
  }

  async function fetchDebtorMain() {
    try {
      debtorMain.value.busy = true

      const initialRsp = await Promise.allSettled([
        v3ServiceApi.home.stat.debtors({ type: 'today' }),
        v3ServiceApi.home.stat.debtors({ type: 'this_week' }),
        v3ServiceApi.home.stat.debtors({ type: 'last_week' }),
        v3ServiceApi.home.stat.debtors({ type: 'this_month' }),
        v3ServiceApi.home.stat.debtors({ type: 'last_month' }),
      ])

      initialRsp.forEach(initialRaw => {
        if (initialRaw.status === 'fulfilled') {
          debtorMain.value.result.push(initialRaw.value.data.result)
        }
      })
    } finally {
      debtorMain.value.busy = false
    }
  }

  async function fetchObjectsIncomeByPeriod(b) {
    try {
      objectsIncome.value.busy = true
      const { data: { result } } = await api.stats.objectsByPeriod(b)
      objectsIncome.value.result = result
    } catch (e) {
      this.toastedWithErrorCode(e)
    } finally {
      objectsIncome.value.busy = false
    }
  }

  async function fetchObjectPayments(b) {
    try {
      objectPayments.value.busy = true
      const { data: { result } } = await api.stats.objectPayments(b)
      objectPayments.value.result = result
    } catch (e) {
      this.toastedWithErrorCode(e)
    } finally {
      objectPayments.value.busy = false
    }
  }

  return {
    initialPayments,
    fetchInitialPayments,

    salesMain,
    fetchSalesMain,

    debtorMain,
    fetchDebtorMain,

    objectsIncome,
    fetchObjectsIncomeByPeriod,

    objectPayments,
    fetchObjectPayments,
  }
}
