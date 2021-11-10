<template>
  <main>
    <div class="app-content">
      <div class="">
        <div class="title__default my-2">
          {{ $t("apartments.list.apartments") }}:
          {{ getApartments.pagination.totalItems }}
        </div>
      </div>

      <div class="">
        <div
          class="
            d-flex
            justify-content-md-end justify-content-center
            float-left
          "
          v-if="
            getPermission.apartments.contract ||
            getPermission.apartments.root_contract
          "
        >
          <button
            v-if="!selected.view && getPermission.apartments.contract"
            class="btn btn-secondary mr-2"
            @click="selected.view = true"
          >
            <i class="far fa-list"></i> {{ $t("apartments.list.choose") }}
          </button>

          <b-button
            v-b-modal.modal-agree
            v-if="
              selected.view &&
              selected.values.length > 1 &&
              getPermission.apartments.contract
            "
            @click="selected.confirm = true"
            variant="success"
            class="btn btn-primary mr-2"
          >
            <i class="far fa-ballot-check"></i>
            {{ $t("apartments.list.contract_all") }}
          </b-button>

          <button
            v-if="selected.view && getPermission.apartments.contract"
            class="btn btn-warning mr-2"
            @click="[(selected.view = false), (selected.values = [])]"
          >
            <i class="far fa-redo"></i> {{ $t("apartments.list.reset") }}
          </button>
        </div>

        <div class="d-flex justify-content-md-end justify-content-center">
          <b-link
            class="btn btn-primary mr-0"
            v-if="getPermission.apartments.filter"
            v-b-modal.modal-filter-all
          >
            <i class="far fa-sliders-h mr-2"></i>
            {{ $t("apartments.list.filter") }}
          </b-link>
        </div>
      </div>

      <div class="mt-4">
        <b-table
          ref="my-table"
          sticky-header
          borderless
          responsive
          :items="getApartments.items"
          :fields="fields"
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

          <template #cell(number)="data">
            <b-form-checkbox
              v-if="selected.view && data.item.order.status === 'available'"
              :id="'checkbox-' + data.item.id"
              v-model="selected.values"
              :name="'checkbox-' + data.item.id"
              :value="data.item.id"
              class="float-left"
            ></b-form-checkbox>
            {{ data.item.number }}
          </template>

          <template #cell(balcony_area)="data">
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
                  <b-link
                    class="dropdown-item dropdown-item--inside"
                    @click="[(edit = true), (apartment_id = data.item.id)]"
                    v-if="getPermission.apartments.edit"
                    v-b-modal.modal-edit
                  >
                    <i class="far fa-pencil"></i> {{ $t("edit") }}
                  </b-link>

                  <b-link
                    v-if="
                      getPermission.apartments.reserve &&
                      data.item.order.status === 'available'
                    "
                    @click="[(reserve = true), (apartment_id = data.item.id)]"
                    v-b-modal.modal-create
                    class="dropdown-item dropdown-item--inside"
                  >
                    <i class="far fa-calendar-check"></i>
                    {{ $t("apartments.list.book") }}
                  </b-link>

                  <b-link
                    v-if="
                      (data.item.order.status === 'booked' &&
                        data.item.order.user_id === getMe.user.id) ||
                      (getPermission.apartments.root_contract &&
                        data.item.order.status === 'booked')
                    "
                    @click="ReserveInfo(data.item)"
                    v-b-modal.modal-view-client
                    class="dropdown-item dropdown-item--inside"
                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.view_client") }}
                  </b-link>

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

                  <router-link
                    :to="{
                      name: 'apartments-view',
                      params: {id: data.item.id},
                    }"
                    :class="'dropdown-item dropdown-item--inside'"
                    v-if="
                      ((data.item.order.status != 'sold' ||
                        data.item.order.status != 'contract') &&
                        data.item.order.status === 'booked' &&
                        data.item.order.user_id === getMe.user.id &&
                        getPermission.apartments.contract) ||
                      (!(
                        data.item.order.status == 'sold' ||
                        data.item.order.status == 'contract'
                      ) &&
                        getPermission.apartments.root_contract) ||
                      ((data.item.order.status != 'sold' ||
                        data.item.order.status != 'contract') &&
                        data.item.order.status === 'available' &&
                        getPermission.apartments.contract)
                    "
                  >
                    <!--                                            apartment.order.status === 'booked' && apartment.order.user.id === getMe.user.id && getPermission.apartments.contract || apartment.order.status != 'sold' && getPermission.apartments.root_contract || apartment.order.status === 'available' && getPermission.apartments.contract-->
                    <i class="far fa-ballot-check"></i>
                    {{ $t("apartments.list.confirm") }}
                  </router-link>

                  <router-link
                    :to="{
                      name: 'apartments-view',
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
                        data.item.order.user_id != getMe.user.id)
                    "
                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.more") }}
                  </router-link>
                </div>
              </div>
            </div>
          </template>
        </b-table>

        <b-overlay :show="getLoading" no-wrap opacity="0.5">
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
      </div>

      <div>
        <reserve-add
          v-if="reserve | getPermission.apartments.reserve"
          :apartment="apartment_id"
          @CreateReserve="CreateReserveSuccess"
        ></reserve-add>

        <filter-form
          v-if="getPermission.apartments.filter"
          @Filtered="Filtered"
        ></filter-form>

        <view-client
          v-if="info_reserve"
          @CancelReserve="CloseReserveInfo"
          :apartment-data="apartment_preview"
          :client-id="client_id"
        ></view-client>

        <edit-modal
          v-if="getPermission.apartments.edit || edit"
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

