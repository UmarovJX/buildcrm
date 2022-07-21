<template>
  <main>
    <div v-if="!appLoading" class="main__content">
      <!--  HEADER NAVIGATION  -->
      <div class="header-navigation d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <span class="go__back" @click="$router.go(-1)">
            <base-arrow-left :width="32" :height="32"></base-arrow-left>
          </span>
          <span class="breadcrumb__content">
          <span class="d-flex align-items-center">
            <span class="mr-2">{{ $t('objects.title') }}</span>
            <base-arrow-right :width="16" :height="16"/>
            <span class="ml-2">{{ apartment.object.name }}</span>
            <base-arrow-right :width="16" :height="16"/>
            <span class="ml-2">
              {{ $t('apartment') }} № {{ apartment.number }}
            </span>
          </span>
          <span class="head color-violet-600">
            {{ $t('apartment') }} № {{ apartment.number }}
          </span>
        </span>
        </div>

        <div>
          <span
              class="apartment__status d-flex justify-content-center align-items-center"
              :class="`status-${status}`"
          >
              {{ $t(`apartments.status.${status}`) }}
            </span>
        </div>
      </div>

      <!--   MAIN   -->
      <div class="content-view">
        <div class="main__content">
          <div class="slider-content">
            <div class="swiper" v-swiper="swiperOption">
              <!--     MAIN CONTENT OF SLIDE       -->
              <div class="swiper-wrapper">
                <div
                    v-for="(image,index) in apartment.plan.image"
                    :key="index"
                    class="swiper-slide"
                >
                  <div class="d-flex justify-content-center align-items-center">
                    <img v-if="image" class="swiper-image" :data-fancybox="image" :src="image" alt="img">
                    <img v-else class="swiper-image" :src="require('@/assets/img/no-image.jpg')" alt="img">
                  </div>
                </div>
              </div>

              <!--     DOTS PAGINATION       -->
              <div class="swiper-pagination"></div>

              <!--     BUTTON PREVIOUS       -->
              <div
                  slot="button-prev"
                  class="swiper-button-prev swiper-button d-flex justify-content-center align-items-center"
              >
                <base-arrow-left-icon/>
              </div>

              <!--     BUTTON NEXT       -->
              <div
                  slot="button-next"
                  class="swiper-button-next swiper-button d-flex justify-content-center align-items-center"
              >
                <base-arrow-right-icon/>
              </div>
            </div>

          </div>

          <div class="primary__information">
            <!--   PRICE CONTENT     -->
            <div v-if="!statusSold" class="price__section d-flex justify-content-between align-items-center">
               <span class="price__section-square-amount">
                {{ squareMetrePrice }} / m<sup class="color-gray-400">2</sup>
                </span>
              <span class="price__section-amount">{{ price }}</span>
            </div>
          </div>


          <!--        <div class="col-12 col-lg-5">-->
          <PrimaryTabItem class="primary__information" :apartment="apartment"/>
          <PromoSection :promo="apartment.promo"/>
        </div>
        <!--        <primary-information class="primary__information" :apartment="apartment"/>-->
        <!--        </div>-->
        <!--        <div class="col-12 col-lg-7">-->
        <div class="calculator w-100 d-flex flex-column justify-content-between">
          <div>
            <h4 class="calculator-title color-gray-600 font-craftworksans">
              {{ $t("apartments.agree.placeholder.enter_discount") }}
            </h4>
            <calculator @for-print="getCalc" :apartment="apartment" :has-apartment="hasApartment"/>
          </div>

          <div class="align-self-stretch d-flex justify-content-end">
            <!--   ACTIONS     -->
            <div class="action-block">
              <!--      CHECKOUT        -->
              <base-button
                  v-if="permission.order"
                  @click="orderApartment"
                  :text="`${ $t('apartments.list.confirm') }`"
                  class="checkout__button violet-gradient"
              />

              <!--      CONTINUE CHECKOUT        -->
              <base-button
                  v-if="permission.continueOrder"
                  @click="continueApartmentOrder"
                  :text="`${ $t('continue_registration') }`"
                  class="checkout__button violet-gradient"
              />

              <!--       MAKE A RESERVATION       -->
              <base-button
                  v-if="permission.reserve"
                  @click="showReservationModal = true"
                  :text="`${ $t('apartments.list.book') }`"
                  class="checkout__button gray-button"
                  v-b-modal.modal-reserve-create
              />

              <!-- CANCEL RESERVE -->
              <base-button
                  v-if="permission.cancelReserve"
                  :text="`${ $t('apartments.list.cancel_reserve') }`"
                  class="reserve__button"
                  @click="cancelReservation"
              />

              <!--     CONTRACT VIEW         -->
              <router-link
                  v-if="permission.contract"
                  :to="{name:'contracts-view', params:{ id: apartment.order.id } }"
                  class="contract_view_btn color-white d-flex align-items-center justify-content-center"
              >
                <i class="far fa-file-signature mr-2" style="color: #FFFFFF"></i>
                {{ $t("apartments.list.contract") }}
              </router-link>

              <button
                  id="print"
                  @click="printPdf"
                  class="print__button bg-gray-100 d-flex justify-content-center align-items-center "
              >
                <base-print-icon :square="20" fill="#4B5563"/>
              </button>
            </div>
          </div>
        </div>
        <!--        </div>-->
      </div>
    </div>

    <!--  MAKE A RESERVATION MODAL    -->
    <reserve
        v-if="showReservationModal"
        :apartment="apartment.id"
        @CreateReserve="updateContent"
    />

    <!--  LOADING    -->
    <base-loading v-if="appLoading"/>

    <PdfTemplate
        ref="html2Pdf"
        v-if="pdfVisible"
        :apartment="apartment"
        :print-calc="printCalc"
        @has-downloaded="completePrintingProcess"
    />
  </main>
