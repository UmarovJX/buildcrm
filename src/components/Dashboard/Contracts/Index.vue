<template>
  <main>
    <div class="my-container px-0 mx-0">
      <div class="d-flex justify-content-md-end justify-content-center mb-3">
        <div class="currency d-flex align-items-center">
          <!-- <div class="currency__price mr-3">
            1 USD = {{ getCurrency.usd }} UZS
          </div> -->
        </div>
      </div>

      <form action="" class="my-form">
        <div class="mb-3 searching">
          <input
            class="my-form__input"
            type="text"
            v-model="search"
            @input="SearchInput"
            :placeholder="$t('clients.search')"
          />
          <button><i class="far fa-search"></i></button>
        </div>
      </form>

      <div class="col-md-2 float-right">
        <div class="row">
          <select
            class="form-control"
            v-model="orderBy"
            aria-label="Default select example"
          >
            <option selected value="all">Все</option>
            <option value="sold">Проданные</option>
            <option value="contract">Неоплаченные</option>
            <option value="booked">Забронированные</option>
          </select>
        </div>
      </div>

      <b-table
        sticky-header
        borderless
        responsive
        :items="getContracts"
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

        <template #cell(status)="data">
          {{ data.value }}
        </template>

        <template #cell(client)="data">
          {{ data.value.first_name.kirill }} {{ data.value.last_name.kirill }}
          {{ data.value.second_name.kirill }}
        </template>

        <template #cell(transaction_price)="data">
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

        <template #cell(contract_date)="data">
          <span v-if="data.item.status === 'cancelled'">{{
            data.item.status | getStatus("", "")
          }}</span>
          <span v-else>{{
            data.item.status
              | getStatus(
                $moment(data.item.contract_date).format("YYYY.MM.DD"),
                $moment(data.item.booking_date).format("YYYY.MM.DD")
              )
          }}</span>
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
                <a
                  class="dropdown-item dropdown-item--inside"
                  v-if="
                    data.item.status === 'contract' ||
                      data.item.status === 'sold'
                  "
                  :href="data.item.contract_path"
                >
                  <i class="fa fa-download"></i>
                  {{ $t("contracts.download") }}
                </a>

                <router-link
                  :to="{name: 'contracts-view', params: {id: data.item.id}}"
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
        v-if="getPagination"
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
import {debounce} from "debounce";
export default {
  components: {
    // 'view-client': ViewClient
  },

  watch: {
    orderBy: function(newVal) {
      if (newVal != "all") {
        this.fetchContractSearch(this);
      } else {
        if (this.search.length > 0) {
          this.fetchContractSearch(this);
        } else {
          this.fetchContracts(this);
        }
      }
    },
  },

  data() {
    return {
      info_reserve: false,
      apartment_preview: {},
      client_id: 0,

      orderBy: "all",
      page: 1,

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },

      search: "",

      sortBy: "contract",
      sortDesc: false,
      fields: [
        {
          key: "contract",
          label: "№",
          sortable: true,
        },
        {
          key: "client",
          label: "ИМЯ КЛИЕНТА",
          sortable: true,
        },
        {
          key: "client.phone",
          label: "ТЕЛЕФОН",
          formatter: (value) => "+" + value,
        },
        {
          key: "transaction_price",
          label: "СТОИМОСТЬ",
          sortable: true,
        },
        {
          key: "object.name",
          label: "ОБЪЕКТ",
        },
        {
          key: "status",
          label: "СТАТУС",
          sortable: true,
          formatter: (value) => this.getStatusOrder(value),
        },
        {
          key: "contract_date",
          label: "ДАТА",
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
      "getPaginationContracts",
      "getContracts",
      "getCurrency",
    ]),
    getPagination() {
      if (this.getPaginationContracts.total) {
        return this.getPaginationContracts.total;
      }
      return 1;
    },
  },

  mounted() {
    this.fetchContracts(this);
    this.fetchCurrency(this);
  },

  methods: {
    ...mapActions(["fetchContracts", "fetchCurrency", "fetchContractSearch"]),
    rowClass(item, type) {
      if (item && type === "row") {
        if (item.status === "contract") {
          return "table-info";
        }
        if (item.status === "sold") {
          return "table-success";
        }
      } else {
        return null;
      }
    },
    getStatusOrder(status) {
      let msg;
      switch (status) {
        case "sold":
          msg = "Продано";
          break;
        case "booked":
          msg = "";
          break;
        case "contract":
          msg = "Оформлен контракт ";
          break;
      }

      return msg;
    },
    PageCallBack(pageNum) {
      this.page = pageNum;

      this.$router
        .push({
          name: "contracts",
          query: {
            page: this.page,
            search: this.search,
            orderBy: this.orderBy,
          },
        })
        .catch((error) => {
          if (
            error.name !== "NavigationDuplicated" &&
            !error.message.includes(
              "Avoided redundant navigation to current location"
            )
          ) {
            console.log(error);
          }
        });

      if (this.search.length > 0) {
        this.fetchContractSearch(this);
        this.$router
          .push({
            name: "contracts",
            query: {
              page: this.page,
              search: this.search,
            },
          })
          .catch((error) => {
            if (
              error.name !== "NavigationDuplicated" &&
              !error.message.includes(
                "Avoided redundant navigation to current location"
              )
            ) {
              console.log(error);
            }
          });
      } else {
        this.fetchContracts(this);
        this.$router.push({
          name: "contracts",
          query: {},
        });
      }
    },
    onSearchInputChange(event) {
      this.page = 1;
      this.search = event.target.value;

      if (this.search.length > 0) {
        this.fetchContractSearch(this);

        this.$router
          .push({
            name: "contracts",
            query: {
              page: this.page,
              search: this.search,
              orderBy: this.orderBy,
            },
          })
          .catch((error) => {
            if (
              error.name !== "NavigationDuplicated" &&
              !error.message.includes(
                "Avoided redundant navigation to current location"
              )
            ) {
              console.log(error);
            }
          });
      } else {
        this.fetchContracts(this);
        this.$router
          .push({
            name: "contracts",
            query: {},
          })
          .catch((error) => {
            if (
              error.name !== "NavigationDuplicated" &&
              !error.message.includes(
                "Avoided redundant navigation to current location"
              )
            ) {
              console.log(error);
            }
          });
      }
    },
    SearchInput: debounce(function(value) {
      this.onSearchInputChange(value);
    }, 800),
  },

  filters: {
    getStatus(status, buy, book) {
      let msg;

      switch (status) {
        case "sold":
          msg = buy;
          break;
        case "booked":
          msg = "Забронировал до " + book;
          break;
        case "contract":
          msg = buy;
          break;
        default:
          msg = "отказался купить или другое";
          break;
      }

      return msg;
    },

    getStatusOrder(status) {
      let msg;
      switch (status) {
        case "sold":
          msg = "Продано";
          break;
        case "booked":
          msg = "";
          break;
        case "contract":
          msg = "Оформлен контракт ";
          break;
      }

      return msg;
    },
  },
};
</script>

<style>
.my-table-fixed thead {
  position: sticky !important;
  top: 0;
}
</style>
