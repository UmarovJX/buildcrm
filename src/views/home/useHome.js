import { ref } from 'vue'
import { v3ServiceApi as api } from '@/services/v3/v3.service'

export default function useHome() {
  const objectsIncome = ref({
    result: {},
    busy: false,
  })

  const objectPayments = ref({
    result: {},
    busy: false,
  })

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
    objectsIncome,
    fetchObjectsIncomeByPeriod,

    objectPayments,
    fetchObjectPayments,
  }
}
