<template>
  <main>
    <div class="app-content">
      <base-bread-crumb
          :active-content="activeContent"
          class="mb-4"
      >
      </base-bread-crumb>

      <div class="row">
        <div class="col-md-5">
          <form action="" class="my-form float-left w-100">
            <div class="mb-3 searching">
              <input
                class="my-form__input"
                type="text"
                v-model="search"
                @input="SearchInput"
                :placeholder="$t('clients.search')"
              />
              <button class="rounded bg-white">
                <i class="far fa-search"></i>
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
                @change="ChangeDate"
                format="YYYY-MM-DD"
                placeholder="Select date range"
                class="w-100"
              ></date-picker>
            </div>
            <div
            class="my-3 my-md-0"
              :class="
                date.length > 0 ||
                orderBy === 'expired' ||
                orderBy === 'friends'
                  ? 'col-md-5'
                  : 'col-md-6'
              "
            >
              <select
                class="form-control"
                v-model="orderBy"
                aria-label="Default select example"
              >
                <option selected value="all">{{ $t('apartments.tab_names.all') }}</option>
                <option value="expired">{{ $t('debtors.overdue') }}</option>
                <option value="friends">{{ $t('debtors.familiars') }}</option>
              </select>
            </div>
            <div
              class="col-md-1"
              v-if="
                date.length > 0 ||
                orderBy === 'expired' ||
                orderBy === 'friends'
              "
            >
              <button
                @click="[(date = []), (orderBy = 'all')]"
                class="btn btn-primary btn-block mt-0"
              >
                <i class="far fa-redo"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <b-table
        sticky-header
        borderless
        responsive
        :items="getDebtors"
        :fields="fields"
        :busy="getLoading"
        show-empty
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        sort-icon-left
        class="custom-table"
        :tbody-tr-class="rowClass"
        :empty-text="$t('no_data')"
      >
        <template #empty="scope" class="text-center">
          <span class="d-flex justify-content-center align-items-center">{{
            scope.emptyText
          }}</span>
        </template>

        <template #table-busy>
          <div class="d-flex justify-content-center w-100">
            <div class="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
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
            <div class="dropdown my-dropdown dropleft">
              <button
                type="button"
                class="dropdown-toggle"
                data-toggle="dropdown"
              >
                <i class="far fa-ellipsis-h"></i>
              </button>

              <div class="dropdown-menu">
                <router-link
                  :to="{
                    name: 'contracts-view',
                    params: {id: data.item.order.id},
                  }"
                  :class="'dropdown-item dropdown-item--inside'"
                >
                  <i class="far fa-eye"></i>
                  {{ $t("apartments.list.more") }}
                </router-link>
              </div>
            </div>
          </div>
        </template>
      </b-table>

      <paginate
        :pageCount="getPagination"
        :clickHandler="PageCallBack"
        :prevText="`<i class='fa fa-chevron-left'></i>`"
        :nextText="`<i class='fa fa-chevron-right'></i>`"
        :container-class="'pagination'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :next-class="'page-item'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
      >
      </paginate>
    </div>
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
// import ViewClient from '../Apartment/ViewClient';
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  components: {
    DatePicker,
    BaseBreadCrumb
    // 'view-client': ViewClient
  },

  watch: {
    orderBy: function (newVal) {
      if (newVal !== "all") {
        this.fetchDebtorsFilter(this);
      } else {
        if (this.search.length > 0 || this.date.length > 0) {
          this.fetchDebtorsFilter(this);
        } else {
          this.fetchDebtors(this);
        }
      }
    },
  },

  data() {
    return {
      orderBy: "all",
      page: 1,

      date: [],

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },

      search: "",

      sortBy: "order",
      sortDesc: false,
      fields: [
        {
          key: "order",
          label: this.$t('debtors.contract_number'),
          sortable: true,
        },
        {
          key: "client",
          label: this.$t('debtors.client_name'),
          sortable: true,
        },
        {
          key: "client.phone",
          label: this.$t('debtors.client_number'),
        },
        {
          key: "order.friends",
          label: this.$t('debtors.client_type'),
          sortable: true,
          formatter: (value) => this.getTypeClient(value),
        },
        {
          key: "amount",
          label: this.$t('contracts.view.sum'),
          sortable: true,
        },
        {
          key: "date_payment",
          label: this.$t('clients.date'),
          sortable: true,
        },
        {
          key: "actions",
          label: "",
        },
      ],
    };
  },

  computed: {
    ...mapGetters([
      "getMe",
      "getPermission",
      "getLoading",
      "getDebtors",
      "getPaginationDebtors",
    ]),
    getPagination() {
      if (this.getPaginationDebtors.total) {
        return this.getPaginationDebtors.total;
      }
      return 1;
    },
    activeContent() {
      return this.$t('debtors.title')
    },
  },

  created() {
    this.fetchDebtors(this);
  },

  methods: {
    ...mapActions(["fetchDebtors", "fetchDebtorsFilter"]),
    rowClass(item, type) {
      if (item && type === "row") {
        if (item.order.friends === true) {
          return "table-warning";
        } else {
          return "";
        }
      } else {
        return null;
      }
    },

    getTypeClient(type) {
      if (type) {
        return "Знакомый";
      }

      return "Клиент";
    },

    PageCallBack(pageNum) {
      this.page = pageNum;

      if (this.search.length > 0 || this.date.length > 0) {
        this.fetchDebtorsFilter(this);
      } else {
        this.fetchDebtors(this);
      }
    },

    ChangeDate() {
      if (this.date.length > 0) {
        this.fetchDebtorsFilter(this);

      } else {
        this.fetchDebtors(this);
      }
    },

    SearchInput(event) {
      this.page = 1;
      this.search = event.target.value;

      if (this.search.length > 0) {
        this.fetchDebtorsFilter(this);
      } else {
        this.fetchDebtors(this);
      }
    },
  },

  filters: {
    getTypeClient(type) {
      if (type) {
        return "Знакомый";
      }

      return "Клиент";
    },
  },
};
</script>