import Filter from "../Objects/Components/Filter/Apartment";
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
  },

  data() {
    return {
      filter: {
        filtered: false,
        rooms: [],
        floors: [],
        price_from: null,
        price_to: null,
        status: 0,
        usd: false,

        area_from: null,
        area_to: null,
      },

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
      currentPage: 0,
      perPage: 10,

      info_reserve: false,
      apartment_preview: {},

      info_manager: false,
      manager_apartment: {},

      sortBy: "number",
      sortDesc: false,
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
          key: "plan.area",
          label: "ПЛОЩАД",
          sortable: true,
          formatter: (value) => value + "м²",
        },
        {
          key: "balcony_area",
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
          sortable: true,
        },
        {
          key: "actions",
          label: "",
        },
      ],
    };
  },

  mounted() {
    this.getData();
  },
  beforeDestroy() {
    const tableScrollBody = this.$refs["my-table"].$el;
    tableScrollBody.removeEventListener("scroll", this.onScroll);
  },

  computed: {
    ...mapGetters(["getApartments", "getPermission", "getMe", "getLoading"]),
  },

  methods: {
    ...mapActions([
      "fetchApartments",
      "fetchApartmentsFilter",
      "fetchReserveClient",
    ]),

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
      } else {
        return null;
      }
    },

    async getData() {
      await this.fetchApartments(this);
      // setTimeout(() => {
      const tableScrollBody = this.$refs["my-table"].$el;
      /* Consider debouncing the event call */
      tableScrollBody.addEventListener("scroll", this.onScroll);
    },

    // scroll() {
    //   window.onscroll = async function() {
    //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    //       this.page = this.page + 1;
    //       if (this.getApartments.pagination.next)
    //         if (this.filter.filtered) {
    //           await this.fetchApartmentsFilter(this);
    //         } else await this.fetchApartments(this);
    //     }
    //   };
    // },

    async onScroll(event) {
      if (
        event.target.scrollTop + event.target.clientHeight >=
        event.target.scrollHeight
      ) {
        this.page = this.page + 1;
        if (this.getApartments.pagination.next)
          if (this.filter.filtered) {
            await this.fetchApartmentsFilter(this);
          } else await this.fetchApartments(this);
      }
    },

    getPrice(area, price) {
      return price * area;
    },

    moment: function () {
      return this.$moment();
    },

    Filtered(event) {
      this.page = 1;
      this.filter = event;
    },

    CreateReserve(id) {
      this.reserve = true;
      this.apartment_id = id;
    },

    CreateReserveSuccess() {
      this.fetchApartmentsFilter(this);
    },

    ReserveInfo(apartment) {
      this.info_reserve = true;
      this.apartment_preview = apartment;
      this.order_id = apartment.order.id;
      this.fetchReserveClient(this);
      // this.$bvModal.show('modal-view-client');
    },

    getInfoReserve(apartment) {
      this.info_manager = true;
      this.manager_apartment = apartment.order.user;
    },

    ManagerInfo() {
      this.info_manager = false;
      this.manager_apartment = {};
    },

    CloseReserveInfo() {
      this.info_reserve = false;
      this.apartment_preview = {};
      this.fetchApartmentsFilter(this);
    },

    async EditApartment() {
      this.apartment_id = 0;
      this.edit = false;

      if (this.filter.filtered) await this.fetchApartmentsFilter(this);
      else await this.fetchApartments(this);
    },

    CloseAgree() {
      this.confirm = false;
    },

    async successAgree(value) {
      this.selected.confirm = false;
      this.selected.values = [];

      this.contract = value;

      await this.fetchApartments(this);

      this.$bvModal.show("modal-success-agree");
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
        default:
          msg = "Свободен";
          break;
      }

      return msg;
    },
  },
};
</script>

<style scoped>
.dropdown-menu .active {
  background: transparent;
}

/*table {*/
/*    table-layout: fixed;*/
/*}*/

table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  /*width: 100px;*/
  background-color: #fff;
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

/*.table-responsive {*/
/*    width: 100%;*/
/*    max-height: 100%;*/
/*    overflow: hidden;*/
/*}*/
</style>
