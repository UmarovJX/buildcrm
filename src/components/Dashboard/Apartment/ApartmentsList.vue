<template>
  <main>
    <div class="app-content apartment-list-filter">
      <base-bread-crumb
          :bread-crumbs="breadCrumbs"
          :active-content="activeContent"
          class="mb-4"
      ></base-bread-crumb>

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
            v-if="showApartmentsContract"
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

          <b-button
              v-b-modal.booking-creation-modal
              v-if="bookingPermission"
              class="mr-md-2 mr-0 mt-md-0 btn btn-primary order-4 booking__button"
          >
            <i class="far fa-calendar-check"></i>
            {{ $t("objects.booking") }}
          </b-button>

          <button
              v-if="selected.view && getPermission.apartments.contract"
              class="btn btn-warning mr-md-2 mr-0 mt-md-0 order-2"
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
          <i class="fas fa-filter"></i>
          <i class="far fa-sliders-h mr-2"></i>
          {{ $t("apartments.list.filter") }}
        </button>
      </div>

      <!--  TODO: FILTER SECTION    -->
      <base-filter-tabs-content
          @get-new-content="getFilterTabsContent"
          :filter-tab-list="filterTabList"
      />
      <!--  TODO: END OF FILTER SECTION    -->

      <div>
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
            <span class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}
            </span>
          </template>

          <!--          <template #cell(is_promo)="data" class="text-center">-->
          <!--            <span v-if="data.item.is_promo">-->
          <!--              <i class="fal fa-gift"></i>-->
          <!--            </span>-->
          <!--          </template>-->

          <template #cell(number)="data" class="p-0">
            <div class="position-relative">
              <div v-if="!data.item.is_sold" class="apartments__lock">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    class="svg-lock-button"
                >
                  <path
                      d="M17 9V7C17 4.2 14.8 2 12 2C9.2 2 7 4.2 7 7V9C5.3 9 4 10.3 4 12V19C4 20.7 5.3 22 7 22H17C18.7 22 20 20.7 20 19V12C20 10.3 18.7 9 17 9ZM9 7C9 5.3 10.3 4 12 4C13.7 4 15 5.3 15 7V9H9V7Z"
                  />
                </svg>
              </div>
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
                  <template v-if="hasPermission">
                    <!-- Редактировать -->
                    <b-link
                        class="dropdown-item dropdown-item--inside"
                        @click="[(edit = true), (apartment_id = data.item.id)]"
                        v-b-modal.modal-edit
                    >
                      <i class="far fa-pencil"></i> {{ $t("edit") }}
                    </b-link>


                    <!--        Вернуть к продаже          -->
                    <b-link
                        v-if="data.item.is_sold && data.item.order.status === 'available'"
                        @click="toggleApartmentToSale(data.item)"
                        class="dropdown-item dropdown-item--inside"
                    >
                      <i class="far fa-unlock"></i> {{ $t("remove_from_sale") }}
                    </b-link>

                    <b-link
                        v-if="!data.item.is_sold && data.item.order.status === 'available'"
                        @click="toggleApartmentToSale(data.item)"
                        class="dropdown-item dropdown-item--inside"
                    >
                      <i class="far fa-lock"></i> {{ $t("return_to_sale") }}
                    </b-link>
                  </template>

                  <!--  Забронировать -->
                  <b-link
                      v-if="
                      data.item.is_sold &&
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
                      v-if="clientsView(data)"
                      @click="ReserveInfo(data.item)"
                      class="dropdown-item dropdown-item--inside"
                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.view_client") }}
                  </b-link>

                  <!--  Информация о менеджера  -->
                  <b-link
                      v-if="data.item.order.status === 'booked' && data.item.order.user.id !== getMe.user.id
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

                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.more") }}
                  </router-link>

                  <!-- Подробная информация  -->

                  <!--  Оформить -->
                  <b-link
                      @click="orderHold([data.item.id])"
                      :class="'dropdown-item dropdown-item--inside'"
                      v-if="allowViewWhenProcessing(data) && !statusHold(data)"
                  >
                    <i class="far fa-ballot-check"></i>
                    {{ $t("apartments.list.confirm") }}
                  </b-link>

                  <!--  Оформить when processing  -->
                  <b-link
                      @click="goOrderHold([data.item.order.id])"
                      :class="'dropdown-item dropdown-item--inside'"
                      v-if="allowViewWhenProcessing(data) && statusHold(data)"
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
            reserve || getPermission.apartments &&
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
    <apartments-booking-modal @set-client-data="bookSelectedApartments" />
  </main>
</template>

<script>
import {mapActions, mapMutations, mapGetters} from "vuex";
import {BAlert, BButton} from "bootstrap-vue";
import ViewClient from "./ViewClient";
import InfoManager from "./InfoManager";
import ReserveAdd from "./Components/Reserve";
import EditApartment from "./Components/Edit";
import Filter from "./Components/ApartmentsFilter";
import SuccessAgree from "./Components/SuccessAgree";
import AgreeMultiple from "./Components/AgreeMultiple";
import ApartmentsBookingModal from "@/components/Dashboard/Apartment/Components/ApartmentsBookingModal";
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import api from "@/services/api"

export default {
  components: {
    "filter-form": Filter,
    "reserve-add": ReserveAdd,
    "view-client": ViewClient,
    "edit-modal": EditApartment,
    "info-manager-modal": InfoManager,
    "agree-modal": AgreeMultiple,
    "success-agree": SuccessAgree,
    ApartmentsBookingModal,
    BaseFilterTabsContent,
    BaseBreadCrumb,
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
    }
  },

  created() {
    this.filter = {
      ...this.$route.query,
    }

    // const id = this.$route.params.object
    // api.apartments.getApartmentsList(id)
    //     .then(response => {
    //       this.items = response.data.items
    //       this.pagination = response.data.pagination
    //     })
    this.currentPage = Number(this.filter.page);
    this.loading = this.getLoading;

    this.fetchApartments(this)
    this.getUnfinishedOrders();
  },

  computed: {
    ...mapGetters(["getApartments", "getPermission", "getMe", "getLoading"]),
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
      if (this.getApartments.pagination.total) {
        return this.getApartments.pagination.total;
      }
      return 1;
    },
    items() {
      return this.getApartments.items;
    },
    filterTabList() {
      return [
        {
          name: this.$t('apartments.tab_names.all'),
          status: 'all'
        },
        {
          name: this.$t('apartments.tab_names.available'),
          status: 'available'
        },
        {
          name: this.$t('apartments.tab_names.booked'),
          status: 'booked'
        },
        {
          name: this.$t('apartments.tab_names.promo'),
          status: 'promo'
        },
        {
          name: this.$t('apartments.tab_names.sold'),
          status: 'sold'
        },
        {
          name: this.$t('apartments.tab_names.unavailable'),
          status: 'unavailable'
        }
      ]
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
          routeName: 'objects',
          textContent: this.$t('objects.title')
        },
        {
          routeName: 'apartments',
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
    }
  },

  methods: {
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
    async getFilterTabsContent(status) {
      this.filter.status = status
      this.scrollActive = false;
      delete this.filter.page
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
        name: "apartments",
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
</style>
