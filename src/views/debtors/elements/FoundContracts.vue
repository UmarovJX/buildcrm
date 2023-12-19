<script>
import BasePagination from '@/components/Reusable/Navigation/BasePagination.vue'

export default {
  name: 'FoundContracts',
  components: {
    BasePagination,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      foundFields: [
        {
          key: 'key',
          label: 'debtors.contract_system',
          thClass: 'theadKey',
          tdClass: 'tbodyKey',
        },
        {
          key: 'value',
          label: 'debtors.alias_system',
          thClass: 'theadValue',
          tdClass: 'tbodyValue',
        },
      ],
      pagination: {
        current: 1,
        perPage: 10,
      },
    }
  },
  computed: {
    tableDetails() {
      const { current, perPage } = this.pagination

      if (this.items.length) {
        return {
          perPage,
          current,
          count: Math.ceil(this.items.length / perPage),
          items: this.items.slice((current - 1) * perPage, current * perPage),
        }
      }

      return {
        perPage: 0,
        current: 0,
        count: 0,
        items: [],
      }
    },
  },
  methods: {
    paginateFoundItems(page) {
      this.pagination.current = page
    },
    changePerPage(perPage) {
      this.pagination.current = 1
      this.pagination.perPage = perPage
    },
  },
}
</script>

<template>
  <div>
    <b-table
      :fields="foundFields"
      :items="tableDetails.items"
      class="fixed-table"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border"
      borderless
      fixed
    >
      <template #empty>
        <span v-if="!items.length">
          {{ $t("no_data") }}
        </span>
      </template>

      <template #head()="data">
        <span>{{ $t(`${data.label}`) }}</span>
      </template>

      <template #cell(key)="data">
        <span>
          {{ data.item.key }}
        </span>
      </template>

      <template #cell(value)="data">
        <span>
          {{ data.item.value.alias || $t("no") }}
        </span>
      </template>
    </b-table>
    <base-pagination
      :pagination-count="tableDetails.count"
      :pagination-current="tableDetails.current"
      @change-page="paginateFoundItems"
      @change-view="changePerPage"
    />
  </div>
</template>

<style lang="scss" scoped></style>
