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
        <!--        <swiper class="swiper">-->
        <!--          <swiper-slide>Slide 1</swiper-slide>-->
        <!--          <swiper-slide>Slide 2</swiper-slide>-->
        <!--          <swiper-slide>Slide 3</swiper-slide>-->
        <!--          <swiper-slide>Slide 4</swiper-slide>-->
        <!--          <swiper-slide>Slide 5</swiper-slide>-->
        <!--          <swiper-slide>Slide 6</swiper-slide>-->
        <!--          <swiper-slide>Slide 7</swiper-slide>-->
        <!--          <swiper-slide>Slide 8</swiper-slide>-->
        <!--          <swiper-slide>Slide 9</swiper-slide>-->
        <!--          <swiper-slide>Slide 10</swiper-slide>-->
        <!--        </swiper>-->
      </div>
    </template>
  </b-sidebar>
</template>
<script>
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
// import 'swiper/css/swiper.css'

export default {
  name: "ApartmentExpressView",
  components: {
    // Swiper,
    // SwiperSlide,
    BaseArrowLeftIcon
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
      margin-top: 3.5rem

      .slider__image
        object-fit: contain


</style>