<template>
  <div class="apartment-list-filter">

    <!--      <div v-if="unsfinishedContracts.length">-->
    <!--        <b-alert variant="warning" class="py-2" show>-->
    <!--          <div-->
    <!--              class="alert-body py-0 d-flex w-100 align-items-center justify-content-center"-->
    <!--          >-->
    <!--            <span>-->
    <!--              Привет {{ getMe.user.firstName }}, У вас-->
    <!--              {{ unsfinishedContracts.length }} незаконченных оформлений,-->
    <!--              продолжайте или отмените эти оформления-->
    <!--            </span>-->
    <!--            <b-button-->
    <!--                variant="info"-->
    <!--                class="mt-0 mr-0 ml-2 h-auto"-->
    <!--                to="/objects/unfinished-contracts"-->
    <!--                v-if="getMe.user"-->
    <!--                style="padding: 7px 15px !important"-->
    <!--            >-->
    <!--              Подробнее-->
    <!--            </b-button>-->
    <!--          </div>-->
    <!--        </b-alert>-->
    <!--      </div>-->


    <div>
      <b-table
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border"
          ref="apartment-list-table"
          id="my-table"
          class="table__list"
          sticky-header
          borderless
          show-empty
          responsive
          sort-icon-left
          :busy="showLoading"
          :items="tableItems"
          :fields="fields"
          :sort-by="sortBy"
          :sort-desc="sortDesc"
          :empty-text="$t('no_data')"
          @sort-changed="sortingChanged"
          @scroll.native="handleScroll"
          :selectable="selectable"
          :select-mode="selectMode"
          @row-selected="onRowSelected"
      >

        <template #table-busy>
          <base-loading/>
        </template>

        <template #empty="scope" class="text-center">
            <span class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}
            </span>
        </template>

        <template #cell(number)="data" class="p-0">
          <div class="position-relative">
            <div class="table-multi-select">
              <b-form-checkbox
                  title="Выберите"
                  v-if="data.item.is_sold && selected.view && data.item.order.status === 'available'"
                  :id="'checkbox-' + data.item.id"
                  v-model="selected.values"
                  :name="'checkbox-' + data.item.id"
                  :value="data.item.id"
              ></b-form-checkbox>
              <span>{{ data.item.number }}</span>
            </div>
          </div>
        </template>

        <template #cell(area)="data">
          <span v-if="data.item.plan"> {{ data.item.plan.area }} м² </span>
        </template>

        <template #cell(balcony)="data">
            <span v-if="data.item.plan.balcony">
              {{ data.item.plan.balcony_area }} м²
            </span>

          <span v-else>
              {{ $t("no") }}
            </span>
        </template>

        <template #cell(price)="data">
          {{
            data.item.price
                | number("0,0.00", {
              thousandsSeparator: " ",
              decimalSeparator: ",",
            })
          }}
          {{ $t("ye") }}
        </template>

        <template #cell(status)="data">
            <span v-if="!data.item.is_sold">
              {{ $t('not_for_sale') }}
            </span>
          <span v-else>
              {{
              data.item.order.status
                  | getStatus(
                  $moment(data.item.order.booking_date).format("YYYY.MM.DD")
                  )
            }}
            </span>
        </template>

      </b-table>

      <!--      <b-overlay :show="loading" no-wrap opacity="0.5">-->
      <!--        <template #overlay>-->
      <!--          <div class="d-flex justify-content-center w-100">-->
      <!--            <div class="lds-ellipsis">-->
      <!--              <div></div>-->
      <!--              <div></div>-->
      <!--              <div></div>-->
      <!--              <div></div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </b-overlay>-->


      <div v-if="!showLoading && pagination.total" class="pagination__vue">
        <!--   Pagination   -->
        <vue-paginate
            :page-count="pagination.total"
            :value="pagination.current"
            :container-class="'container'"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :next-class="'page-item'"
            :prev-class="'page-item'"
            :prev-link-class="'page-link'"
            :next-link-class="'page-link'"
            @change-page="changeCurrentPage"
        >
          <template #next-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-right-icon/>
          </span>
          </template>

          <template #prev-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-left-icon/>
          </span>
          </template>
        </vue-paginate>

        <!--  Show By Select    -->
        <div class="show__by">
        <span class="show__by__content">
          <span class="description">{{ $t('contracts.show_by') }}:</span>
          <b-form-select
              @input="limitChanged"
              v-model="showByValue"
              :options="showByOptions"
          ></b-form-select>
          <span class="arrow__down">
            <base-down-icon/>
          </span>
        </span>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from "vuex";