</template>

<script>
import api from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePrintIcon from "@/components/icons/BasePrintIcon";
import Reserve from "@/components/Dashboard/Apartment/Components/Reserve";
import Calculator from "@/components/Objects/View/elements/Calculator";
import {mapGetters, mapMutations} from "vuex";
import PrimaryTabItem from "@/components/Objects/View/elements/PrimaryTabItem";
import {directive} from "vue-awesome-swiper";
import 'swiper/css/swiper.css'
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import PromoSection from "@/components/Objects/View/elements/PromoSection";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import PdfTemplate from "@/components/PdfTemplate";
import {formatToPrice} from "@/util/reusable";
import CheckoutPermission from "@/permission/checkout";

export default {
  name: "ApartmentView",
  components: {
    PromoSection,
    BaseLoading,
    BaseArrowLeft,
    BaseArrowRight,
    BasePrintIcon,
    PrimaryTabItem,
    Calculator,
    Reserve,
    BaseButton,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    PdfTemplate
  },
  directives: {
    swiper: directive,
  },
  data() {
    return {
      /* SLIDER OPTION */
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 0,
        direction: 'horizontal',
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true
        },
        paginationClickable: true,
        draggable: true,
        loop: false,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      },
      /* SLIDER END */
      selectedOption: null,
      discountPerM2: null,
      apartment: {},
      appLoading: false,
      showReservationModal: false,
      printCalc: {},
      pdfVisible: false,
      bookPermission: CheckoutPermission.getCheckoutPermission('book'),
      checkoutPermission: CheckoutPermission.getCheckoutPermission('checkout'),
      checkoutRootPermission: CheckoutPermission.getCheckoutPermission('root'),
    }
  },

  computed: {
    ...mapGetters({
      me: "getMe",
      userPermission: "getPermission",
      reserveClient: "getReserveClient",
    }),
    hasApartment() {
      return Object.keys(this.apartment).length > 0
    },
    status() {
      if (!this.apartment['is_sold']) {
        return 'unavailable'
      }
      return this.apartment.order.status
    },
    permission() {
      const context = {
        cancelReserve: false,
        reserve: false,
        continueOrder: false,
        order: false,
        contract: false
      }

      if (!this.hasApartment) return context

      const {apartment, me} = this
      const {order} = apartment
      // const {checkout} = userPermission
      const forSale = apartment['is_sold']
      const authorityUser = order?.user?.id === me?.user?.id
      // const rootContract = userPermission?.checkout?.root
      // const isMainRole = me?.role?.id === 1
      const isStatusBooked = order.status === 'booked'
      const isStatusAvailable = order.status === 'available'
      const isStatusHold = order.status === 'hold'
      const isStatusSold = order.status === 'sold'
      const isStatusContract = order.status === 'contract'

      const permissionCancelReserve = isStatusBooked && (authorityUser || this.checkoutRootPermission)
      const permissionReserve = forSale && isStatusAvailable && this.bookPermission

      const permissionContract = () => {
        const permissionOne = this.checkoutPermission && authorityUser
        return (isStatusSold || isStatusContract) && (permissionOne || this.checkoutRootPermission)
      }

      const permissionOrder = () => {
        const permissionOne = isStatusAvailable && (authorityUser || this.checkoutPermission || this.checkoutRootPermission)
        return forSale && permissionOne
      }
      const permissionContinueOrder = () => {
        const permissionOne = isStatusHold && (authorityUser || this.checkoutRootPermission || this.checkoutPermission)
        const permissionTwo = isStatusBooked && authorityUser && this.checkoutPermission
        return permissionOne || permissionTwo
      }

      const effectContext = (property) => {
        context[property] = true
      }

      permissionCancelReserve && effectContext('cancelReserve')
      permissionReserve && effectContext('reserve')
      permissionOrder() && effectContext('order')
      permissionContinueOrder() && effectContext('continueOrder')
      permissionContract() && effectContext('contract')

      return context
    },
    price() {
      return formatToPrice(this.apartment.prices.price, 2) + ' ' + this.$t('ye')
    },
    squareMetrePrice() {
      return formatToPrice(this.apartment.prices.price_m2, 2) + ' ' + this.$t('ye')
    },
    statusSold() {
      return this.apartment.order.status === 'sold'
    }
  },

  mounted() {
    Fancybox.bind("[data-fancybox]");
  },

  async created() {
    await this.fetchApartmentView()
  },

  methods: {
    ...mapMutations([
      'setCalculationProperties'
    ]),
    getCalc(value) {
      this.printCalc = value
      this.setCalculationProperties(Object.assign({}, value))
    },
    printPdf() {
      this.pdfVisible = true
      setTimeout(() => {
        this.$refs.html2Pdf.generatePdf()
      }, 10)
    },
    completePrintingProcess() {
      this.pdfVisible = false
    },
    async fetchApartmentView() {
      this.appLoading = true
      const {object, id} = this.$route.params
      await api.apartmentsV2.getApartmentView(object, id)
          .then(response => {
            this.apartment = response.data
          }).catch((error) => {
            this.toastedWithErrorCode(error)
          }).finally(() => {
            this.appLoading = false
          })
    },
    printApartmentInformation() {
      window.print()
    },
    async orderApartment() {
      this.appLoading = true
      const apartments = [this.apartment.id]
      await api.orders.holdOrder(apartments)
          .then((response) => {
            if (response?.data) {
              this.$router.push({
                name: "confirm-apartment",
                params: {
                  id: response.data.uuid
                }
              })
            }
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.appLoading = false
          })
    },
    continueApartmentOrder() {
      this.$router.push({
        name: "confirm-apartment",
        params: {
          id: this.apartment.order.id
        },
      })
    },
    updateContent() {
      this.$emit('update-content')
    },
    async cancelReservation() {
      this.appLoading = true
      await api.orders.fetchOrderClient(this.apartment.order.id)
          .then((response) => {
            const client = response.data
            this.$swal({
              title: this.$t("sweetAlert.title"),
              text: this.$t("sweetAlert.text_cancel_reserve"),
              icon: "warning",
              showCancelButton: true,
              cancelButtonText: this.$t("cancel"),
              confirmButtonText: this.$t("sweetAlert.yes_cancel_reserve"),
            }).then((result) => {
              if (result.value) {
                this.appLoading = true
                api.orders.deactivateReserveOrders(client.id)
                    .then((response) => {
                      this.toasted(response.data.message, "success")

                      this.$nextTick(() => {
                        this.$bvModal.hide("modal-view-reserved-client")
                      })

                      this.hideApartmentSidebar()
                      this.updateContent()

                      this.$swal(this.$t("sweetAlert.canceled_reserve"), "", "success");
                    })
                    .catch((error) => {
                      this.toastedWithErrorCode(error)
                    })
                    .finally(() => {
                      this.appLoading = false
                    })
              }
            })
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.appLoading = false
          })
    },
  }
}
</script>

