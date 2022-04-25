<template>
  <b-sidebar
      :visible="visible"
      sidebar-class="sidebar__apartment"
      body-class="sidebar__apartment-body"
      aria-labelledby="sidebar-no-header-title"
      right no-header shadow
  >
    <template #default="{ hide }">
      <!--  HEAD    -->
      <div class="head d-flex justify-content-between">
        <span class="d-flex justify-content-center align-items-center">
          <span class="close__button d-flex justify-content-center align-items-center">
            <base-arrow-left-icon :width="32" :height="32"/>
          </span>
          <span class="section__title">
            Apelsin, А Блок
          </span>
        </span>
        <span class="apartment__status d-flex justify-content-center align-items-center">
          Свободно
        </span>
      </div>

      <!--  MAIN    -->
      <div class="main__content">
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
          <span class="price__section-amount">330 000 000 сум</span>
          <span class="price__section-square-amount">3 180 000 сум/M2</span>
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
          <span class="d-flex justify-content-between mb-2">
            <span>328 500 000 сум</span>
            <span>2 500 000 сум/M2</span>
          </span>
        </div>
      </div>
    </template>
  </b-sidebar>
</template>
<script>
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default {
  name: "ApartmentExpressView",
  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon
  },
  directives: {
    swiper: directive,
  },
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
  data() {
    return {
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
      }
    }
  },
}
</script>

<style lang="sass" scoped>
::v-deep .sidebar__apartment
  width: 42rem
  font-family: CraftworkSans, serif

  &-body
    margin: 3.5rem

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
  border-top: 2px solid var(--gray-100)
  border-bottom: 2px solid var(--gray-100)

  &-title
    color: var(--violet-600) !important

</style>
