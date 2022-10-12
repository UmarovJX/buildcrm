<template>
  <div>
    <div v-if="!appLoading">
      <!--   MAIN   -->
      <div class="content-view">
        <div class="main__content">
          <div class="slider-content">
            <div class="swiper" v-swiper="swiperOption">
              <!--     MAIN CONTENT OF SLIDE       -->
              <div class="swiper-wrapper">
                <div
                    v-for="(image,index) in apartment.plan.images"
                    :key="index"
                    class="swiper-slide"
                >
                  <div class="d-flex justify-content-center align-items-center">
                    <img v-if="image" class="swiper-image" :data-fancybox="image" :src="image"
                         alt="img">
                    <img v-else class="swiper-image" :src="require('@/assets/img/no-image.jpg')"
                         alt="img">
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

          <!--          <div class="primary__information">-->
          <!--            &lt;!&ndash;   PRICE CONTENT     &ndash;&gt;-->
          <!--            <div v-if="!statusSold" class="price__section d-flex justify-content-between align-items-center">-->
          <!--               <span class="price__section-square-amount">-->
          <!--                {{ squareMetrePrice }} / m<sup class="color-gray-400">2</sup>-->
          <!--                </span>-->
          <!--              <span class="price__section-amount">{{ price }}</span>-->
          <!--            </div>-->
          <!--          </div>-->
          <!--        <div class="col-12 col-lg-5">-->
          <PrimaryTabItem class="primary__information" :apartment="apartment"/>
          <!--          <div class="peculiarities">-->
          <!--            <h1 class="mb-4">{{ $t("peculiarities") }}</h1>-->
          <!--            <div class="d-flex flex-wrap list-boxes">-->
          <!--              <PeculiarityBox name="Большой балкон"/>-->
          <!--              <PeculiarityBox name="Шикарный вид"/>-->
          <!--              <PeculiarityBox name="Эко-парковка"/>-->
          <!--              <PeculiarityBox name="Секретный шкаф"/>-->
          <!--              <PeculiarityBox name="Красный ковер"/>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
        <!--        <primary-information class="primary__information" :apartment="apartment"/>-->
        <!--        </div>-->
        <!--        <div class="col-12 col-lg-7">-->
        <div class="calculator w-100 d-flex flex-column">
          <!--          <h2>Акции</h2>-->
          <!--          <span v-if="apartment.is_promo">-->
          <!--            <PromoSection :promo="apartment.promo"/>-->
          <!--          </span>-->
          <!--          <span v-else class="no_promos">-->
          <!--            На данный момент нет акции.-->
          <!--          </span>-->
          <div>
            <h4 class="calculator-title color-gray-600 font-craftworksans">
              {{ $t("type_payment") }}
            </h4>
            <calculator
                @for-print="getCalc"
                :apartment="apartment"
                :has-apartment="hasApartment"
            />
          </div>

          <div class="align-self-stretch d-flex justify-content-end">
            <!--   ACTIONS     -->
            <div class="action-block">
              <!--      CHECKOUT        -->
              <!--              v-if="permission.order"-->
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
              <!--              v-if="permission.reserve"-->
              <base-button
                  v-if="permission.reserve"
                  @click="showReservationModal = true"
                  :text="`${ $t('apartments.list.book') }`"
                  v-b-modal.modal-reserve-create
              />


              <!--     CONTRACT VIEW         -->
              <router-link
                  v-if="permission.contract"
                  :to="{name:'contracts-view', params:{ id: apartment.order.id } }"
              >
                <base-button design="violet-gradient px-5" :text="$t('apartments.list.contract')"/>
              </router-link>

              <!-- CANCEL RESERVE -->
              <!--              v-if="permission.cancelReserve"-->
              <base-button
                  v-if="permission.cancelReserve"
                  @click="cancelReservation"
                  :text="`${ $t('apartments.list.cancel_reserve') }`"
              />

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
  </div>
</template>

<script>
import api from "@/services/api";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePrintIcon from "@/components/icons/BasePrintIcon";
import Reserve from "@/components/Dashboard/Apartment/Components/Reserve";
import Calculator from "@/components/Objects/View/elements/Calculator";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {mapGetters, mapMutations} from "vuex";
import PrimaryTabItem from "@/components/Objects/View/elements/PrimaryTabItem";
import {directive} from "vue-awesome-swiper";
import 'swiper/css/swiper.css'

// import PromoSection from "@/components/Objects/View/elements/PromoSection";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";
import PdfTemplate from "@/components/PdfTemplate";
import {formatToPrice} from "@/util/reusable";
import CheckoutPermission from "@/permission/checkout";
// import PeculiarityBox from "@/components/Objects/View/elements/PeculiarityBox";

