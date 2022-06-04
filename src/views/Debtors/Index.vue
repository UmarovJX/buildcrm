<template>
  <main class="app-content">
    <!--  FILTER CONTENT  -->
    <filter-content
        @change-view-type="changeViewType"
    />

    <!--  TABLE UI  -->
    <template v-if="showListOfDebtorsTable">
      <b-table
          :busy="appLoading"
          :items="items"
          :fields="fields"
          :empty-text="$t('no_data')"
          @row-clicked="clickRowAction"
          class="table__list"
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border cursor-pointer"
          show-empty
          borderless
          responsive
          sticky-header
          sort-icon-left
      >

        <!--  LOADING ANIMATION    -->
        <template #table-busy>
          <base-loading/>
        </template>

        <!--  SHOW EMPTY MESSAGE WHEN CONTENT NOT FOUND   -->
        <template class="text-center" #empty>
          <div class="d-flex justify-content-center align-items-center flex-column not__found">
            <p class="head">Должники не были найдены</p>
            <p>Попробуйте ввести другие данные для поиска</p>
          </div>
        </template>
      </b-table>

      <!-- PAGINATION   -->
      <base-pagination
          v-if="itemsExist"
          :pagination-count="pagination.total"
          :pagination-current="pagination.current"
      />
    </template>

    <!-- MONTHLY UI   -->

  </main>
</template>

<script>
// import BaseCalendarNavigation from "@/components/Reusable/Calendar/BaseCalendarNavigation";
import {debtorsV2} from "@/services/api";
import {formatDateWithDot, formatToPrice, phonePrettier} from "@/util/reusable";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BasePagination from "@/components/Reusable/Navigation/BasePagination";
import FilterContent from "@/components/Debtors/FilterContent";

export default {
  name: "Debtors",
  components: {
    // BaseCalendarNavigation,
    BaseLoading,
    BasePagination,
    FilterContent
  },
  data() {
    return {
      items: [],
      pagination: {
        total: 1,
        current: 1
      },
      typeOfView: 'list',
      appLoading: false
    }
  },
  computed: {
    fields() {
      return [
        {
          key: "order.contract",
          label: this.$t("contracts.table.contract"),
        },
        {
          key: "client",
          label: this.$t("contracts.table.client"),
          formatter: (client) => client.last_name.lotin + ' ' + client.first_name.lotin
        },
        {
          key: "client.phone",
          label: this.$t("contracts.table.phone_number"),
          formatter: (phone) => phonePrettier(phone)
        },
        {
          key: "amount",
          label: this.$t("contracts.table.cost"),
          formatter: (price) => formatToPrice(price) + ' ' + this.$t('ye')
        },
        /*{
          key: "object",
          label: this.$t("contracts.table.object"),
          formatter: (object) => object.name
        },*/
        {
          key: "date",
          label: this.$t("contracts.table.date"),
          formatter: (date) => formatDateWithDot(date)
        },
        /*{
          key: "actions",
          label: '',
        }*/
      ]
    },
    itemsExist() {
      return this.items.length > 0
    },
    showListOfDebtorsTable() {
      return this.typeOfView === 'list'
    }
  },
  created() {
    this.fetchItems()
  },
  methods: {
    async fetchItems() {
      this.appLoading = true
      await debtorsV2.fetchDebtorsList()
          .then((response) => {
            this.items = response.data.items
            this.pagination = response.data.pagination
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.appLoading = false
          })
    },
    clickRowAction() {

    },
    changeCurrentPage() {

    },
    changeCountOfView() {

    },
    changeViewType(type) {
      this.typeOfView = type
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/reusable/table-depend-on-design";
</style>