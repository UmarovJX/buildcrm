<script>
import api from '@/services/api'
import BasePagination from '@/components/Reusable/Navigation/BasePagination.vue'

export default {
  name: 'NotFoundContracts',
  components: {
    BasePagination,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update-option'],
  data() {
    return {
      openListId: null,
      notFoundFields: [
        {
          key: 'key',
          label: 'debtors.contract_file',
          thClass: 'theadKey',
          tdClass: 'tbodyKey',
        },
        // {
        //   key: "value",
        //   label: "debtors.contract_system",
        //   thClass: "theadValue",
        //   tdClass: "tbodyValue",
        // },
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
    async searchContract(item, search) {
      if (this.timeout) clearTimeout(this.timeout)

      this.timeout = setTimeout(async () => {
        try {
          const response = await api.debtorsV2.searchContract({
            contract: search,
          })

          this.openListId = item.key

          const options = response.data.map(r => ({
            alias: r.alias || null,
            contract: r.contract_number || null,
            uuid: r.uuid || null,
          }))

          this.$emit('update-option', {
            item,
            options,
          })
        } catch (e) {
          this.toastedWithErrorCode(e)
        }
      }, 350)
    },
    async selectOptionSystem(index, option) {
      this.$emit('update-alias', {
        index,
        option,
      })
    },
  },
}
</script>

<template>
  <div>
    <b-table
      :fields="notFoundFields"
      :items="tableDetails.items"
      class="fixed-table"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border"
      borderless
      fixed
    >
      <template #head()="data">
        <span>{{ $t(`${data.label}`) }}</span>
      </template>

      <template #cell(key)="data">
        <span>
          {{ data.item.key }}
        </span>
      </template>

      <template #cell(value)="data">
        <ValidationProvider
          rules="required"
          :name="`${$t('contracts.name')}`"
          class="cell position-relative"
        >
          <v-select
            v-model="data.item.value.alias"
            :options="data.item.option"
            :filterable="false"
            label="contract"
            @open="openListId = data.item.key"
            @search="searchContract(data.item, $event)"
            @input="selectOptionSystem(data.item.index, $event)"
          />
        </ValidationProvider>
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
