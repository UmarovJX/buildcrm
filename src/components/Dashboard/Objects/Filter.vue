<script>
import { mapActions, mapGetters } from "vuex";
import Filter from "./Components/Filter/All";
import ReserveAdd from "../Apartment/Components/Reserve";
import ViewClient from "../Apartment/ViewClient";

export default {
  components: {
    "filter-form": Filter,
    "reserve-add": ReserveAdd,
    "view-client": ViewClient,
  },

  data: () => ({
    filter: {
      rooms: [],
      floors: [],
      price_from: null,
      price_to: null,
      status: 0,

      objects: [],
      area_from: null,
      area_to: null,
    },

    reserve: false,
    info_reserve: false,
    apartment_preview: {},
    client_id: 0,

    apartment_id: 0,
  }),

  mounted() {
    this.fetchObjects(this);
    this.fetchFilterApartments(this);
  },

  computed: mapGetters([
    "getObjects",
    "getFilteredApartments",
    "getPermission",
    "getMe",
    "getLoading",
  ]),

  methods: {
    ...mapActions([
      "fetchFilterApartments",
      "fetchObjects",
      "fetchReserveClient",
    ]),

    getPrice(area, price) {
      return price * area;
    },

    moment: function () {
      return this.$moment();
    },

    Filtered(event) {
      this.filter = event;
    },

    CreateReserve(id) {
      this.reserve = true;
      this.apartment_id = id;
    },

    CreateReserveSuccess() {
      this.fetchFilterApartments(this);
    },

    ReserveInfo(apartment) {
      this.info_reserve = true;
      this.apartment_preview = apartment;
      this.client_id = apartment.client_id;
      this.fetchReserveClient(this);
      // this.$bvModal.show('modal-view-status');
    },

    CloseReserveInfo() {
      this.info_reserve = false;
      this.apartment_preview = {};
      this.fetchApartmentsFilter(this);
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
        default:
          msg = "Свободен";
          break;
      }

      return msg;
    },
  },
};
</script>

<template>
  <div>
    <div class="mt-4">
      <div class="title__default my-2">
        {{ $t("apartments.list.apartments") }}:
        {{ getFilteredApartments.length }}
      </div>
    </div>
    <div class="mt-4">
      <div class="table-responsive">
        <table class="table table-borderless my-table my-table-second">
          <thead>
            <tr>
              <th scope="col" width="50">
                {{ $t("apartments.list.number") }}
              </th>
              <th scope="col">{{ $t("apartments.list.object") }}</th>
              <th scope="col">{{ $t("apartments.list.building") }}</th>
              <th scope="col">{{ $t("apartments.list.block") }}</th>
              <th scope="col" class="text-center">
                {{ $t("apartments.list.rooms") }}
              </th>
              <th scope="col" class="text-center">
                {{ $t("apartments.list.floor") }}
              </th>
              <th scope="col" class="text-center">
                {{ $t("apartments.list.area") }}
              </th>
              <th scope="col">{{ $t("apartments.list.price") }}</th>
              <th scope="col">{{ $t("apartments.list.status") }}</th>
              <th scope="col" class="text-right"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="getLoading">
              <td colspan="10" style="">
                <div class="d-flex justify-content-center w-100">
                  <div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="getFilteredApartments.length === 0 && !getLoading">
              <td colspan="10">
                <center>
                  {{ $t("no_data") }}
                </center>
              </td>
            </tr>

            <tr
              v-for="(apartment, index) in getFilteredApartments"
              :key="index"
              :class="[
                apartment.status === 'booked' ? 'table-warning' : '',
                apartment.status === 'sold' ? 'table-danger' : '',
              ]"
            >
              <td scope="row">
                {{ apartment.number }}
              </td>

              <td>
                {{ apartment.block.building.object.name }}
              </td>

              <td>
                {{ apartment.block.building.name }}
              </td>

              <td>
                {{ apartment.block.name }}
              </td>

              <td class="text-center">
                {{ apartment.rooms }}
              </td>

              <td class="text-center">
                {{ apartment.floor }}
              </td>

              <td class="text-center">
                {{ apartment.area }}
              </td>

              <td>
                {{
                  getPrice(apartment.area, apartment.price.price)
                    | number("0,0.00", {
                      thousandsSeparator: " ",
                      decimalSeparator: ",",
                    })
                }}
                сум
              </td>
              <td>
                <small>{{
                  apartment.status
                    | getStatus(
                      $moment(apartment.booking_date).format("DD.MM.YYYY")
                    )
                }}</small>
              </td>
              <td>
                <div
                  class="dropdown my-dropdown dropleft"
                  v-if="
                    !apartment.status ||
                    apartment.manager_id === getMe.user.id ||
                    getMe.role.id === 1
                  "
                >
                  <button
                    type="button"
                    class="dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    <i class="far fa-ellipsis-h"></i>
                  </button>
                  <div class="dropdown-menu">
                    <b-link
                      v-if="
                        getPermission.apartments.reserve && !apartment.status
                      "
                      @click="[(reserve = true), (apartment_id = apartment.id)]"
                      v-b-modal.modal-create
                      class="dropdown-item dropdown-item--inside"
                    >
                      <i class="far fa-calendar-check"></i>
                      {{ $t("apartments.list.book") }}
                    </b-link>

                    <b-link
                      v-if="
                        (apartment.status === 2 &&
                          apartment.manager_id === getMe.user.id) ||
                        (getMe.role.id === 1 && apartment.status === 2)
                      "
                      @click="ReserveInfo(apartment)"
                      v-b-modal.modal-view-client
                      class="dropdown-item dropdown-item--inside"
                    >
                      <i class="far fa-eye"></i>
                      {{ $t("apartments.list.view_client") }}
                    </b-link>

                    <router-link
                      :to="{
                        name: 'apartment-view',
                        params: { id: apartment.id },
                      }"
                      :class="'dropdown-item dropdown-item--inside'"
                      v-if="apartment.status != 1"
                    >
                      <i class="far fa-ballot-check"></i>
                      {{ $t("apartments.list.confirm") }}
                    </router-link>

                    <a
                      class="dropdown-item dropdown-item--inside"
                      href="product-item.html"
                      v-if="apartment.status === 1"
                    >
                      <i class="far fa-eye"></i>
                      {{ $t("apartments.list.more") }}
                    </a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="" v-if="getPermission.apartments.filter">
      <div class="d-flex justify-content-md-end justify-content-center">
        <b-link class="btn btn-primary mr-0" v-b-modal.modal-filter-all>
          <i class="far fa-sliders-h mr-2"></i>
          {{ $t("apartments.list.filter") }}
        </b-link>
      </div>
    </div>

    <reserve-add
      v-if="reserve || getPermission.apartments.reserve"
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
  </div>
</template>

<style scoped></style>