export default {
  name: "ApartmentView",
  components: {
    Reserve,
    BaseButton,
    Calculator,
    PdfTemplate,
    BaseLoading,
    // PromoSection,
    BasePrintIcon,
    // PeculiarityBox,
    PrimaryTabItem,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
  },
  props: {
    appLoading: {
      type: Boolean,
      default: false,
    },
    apartment: {
      type: Object,
      required: true,
    }
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
      // apartment: {},
      // appLoading: false,
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
      const isStatusClosed = order.status === 'closed'
      const isStatusContract = order.status === 'contract'

      const permissionCancelReserve = isStatusBooked && (authorityUser || this.checkoutRootPermission)
      const permissionReserve = forSale && isStatusAvailable && this.bookPermission

      const permissionContract = () => {
        const permissionOne = this.checkoutPermission && authorityUser
        return (isStatusSold || isStatusContract || isStatusClosed) && (permissionOne || this.checkoutRootPermission)
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

  // async created() {
  //     await this.fetchApartmentView()
  // },

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
    // async fetchApartmentView() {
    //     this.appLoading = true
    //     const {object, id} = this.$route.params
    //     await api.apartmentsV2.getApartmentView(object, id)
    //         .then(response => {
    //             this.apartment = response.data
    //         }).catch((error) => {
    //             this.toastedWithErrorCode(error)
    //         }).finally(() => {
    //             this.appLoading = false
    //         })
    // },
    printApartmentInformation() {
      window.print()
    },
    async orderApartment() {
      this.appLoading = true
      try {
        const apartments = [this.apartment.id]
        const {data} = await api.orders.holdOrder(apartments)
        if (data) {
          const objectId = data.apartments[0].object.id
          await this.$router.push({
            name: 'confirm-apartment',
            params: {
              id: data.uuid,
              object: objectId
            }
          })
          // await this.$router.push({
          //   name: "checkout",
          //   params: {
          //     id: data.uuid
          //   }
          // })
        }
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.appLoading = false
      }
    },
    async continueApartmentOrder() {
      // this.$router.push({
      //   name: "checkout",
      //   params: {
      //     id: this.apartment.order.id
      //   },
      // })
      const {object} = this.$route.params
      await this.$router.push({
        name: 'confirm-apartment',
        params: {
          object,
          id: this.apartment.order.id,
        }
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
  .swiper-pagination-bullets
    bottom: 0 !important

  .swiper-pagination-bullet
    width: 9px
    height: 10px

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

.main__content
  padding-left: 1rem
  padding-right: 1rem
  min-width: 42rem


.main__class
  background-color: white
  padding: 3rem
  min-height: 100vh
  color: var(--gray-600)


.primary__information
  max-width: 42rem


.calculator
  margin-top: 3.5rem
  margin-left: 1rem
  margin-right: 1.5rem
  max-width: 500px

  h2
    font-family: 'CraftworkSans', serif
    font-weight: 900
    font-size: 24px
    line-height: 28px
    color: #9CA3AF

  &-title
    font-family: 'CraftworkSans', serif
    font-weight: 900
    font-size: 24px
    line-height: 28px
    color: #9CA3AF !important
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

::v-deep .monthly
  background-color: var(--gray-100)
  border-radius: 2rem
  margin-top: 1.5rem
  display: none

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
  padding: 17px 32.75px

.action-block
  display: flex
  flex-wrap: wrap
  margin-top: 1rem
  margin-bottom: .5rem
  gap: .5rem

  .checkout__button
    padding: 12.75px


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

::v-deep .apartment__details
  &-title
    display: none

  &-row
    .property
    text-transform: none


.peculiarities
  margin-top: 48px

  h1
    font-family: 'CraftworkSans', serif
    font-weight: 900
    font-size: 18px
    line-height: 22px
    color: #9CA3AF

::v-deep .promo__section
  border: none
  border-bottom: 3px solid var(--gray-100)

::v-deep .promo__section:last-child
  border: none !important

.list-boxes
  gap: 16px

.price__section
  font-family: CraftworkSans, serif
  font-size: 1.5rem
  font-weight: 900
  margin: 1.5rem 0

.promo__section-subtitle
  text-transform: capitalize

  &-amount
    color: var(--gray-600) !important
    line-height: 28px

  &-square-amount
    color: var(--gray-500) !important
    font-size: 18px
    line-height: 22px

.no_promos
  font-family: 'Inter', serif
  font-weight: 600
  font-size: 18px
  line-height: 24px
  color: #9CA3AF
  margin-top: 24px
  margin-bottom: 48px

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