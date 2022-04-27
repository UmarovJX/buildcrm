<template>
  <b-sidebar
      :visible="visible"
      sidebar-class="sidebar__apartment"
      body-class="sidebar__apartment-body"
      aria-labelledby="sidebar-no-header-title"
      id="apartment-express-view"
      right no-header shadow
  >
    <template #default="{ hide }">
      <vue-html2pdf
          :show-layout="false"
          :float-layout="true"
          :enable-download="true"
          :preview-modal="true"
          filename="hee hee"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a5"
          :paginate-elements-by-height="3000"
          pdf-orientation="portrait"
          pdf-content-width="560px"
          :html-to-pdf-options="htmlToPdfOptions"
          ref="html2Pdf"
      >
        <section slot="pdf-content">
          <!--  HEAD    -->
          <div v-if="visible" class="head d-flex justify-content-between pdf-item">
            <span class="d-flex justify-content-center align-items-center">
              <span
                  @click="hideApartmentSidebar"
                  class="close__button d-flex justify-content-center align-items-center"
              >
                <base-arrow-left-icon :width="32" :height="32"/>
              </span>
              <span class="section__title">
                {{ apartment.object.name }} , {{ apartment.block.name }}
              </span>
            </span>
            <span
                class="apartment__status d-flex justify-content-center align-items-center"
                :class="`status-${status}`"
            >
              {{ $t(`apartments.status.${status}`) }}
            </span>
          </div>

          <!--  MAIN    -->
          <div v-if="visible" class="main__content pdf-item">
            <!--   IMAGE SLIDER     -->
            <div class="slider-content">
              <div class="swiper" v-swiper="swiperOption">
                <!--     MAIN CONTENT OF SLIDE       -->
                <div class="swiper-wrapper">
                  <div
                      v-for="key of [1,2,3,4,5,6]"
                      :key="key"
                      class="swiper-slide"
                  >
                    <div class="d-flex justify-content-center align-items-center">
                      <img class="swiper-image" src="../../../../assets/img/object-details.png" alt="img">
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

            <!--   PRICE CONTENT     -->
            <div class="price__section d-flex justify-content-between align-items-center">
              <span class="price__section-amount">{{ price }}</span>
              <span class="price__section-square-amount">
            {{ squareMetrePrice }} / M<sup class="color-gray-400">2</sup>
          </span>
            </div>

            <!--   LINK TO APARTMENT VIEW     -->
            <div class="mt-5 mb-4">
              <router-link to="/" class="button__view">Вариант оплаты</router-link>
            </div>

            <!--   PROMO SECTION     -->
            <div class="promo__section font-inter">
          <span class="d-block mb-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.576446 10L10 0.576446L19.4236 10L10 19.4236L0.576446 10Z" fill="#7C3AED" stroke="white"
                    stroke-width="0.815217"/>
            </svg>
            <span class="ml-2 promo__section-title">День Рождения застройщика</span>
          </span>
              <span class="d-flex justify-content-between mb-2">
            <span class="color-gray-600">Цена по акции</span>
            <span class="color-gray-400">Осталось 215 дней</span>
          </span>
              <span class="d-flex justify-content-between align-items-center mb-2">
            <span class="color-violet-600 total__sum">328 500 000 сум</span>
            <span class="color-violet-600">2 500 000 сум/M2</span>
          </span>
              <span class="mortgage">
            <span class="d-flex justify-content-between align-items-center mb-2">
              <span class="d-block mb-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.576446 10L10 0.576446L19.4236 10L10 19.4236L0.576446 10Z" fill="#7C3AED" stroke="white"
                        stroke-width="0.815217"/>
                </svg>
                <span class="ml-2 promo__section-title color-violet-600">Ипотека 5.4%</span>
              </span>
              <span class="color-gray-400">До 31.12</span>
            </span>
            <span class="color-violet-600 mortgage__title">
              Ипотека 5.4%
            </span>
          </span>
            </div>

            <!--   APARTMENT DETAILS     -->
            <div class="apartment__details my-3">
          <span class="apartment__details-row">
            <span class="property">№ квартиры</span>
            <span class="value">{{ apartment.number }}</span>
          </span>

              <span class="apartment__details-row">
            <span class="property">Дата завершения</span>
            <span class="value"> {{ buildingDate(apartment.object.build_date) }} </span>
          </span>

              <span class="apartment__details-row">
            <span class="property">Площадь планировки</span>
            <span class="value">
              {{ apartment.plan.area }} M<sup>2</sup>
            </span>
          </span>

              <span class="apartment__details-row">
            <span class="property">Балкон</span>
            <span class="value">
              {{ apartment.plan.balcony_area }} M<sup>2</sup>
            </span>
          </span>

              <span class="apartment__details-row">
            <span class="property">Количество комнат</span>
            <span class="value">{{ apartment.rooms }}</span>
          </span>

              <span class="apartment__details-row">
            <span class="property">Этаж</span>
            <span class="value">{{ apartment.floor }}</span>
          </span>

              <span class="apartment__details-row">
            <span class="property">Этажность блока</span>
            <span class="value">{{ apartment.block.floors }}</span>
          </span>
            </div>

            <!--   PARTICULAR QUALITIES     -->
            <div class="particular__qualities font-inter">
              <h3 class="title color-gray-600">Особенности</h3>
              <div class="particular__qualities-content">
                <div class="part">
                  <span class="image__container"></span>
                  <span class="description">Большой балкон</span>
                </div>

                <div class="part">
                  <span class="image__container"></span>
                  <span class="description">Шикарный вид</span>
                </div>

                <div class="part">
                  <span class="image__container"></span>
                  <span class="description">Эко-парковка</span>
                </div>

                <div class="part">
                  <span class="image__container"></span>
                  <span class="description">Секретный шкаф</span>
                </div>

                <div class="part">
                  <span class="image__container"></span>
                  <span class="description">Красный ковер</span>
                </div>
              </div>
            </div>

            <!--   ACTIONS     -->
            <div class="d-flex flex-wrap mt-4">
              <!--      CHECKOUT        -->
              <base-button
                  v-if="permission.order"
                  :text="`${ $t('apartments.list.confirm') }`"
                  class="checkout__button bg-gradient-violet color-white mr-3 mb-4"
              />

              <!--      CONTINUE CHECKOUT        -->
              <base-button
                  v-if="permission.continueOrder"
                  :text="`${ $t('continue_registration') }`"
                  class="checkout__button bg-gradient-violet color-white mr-3 mb-4"
              />

              <!--       MAKE A RESERVATION       -->
              <base-button
                  v-if="permission.reserve"
                  :text="`${ $t('apartments.list.book') }`"
                  class="checkout__button bg-gray-100 color-gray-600 mr-3 mb-4"
              />

              <!-- CANCEL RESERVE -->
              <base-button
                  v-if="permission.cancelReserve"
                  :text="`${ $t('apartments.list.cancel_reserve') }`"
                  class="reserve__button mr-3 mb-4"
              />

              <button
                  @click="printApartmentInformation"
                  class="print__button bg-gray-100 d-flex justify-content-center align-items-center mr-3 mb-4"
              >
                <base-print-icon :square="20" fill="#4B5563"/>
              </button>

              <button
                  class="cancel__button bg-gray-100 d-flex justify-content-center align-items-center mr-3 mb-4"
              >
                <base-minus-circle-icon :square="20" fill="#4B5563"/>
              </button>
            </div>
          </div>
        </section>
      </vue-html2pdf>
    </template>
  </b-sidebar>
