<template>
  <div class="main__content">
    <!--   IMAGE SLIDER     -->
    <div class="slider-content">
      <div class="swiper" v-swiper="swiperOption">
        <!--     MAIN CONTENT OF SLIDE       -->
        <div class="swiper-wrapper">
          <div
              v-for="(image,index) in plan.image"
              :key="index"
              class="swiper-slide"
          >
            <div class="d-flex justify-content-center align-items-center">
              <img class="swiper-image" :src="image" alt="img"/>
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
    <div class="plan-text">
      <h5>Квартира: {{ plan.area }} 82 М<sup>2</sup></h5>
      <p>Найдено {{ plan.rooms }} помещений</p>
    </div>

    <div class="plans">
      <div v-for="item in plan.apartments" :key="item.id" class="plan-block" @click="openModal(item)">
        <div class="plan-item">
          <h5>{{ item.entrance }} этаж</h5>
          <p>{{ item.plan.area }} M<sup>2</sup></p>
        </div>
        <div class="plan-item">
          <h5>{{ item.price }} сум</h5>
          <p>{{ item.price_m2 }} сум/M <sup>2</sup></p>
        </div>
        <div class="apartment-promo-icon">
          <img v-if="item.is_promo" src="../../../../assets/icons/bonuses.svg" alt="">
        </div>
      </div>
      <!--      <div class="plan-block">-->
      <!--        <div class="plan-item">-->
      <!--          <h5>2 этаж</h5>-->
      <!--          <p>166.2 M<sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="plan-item">-->
      <!--          <h5>330 000 000 сум</h5>-->
      <!--          <p>3,180,000 сум/M <sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="apartment-promo-icon">-->
      <!--          <img v-if="false" src="../../../../assets/icons/bonuses.svg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="plan-block">-->
      <!--        <div class="plan-item">-->
      <!--          <h5>2 этаж</h5>-->
      <!--          <p>166.2 M<sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="plan-item">-->
      <!--          <h5>330 000 000 сум</h5>-->
      <!--          <p>3,180,000 сум/M <sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="apartment-promo-icon">-->
      <!--          <img v-if="false" src="../../../../assets/icons/bonuses.svg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="plan-block">-->
      <!--        <div class="plan-item">-->
      <!--          <h5>2 этаж</h5>-->
      <!--          <p>166.2 M<sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="plan-item">-->
      <!--          <h5>330 000 000 сум</h5>-->
      <!--          <p>3,180,000 сум/M <sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="apartment-promo-icon">-->
      <!--          <img v-if="false" src="../../../../assets/icons/bonuses.svg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="plan-block">-->
      <!--        <div class="plan-item">-->
      <!--          <h5>2 этаж</h5>-->
      <!--          <p>166.2 M<sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="plan-item">-->
      <!--          <h5>330 000 000 сум</h5>-->
      <!--          <p>3,180,000 сум/M <sup>2</sup></p>-->
      <!--        </div>-->
      <!--        <div class="apartment-promo-icon">-->
      <!--          <img v-if="false" src="../../../../assets/icons/bonuses.svg" alt="">-->
      <!--        </div>-->
      <!--      </div>-->
    </div>


  </div>
</template>

<script>
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {formatToPrice} from "@/util/reusable";
import {directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
// import VueSilentbox from 'vue-silentbox'

export default {
  name: "PrimaryInformation",

  props: {
    visible: {
      type: Boolean,
      default: true
    },
    plan: {
      type: Object,
      required: true
    }
  },

  /* COMPONENTS */
  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    // VueSilentbox
  },

  /* DIRECTIVES */
  directives: {
    swiper: directive,
  },

  /* DATA */
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
  },

  methods: {
    openModal(item) {
      this.$emit('open-express', item)
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


.apartment-promo-icon
  display: flex
  //height: auto
  height: 24px
  min-width: 32px

  img
    width: 100%


.plan-text
  display: flex
  flex-direction: column
  font-family: Inter, sans-serif
  margin-bottom: 1.5rem

  h5
    font-weight: 600
    font-size: 18px
    line-height: 24px
    color: var(--gray-600)
    margin-bottom: 1rem

    sup
      color: var(--gray-600)

  p
    font-weight: 600
    font-size: 16px
    line-height: 22px
    color: var(--gray-400)
    margin-bottom: 0

    sup
      color: var(--gray-400)

.plans
  display: flex
  flex-direction: column
  row-gap: 1rem

.plan-block
  font-family: Inter, sans-serif
  display: flex
  justify-content: space-between
  background: #F3F4F6
  border-radius: 32px
  padding: 24px 32px

  .plan-item
    h5
      font-weight: 600
      font-size: 24px
      line-height: 30px
      margin-bottom: .5rem
      color: var(--gray-600)

      sup
        color: var(--gray-600)


    p
      font-weight: 600
      font-size: 16px
      line-height: 22px
      margin-bottom: 0
      color: var(--gray-500)

      sup
        color: var(--gray-500)


</style>