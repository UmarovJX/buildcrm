<template>
  <main>
    <div v-if="Object.keys(apartment).length" class="app-content print-page">
      <base-bread-crumb
          :bread-crumbs="breadCrumbs"
          :active-content="activeContent"
          class="mb-4"
      >
      </base-bread-crumb>

      <div ref="document" id="printMe" :class="{'map-active': isMapActive}">
        <h3 class="text-center heading-for-print">
          "Xon Saroy" - Уверенный шаг к вашим мечтам!
        </h3>
        <div class="row">
          <div class="col-md-9 pr-md-0 object-detail">
            <div class="new-object mb-0">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-lg-8 pr-md-0 border-right">
                    <!-- building__img -->
                    <div class="building">
                      <div class="building__img" v-if="apartment.plan">
                        <img
                            :data-fancybox="apartment.plan.image"
                            v-lazy="apartment.plan.image"
                            width="100%"
                        />
                      </div>
                    </div>
                    <!-- building__info -->
                    <div v-if="apartment.object">
                      <!-- Объект -->
                      <p class="building__info mt-2 mb-1">
                        <i class="far fa-building"></i>
                        {{ $t("apartments.view.object") }}: {{ apartment.object.name }},
                        {{ apartment.building.name }},
                        {{ apartment.block.name }}

                        <span class="promo__marker" v-if="hasPromo">
                          {{ $t('promo.in_promo') }}
                        </span>
                      </p>
                      <!-- Адрес -->
                      <p class="building__info mt-2 mb-1">
                        <i class="far fa-map-marker-alt"></i>
                        {{ $t("apartments.view.address") }}: {{ apartment.object.address }}
                      </p>
                      <!-- Status -->
                      <div
                          class="building__info building__info-for-print d-flex align-items-center"
                      >
                        <p>
                          <i class="far fa-spinner"></i>
                          {{ $t("apartments.view.status") }}:
                        </p>

                        <div
                            :class="[
                            apartment.order === 'booked'
                              ? 'text-warning ml-3'
                              : '',
                            (apartment.order &&
                              apartment.order.status === 'sold') ||
                            (apartment.order &&
                              apartment.order.status === 'contract')
                              ? 'text-danger ml-3'
                              : 'text-success ml-3',
                            apartment.order &&
                            apartment.order.status === 'hold'
                              ? 'text-warning ml-3'
                              : 'text-success ml-3',
                          ]"
                        >
                          {{
                            apartment.order.status | getStatus($moment(apartment.order.booking_date).format("DD.MM.YYYY"))
                          }}
                        </div>
                      </div>
                      <!-- Дата завершения строительства -->
                      <div
                          class="building__info mb-3 d-flex align-items-center"
                      >
                        <p>
                          <i class="far fa-calendar-check"></i>
                          {{ $t("apartments.view.completion_date") }}:
                        </p>

                        <div class="ml-3">
                          {{ momentQuarter(apartment.object.build_date) }} -
                          четверть
                          {{ apartment.object.build_date | moment("YYYY") }}
                          года
                        </div>
                        <!-- первый четверть 2022 года -->
                      </div>
                    </div>

                    <hr/>

                    <!-- apartment info -->
                    <div class="row">
                      <div class="col-md-4 col-6 mb-4">
                        <p class="mb-1">{{ $t("apartments.view.number") }}:</p>
                        <h5>
                          <i class="far fa-building"></i>
                          {{ apartment.number }}
                        </h5>
                      </div>
                      <div class="col-md-4 col-6 mb-4" v-if="apartment.plan">
                        <p class="mb-1">{{ $t("apartments.view.area") }}:</p>
                        <h5>
                          <i class="far fa-expand"></i>
                          {{ apartment.plan.area }} м²
                        </h5>
                      </div>
                      <div class="col-md-4 col-6 mb-4" v-if="apartment.plan">
                        <p class="mb-1">{{ $t("apartments.list.balcony") }}:</p>
                        <h5>
                          <i class="far fa-inbox"></i>
                          <span v-if="apartment.plan.balcony">
                            {{ apartment.plan.balcony_area }} м²
                          </span>

                          <span v-else>
                            {{ $t("no") }}
                          </span>
                        </h5>
                      </div>
                      <div
                          class="col-md-4 col-6 mb-4"
                          v-if="apartment.rooms"
                      >
                        <p class="mb-1">{{ $t("apartments.view.rooms") }}:</p>
                        <h5>
                          <i class="far fa-door-open"></i>
                          {{ apartment.rooms }}
                        </h5>
                      </div>
                      <div class="col-md-4 col-6 mb-4">
                        <p class="mb-1">{{ $t("apartments.view.floor") }}:</p>
                        <h5>
                          <i class="far fa-industry"></i>
                          {{ apartment.floor }}
                        </h5>
                      </div>
                      <div
                          class="col-md-4 col-6 mb-4"
                          v-if="apartment.block"
                      >
                        <p class="mb-1">{{ $t("apartments.view.number_of_blocks") }}:</p>
                        <h5>
                          <i class="far fa-align-justify"></i>
                          {{ apartment.block.floors }}
                        </h5>
                      </div>
                    </div>

                    <div class="datas-for-print">
                      <div class="table-for-print">
                        <hr/>
                        <h4>Условия оплаты</h4>
                        <table class="table">
                          <thead class="thead-dark">
                          <tr>
                            <th>Вариант оплаты</th>
                            <th>Цена продажы за м2</th>
                            <th>Скидка за м2</th>
                            <th>Итого</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td>{{ calc.prepay_percente }}%</td>
                            <td>
                              {{
                                calc.price_for_m2
                                    | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                              }}
                              сум
                            </td>
                            <td>
                              {{
                                calc.discount_price
                                    | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                              }}
                              сум
                            </td>
                            <td>
                              {{
                                calc.total
                                    | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                              }}
                              сум
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <div
                          class="table-for-print pt-5"
                          v-show="calc.prepay_percente !== 100"
                      >
                        <table class="table">
                          <thead class="thead-dark">
                          <tr>
                            <th>Число</th>
                            <th>Тип оплаты</th>
                            <th>Сумма оплаты</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td>-</td>
                            <td>Первый взнос</td>
                            <td>
                              {{
                                calc.prepay
                                    | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                              }}
                              сум
                            </td>
                          </tr>
                          <tr>
                            <td>{{ calc.month }} месяцев</td>
                            <td>Ежемесячная</td>
                            <td>
                              {{
                                calc.monthly_price
                                    | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                              }}
                              сум
                            </td>
                          </tr>
                          <tr>
                            <!-- <td></td> -->
                            <td colspan="2">Итого</td>
                            <td>
                              {{
                                calc.total
                                    | number("0,0.00", {
                                  thousandsSeparator: " ",
                                  decimalSeparator: ",",
                                })
                              }}
                              сум
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="socials-for-print">
                        <hr/>
                        <h4>Свяжитесь с нами!</h4>
                        <ul>
                          <li>
                            <a href="https://xonsaroy.uz"
                            ><i class="far fa-globe"></i> Xonsaroy.uz</a
                            >
                          </li>
                          <li>
                            <a href="https://www.instagram.com/xonsaroyuz/"
                            ><i class="fab fa-instagram"></i> Xonsaroyuz</a
                            >
                          </li>
                          <li>
                            <a href="https://www.facebook.com/xonsaroyuz"
                            ><i class="fab fa-facebook"></i> Xonsaroyuz</a
                            >
                          </li>
                          <li>
                            <a href="https://t.me/xonsaroyuz"
                            ><i class="fab fa-telegram"></i> Xonsaroyuz</a
                            >
                          </li>
                          <li>
                            <a href="tel:+998555017400"
                            >
                              <i class="far fa-phone-alt"></i>
                              +998 55 501 74 00
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 Calc">
                    <!-- Calc -->
                    <Discount
                        v-if="otherGetApartment"
                        :apartment="apartment"
                        @getCalData="getCalData"
                    ></Discount>
                  </div>
                </div>
              </div>
              <!-- footer-btns -->
              <div class="container-fluid footer-btns">
                <div
                    class="
                      mt-3
                      d-flex
                      justify-content-end
                      w-100
                      flex-md-row flex-column
                    "
                >
                  <!-- Печать -->
                  <button
                      class="mr-md-2 mr-0 btn btn-info"
                      type="button"
                      @click="printPage"
                  >
                    <i class="fa fa-print"></i> {{ $t('apartments.view.print') }}
                  </button>

                  <!-- cancelReserve -->
                  <b-button
                      v-if="
                      apartment.order.status === 'booked' && apartment.order.user.id === getMe.user.id || getMe.role.id === 1 && apartment.order.status === 'booked' || apartment.order.status === 'booked' && getPermission.apartments.root_contract"
                      type="button"
                      @click="cancelReserve"
                      class="ml-1"
                      variant="light"
                  >
                    <i class="fas fa-eraser"></i>
                    {{ $t("apartments.list.cancel_reserve") }}
                  </b-button>

                  <!-- view_client -->
                  <b-link
                      v-if="
                      apartment.order.status === 'booked' && apartment.order.user.id === getMe.user.id || getMe.role.id === 1 && apartment.order.status === 'booked'
                    "
                      @click="ReserveInfo(apartment)"
                      v-b-modal.modal-view-reserved-client
                      class="mr-md-2 mr-0 btn btn-secondary ml-1"
                  >
                    <i class="far fa-eye"></i>
                    {{ $t("apartments.list.view_client") }}
                  </b-link>

                  <template v-if="apartment.is_sold">
                    <!-- Reserve -->
                    <b-button
                        class="mr-md-2 mr-0 btn btn-primary ml-1"
                        v-if="
                        getPermission.apartments &&
                        getPermission.apartments.reserve &&
                        apartment.order &&
                        apartment.order &&
                        apartment.order.status === 'available'
                    "
                        @click="
                      [(reserve = true), (apartment_id = apartment.id)]
                    "
                        v-b-modal.modal-reserve-create
                    >
                      <i class="far fa-calendar-check"></i>
                      {{ $t("apartments.list.book") }}
                    </b-button>

                    <!-- confirm -->
                    <b-button
                        v-b-modal.modal-agree
                        @click="orderHold([apartment.id])"
                        variant="primary"
                        class="mr-md-2 mr-0 btn btn-primary ml-1"
                        v-if="
                      (apartment.order &&
                        ((apartment.order &&
                          apartment.order.status !== 'sold') ||
                          (apartment.order &&
                            apartment.order.status !== 'contract')) &&
                        apartment.order &&
                        apartment.order &&
                        apartment.order.status === 'booked' &&
                        apartment.order &&
                        apartment.order.user &&
                        apartment.order.user.id === getMe.user.id &&
                        getPermission.apartments &&
                        getPermission.apartments &&
                        getPermission.apartments.contract) ||
                        (!(
                          (apartment.order && apartment.order.status) ===
                            'sold' ||
                          (apartment.order && apartment.order.status) ===
                            'contract' ||
                          (apartment.order && apartment.order.status) ===
                            'hold'
                        ) &&
                          getPermission.apartments &&
                          getPermission.apartments &&
                          getPermission.apartments.root_contract) ||
                        (apartment.order &&
                          ((apartment.order &&
                            apartment.order.status !== 'sold') ||
                            (apartment.order &&
                              apartment.order.status !== 'contract')) &&
                          apartment.order &&
                          apartment.order &&
                          apartment.order.status === 'available' &&
                          getPermission.apartments &&
                          getPermission.apartments &&
                          getPermission.apartments.contract)
                    "
                    >
                      <!--                    apartment.order && apartment.order.status != 'contract'  || apartment.order && apartment.order.status === 'booked' && apartment.order && apartment.order.user && apartment.order.user.id === getMe.user.id && getPermission.apartments && getPermission.apartments.contract || apartment.order && apartment.order.status != 'sold' &&  getPermission.apartments && getPermission.apartments.root_contract || apartment.order && apartment.order.status === 'available' && getPermission.apartments && getPermission.apartments.contract-->
                      <i class="far fa-ballot-check"></i>
                      {{ $t("apartments.list.confirm") }}
                    </b-button>
                  </template>

                  <!--  Оформить when processing  -->
                  <b-link
                      v-if="
                      (
                          (
                          ((apartment.order && apartment.order.status) !==
                          'sold' ||
                          (apartment.order && apartment.order.status) !==
                            'contract') &&
                        apartment.order &&
                        apartment.order &&
                        apartment.order.status === 'booked' &&
                        apartment.order.user_id === getMe.user.id &&
                        getPermission.apartments &&
                        getPermission.apartments &&
                        getPermission.apartments.contract)
                        ||
                        (!(
                          apartment.order &&
                          ((apartment.order &&
                            apartment.order.status === 'sold') ||
                            (apartment.order &&
                              apartment.order.status === 'contract'))
                        ) &&
                          getPermission.apartments &&
                          getPermission.apartments &&
                          getPermission.apartments.root_contract) ||
                        (apartment.order &&
                          ((apartment.order &&
                            apartment.order.status !== 'sold') ||
                            (apartment.order &&
                              apartment.order.status !== 'contract')) &&
                          apartment.order &&
                          apartment.order.status === 'available' &&
                          getPermission.apartments &&
                          getPermission.apartments &&
                          getPermission.apartments.contract)) &&
                        (apartment.order && apartment.order.status) ===
                          'hold'
                    "
                      @click="goOrderHold([apartment.order.id])"
                      class="btn btn-primary ml-md-1 mr-0 mr-md-2"
                  >
                    <i class="far fa-ballot-check"></i>
                    Продолжить оформление
                  </b-link>

                  <router-link
                      :to="{
                      name: 'contracts-view',
                      params: {id: apartment.order.id},
                    }"
                      :class="'btn btn-primary ml-1'"
                      v-if="
                      (getPermission.apartments &&
                        getPermission.apartments.contract &&
                        ((apartment.order &&
                          apartment.order.status === 'sold') ||
                          (apartment.order &&
                            apartment.order.status === 'contract')) &&
                        getMe.user.id === apartment.order &&
                        apartment.order.user &&
                        apartment.order.user.id) ||
                        (getPermission.apartments &&
                          getPermission.apartments.root_contract &&
                          ((apartment.order &&
                            apartment.order.status === 'sold') ||
                            (apartment.order &&
                              apartment.order.status === 'contract'))) ||
                        (getMe.role &&
                          getMe.role.id === 1 &&
                          ((apartment.order &&
                            apartment.order.status === 'sold') ||
                            (apartment.order &&
                              apartment.order.status === 'contract')))
                    "
                  >
                    <i class="far fa-file-signature"></i>
                    {{ $t("apartments.list.contract") }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <!-- map -->
          <div
              class="map"
              :class="
              isMapActive ? 'map-active' : 'col-md-3 pl-md-0 position-relative'
            "
          >
            <yandex-map :coords="coords" zoom="18">
              <ymap-marker
                  :coords="coords"
                  marker-id="123123"
                  marker-type="placemark"
              >
              </ymap-marker>
            </yandex-map>
          </div>
        </div>
      </div>

      <view-client
          v-if="info_reserve"
          @CancelReserve="CloseReserveInfo"
          :apartment-data="apartment_preview"
      ></view-client>

      <reserve-add
          v-if="
          reserve ||
            (getPermission.apartments && getPermission.apartments.reserve)
        "
          :apartment="apartment_id"
          @CreateReserve="CreateReserveSuccess"
      ></reserve-add>

      <agree-modal
          v-if="confirm"
          :apartment="apartment"
          @successAgree="successAgree"
          @CloseAgree="CloseAgree"
      ></agree-modal>
    </div>
    <b-overlay :show="getLoading" class="loading-content" no-wrap opacity="0.5" style="z-index: 9999">
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
  </main>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {yandexMap, ymapMarker} from "vue-yandex-maps";
import ViewClient from "./ViewClient";
import ReserveAdd from "./Components/Reserve";
import Agree from "./Components/Agree";
import Discount from "./Components/Discount";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import api from "@/services/api";

export default {
  name: 'ApartmentView',
  components: {
    "view-client": ViewClient,
    "reserve-add": ReserveAdd,
    "agree-modal": Agree,
    Discount,
    BaseBreadCrumb,
    yandexMap,
    ymapMarker,
  },

  data() {
    return {
      apartment: {},
      settings: {
        // apiKey: "65fb39dd-bc0c-4ba6-8a62-96e80a9a9f4f",
        lang: "ru_RU",
        coordorder: "latlong",
        enterprise: false,
        version: "2.1",
      },
      coords: [41.36499519043105, 69.29568268947267],

      apartment_preview: {},
      reserve: false,
      apartment_id: 0,
      order_id: 0,
      confirm: false,

      info_reserve: false,

      contract: {
        id: null,
        contract: null,
        contract_path: null,
      },

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },

      calc: {
        debt: 0,
        discount_price: 0,
        month: 0,
        monthly_price: 0,
        prepay: 0,
        prepay_percente: 0,
        price_for_m2: 0,
        total: 0,
      },
      isMapActive: false,
      getLoading: false,
    };
  },

  async created() {
    await this.fetchApartmentView()
  },
  mounted() {
    Fancybox.bind("[data-fancybox]");
  },
  computed: {
    ...mapGetters([
      "getMe",
      "getPermission",
      "getReserveClient",
    ]),
    breadCrumbs() {
      return [
        {
          routeName: 'objects',
          textContent: this.$t('objects.title')
        },
        {
          routeName: 'apartments',
          textContent: this.apartment.object.name,
          params: {
            object: this.apartment.object.id
          }
        }
      ]
    },
    activeContent() {
      return this.$t('objects.create.apartment')
    },
    otherGetApartment() {
      if (Object.values(this.apartment).length) {
        return this.apartment;
      }
      return null;
    },
    hasPromo() {
      return this.apartment.discounts.some((discount) => discount.type === 'promo')
    }
  },
  methods: {
    ...mapActions(["fetchApartment", "fetchReserveClient"]),

    async fetchApartmentView() {
      this.getLoading = true
      const {object, id} = this.$route.params
      await api.apartments.getApartmentView(object, id)
          .then(response => {
            this.apartment = response.data
            this.setCoordinate()
          }).catch((error) => {
            this.toastedWithErrorCode(error)
          }).finally(() => {
            this.getLoading = false
          })
    },

    setCoordinate() {
      const {latitude, longitude} = this.apartment.object.location
      this.coords = [latitude, longitude]
    },

    getCalData(data) {
      this.calc = {
        ...data,
      };
    },

    async orderHold(arr) {
      this.getLoading = true;
      await api.orders.holdOrder(arr)
          .then((res) => {
            this.getLoading = false;
            if (res) {
              this.$router.push({
                name: "confirm-apartment",
                params: {id: res.data.uuid},
              });
            }
          })
          .catch(() => {
            this.getLoading = false;
          });
    },

    goOrderHold(order_id) {
      this.$router.push({
        name: "confirm-apartment",
        params: {id: order_id[0]},
      })
    },

    momentQuarter(val) {
      return this.$moment(val).quarter();
    },

    printPage() {
      window.print();
    },

    ReserveInfo(apartment) {
      this.getLoading = true;
      this.info_reserve = true;
      this.apartment_preview = apartment;
      this.order_id = apartment.order.id;
      this.fetchReserveClient(this).then(() => {
        this.getLoading = false;
      });
    },

    async CreateReserveSuccess() {
      await this.fetchApartmentView()
    },

    async CloseReserveInfo() {
      this.info_reserve = false;
      this.apartment_preview = {};
      await this.fetchApartmentView()
    },

    ConfirmFindUser() {
      this.$router.push({name: "confirm-apartment"});
    },

    CloseAgree() {
      this.confirm = false;
    },

    async successAgree(value) {
      await this.fetchApartmentView()
      this.contract = value;
      this.$bvModal.show("modal-success-agree");
    },

    async cancelReserve() {
      this.order_id = this.apartment.order.id;
      await this.fetchReserveClient(this);
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_reserve"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_cancel_reserve"),
      }).then((result) => {
        if (result.value) {
          this.getLoading = true;
          api.orders.deactivateReserveOrders(this.getReserveClient.id)
              .then((response) => {
                this.toasted(response.data.message, "success");

                this.$nextTick(() => {
                  this.$bvModal.hide("modal-view-reserved-client");
                });

                this.fetchApartmentView();

                this.$swal(this.$t("sweetAlert.canceled_reserve"), "", "success");
              })
              .catch((error) => {
                if (!error.response) {
                  this.toasted("Error: Network Error", "error");
                } else {
                  const status = error.response.status
                  const message = error.response.data.message

                  /* CLIENT AND SERVER ERROR */
                  if (status && status >= 400 && status <= 511) {
                    this.toasted(message, 'error')
                  }
                }
              }).finally(() => {
            this.getLoading = false;
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
<style lang="scss">
.building__info .promo__marker {
  margin-left: 0.5rem;
  border-radius: 1rem;
  color: #28a745;
  background-color: rgba(#28a745, .2);
  padding: 0.25rem 2rem;
}

.loading-content {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

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

.ymap-container {
  height: 100%;
  width: 100%;
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

      .ymap-container {
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
  .ymap-container {
    height: 400px;
  }
}
</style>
