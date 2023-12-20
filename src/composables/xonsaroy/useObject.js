import { ref } from 'vue'
import api from '@/services/api'
import { useToastError } from '@/composables/useToastError'

export default function useObject() {
  const objects = ref({
    busy: false,
    list: [],
  })
  const { toastError } = useToastError()

  async function fetchObjects() {
    try {
      objects.busy = true
      const { data: { result } } = await api.objectsV3.getObjects()
      objects.value.list = result
    } catch (e) {
      toastError(e)
    } finally {
      objects.busy = false
    }
  }

  return {
    objects,
    fetchObjects,
  }
}
