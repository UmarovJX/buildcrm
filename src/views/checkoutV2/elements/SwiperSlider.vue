<script>
import { makeProp as p } from '@/util/props'
import { PROP_TYPE_OBJECT, PROP_TYPE_ARRAY } from '@/constants/props'
import { Fancybox } from '@fancyapps/ui'
import { directive as swiperDirective } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import { XIcon } from '@/components/ui-components/material-icons'

const swiperDefaultOption = {
  slidesPerView: 1,
  spaceBetween: 0,
  direction: 'horizontal',
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true,
  },
  paginationClickable: true,
  draggable: true,
  loop: false,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}

export default {
  name: 'SwiperSlider',
  components: {
    XIcon,
  },
  props: {
    swiperOption: p(PROP_TYPE_OBJECT, swiperDefaultOption),
    items: p(PROP_TYPE_ARRAY, []),
  },
  directives: {
    swiper: swiperDirective,
  },
  mounted() {
    Fancybox.bind('[data-fancybox]')
  },
}
</script>

<template>
  <!--   IMAGE SLIDER     -->
  <div class="slider-content">
    <div
      ref="swiper"
      v-swiper="swiperOption"
      class="swiper swiper-container"
    >
      <!--     MAIN CONTENT OF SLIDE       -->
      <div class="swiper-wrapper">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="swiper-slide"
        >
          <div class="d-flex justify-content-center align-items-center">
            <img
              v-if="item.image"
              :src="item.image"
              :data-fancybox="item.image"
              class="swiper-image"
              alt="slider image"
            >
            <img
              v-else
              :src="require('@/assets/img/no-image.jpg')"
              alt="slider default image"
              class="swiper-image"
            >
          </div>
        </div>
      </div>
      <!--     DOTS PAGINATION       -->
      <div class="swiper-pagination" />

      <!--     BUTTON PREVIOUS       -->
      <div
        slot="button-prev"
        class="swiper-button-prev swiper-button d-flex justify-content-center align-items-center"
      >
        <x-icon
          name="chevron_left"
          class="gray-600"
        />
      </div>

      <!--     BUTTON NEXT       -->
      <div
        slot="button-next"
        class="swiper-button-next swiper-button d-flex justify-content-center align-items-center"
      >
        <x-icon
          name="chevron_right"
          class="gray-600"
        />
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.slider-content
  margin: 1rem

  .swiper
    display: flex
    align-items: center
    justify-content: center
    height: 100%
    //max-height: 24rem
    min-width: 300px

    .swiper-button
      width: 3rem
      height: 3rem
      border-radius: 50%
      background-color: var(--gray-100)
      display: none

      &-next::after,
      &-prev::after
        content: none !important

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
</style>