</template>
<script>
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BasePrintIcon from "@/components/icons/BasePrintIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseMinusCircleIcon from "@/components/icons/BaseMinusCircleIcon";
import VueHtml2pdf from 'vue-html2pdf'
import {formatToPrice} from "@/util/reusable";
import {directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import {mapGetters} from "vuex";

export default {
  name: "ApartmentExpressView",

  /* COMPONENTS */
  components: {
    BaseButton,
    BasePrintIcon,
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseMinusCircleIcon,
    VueHtml2pdf
  },

  /* DIRECTIVES */
  directives: {
    swiper: directive,
  },

  /* PROPS */
  props: {
    apartment: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    }
  },

  /* EMITS */
  emits: ['hide-apartment-sidebar-view'],

  /* DATA */
  data() {
    return {
      /* SLIDER OPTION */
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 80,
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

      htmlToPdfOptions: {
        margin: 6,
        filename: ''
      }
    }
  },

  /* COMPUTED */
  computed: {
    ...mapGetters({
      me: "getMe",
      userPermission: "getPermission",
      reserveClient: "getReserveClient",
    }),
    price() {
      return formatToPrice(this.apartment.price) + ' ' + this.$t('ye')
    },
    squareMetrePrice() {
      return formatToPrice(this.apartment.price_m2) + ' ' + this.$t('ye')
    },
    status() {
      return this.apartment.order.status
    },
    permission() {
      const {apartment, me, userPermission} = this
      const {order} = apartment
      const {apartments} = userPermission
      const context = {
        cancelReserve: false,
        reserve: false,
        continueOrder: false,
        order: false
      }

      const authorityUser = order?.user?.id === me?.user?.id
      const rootContract = userPermission?.apartments?.root_contract
      const isMainRole = me?.role?.id === 1
      const isStatusBooked = order.status === 'booked'
      const isStatusAvailable = order.status === 'available'
      const isStatusSold = order.status === 'sold'
      const isStatusContract = order.status === 'contract'
      const isStatusHold = order.status === 'hold'

      const permissionCancelReserve = isStatusBooked && (authorityUser || rootContract || isMainRole)
      const permissionReserve = isStatusAvailable && userPermission?.apartments?.reserve

      const permissionOrder = () => {
        const permissionOne = isStatusBooked && authorityUser && apartments.contract
        const permissionTwo = !(isStatusSold || isStatusContract || isStatusHold) && rootContract
        const permissionThree = isStatusAvailable && apartments.contract
        return permissionOne || permissionTwo || permissionThree
      }

      const permissionContinueOrder = () => {
        const expressionOne = isStatusBooked && authorityUser && apartments.contract
        const expressionTwo = !(isStatusSold || isStatusContract) && rootContract
        const expressionThree = isStatusAvailable && apartments.contract
        return isStatusHold && expressionOne && expressionTwo && expressionThree
      }

      const effectContext = (property) => {
        context[property] = true
      }

      permissionCancelReserve && effectContext('cancelReserve')
      permissionReserve && effectContext('reserve')
      permissionOrder() && effectContext('order')
      permissionContinueOrder() && effectContext('continueOrder')
      return context
    }
  },

  /* METHODS */
  methods: {
    hideApartmentSidebar() {
      this.$emit('hide-apartment-sidebar-view')
    },
    buildingDate(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      let month = date.getMonth()
      if (month < 3) {
        month = '1'
      } else if (month >= 3 && month < 6) {
        month = '2'
      } else if (month >= 6 && month < 9) {
        month = '3'
      } else {
        month = '4'
      }

      return ` ${month} - ${this.$t('quarter')} ${year} ${this.$t('of_the_year')}`
    },
    printApartmentInformation() {
      const {object, block, entrance, number} = this.apartment
      this.htmlToPdfOptions.filename = object.name + ' , ' + block.name + ' , ' + entrance + '/' + number
      this.$refs.html2Pdf.generatePdf()
    }
  }
}
</script>

