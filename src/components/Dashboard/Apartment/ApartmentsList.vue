<template>
  <main>
    <div class="app-content apartment-list-filter">
      <div v-if="unsfinishedContracts.length">
        <b-alert variant="warning" class="py-2" show>
          <div
            class="alert-body py-0 d-flex w-100 align-items-center justify-content-center"
          >
            <span>
              Привет {{ getMe.user.firstName }}, У вас
              {{ unsfinishedContracts.length }} незаконченных оформлений,
              продолжайте или отмените эти оформления
            </span>
            <b-button
              variant="info"
              class="mt-0 mr-0 ml-2 h-auto"
              to="/objects/unfinished-contracts"
              v-if="getMe.user"
              style="padding: 7px 15px !important"
            >
              Подробнее
            </b-button>
          </div>
        </b-alert>
      </div>

      <div class="d-flex justify-content-between flex-md-row flex-column">
        <div
          class="
            d-flex
            justify-content-center
            align-items-center
            flex-md-row flex-column
          "
          v-if="
            (getPermission.apartments && getPermission.apartments.contract) ||
              (getPermission.apartments &&
                getPermission.apartments.root_contract)
          "
        >
          <button
            v-if="!selected.view && getPermission.apartments.contract"
            class="btn btn-secondary mr-md-2 mr-0 mt-md-0 order-2"
            @click="multiSelectOn"
          >
            <i class="far fa-list"></i> {{ $t("apartments.list.choose") }}
          </button>

          <b-button
            v-b-modal.modal-agree
            v-if="
              selected.view &&
                selected.values.length > 1 &&
                getPermission.apartments &&
                getPermission.apartments.contract
            "
            @click="orderHold(selected.values)"
            variant="success"
            class="btn btn-primary mr-md-2 mr-0 mt-md-0 order-3"
          >
            <i class="far fa-ballot-check"></i>
            {{ $t("apartments.list.contract_all") }}
          </b-button>

          <button
            v-if="selected.view && getPermission.apartments.contract"
            class="btn btn-warning mr-md-2 mr-0 mt-md-0 order-4"
            @click="multiSelectOff"
          >
            <i class="far fa-redo"></i> {{ $t("apartments.list.reset") }}
          </button>

          <div class="mt-md-0 order-md-6 order-1">
            <div class="title__default">
              {{ $t("apartments.list.apartments") }}:
              {{ getApartments.pagination.totalItems }}
            </div>
          </div>
        </div>

        <button
          class="btn btn-primary mr-0 mt-md-0 ml-md-auto"
          v-b-toggle.apartment-list-filter
          v-if="getPermission.apartments && getPermission.apartments.filter"
        >
          <i class="far fa-sliders-h mr-2"></i>
          {{ $t("apartments.list.filter") }}
        </button>
      </div>

      <div class="mt-4">
        <b-table
          ref="apartment-list-table"
          id="my-table"
          class="custom-table"
          sticky-header
          borderless
          show-empty
          responsive
          sort-icon-left
          :items="items"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :tbody-tr-class="rowClass"
          :empty-text="$t('no_data')"
          @sort-changed="sortingChanged"
          @scroll.native="handleScroll"
          :selectable="selectable"
          :select-mode="selectMode"
          @row-selected="onRowSelected"
        >
          <template #empty="scope" class="text-center">
            <span class="d-flex justify-content-center align-items-center">{{
              scope.emptyText
            }}</span>
          </template>

          <template #cell(number)="data" class="p-0">
            <div class="table-multi-select">
              <b-form-checkbox
                title="Выберите"
                v-if="selected.view && data.item.order.status === 'available'"
                :id="'checkbox-' + data.item.id"
                v-model="selected.values"
                :name="'checkbox-' + data.item.id"
                :value="data.item.id"
              ></b-form-checkbox>
              <span>{{ data.item.number }}</span>
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
            {{
              data.item.order.status
                | getStatus(
                  $moment(data.item.order.booking_date).format("YYYY.MM.DD")
                )
            }}
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
                  <!-- Редактировать -->
                  <b-link
                    class="dropdown-item dropdown-item--inside"
                    @click="[(edit = true), (apartment_id = data.item.id)]"
                    v-if="
                      getPermission.apartments && getPermission.apartments.edit
                    "
                    v-b-modal.modal-edit
                  >
                    <i class="far fa-pencil"></i> {{ $t("edit") }}
                  </b-link>

                  <!--  Забронировать -->
                  <b-link
                    v-if="
                      getPermission.apartments &&
                        getPermission.apartments.reserve &&
                        data.item.order.status === 'available'
                    "
                    @click="[(reserve = true), (apartment_id = data.item.id)]"
                    v-b-modal.modal-reserve-create
                    class="dropdown-item dropdown-item--inside"
                  >
                    <i class="far fa-calendar-check"></i>
                    {{ $t("apartments.list.book") }}
                  </b-link>

                  <!-- Посмотреть клиент  -->
                  <b-link
                    v-if="
                      (data.item.order.status === 'booked' &&
                        data.item.order.user_id === getMe.user.id) ||
                        (getPermission.apartments &&
                          getPermission.apartments.root_contract &&
                          data.item.order.status === 'booked')
                    "
                    @click="ReserveInfo(data.item)"
                    class="dropdown-item dropdown-item--inside"
                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.view_client") }}
                  </b-link>

                  <!--  Информация о менеджера  -->
                  <b-link
                    v-if="
                      data.item.order.status === 'booked' &&
                        data.item.order.user_id != getMe.user.id
                    "
                    @click="getInfoReserve(data.item)"
                    v-b-modal.modal-view-info-manager
                    class="dropdown-item dropdown-item--inside"
                  >
                    <i class="far fa-info-circle"></i>
                    {{ $t("apartments.list.view_manager") }}
                  </b-link>

                  <!--  Подробная информация  -->
                  <router-link
                    :to="{
                      name: 'apartment-view',
                      params: {id: data.item.id},
                    }"
                    :class="'dropdown-item dropdown-item--inside'"
                    v-if="
                      (getPermission.apartments.view &&
                        data.item.order.status === 'contract') ||
                        (getPermission.apartments.view &&
                          data.item.order.status === 'sold') ||
                        (!getPermission.apartments.contract &&
                          getPermission.apartments.view) ||
                        (data.item.order.status === 'booked' &&
                          data.item.order.user_id != getMe.user.id) ||
                        (getPermission.apartments.view &&
                          data.item.order.status === 'hold')
                    "
                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.more") }}
                  </router-link>

                  <!-- Подробная информация  -->
                  <router-link
                    :to="{
                      name: 'apartment-view',
                      params: {id: data.item.id},
                    }"
                    :class="'dropdown-item dropdown-item--inside'"
                    v-else-if="
                      ((data.item.order.status != 'sold' ||
                        data.item.order.status != 'contract') &&
                        data.item.order.status === 'booked' &&
                        data.item.order.user_id === getMe.user.id &&
                        getPermission.apartments.contract) ||
                        (!(
                          data.item.order.status == 'sold' ||
                          data.item.order.status == 'contract'
                        ) &&
                          getPermission.apartments &&
                          getPermission.apartments.root_contract) ||
                        ((data.item.order.status != 'sold' ||
                          data.item.order.status != 'contract') &&
                          data.item.order.status === 'available' &&
                          getPermission.apartments.contract)
                    "
                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.more") }}
                  </router-link>

                  <!--  Оформить -->
                  <b-link
                    @click="orderHold([data.item.id])"
                    :class="'dropdown-item dropdown-item--inside'"
                    v-if="
                      (((data.item.order.status != 'sold' ||
                        data.item.order.status != 'contract') &&
                        data.item.order.status === 'booked' &&
                        data.item.order.user_id === getMe.user.id &&
                        getPermission.apartments.contract) ||
                        (!(
                          data.item.order.status == 'sold' ||
                          data.item.order.status == 'contract'
                        ) &&
                          getPermission.apartments &&
                          getPermission.apartments.root_contract) ||
                        ((data.item.order.status != 'sold' ||
                          data.item.order.status != 'contract') &&
                          data.item.order.status === 'available' &&
                          getPermission.apartments.contract)) &&
                        data.item.order.status !== 'hold'
                    "
                  >
                    <i class="far fa-ballot-check"></i>
                    {{ $t("apartments.list.confirm") }}
                  </b-link>

                  <!--  Оформить when processing  -->
                  <b-link
                    @click="goOrderHold([data.item.order.id])"
                    :class="'dropdown-item dropdown-item--inside'"
                    v-if="
                      (((data.item.order.status != 'sold' ||
                        data.item.order.status != 'contract') &&
                        data.item.order.status === 'booked' &&
                        data.item.order.user_id === getMe.user.id &&
                        getPermission.apartments.contract) ||
                        (!(
                          data.item.order.status == 'sold' ||
                          data.item.order.status == 'contract'
                        ) &&
                          getPermission.apartments &&
                          getPermission.apartments.root_contract) ||
                        ((data.item.order.status != 'sold' ||
                          data.item.order.status != 'contract') &&
                          data.item.order.status === 'available' &&
                          getPermission.apartments.contract)) &&
                        data.item.order.status === 'hold'
                    "
                  >
                    <i class="far fa-ballot-check"></i>
                    Продолжить оформление
                  </b-link>
                </div>
              </div>
            </div>
          </template>
        </b-table>

        <b-overlay :show="loading" no-wrap opacity="0.5">
          <template #overlay>
            <div class="d-flex justify-content-center w-100">
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </template>
        </b-overlay>

        <paginate
          v-if="getPagination"
          :pageCount="getPagination"
          :click-handler="PageCallBack"
          :prevText="`<i class='fa fa-chevron-left'></i>`"
          :nextText="`<i class='fa fa-chevron-right'></i>`"
          :container-class="'pagination'"
          :page-class="'page-item'"
          :page-link-class="'page-link'"
          :next-class="'page-item'"
          :prev-class="'page-item'"
          :prev-link-class="'page-link'"
          :next-link-class="'page-link'"
          v-model="currentPage"
        >
        </paginate>
      </div>

      <div>
        <reserve-add
          v-if="
            reserve | getPermission.apartments &&
              getPermission.apartments.reserve
          "
          :apartment="apartment_id"
          @CreateReserve="CreateReserveSuccess"
        ></reserve-add>

        <filter-form
          v-if="getPermission.apartments && getPermission.apartments.filter"
          @filteredForm="filteredForm"
          :filtered="filter"
        ></filter-form>

        <view-client
          v-if="info_reserve"
          @CancelReserve="CloseReserveInfo"
          :apartment-data="apartment_preview"
        ></view-client>

        <edit-modal
          v-if="
            (getPermission.apartments && getPermission.apartments.edit) || edit
          "
          :apartment="apartment_id"
          @EditApartment="EditApartment"
        ></edit-modal>

        <info-manager-modal
          :manager-data="this.manager_apartment"
          @ManagerInfo="ManagerInfo"
        ></info-manager-modal>

        <agree-modal
          v-if="selected.confirm"
          :apartments="selected.values"
          @successAgree="successAgree"
          @CloseAgree="CloseAgree"
        ></agree-modal>

        <success-agree :contract="contract"></success-agree>
      </div>
    </div>
  </main>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {BAlert, BButton} from "bootstrap-vue";
