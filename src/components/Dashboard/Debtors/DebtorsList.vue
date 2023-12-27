<script>
import { mapActions, mapGetters } from 'vuex'
// import ViewClient from '../Apartment/ViewClient';
import BaseBreadCrumb from '@/components/BaseBreadCrumb'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import XDropdown from "@/components/ui-components/dropdown/XDropdown.vue";

export default {
  components: {
    XDropdown,
    DatePicker,
    BaseBreadCrumb,
    // 'view-status': ViewClient
  },

  data() {
    return {
      orderBy: 'all',
      page: 1,

      date: [],

      header: {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      },

      search: '',

      sortBy: 'order',
      sortDesc: false,
      fields: [
        {
          key: 'order',
          label: this.$t('debtors.contract_number'),
          sortable: true,
        },
        {
          key: 'client',
          label: this.$t('debtors.client_name'),
          sortable: true,
        },
        {
          key: 'client.phone',
          label: this.$t('debtors.client_number'),
        },
        {
          key: 'order.friends',
          label: this.$t('debtors.client_type'),
          sortable: true,
          formatter: value => this.getTypeClient(value),
        },
        {
          key: 'amount',
          label: this.$t('contracts.view.sum'),
          sortable: true,
        },
        {
          key: 'date_payment',
          label: this.$t('clients.date'),
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
        },
      ],
    }
  },

  watch: {
    orderBy(newVal) {
      if (newVal !== 'all') {
        this.fetchDebtorsFilter(this)
      } else if (this.search.length > 0 || this.date.length > 0) {
        this.fetchDebtorsFilter(this)
      } else {
        this.fetchDebtors(this)
      }
    },
  },

  computed: {
    ...mapGetters([
      'getMe',
      'getPermission',
      'getLoading',
      'getDebtors',
      'getPaginationDebtors',
    ]),
    getPagination() {
      if (this.getPaginationDebtors.total) {
        return this.getPaginationDebtors.total
      }
      return 1
    },
    activeContent() {
      return this.$t('debtors.title')
    },
  },

  created() {
    this.fetchDebtors(this)
  },

  methods: {
    ...mapActions(['fetchDebtors', 'fetchDebtorsFilter']),
    rowClass(item, type) {
      if (item && type === 'row') {
        if (item.order.friends === true) {
          return 'table-warning'
        }
        return ''
      }
      return null
    },

    getTypeClient(type) {
      if (type) {
        return 'Знакомый'
      }

      return 'Клиент'
    },

    PageCallBack(pageNum) {
      this.page = pageNum

      if (this.search.length > 0 || this.date.length > 0) {
        this.fetchDebtorsFilter(this)
      } else {
        this.fetchDebtors(this)
      }
    },

    ChangeDate() {
      if (this.date.length > 0) {
        this.fetchDebtorsFilter(this)
      } else {
        this.fetchDebtors(this)
      }
    },

    SearchInput(event) {
      this.page = 1
      this.search = event.target.value

      if (this.search.length > 0) {
        this.fetchDebtorsFilter(this)
      } else {
        this.fetchDebtors(this)
      }
    },
  },

  filters: {
    getTypeClient(type) {
      if (type) {
        return 'Знакомый'
      }

      return 'Клиент'
    },
  },
}
</script>

<template>
  <div>
    <base-bread-crumb
      :active-content="activeContent"
      class="mb-4"
    />

    <div class="row">
      <div class="col-md-5">
        <form
          action=""
          class="my-form float-left w-100"
        >
          <div class="mb-3 searching">
            <input
              v-model="search"
              class="my-form__input"
              type="text"
              :placeholder="$t('clients.search')"
              @input="SearchInput"
            >
            <button class="rounded bg-white">
              <i class="far fa-search" />
            </button>
          </div>
        </form>
      </div>
      <div class="col-md-7">
        <div class="row">
          <div class="col-md-6">
            <date-picker
              v-model="date"
              type="date"
              range
              value-type="format"
              format="YYYY-MM-DD"
              placeholder="Select date range"
              class="w-100"
              @change="ChangeDate"
            />
          </div>
          <div
            class="my-3 my-md-0"
            :class="
              date.length > 0 || orderBy === 'expired' || orderBy === 'friends'
                ? 'col-md-5'
                : 'col-md-6'
            "
          >
            <select
              v-model="orderBy"
              class="form-control"
              aria-label="Default select example"
            >
              <option
                selected
                value="all"
              >
                {{ $t("apartments.tab_names.all") }}
              </option>
              <option value="expired">
                {{ $t("debtors.overdue") }}
              </option>
              <option value="friends">
                {{ $t("debtors.familiars") }}
              </option>
            </select>
          </div>
          <div
            v-if="
              date.length > 0 || orderBy === 'expired' || orderBy === 'friends'
            "
            class="col-md-1"
          >
            <button
              class="btn btn-primary btn-block mt-0"
              @click="[(date = []), (orderBy = 'all')]"
            >
              <i class="far fa-redo" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <b-table
      v-model:sort-by="sortBy"
      v-model:sort-desc="sortDesc"
      responsive
      :items="getDebtors"
      :fields="fields"
      :busy="getLoading"
      show-empty
      sort-icon-left
      class="custom-table"
      :tbody-tr-class="rowClass"
      :empty-text="$t('no_data')"
    >
      <template
        #empty="scope"
        class="text-center"
      >
        <span class="d-flex justify-content-center align-items-center">{{
          scope.emptyText
        }}</span>
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

      <template #cell(order)="data">
        {{ data.value.contract }}
      </template>

      <template #cell(client)="data">
        {{ data.value.first_name }} {{ data.value.last_name }}
        {{ data.value.second_name }}
      </template>

      <template #cell(amount)="data">
        {{
          data.value
            | number("0,0.00", {
              thousandsSeparator: " ",
              decimalSeparator: ",",
            })
        }}
        {{ $t("ye") }}
      </template>

      <template #cell(date_payment)="data">
        {{ data.value | moment("YYYY.MM.DD") }}
      </template>

      <template #cell(actions)="data">
        <div class="float-right">
          <x-dropdown>
            <router-link
                :to="{
                  name: 'contracts-view',
                  params: { id: data.item.order.id },
                }"
                :class="'dropdown-item dropdown-item--inside'"
            >
              <i class="far fa-eye" />
              {{ $t("apartments.list.more") }}
            </router-link>
          </x-dropdown>
        </div>
      </template>
    </b-table>

    <paginate
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
</template>