import api from "@/services/api"
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import {sortObjectValues} from "@/util/reusable";
import BaseLoading from "@/components/Reusable/BaseLoading";

export default {
  name: 'ObjectTable',
  components: {
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseDownIcon,
    BaseLoading

  },

  data() {
    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    let {search: searchValue, limit: showByValue} = this.$route.query

    if (!showByValue) {
      showByValue = 20
    }

    return {
      showByValue,
      searchValue,
      showByOptions,
      pagination: {},
      tableItems: [],
      selectMode: "single",
      unsfinishedContracts: [],
      selectable: true,
      selected: {
        view: false,
        confirm: false,
        values: [],
      },

      contract: {},

      reserve: false,
      apartment_id: 0,
      order_id: 0,
      edit: false,

      page: 1,
      info_reserve: false,
      apartment_preview: {},

      info_manager: false,
      manager_apartment: {},

      fields: [
        {
          key: "number",
          label: this.$t('apartments.list.number'),
          sortable: true,
        },
        // {
        //   key: "building.name",
        //   label: "ЗДАНИЯ",
        //   sortable: true,
        // },
        // {
        //   key: "block.name",
        //   label: "КОРПУС",
        // },
        // {
        //   key: "is_promo",
        //   label: this.$t('promo.in_promo'),
        //   sortable: true,
        // },
        {
          key: "rooms",
          label: this.$t('apartments.list.rooms'),
          sortable: true,
        },
        {
          key: "floor",
          label: this.$t('apartments.list.floor'),
          sortable: true,
        },
        {
          key: "entrance",
          label: this.$t('apartments.list.entrance'),
          sortable: true,
        },
        {
          key: "area",
          label: this.$t('apartments.list.area'),
          sortable: true,
        },
        {
          key: "balcony",
          label: this.$t('apartments.list.balcony'),
          sortable: true,
        },
        {
          key: "price",
          label: this.$t('apartments.list.price'),
          sortable: true,
        },
        {
          key: "status",
          label: this.$t('apartments.list.status'),
        },
        {
          key: "actions",
          label: "",
        },
      ],
      filter: {
        status: null,
      },
      sortBy: "",
      sortDesc: false,
      currentPage: 1,
      scrollActive: true,
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
      loading: true,
      showLoading: false,
    }
  },

  async created() {
    this.loading = true

    this.filter = {
      ...this.$route.query,
    }

    this.currentPage = Number(this.filter.page);
    //
    // this.$route.push()
    // const id = this.$route.params.object
    // api.apartments.getApartmentsList(id)
    //     .then(response => {
    //       this.items = response.data.items
    //       this.pagination = response.data.pagination
    //     })
    this.currentPage = Number(this.filter.page);
    this.loading = this.getLoading;

    // this.fetchApartments(this)
    // this.getUnfinishedOrders();

    await this.fetchContractList()
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    },
    countOfItems() {
      return this.tableItems.length
    },
    ...mapGetters(["getApartments", "getPermission", "getMe", "getLoading"]),
    // items() {
    //   return this.getApartments.items
    // },
    // pagination() {
    //   return this.getApartments.pagination
    // },
    bookingPermission() {
      return this.selected.view && this.selected.values.length > 1
          && this.getPermission.apartments && this.getPermission.apartments.contract
    },
    hasPermission() {
      return this.getPermission.apartments && this.getPermission.apartments.edit
    },
    showApartmentsContract() {
      const {getPermission} = this
      const firstOption = getPermission.apartments && getPermission.apartments.contract
      const secondOption = getPermission.apartments && getPermission.apartments.root_contract
      return firstOption || secondOption
    },
    getPagination() {
      if (this.pagination.total) {
        return this.pagination.total;
      }
      return 1;
    },

    objectName() {
      if (this.items.length) {
        return this.items[0].object.name
      }

      return ''
    },
    breadCrumbs() {
      return [
        {
          routeName: 'chess/18',
          textContent: this.$t('objects.title')
        },
        {
          routeName: 'chess/18',
          textContent: this.objectName,
          params: {
            object: this.$route.params.object
          }
        }
      ]
    },
    activeContent() {
      return this.$t('objects.apartments')
    },
  },

  watch: {
    getLoading(val) {
      this.loading = val;
    },
    '$route.query': {
      handler: function () {
        this.fetchContractList()
      },
      deep: true
    },
    searchValue() {
      this.getContractListBySearch()
    },

  },

  methods: {
    limitChanged() {
      this.changeFetchLimit()
    },
    async fetchContractList() {
      this.showLoading = true

      const query = sortObjectValues(this.query)

      if (query.hasOwnProperty('object_id') && typeof query.object_id === 'string') {
        query.object_id = [query.object_id]
      }

      await api.objects.fetchObjectApartments(18, query)
          .then((response) => {
            this.tableItems = response.data.items
            this.pagination = response.data.pagination
            this.counts = response.data.counts
            this.showByValue = response.data.pagination.perPage
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    changeFetchLimit() {
      const query = {
        ...this.query, page: 1
      }
      const limit = this.showByValue
      this.replaceRouter({...query, limit})
    },
    replaceRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.replace({query: sortQuery})
    },
    pushRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.push({query: sortQuery})
    },
    searchQueryFilter(searchQuery) {
      const hasQueryStatus = this.query.hasOwnProperty('status')
      if (hasQueryStatus) {
        const {status} = this.query
        this.replaceRouter({
          ...searchQuery,
          status
        })
        return
      }

      this.replaceRouter(searchQuery)
    },
    changeCurrentPage(page) {
      console.log(page, 'page number');
      const currentPage = this.query.page
      if (page === currentPage) return
      this.replaceRouter({...this.query, page})
    },
    // async getApartmentsAll() {
    //   return await api.objects.fetchObjectApartments(18)
    //       .then((response) => {
    //         this.pagination = response.data.pagination
    //         this.items = response.data.items
    //       })
    //       .catch((error) => {
    //         this.toastedWithErrorCode(error)
    //       })
    //       .finally(() => {
    //         this.loading = false
    //       })
    // },
    ...mapActions(["fetchApartments", "fetchReserveClient"]),
    ...mapMutations(['updateSpecificApartment']),
    bookSelectedApartments(client) {
      const {values: apartments} = this.selected
      const form = Object.assign({}, {...client, apartments})
      delete form.apartment_id
      this.loading = true
      api.apartments.bookingApartments(form)
          .then(async (response) => {
            const {contract_path} = response.data
            await this.showSuccessResponse()
            await this.updateContent()
            await this.multiSelectOff()
            await this.downloadContract(contract_path)
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.loading = false
          })
    },
    downloadContract(url) {
      const a = document.createElement('a')
      a.href = url
      a.click()
      document.body.removeChild(a)
    },
    showSuccessResponse() {
      this.$swal({
        title: this.$t('booked'),
        text: '',
        icon: "success",
        showCancelButton: false,
        confirmButtonText: this.$t("next"),
      })
    },
    updateContent() {
      this.fetchApartments(this)
      this.getUnfinishedOrders()
    },
    statusHold(data) {
      return data.item.order.status === 'hold'
    },
    allowViewWhenProcessing(data) {
      const status = data.item.order.status
      const userId = data.item.order?.user_id

      const permissionApartment = this.getPermission.apartments
      const sameUserId = userId === this.getMe.user.id

      const unnecessaryStatus = ['sold', 'contract']
      const notSolidOrContract = !unnecessaryStatus.includes(status)

      const firstOption = notSolidOrContract && status === 'booked' && sameUserId && permissionApartment.contract
      const secondOption = !notSolidOrContract && permissionApartment && permissionApartment.root_contract
      const thirdOption = notSolidOrContract && status === 'available' && permissionApartment.contract

      return (firstOption || secondOption || thirdOption) && status === 'hold'
    },
    clientsView(data) {
      const firstOption = data.item.order.status === 'booked' && data.item.order.user.id === this.getMe.user.id
      const secondOption = (this.getPermission.apartments && this.getPermission.apartments.root_contract && data.item.order.status === 'booked')
      return firstOption || secondOption
    },
    async toggleApartmentToSale(item) {
      const {status} = this.$route.query
      const id = this.$route.params.object
      const apartmentUID = item.id
      await api.apartments.isAvailableToSold(id, apartmentUID).then(response => {
        this.updateSpecificApartment({updatingApartment: response.data, status})
      })
    },
    async getUnfinishedOrders() {
      await api.orders.fetchUnfinishedOrders().then((res) => {
        if (res) {
          this.unsfinishedContracts = res.data;
        }
      });
    },

    async orderHold(arr) {
      this.loading = true;
      await api.orders.holdOrder(arr).then((res) => {
        this.loading = false;
        if (res) {
          // localStorage.setItem("order", JSON.stringify(res.data));
          this.$router.push({
            name: "confirm-apartment",
            params: {id: res.data.uuid},
          })
          this.selected.view = false;
          this.selected.values = [];
          this.selectable = true;
        }
      });
    },
    goOrderHold(order_id) {
      this.selected.view = false;
      this.selected.values = [];
      this.selectable = true;
      this.$router.push({
        name: "confirm-apartment",
        params: {id: order_id[0]},
      })
    },
    multiSelectOn() {
      this.selected.view = true;
      this.selectable = true;
      this.scrollActive = false;
      // this.page = 1;
      // this.filter.page = 1;
      // this.filter.status = true;
      // this.currentPage = this.filter.page;

      // this.$router.push({
      //   name: "apartments",
      //   query: this.filter,
      // });
      // this.fetchApartments(this).then(() => {
      //   const element = document.getElementById("my-table");
      //   element.scrollIntoView();
      // });
    },
    multiSelectOff() {
      this.selected.view = false;
      this.selected.values = [];
      this.selectable = true;

      this.scrollActive = true;
      // this.page = 1;
      // this.filter.page = 1;
      // this.filter.status = null;
      // this.currentPage = this.filter.page;

      // this.$router.push({
      //   name: "apartments",
      //   query: this.filter,
      // });
      // this.fetchApartments(this).then(() => {
      //   const element = document.getElementById("my-table");
      //   element.scrollIntoView();
      // });
    },
    onRowSelected(items) {
      this.$router.push({
        name: "chess",
        params: {id: items[0].id},
      });
    },
    async PageCallBack(event) {
      this.scrollActive = false;
      this.page = event;
      this.filter.page = Number(this.page);
      this.$router.push({
        name: "chess-table",
        query: this.filter,
      });
      await this.fetchApartments(this).then(() => {
        const element = document.getElementById("my-table");
        element.scrollIntoView();
      });
    },
    async getFilterTabsContent(status) {
      this.filter.status = status
      this.scrollActive = false;
      delete this.filter.page
      this.$router.push({
        name: "chess",
        query: this.filter,
      })
      await this.fetchApartments(this).then(() => {
        const element = document.getElementById("my-table")
        element.scrollIntoView()
      });
    },
    async handleScroll(event) {
      if (!this.scrollActive) {
        this.scrollActive = true;
        return;
      }

      if (
          event.target.scrollTop + event.target.clientHeight >=
          event.target.scrollHeight
      ) {
        if (this.getApartments.pagination.next) {
          this.page = this.page + 1;
          this.filter.page = Number(this.page);
          this.currentPage = this.filter.page;
          this.$router.push({
            name: "chess",
            query: this.filter,
          });
          await this.fetchApartments(this);
        }
      }
    },
    sortingChanged(val) {
      this.showLoading = true
      this.scrollActive = false;
      this.filter.filtered = true;
      this.filter.sort_by = val.sortBy;
      this.filter.order_by = val.sortDesc ? "desc" : "asc";

      // this.$router.push({
      //   name: "chess-table",
      //   params: {objectId: 18},
      //   query: this.filter,
      // });

      setTimeout(() => {
        this.$router.push({
          name: "chess-table",
          params: {objectId: 18},
          query: this.filter,
        }).then(() => {
          const element = document.getElementById("my-table");
          element.scrollIntoView();

        });
      }, 1000);
    },

    rowClass(item, type) {
      if (item && type === "row") {
        if (item.order.status === "booked") {
          return "";
        }
        if (item.order.status === "contract") {
          return "table-info";
        }
        if (item.order.status === "sold") {
          return "table-success";
        }
        if (item.order.status === "hold") {
          return "table-warning";
        }
      } else {
        return null;
      }
    },

    getPrice(area, price) {
      return price * area;
    },

    moment: function () {
      return this.$moment();
    },

    async filteredForm(event) {
      this.filter = event;
      this.selected.view = false;
      this.selected.values = [];
      this.selectable = true;
      this.scrollActive = true;
      this.page = 1;
      this.filter.page = 1;
      this.currentPage = this.filter.page;

      await this.$router.push({
        name: "chess",
        query: this.filter,
      });

      const vm = this;
      await this.fetchApartments(vm)
    },

    CreateReserve(id) {
      this.reserve = true;
      this.apartment_id = id;
    },

    CreateReserveSuccess() {
      this.fetchApartments(this).then(() => {
        location.reload();
      });
    },

    CloseReserveInfo() {
      this.info_reserve = false;
      this.apartment_preview = {};
      this.fetchApartments(this).then(() => {
        location.reload();
      });
    },

    ReserveInfo(apartment) {
      this.info_reserve = true;
      this.apartment_preview = apartment;
      this.order_id = apartment.order.id;
      this.fetchReserveClient(this).then(() => {
        this.$root.$emit("bv::show::modal", "modal-view-reserved-client");
      });
    },

    getInfoReserve(apartment) {
      this.info_manager = true;
      this.manager_apartment = apartment.order.user;
    },

    ManagerInfo() {
      this.info_manager = false;
      this.manager_apartment = {};
    },

    async EditApartment() {
      this.apartment_id = 0;
      this.edit = false;

      await this.$router.push({
        name: "chess",
        query: this.filter,
      });

      if (this.filter.filtered) await this.fetchApartments(this);
      else await this.fetchApartments(this);
    },

    CloseAgree() {
      this.confirm = false;
    },

    async successAgree(value) {
      this.contract = value;
      await this.fetchApartments(this);
      // this.$bvModal.show("modal-success-agree");
      this.selected.confirm = false;
      this.selected.view = false;
      this.selected.values = [];
      this.selectable = true;
    },
  },

  filters: {
    getStatus(status, booking_date) {
      let msg;
      switch (status) {
        case "sold":
          msg = "Продано";
          break;
        case "booked":
          msg = "Забронировано до " + booking_date;
          break;
        case "available":
          msg = "Свободен";
          break;
        case "contract":
          msg = "Ждет оплата";
          break;
        case "hold":
          msg = "Оформляется...";
          break;
        default:
          msg = "Свободен";
          break;
      }

      return msg;
    },
  },
};
</script>

