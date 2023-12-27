<script>
import { BOverlay } from 'bootstrap-vue'
import { mapActions, mapGetters } from 'vuex'
// import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import BaseBreadCrumb from '@/components/BaseBreadCrumb'
import api from '@/services/api'
import SideBarFilter from './SideBarFilter.vue'
import XDropdown from "@/components/ui-components/dropdown/XDropdown.vue";

export default {
  name: 'Contracts',
  components: {
    XDropdown,
    // BaseFilterTabsContent,
    BaseBreadCrumb,
    SideBarFilter,
    BOverlay,
  },

  data() {
    return {
      fields: [
        {
          key: 'contract_number',
          label: '№',
          sortable: true,
        },
        {
          key: 'client',
          label: this.$t('contracts.client_name'),
          // sortable: true,
        },
        {
          key: 'client.phone',
          label: this.$t('contracts.client_phone'),
          formatter: value => `+${value}`,
        },
        {
          key: 'price',
          label: this.$t('contracts.price'),
          sortable: true,
        },
        {
          key: 'object.name',
          label: this.$t('contracts.object'),
        },
        {
          key: 'status',
          label: this.$t('apartments.list.status'),
          // sortable: true,
          formatter: value => this.getStatusOrder(value),
        },
        {
          key: 'date',
          label: this.$t('clients.date'),
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
        },
      ],
      filter: {},
      sortBy: '',
      sortDesc: false,
      page: 1,
      currentPage: 1,
      loading: false,
    }
  },
  created() {
    this.filter = {
      ...this.$route.query,
    }
    this.currentPage = Number(this.filter.page)
  },
  computed: {
    ...mapGetters(['getContracts', 'getLoading', 'getPaginationContracts']),
    filterTabList() {
      return [
        {
          name: this.$t('filter_names.all'),
          status: 'all',
        },
        {
          name: this.$t('filter_names.booked'),
          status: 'booked',
        },
        {
          name: this.$t('filter_names.sold'),
          status: 'sold',
        },
        {
          name: this.$t('filter_names.in_payment'),
          status: 'in_payment',
        },
        {
          name: this.$t('filter_names.archive'),
          status: 'archive',
        },
      ]
    },
    getPagination() {
      if (this.getPaginationContracts.total) {
        return this.getPaginationContracts.total
      }
      return 1
    },
    activeContent() {
      return this.$t('contracts.title')
    },
  },
  mounted() {
    this.fetchContracts(this)
  },

  methods: {
    ...mapActions(['fetchContracts']),
    getFilterTabsContent(status) {
      console.log(status)
    },
    downloadContractLink(id) {
      api.contract
        .downloadContract(id)
        .then(() => {
          window.open(`${process.env.VUE_APP_URL}/orders/${id}/contract`)
        })
        .catch(() => '#')
    },
    sortingChanged(val) {
      this.filter.sort_by = val.sortBy
      this.filter.order_by = val.sortDesc ? 'desc' : 'asc'
      this.filter.page = 1
      this.currentPage = this.filter.page

      this.$router.push({
        name: 'contracts',
        query: this.filter,
      })
      setTimeout(() => {
        this.fetchContracts(this)
      }, 1000)
    },
    async contractsFiltered(event) {
      this.filter = event
      const filter = {}
      if (this.filter.object_id.length > 0) {
        filter.object_id = this.filter.object_id
      }
      if (this.filter.apartment_number.length > 0) {
        filter.apartment_number = this.filter.apartment_number
      }
      if (this.filter.date.length > 0) {
        filter.date = this.filter.date
      }
      // if (this.filter.status.length > 0) {
      //   filter.status = this.filter.status;
      // }

      if (this.filter.contract_number !== '') {
        filter.contract_number = this.filter.contract_number
      }
      if (this.filter.phone !== '') {
        filter.phone = this.filter.phone
      }
      if (this.filter.full_name !== '') {
        filter.full_name = this.filter.full_name
      }
      this.filter.page = 1
      this.currentPage = this.filter.page
      filter.page = this.filter.page
      this.$router.push({
        name: 'contracts',
        query: filter,
      })
      const vm = this
      setTimeout(() => {
        this.fetchContracts(vm)
      }, 1000)
      // await this.fetchContracts(this);
    },
    rowClass(item, type) {
      if (item && type === 'row') {
        if (item.status === 'contract') {
          return 'table-info'
        }
        if (item.status === 'sold') {
          return 'table-success'
        }
      } else {
        return null
      }
    },
    async PageCallBack(pageNum) {
      this.page = pageNum
      this.filter.page = Number(this.page)
      this.currentPage = this.filter.page
      this.$router.push({
        name: 'contracts',
        query: this.filter,
      })
      await this.fetchContracts(this)
    },
    getStatusOrder(status) {
      let msg
      switch (status) {
        case 'sold':
          msg = 'Продано'
          break
        case 'booked':
          msg = ''
          break
        case 'contract':
          msg = 'Оформлен контракт '
          break
      }

      return msg
    },
  },

  filters: {
    getStatus(status, buy, book) {
      let msg

      switch (status) {
        case 'sold':
          msg = buy
          break
        case 'booked':
          msg = `Забронировал до ${book}`
          break
        case 'contract':
          msg = buy
          break
        default:
          msg = 'отказался купить или другое'
          break
      }

      return msg
    },

    getStatusOrder(status) {
      let msg
      switch (status) {
        case 'sold':
          msg = 'Продано'
          break
        case 'booked':
          msg = ''
          break
        case 'contract':
          msg = 'Оформлен контракт '
          break
      }

      return msg
    },
  },
}
</script>

