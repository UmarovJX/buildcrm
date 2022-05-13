<template>
  <div class="main__content">
    <!--   IMAGE SLIDER     -->
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
              <img v-if="image" class="swiper-image" :src="image" alt="img">
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

    <!--   PRICE CONTENT     -->
    <div v-if="statusSold" class="price__section d-flex justify-content-between align-items-center">
      <span class="price__section-amount">{{ price }}</span>
      <span class="price__section-square-amount">
        {{ squareMetrePrice }} / M<sup class="color-gray-400">2</sup>
      </span>
    </div>

    <!--   LINK TO APARTMENT VIEW     -->
    <!--    <div class="mt-5 mb-4">-->
    <!--      <router-link to="/" class="button__view">Вариант оплаты</router-link>-->
    <!--    </div>-->

    <!--   PROMO SECTION
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
    -->

    <!--   APARTMENT DETAILS     -->
    <div class="apartment__details my-3">
      <span class="apartment__details-row">
        <span class="property">№ {{ $t('apartment_number') }}</span>
        <span class="value">{{ apartment.number }}</span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('completion_date') }}</span>
        <span class="value"> {{ buildingDate(apartment.object.build_date) }} </span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('plan_area') }}</span>
        <span class="value">
          {{ apartment.plan.area }} M<sup>2</sup>
        </span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('balcony') }}</span>
        <span class="value">
          {{ apartment.plan.balcony_area }} M<sup>2</sup>
        </span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('number_of_rooms') }}</span>
        <span class="value">{{ apartment.rooms }}</span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('floor') }}</span>
        <span class="value">{{ apartment.floor }}</span>
      </span>

      <span class="apartment__details-row">
        <span class="property">{{ $t('number_of_floors_of_the_block') }}</span>
        <span class="value">{{ apartment.block.floors }}</span>
      </span>
    </div>

    <!--
      PARTICULAR QUALITIES
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
    -->
  </div>
</template>

<script>
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {formatToPrice} from "@/util/reusable";
import {directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: "PrimaryInformation",
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    apartment: {
      type: Object,
      required: true
    }
  },

  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
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
    }
  },

  computed: {
    price() {
      return formatToPrice(this.apartment.price) + ' ' + this.$t('ye')
    },

    squareMetrePrice() {
      return formatToPrice(this.apartment.price_m2) + ' ' + this.$t('ye')
    },

    statusSold() {
      return this.apartment.order.status === 'sold'
    }
  },

  methods: {
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
  }
}
</script>

<style lang="sass" scoped>
::v-deep .main__content
  .slider__image
    object-fit: contain

::v-deep .slider-content
  margin: 1rem
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

</style>