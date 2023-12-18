<script>
import {keys} from "@/util/object";
import {formatToPrice} from "@/util/reusable";
import {computed, getCurrentInstance} from "vue";

import {XIcon} from "@/components/ui-components/material-icons";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import {XCircularBackground} from "@/components/ui-components/circular-background";

export default {
  name: 'ObjectPayments',
  components: {
    XIcon,
    BaseLoading,
    XCircularBackground,
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    busy: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const vm = getCurrentInstance().proxy

    const items = computed(() => {
      const objKeys = keys(props.data)
      let list = []
      if (objKeys.length) {
        objKeys.forEach(key => {
          list.push({
            name: key,
            ...props.data[key]
          })
        })
      }

      return list
    })

    function formatter(x) {
      return formatToPrice(x, 2) + " " + vm.$t('ye')
    }

    const tableFields = computed(() => [
      {
        key: "name",
        label: vm.$t('objects.title'),
      },
      {
        key: "paid",
        label: vm.$t('statistics.object_payments.paid'),
        formatter
      },
      {
        key: "unpaid",
        label: vm.$t('statistics.object_payments.unpaid'),
        formatter
      },
      {
        key: "not_sold",
        label: vm.$t('statistics.object_payments.not_sold'),
        formatter
      }
    ])

    return {
      items,
      tableFields
    }
  }
}
</script>

<template>
  <div>
    <h3 class="gray-600 font-craftworksans">{{ $t('common.object_report') }}</h3>
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
        <base-loading/>
      </template>

      <template #empty="scope">
        <span class="d-flex justify-content-center align-items-center">
          {{ scope["emptyText"] }}
        </span>
      </template>
    </b-table>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";
</style>
