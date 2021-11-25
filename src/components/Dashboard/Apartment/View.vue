<template>
  <main>
    <div class="app-content print-page">
      <div ref="document" id="printMe" :class="{'map-active': isMapActive}">
        <div class="row">
          <div class="col-md-9 pr-md-0 object-detail">
            <div class="new-object mb-0">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-lg-8 pr-md-0 border-right">
                    <!-- building__img -->
                    <div class="building">
                      <div class="building__img">
                        <img
                          :data-fancybox="getApartment.plan.image"
                          v-lazy="getApartment.plan.image"
                          width="100%"
                        />
                      </div>
                    </div>
                    <!-- building__info -->
                    <div>
                      <p class="building__info mt-2 mb-1">
                        <i
                          style="color: #4C0852"
                          class="far fa-map-marker-alt"
                        ></i>
                        Адрес: {{ getApartment.object.name }} -
                        {{ getApartment.number }},
                        {{ getApartment.block.name }},
                        {{ getApartment.building.name }}
                      </p>
                      <div class="building__info d-flex align-items-center">
                        <p>
                          <i style="color: #4C0852" class="far fa-spinner"></i>
                          {{ $t("apartments.view.status") }}:
                        </p>

                        <div
                          :class="[
                            getApartment.order === 'booked'
                              ? 'text-warning ml-3'
                              : '',
                            getApartment.order.status === 'sold' ||
                            getApartment.order.status === 'contract'
                              ? 'text-danger ml-3'
                              : 'text-success ml-3',
                          ]"
                        >
                          {{
                            getApartment.order.status
                              | getStatus(
                                $moment(getApartment.order.booking_date).format(
                                  "DD.MM.YYYY"
                                )
                              )
                          }}
                        </div>
                      </div>
                      <div
                        class="building__info mb-3 d-flex align-items-center"
                      >
                        <p>
                          <i
                            style="color: #4C0852"
                            class="far fa-calendar-check"
                          ></i>
                          Дата завершения строительства :
                        </p>

                        <div class="ml-3">11.12.2022</div>
                      </div>
                    </div>
                    <hr />
                    <!-- apartment info -->
                    <div class="row">
                      <div class="col-md-4 mb-4">
                        <p class="mb-1">{{ $t("apartments.view.number") }}:</p>
                        <h5>
                          <i style="color: #4C0852" class="far fa-building"></i>
                          {{ getApartment.number }}
                        </h5>
                      </div>
                      <div class="col-md-4 mb-4">
                        <p class="mb-1">{{ $t("apartments.view.area") }}:</p>
                        <h5>
                          <i style="color: #4C0852" class="far fa-expand"></i>
                          {{ getApartment.plan.area }} м²
                        </h5>
                      </div>
                      <div class="col-md-4 mb-4">
                        <p class="mb-1">{{ $t("apartments.list.balcony") }}:</p>
                        <h5>
                          <i style="color: #4C0852" class="far fa-inbox"></i>
                          <span v-if="getApartment.plan.balcony">
                            {{ getApartment.plan.balcony_area }} м²
                          </span>

                          <span v-else>
                            {{ $t("no") }}
                          </span>
                        </h5>
                      </div>
                      <div class="col-md-4 mb-4">
                        <p class="mb-1">{{ $t("apartments.view.rooms") }}:</p>
                        <h5>
                          <i
                            style="color: #4C0852"
                            class="far fa-door-open"
                          ></i>
                          {{ getApartment.rooms }}
                        </h5>
                      </div>
                      <div class="col-md-4 mb-4">
                        <p class="mb-1">{{ $t("apartments.view.floor") }}:</p>
                        <h5>
                          <i style="color: #4C0852" class="far fa-industry"></i>
                          {{ getApartment.floor }}
                        </h5>
                      </div>
                      <!-- <div class="col-md-4 mb-4">
                        <p>{{ $t("apartments.view.price_m2") }}:</p>
                        <h5>
                          {{
                            getApartment.price_m2
                              | number("0,0.00", {
                                thousandsSeparator: " ",
                                decimalSeparator: ",",
                              })
                          }}
                          {{ $t("ye") }}
                        </h5>
                      </div>
                      <div class="col-md-4 mb-4">
                        <p>{{ $t("apartments.view.total_price") }}:</p>
                        <h5>
                          {{
                            getApartment.price
                              | number("0,0.00", {
                                thousandsSeparator: " ",
                                decimalSeparator: ",",
                              })
                          }}
                          {{ $t("ye") }}
                        </h5>
                      </div> -->
                    </div>
                  </div>
                  <div class="col-md-4">
                    <!-- object-calculator -->
                    <div class="object-calculator">
                      <b-form-group
                        class="mb-1"
                        label-cols="12"
                        content-cols="12"
                        :label="
                          $t('apartments.agree.placeholder.enter_discount')
                        "
                        label-for="discounts"
                      >
                        <b-form-select
                          id="discounts"
                          v-model="client.discount"
                          @change="ChangeDiscount()"
                        >
                          <b-form-select-option
                            v-for="(discount, index) in getApartmentDiscounts"
                            :value="discount"
                            :key="'discounts' + index"
                          >
                            {{ $t("apartments.view.variant") }}
                            {{ index + 1 }} - {{ discount.prepay_to }}%
                          </b-form-select-option>
                        </b-form-select>
                      </b-form-group>

                      <b-form-group
                        class="mb-1"
                        label-cols="12"
                        content-cols="12"
                        label="Цена продажы за м2:"
                        label-for="price"
                      >
                        <b-form-input
                          id="price"
                          @change="changePrice_price_for_m2"
                          v-model="client.price_for_m2"
                        ></b-form-input>
                        <span
                          style="position: absolute; right: 20px; top: 6px"
                          >{{ $t("ye") }}</span
                        >
                      </b-form-group>

                      <b-form-group
                        class="mb-1"
                        label-cols="12"
                        content-cols="12"
                        label="Скидка:"
                        label-for="discound-price"
                      >
                        <b-form-input
                          id="discound-price"
                          @change="
                            changePrice_price_for_m2(client.discount_price)
                          "
                          v-model="client.discount_price"
                        >
                        </b-form-input>
                        <span
                          style="position: absolute; right: 20px; top: 6px"
                          >{{ $t("ye") }}</span
                        >
                      </b-form-group>

                      <b-form-group
                        class="mb-1"
                        id="total"
                        label-cols="12"
                        content-cols="12"
                        label="Общ. цена:"
                        label-for="total-price"
                      >
                        <b-form-input
                          id="total-price"
                          @change="changePrice_price_for_m2(client.total_price)"
                          v-model="client.total_price"
                        ></b-form-input>
                        <span
                          style="position: absolute; right: 20px; top: 6px"
                          >{{ $t("ye") }}</span
                        >
                      </b-form-group>
                    </div>
                    <hr />
                    <div class="object-sales-type">
                      <Discount
                        v-if="
                          getApartment.object.credit_month != 0 ||
                            client.discount.prepay_to != 100
                        "
                        :discount="client.discount"
                        :apartment="getApartment"
                      ></Discount>
                    </div>
                  </div>
                </div>
              </div>
              <div class="container-fluid footer-btns">
                <div
                  class="
                    mt-md-5
                    d-flex
                    justify-content-start
                    w-100
                    flex-md-row flex-column
                  "
                >
                  <div v-if="!print">+998 55 501 74 00</div>

                  <div
                    v-if="print"
                    class="
                      d-flex
                      justify-content-end
                      w-100
                      flex-md-row flex-column
                    "
                  >
                    <button
                      class="mr-md-2 mr-0 btn btn-info"
                      type="button"
                      @click="printPage"
                    >
                      <i class="fa fa-print"></i> Печать
                    </button>
                    <b-button
                      v-if="
                        (getApartment.order.status === 'booked' &&
                          getApartment.order.user.id === getMe.user.id &&
                          (getPermission.apartments.root_contract ||
                            getPermission.apartments.reserve_cancel)) ||
                          (getMe.role.id === 1 &&
                            getApartment.order.status === 'booked')
                      "
                      type="button"
                      @click="cancelReserve"
                      class="ml-1"
                      variant="light"
                    >
                      <i class="fas fa-eraser"></i>
                      {{ $t("apartments.list.cancel_reserve") }}
                    </b-button>

                    <b-link
                      v-if="
                        (getApartment.order.status === 'booked' &&
                          getApartment.order.user.id === getMe.user.id) ||
                          (getMe.role.id === 1 &&
                            getApartment.order.status === 'booked')
                      "
                      @click="ReserveInfo(getApartment)"
                      v-b-modal.modal-view-client
                      class="mr-md-2 mr-0 btn btn-secondary ml-1"
                    >
                      <i class="far fa-eye"></i>
                      {{ $t("apartments.list.view_client") }}
                    </b-link>

                    <b-button
                      class="mr-md-2 mr-0 btn btn-primary ml-1"
                      v-if="
                        getPermission.apartments.reserve &&
                          getApartment.order.status === 'available'
                      "
                      @click="
                        [(reserve = true), (apartment_id = getApartment.id)]
                      "
                      v-b-modal.modal-create
                    >
                      <i class="far fa-calendar-check"></i>
                      {{ $t("apartments.list.book") }}
                    </b-button>

                    <b-button
                      v-b-modal.modal-agree
                      @click="ConfirmFindUser"
                      variant="primary"
                      class="mr-md-2 mr-0 btn btn-primary ml-1"
                      v-if="
                        ((getApartment.order.status != 'sold' ||
                          getApartment.order.status != 'contract') &&
                          getApartment.order.status === 'booked' &&
                          getApartment.order.user.id === getMe.user.id &&
                          getPermission.apartments.contract) ||
                          (!(
                            getApartment.order.status == 'sold' ||
                            getApartment.order.status == 'contract'
                          ) &&
                            getPermission.apartments.root_contract) ||
                          ((getApartment.order.status != 'sold' ||
                            getApartment.order.status != 'contract') &&
                            getApartment.order.status === 'available' &&
                            getPermission.apartments.contract)
                      "
                    >
                      <!--                    getApartment.order.status != 'contract'  || getApartment.order.status === 'booked' && getApartment.order.user.id === getMe.user.id && getPermission.apartments.contract || getApartment.order.status != 'sold' &&  getPermission.apartments.root_contract || getApartment.order.status === 'available' && getPermission.apartments.contract-->
                      <i class="far fa-ballot-check"></i>
                      {{ $t("apartments.list.confirm") }}
                    </b-button>

                    <router-link
                      :to="{
                        name: 'contracts-view',
                        params: {id: getApartment.order.id},
                      }"
                      :class="'btn btn-primary ml-md-1 mr-0 mr-md-2'"
                      v-if="
                        (getPermission.apartments.contract &&
                          (getApartment.order.status === 'sold' ||
                            getApartment.order.status === 'contract') &&
                          getMe.user.id === getApartment.order.user.id) ||
                          (getPermission.apartments.root_contract &&
                            (getApartment.order.status === 'sold' ||
                              getApartment.order.status === 'contract')) ||
                          (getMe.role.id === 1 &&
                            (getApartment.order.status === 'sold' ||
                              getApartment.order.status === 'contract'))
                      "
                    >
                      <i class="far fa-file-signature"></i>
                      {{ $t("apartments.list.contract") }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="map"
            :class="
              isMapActive ? 'map-active' : 'col-md-3 pl-md-0 position-relative'
            "
          >
            <button
              class="rounded-circle toggle-map"
              @click="isMapActive = !isMapActive"
            >
              <i
                class="fal"
                :class="
                  isMapActive ? 'fa-angle-double-right' : 'fa-angle-double-left'
                "
              ></i>
            </button>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1146.2114613463111!2d69.29439953162031!3d41.364364578204004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aef3bcc92f7007%3A0x266c2ac0df27fccf!2sXon%20Saroy!5e0!3m2!1suz!2s!4v1637674022659!5m2!1suz!2s"
              width="100%"
              height="100%"
              style="border:0;"
            ></iframe>
          </div>
        </div>
      </div>

      <div class="container-fluid mt-4" v-if="false">
        <div class="row">
          <div
            class="col-lg-4 my-2"
            v-for="(discount, index) in getApartment.discounts"
            :key="index"
          >
            <Discount
              v-if="
                getApartment.object.credit_month != 0 ||
                  discount.prepay_to === 100
              "
              :discount="discount"
              :apartment="getApartment"
            ></Discount>
          </div>
        </div>
      </div>

      <view-client
        v-if="info_reserve"
        @CancelReserve="CloseReserveInfo"
        :apartment-data="apartment_preview"
      ></view-client>

      <reserve-add
        v-if="reserve | getPermission.apartments.reserve"
        :apartment="apartment_id"
        @CreateReserve="CreateReserveSuccess"
      ></reserve-add>

      <agree-modal
        v-if="confirm"
        :apartment="getApartment"
        @successAgree="successAgree"
        @CloseAgree="CloseAgree"
      ></agree-modal>
    </div>
  </main>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import ViewClient from "./ViewClient";
import ReserveAdd from "./Components/Reserve";
import Agree from "./Components/Agree";
import Discount from "./Components/Discount";

import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
export default {
  components: {
    "view-client": ViewClient,
    "reserve-add": ReserveAdd,
    "agree-modal": Agree,
    Discount: Discount,
  },

  data() {
    return {
      apartment_preview: {},
      reserve: false,
      apartment_id: 0,
      order_id: 0,
      edit: false,
      confirm: false,
      isConfirm: false,

      info_reserve: false,
      client: {
        discount: "",
        price_for_m2: 0,
        discount_price: 0,
        total_price: 0,
      },

      contract: {
        id: null,
        contract: null,
        contract_path: null,
      },

      print: true,

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },

      isMapActive: false,
    };
  },

  mounted() {
    this.fetchApartment(this).then(() => {
      this.client.discount = this.getApartmentDiscounts[0];
      this.client.price_for_m2 = this.apartment.price_m2;
      this.client.total_price = this.apartment.price;
    });
    Fancybox.bind("[data-fancybox]");
  },
  computed: {
    ...mapGetters([
      "getApartment",
      "getMe",
      "getPermission",
      "getReserveClient",
    ]),
    getApartmentDiscounts() {
      let arr = this.apartment.discounts;
      if (this.apartment.object.credit_month != 0) {
        // arr = arr.map((a) => a.prepay_to);
        return arr.sort((a, b) => a.prepay_to - b.prepay_to);
      }

      return [];
    },
    apartment() {
      return this.getApartment;
    },
  },

  methods: {
    formatTo(item) {
      return (Math.round(item * 100) / 100)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    changePrice_price_for_m2(val) {
      console.log(val);
      this.client.total_price
    },
    getDiscount() {
      this.client.discount = this.discount;
    },
    ...mapActions(["fetchApartment", "fetchReserveClient"]),
    ChangeDiscount() {
      console.log(this.client.discount);
    },

    printPage() {
      window.print();
    },

    ReserveInfo(apartment) {
      this.info_reserve = true;
      this.apartment_preview = apartment;
      this.order_id = apartment.order.id;
      this.fetchReserveClient(this);
    },

    CreateReserveSuccess() {
      this.fetchApartment(this);
    },

    getPrice(area, price) {
      return price * area;
    },

    CloseReserveInfo() {
      this.info_reserve = false;
      this.apartment_preview = {};
      this.fetchApartment(this);
    },

    ConfirmFindUser() {
      this.$router.push({name: "confirm-apartment"});
    },

    CloseAgree() {
      this.confirm = false;
    },

    successAgree(value) {
      this.fetchApartment(this);
      this.contract = value;
      this.$bvModal.show("modal-success-agree");
    },

    async cancelReserve() {
      this.order_id = this.getApartment.order.id;
      this.fetchReserveClient(this);
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_reserve"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_cancel_reserve"),
      }).then((result) => {
        if (result.value) {
          this.axios
            .delete(
              process.env.VUE_APP_URL +
                "/orders/" +
                this.getReserveClient.id +
                "/reserve",
              this.header
            )
            .then((response) => {
              this.toasted(response.data.message, "success");

              this.$nextTick(() => {
                this.$bvModal.hide("modal-view-client");
              });

              this.fetchApartment(this);

              this.$swal(this.$t("sweetAlert.canceled_reserve"), "", "success");
            })
            .catch((error) => {
              if (!error.response) {
                this.toasted("Error: Network Error", "error");
              } else {
                if (error.response.status === 403) {
                  this.toasted(error.response.data.message, "error");
                } else if (error.response.status === 401) {
                  this.toasted(error.response.data.message, "error");
                } else if (error.response.status === 500) {
                  this.toasted(error.response.data.message, "error");
                } else {
                  this.error = true;
                  this.errors = error.response.data.errors;
                }
              }
            });
        }
      });
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
<style lang="scss">
.building__img img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  cursor: pointer;
}

.toggle-map {
  top: 48%;
  left: -20px;
  transform: translateY(-50%);
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: white;
  border: 1px solid #b8b8b8;

  @media screen and (max-width: 576px) {
    display: none;
  }
}

@media screen and (min-width: 576px) {
  .map-active {
    position: relative;
    right: 0;
    .map-active {
      width: 100%;
      position: absolute;
      height: 100%;
      z-index: 112;
      right: 0;

      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
}
@media screen and (max-width: 576px) {
  map {
    margin-top: 30px;
  }
  iframe {
    height: 400px;
  }
}
</style>