<style scoped lang="scss">
.booking__button {
  background-color: #fab005 !important;
}

.svg-lock-button {
  fill: var(--dark);
}

.apartments__lock {
  position: absolute;
  left: -20px;
  top: 25%;
  transform: translateY(-30%);
}

.space-room-button {
  background: #f1f1f1;
  box-shadow: -1px 5px 22px -12px rgba(0, 0, 0, 0.75);
  border-radius: 8px;
  padding-left: 8px;
  padding-right: 8px;
  border: 0.1px solid rgba(0, 0, 0, 0.2)
}

.dropdown-menu .active {
  background: transparent;
}

.cursor-pointer {
  cursor: pointer;
}

table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--background-color-nav);
}

.my-table thead tr th {
  padding-top: 20px;
  padding-bottom: 20px;
}

table tbody th {
  position: relative;
}

table tbody th {
  position: sticky;
  left: 0;
  z-index: 1;
}

.apartment-list-filter {
  @media screen and (max-width: 576px) {
    .btn {
      width: 100%;
    }
  }
}


@import "@/assets/scss/utils/pagination";

.search__content {
  margin-top: 0;
}

::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}


::v-deep .table__list {
  min-height: 250px;
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.125rem 1rem;
      vertical-align: middle;

      //&.b-table-sort-icon-left {
      //display: flex;
      //align-items: center;
      //}
    }

    td {
      vertical-align: middle;
    }
  }


  .table.b-table[aria-busy=true] {
    opacity: 1 !important;
  }
}


::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 5) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
  background-position: right calc(2rem / 6) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
  background-position: right calc(2rem / 6) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}


</style>