<style lang="sass" scoped>
.content-view
  display: flex
  //justify-content: space-between
  gap: 4rem

::v-deep .main__content
  .slider__image
    object-fit: contain

::v-deep .slider-content
  margin: 1rem
  max-width: 42rem
  //margin-left: 1rem
  //margin-right: 1rem
  //margin-bottom: 1rem

  .swiper-container
    display: flex
    align-items: center
    justify-content: center
    height: 24rem

    .swiper-slide
      cursor: grab
      display: flex
      justify-content: center
      align-items: center
      padding: 0 58px

      .swiper-image
        width: 100%
        max-height: 19rem
        object-fit: contain
    //height: 16rem

    .swiper-button
      width: 3rem
      height: 3rem
      border-radius: 50%
      background-color: var(--gray-100)

    .swiper-button-next::after,
    .swiper-button-prev::after
      content: none

  .swiper-pagination
    margin-top: 3rem

    &-bullets
      bottom: 1rem

    &-bullet
      width: 0.75rem
      height: 0.75rem
      margin-right: 0.3rem
      background-color: var(--gray-400)

      &-active
        background-color: var(--violet-400)


/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
  -webkit-appearance: none
  margin: 0

/* Firefox */
input[type="number"]
  -moz-appearance: textfield

.header-navigation
  margin-right: 4.25rem
  //max-width: 640px
  max-width: 720px

