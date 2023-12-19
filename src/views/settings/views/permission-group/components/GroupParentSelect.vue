<script>
import { computed, getCurrentInstance, ref } from 'vue'
import { v3ServiceApi } from '@/services/v3/v3.service'

import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'GroupParentSelect',
  components: {
    TreeSelect,
  },
  props: {
    modelValue: {
      type: [String, Number],
    },
  },
  emits: ['input'],
  setup(props, { emit }) {
    const vm = getCurrentInstance().proxy
    const groupParent = computed({
      get() {
        return props.modelValue
      },
      set(vParent) {
        emit('input', vParent)
      },
    })
    const groupOptions = ref([])

    async function fetchGroups() {
      const groupRsp = await v3ServiceApi.permission.group.index({
        page: 1,
        limit: 200,
      })
      groupOptions.value = groupRsp.data.result
    }

    function normalizer(node) {
      return {
        id: node.id,
        label: node.name[vm.$i18n.locale],
        children: node.children,
      }
    }

    fetchGroups()

    return {
      groupOptions,
      groupParent,
      normalizer,
    }
  },
}
</script>

<template>
  <tree-select
    v-model="groupParent"
    search-nested
    :options="groupOptions"
    :placeholder="$t('common.select_parent')"
    :normalizer="normalizer"
  />
</template>