import Filter from "./Components/ApartmentsFilter";
import ReserveAdd from "./Components/Reserve";
import EditApartment from "./Components/Edit";
import ViewClient from "./ViewClient";
import InfoManager from "./InfoManager";
import AgreeMultiple from "./Components/AgreeMultiple";
import SuccessAgree from "./Components/SuccessAgree";

export default {
  components: {
    "filter-form": Filter,
    "reserve-add": ReserveAdd,
    "view-client": ViewClient,
    "edit-modal": EditApartment,
    "info-manager-modal": InfoManager,
    "agree-modal": AgreeMultiple,
    "success-agree": SuccessAgree,
    BAlert,
    BButton,
  },

  data() {
    return {
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
          label: "№ ДОМ",
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
        {
          key: "rooms",
          label: "КОМНАТ",
          sortable: true,
        },
        {
          key: "floor",
          label: "ЭТАЖ",
          sortable: true,
        },
        {
          key: "entrance",
          label: "ПОДЪЕЗД",
          sortable: true,
        },
        {
          key: "area",
          label: "ПЛОЩАД",
          sortable: true,
        },
        {
          key: "balcony",
          label: "БАЛКОН",
          sortable: true,
        },
        {
          key: "price",
          label: "ЦЕНА",
          sortable: true,
        },
        {
          key: "status",
          label: "СТАТУС",
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
    };
  },

  created() {
    this.filter = {
      ...this.$route.query,
    };
    // if (this.filter.status === true) {
    //   this.multiSelectOn();
    // }
    this.currentPage = Number(this.filter.page);
    this.loading = this.getLoading;
  },

  computed: {
    ...mapGetters(["getApartments", "getPermission", "getMe", "getLoading"]),

    getPagination() {
      if (this.getApartments.pagination.total) {
        return this.getApartments.pagination.total;
      }
      return 1;
    },
    items() {
      return this.getApartments.items;
    },
  },
  mounted() {
    this.fetchApartments(this);
    this.getUnfinishedOrders();
  },
  watch: {
    getLoading(val) {
      this.loading = val;
    },
  },

  methods: {
    ...mapActions(["fetchApartments", "fetchReserveClient"]),
    async getUnfinishedOrders() {
      await this.axios
        .get(process.env.VUE_APP_URL + "/orders/hold", this.header)
        .then((res) => {
          if (res) {
            this.unsfinishedContracts = res.data;
          }
        });
    },
    async orderHold(arr) {
      this.loading = true;
      await this.axios
        .post(
          process.env.VUE_APP_URL + "/orders/hold",
          {
            apartments: arr,
          },
          this.header
        )
        .then((res) => {
          this.loading = false;
          if (res) {
            // localStorage.setItem("order", JSON.stringify(res.data));
            this.$router.push({
              name: "confirm-apartment",
              params: {id: res.data.uuid},
            });
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
      });
    },
    multiSelectOn() {
      this.selected.view = true;
      this.selectable = false;

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
        name: "apartment-view",
        params: {id: items[0].id},
      });
    },
    async PageCallBack(event) {
      this.scrollActive = false;
      this.page = event;
      this.filter.page = Number(this.page);
      this.$router.push({
        name: "apartments",
        query: this.filter,
      });
      await this.fetchApartments(this).then(() => {
        const element = document.getElementById("my-table");
        element.scrollIntoView();
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
            name: "apartments",
            query: this.filter,
          });
          await this.fetchApartments(this);
        }
      }
    },
    sortingChanged(val) {
      this.scrollActive = false;
      this.filter.filtered = true;
      this.filter.sort_by = val.sortBy;
      this.filter.order_by = val.sortDesc ? "desc" : "asc";

      this.$router.push({
        name: "apartments",
        query: this.filter,
      });
      setTimeout(() => {
        this.fetchApartments(this).then(() => {
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

    moment: function() {
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

      this.$router.push({
        name: "apartments",
        query: this.filter,
      });

      const vm = this;
      setTimeout(() => {
        this.fetchApartments(vm);
      }, 1000);
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

      this.$router.push({
        name: "apartments",
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
.dropdown-menu .active {
  background: transparent;
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
</style>