.main__content
  padding-left: 1rem
  padding-right: 1rem
  min-width: 42rem
//width: 100%


.main__class
  background-color: white
  padding: 3rem
  min-height: 100vh
  color: var(--gray-600)

.go__back
  width: 56px
  height: 56px
  border-radius: 100%
  background-color: var(--gray-100)
  display: flex
  justify-content: center
  align-items: center
  cursor: pointer

.breadcrumb__content
  display: inline-flex
  flex-direction: column
  margin-left: 1rem
  font-weight: 600
  font-size: 14px
  color: #9CA3AF

.head
  font-size: 24px
  line-height: 28px
  color: #4B5563

.primary__information
  max-width: 42rem


.calculator
  margin-top: 3.5rem
  margin-left: 1rem
  margin-right: 1.5rem
  max-width: 500px

  &-title
    font-size: 1.5rem
    margin-bottom: 1.5rem

  .inputs
    margin-right: 2.25rem
    margin-bottom: 2.5rem

  .outputs
    margin-right: 2.25rem

    & > div
      margin-bottom: 2rem
      font-size: 18px
      font-weight: 600

      .total-price
        font-size: 24px

.monthly
  background-color: var(--gray-100)
  border-radius: 1rem
  margin-top: 1.5rem

  .placeholder
    letter-spacing: 1px
    color: var(--gray-400)
    text-transform: uppercase
    line-height: 10px
    font-size: 0.6rem
    margin-bottom: 0.25rem
    padding-top: 0.75rem
    padding-left: 1.5rem

  .input
    padding: 0.25rem 1.25rem 0.75rem 0
    margin-left: 1.5rem

    &::placeholder
      padding: 0

    &-monthly-payment
      border: none
      background-color: transparent

  .square-price
    padding: 0.75rem 1.25rem
    background-color: var(--gray-200)
    border-top: 2px solid var(--gray-300)
    border-bottom-right-radius: 1rem
    border-bottom-left-radius: 1rem

.discount-per-m2
  border-radius: 2rem
  background-color: var(--gray-100)
  margin-top: 1.5rem
  width: 100%

.checkout__button
  padding: 1rem 3rem

.action-block
  display: flex
  flex-wrap: wrap
  margin-top: 1rem
  margin-bottom: .5rem
  gap: .5rem


.print__button,
.cancel__button,
.view__button
  outline: none
  border: none
  width: 3.5rem
  height: 3.5rem
  border-radius: 50%

.contract_view_btn
  height: 3.5rem
  border-radius: 2rem
  padding: 1rem 2rem
  background-color: var(--blue-600)

.apartment__status
  font-family: Inter, sans-serif
  background-color: var(--gray-100)
  border-radius: 2rem
  min-width: max-content
  padding: 0.5rem 2rem

.status
  &-waiting
    background-color: var(--yellow-100) !important
    color: var(--yellow-600) !important

  &-contract
    background-color: var(--blue-100) !important
    color: var(--blue-600) !important

  &-booked
    background-color: var(--yellow-100) !important
    color: var(--yellow-600) !important

  &-cancelled
    background-color: var(--pink-100) !important
    color: var(--pink-600) !important

  &-available
    background-color: var(--teal-100) !important
    color: var(--teal-600) !important

  &-sold
    background-color: var(--gray-100) !important
    color: var(--gray-600) !important

  &-unavailable
    background-color: var(--gray-500) !important
    color: var(--white) !important


.price__section
  font-family: CraftworkSans, serif
  font-size: 1.5rem
  font-weight: 900
  margin: 1.5rem 0

  &-amount
    color: var(--gray-600) !important
    line-height: 28px

  &-square-amount
    color: var(--gray-500) !important
    font-size: 18px
    line-height: 22px


//@media only screen and (max-width: 1200px)
//  .content-view
//    flex-wrap: wrap
//    row-gap: 2rem
//    justify-content: center !important
//  .calculator
//    max-width: 640px
//  //.primary__information
//  //  width: 30rem
//  .price__section
//    font-size: 1.2rem
//
//    &-amount
//      line-height: 25px
//
//    &-square-amount
//      font-size: 15px
//      line-height: 18px
@media (max-width: 1350px)
  .content-view
    flex-wrap: wrap
  .calculator
    max-width: 42rem


</style>