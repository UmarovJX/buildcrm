<script>
import { computed, getCurrentInstance } from 'vue'

import BaseLoading from '@/components/Reusable/BaseLoading.vue'
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'

export default {
  name: 'GroupTable',
  components: {
    XIcon,
    BaseLoading,
    XCircularBackground,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    busy: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'delete'],
  setup() {
    const vm = getCurrentInstance().proxy
    const tableFields = computed(() => [
      {
        key: 'id',
        label: 'ID',
      },
      {
        key: 'name',
        label: vm.$t('name'),
        formatter: name => name[vm.$i18n.locale],
      },
      {
        key: 'key',
        label: vm.$t('common.key'),
      },
      {
        key: 'actions',
      },
    ])

    return {
      tableFields,
    }
  },
}
</script>

<template>
  <b-table
    id="my-table"
    ref="apartment-list-table"
    thead-tr-class="row__head__bottom-border"
    tbody-tr-class="row__body__bottom-border"
    class="table__list"
    sticky-header
    borderless
    show-empty
    responsive
    sort-icon-left
    :items="items"
    :fields="tableFields"
    :busy="busy"
    :empty-text="$t('no_data')"
  >
    <template #table-busy>
      <base-loading />
    </template>

    <template #empty="scope">
      <span class="d-flex justify-content-center align-items-center">
        {{ scope["emptyText"] }}
      </span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="float-right d-flex x-gap-1 cursor-pointer">
        <x-circular-background
          class="bg-violet-600"
          @click="$emit('edit',item)"
        >
          <x-icon
            name="draw"
            class="color-white"
          />
        </x-circular-background>

        <x-circular-background
          class="bg-red-600"
          @click="$emit('delete',item)"
        >
          <x-icon
            name="delete"
            class="color-white"
          />
        </x-circular-background>
      </div>
    </template>
  </b-table>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";
</style>