<style lang="sass" scoped>
::v-deep .sidebar__apartment
  width: 42rem
  font-family: CraftworkSans, serif

  &-body
    margin: 0 3.5rem
    padding: 3.5rem 0
    -ms-overflow-style: none
    scrollbar-width: none

    &::-webkit-scrollbar
      display: none


    .head
      line-height: 1.75rem

      .close__button
        width: 3.5rem
        height: 3.5rem
        cursor: pointer
        border-radius: 50%
        margin-right: 0.5rem
        background-color: var(--gray-100)
        transition: background-color 100ms ease-in-out

        &:hover
          background-color: var(--gray-200)

      .section__title
        color: var(--gray-600)
        font-size: 1.5rem


      .apartment__status
        font-family: Inter, sans-serif
        background-color: var(--gray-100)
        border-radius: 2rem
        padding: 0.5rem 2rem

    .main__content
      .slider__image
        object-fit: contain

    .vue-html2pdf
      .layout-container
        position: relative
        width: auto
        height: auto
        left: 0
        z-index: 0
        background: #FFFFFF
        display: block


::v-deep .slider-content
  margin-left: 2.5rem
  margin-right: 2.5rem

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

      .swiper-image
        width: 16rem
        height: 16rem

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

.price__section
  font-family: Inter, sans-serif
  font-size: 1.5rem
  line-height: 1.5rem
  font-weight: 600

  &-amount
    color: var(--gray-600) !important

  &-square-amount
    color: var(--gray-500) !important
    font-size: 18px

.button__view
  display: inline-block
  padding: 1rem 1.5rem
  background-color: var(--gray-100)
  border-radius: 2rem
  font-family: Inter, sans-serif

.promo__section
  margin-top: 1.5rem
  padding-top: 1rem
  padding-bottom: 1rem
  border-top: 3px solid var(--gray-100)
  border-bottom: 3px solid var(--gray-100)
  font-weight: 600

  &-title
    color: var(--violet-600) !important

  .total__sum
    font-size: 1.5rem
    line-height: 30px
    font-weight: 600

  .mortgage
    display: block
    border-top: 3px solid var(--gray-100)
    padding-top: 1rem

    &__title
      font-size: 1.5rem
      line-height: 30px

.apartment__details
  padding-top: 1rem
  padding-bottom: 1rem

  &-row
    font-family: Inter, sans-serif
    font-weight: 600
    display: flex
    justify-content: space-between
    padding: 0.5rem 0

    .property
      color: var(--gray-400)

    .value
      color: var(--gray-600)

.particular__qualities
  font-family: Inter, sans-serif
  margin-bottom: 2.5rem

  .title
    font-size: 1.25rem


  &-content
    display: flex
    flex-wrap: wrap

    .part
      margin-top: 1rem

      &:not(:last-child)
        margin-right: 1rem

      .image__container
        width: 4rem
        height: 4rem
        display: block
        background-color: var(--violet-300)
        margin-bottom: 0.75rem

      .description
        font-size: 14px
        line-height: 20px

.checkout__button
  padding: 1rem 3rem

.print__button,
.cancel__button
  outline: none
  border: none
  width: 3.5rem
  height: 3.5rem
  border-radius: 50%

.status
  &-waiting
    background-color: var(--yellow-100) !important
    color: var(--yellow-600) !important

  &-contract,
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
    background-color: var(--light-blue-100) !important
    color: var(--light-blue-600) !important
</style>