<template>
  <div>
    <base-bread-crumb :active-content="activeContent">
      <template #extra-content>
        <button
          v-b-toggle.contracts-list-filter
          class="btn btn-primary mt-0 mr-0 ml-auto"
        >
          <i class="far fa-sliders-h mr-2" />
          {{ $t("apartments.list.filter") }}
        </button>
      </template>
    </base-bread-crumb>

    <router-link :to="{ name: 'contracts-clone' }">
      Contracts Clone
    </router-link>

    <SideBarFilter
      :filtered="filter"
      @contractsFiltered="contractsFiltered"
    />

    <!--    <base-filter-tabs-content-->
    <!--        :filter-tab-list="filterTabList"-->
    <!--        @get-new-content="getFilterTabsContent"-->
    <!--    />-->

    <div class="app-content">
      <b-table
        id="contracts-table"
        ref="contracts-table"
        v-model:sort-by="sortBy"
        v-model:sort-desc="sortDesc"
        class="custom-table"
        sticky-header
        borderless
        responsive
        show-empty
        sort-icon-left
        :items="getContracts"
        :fields="fields"
        :tbody-tr-class="rowClass"
        :empty-text="$t('no_data')"
        @sort-changed="sortingChanged"
      >
        <template
          #empty="scope"
          class="text-center"
        >
          <span class="d-flex justify-content-center align-items-center">
            {{ scope.emptyText }}</span>
        </template>

        <template #table-busy>
          <div class="d-flex justify-content-center w-100">
            <div class="lds-ellipsis">
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </template>

        <template #cell(contract_number)="data">
          {{ data.item.contract }}
        </template>

        <template #cell(status)="data">
          {{ data.value }}
        </template>

        <template #cell(client)="data">
          {{
            data.value.first_name.kirill
              ? data.value.first_name.kirill
              : data.value.first_name.lotin
          }}
          {{
            data.value.last_name.kirill
              ? data.value.last_name.kirill
              : data.value.last_name.lotin
          }}
          {{
            data.value.second_name && data.value.second_name.kirill
              ? data.value.second_name.kirill
              : ""
          }}
        </template>

        <template #cell(price)="data">
          {{
            data.item.status === "booked"
              ? 0
              : data.item.transaction_price
              | number("0,0.00", {
                thousandsSeparator: " ",
                decimalSeparator: ",",
              })
          }}
          {{ $t("ye") }}
        </template>

        <template #cell(date)="data">
          <span v-if="data.item.status === 'cancelled'">
            {{ data.item.status | getStatus("", "") }}
          </span>
          <span v-else>{{
            data.item.status
              | getStatus(
                $moment(data.item.contract_date).format("DD.MM.YYYY"),
                $moment(data.item.booking_date).format("DD.MM.YYYY")
              )
          }}</span>
        </template>

        <template #cell(actions)="data">
          <div class="float-right">
            <x-dropdown>
              <a
                  v-if="
                    data.item.status === 'contract' ||
                      data.item.status === 'sold'
                  "
                  class="dropdown-item dropdown-item--inside"
                  href="#"
                  @click="downloadContractLink(data.item.id)"
              >
                <i class="fa fa-download" />
                {{ $t("contracts.download") }}
              </a>

              <!--                    :href="downloadContractLink(data.item.id)"-->
              <!--                    target="_blank"-->
              <!--                    download-->

              <router-link
                  :to="{ name: 'contracts-view', params: { id: data.item.id } }"
                  :class="'dropdown-item dropdown-item--inside'"
              >
                <i class="far fa-eye" />
                {{ $t("apartments.list.more") }}
              </router-link>
            </x-dropdown>
          </div>
        </template>

        <b-overlay
          :show="getLoading"
          no-wrap
          opacity="0.5"
        >
          <template #overlay>
            <div class="d-flex justify-content-center w-100">
              <div class="lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
              </div>
            </div>
          </template>
        </b-overlay>
      </b-table>

      <paginate
        v-if="getPagination"
        v-model="currentPage"
        :page-count="getPagination"
        :click-handler="PageCallBack"
        :prev-text="`<i class='fa fa-chevron-left'></i>`"
        :next-text="`<i class='fa fa-chevron-right'></i>`"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :next-class="'page-item'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
      />
    </div>

    <b-overlay
      :show="getLoading"
      no-wrap
      opacity="0.5"
      style="z-index: 2222"
    >
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<style>
.my-table-fixed thead {
  position: sticky !important;
  top: 0;
}
</style>
