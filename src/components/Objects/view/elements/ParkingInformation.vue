<script>
import ParkingPrimaryTabItem from "@/components/Objects/view/elements/ParkingPrimaryTabItem";
import ParkingCalculator from "@/components/Objects/view/elements/ParkingCalculator";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import { formatToPrice } from "@/util/reusable";
import { directive } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import PromoSection from "@/components/Objects/view/elements/PromoSection";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";

export default {
  name: "PrimaryInformation",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    apartment: {
      type: Object,
      required: true,
    },
  },

  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    ParkingCalculator,
    ParkingPrimaryTabItem,
    PromoSection,
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
        direction: "horizontal",
        pagination: {
          el: ".swiper-pagination",
          type: "bullets",
          clickable: true,
        },
        paginationClickable: true,
        draggable: true,
        loop: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  mounted() {
    Fancybox.bind("[data-fancybox]");
  },
  computed: {
    price() {
      return this.apartment.is_sold
        ? formatToPrice(this.apartment.price, 2) + " " + this.$t("ye")
        : "";
    },
    statusSold() {
      return this.apartment.order.status === "sold";
    },
  },

  methods: {
    forPrint(value) {
      this.$emit("for-print", value);
    },
    buildingDate(time) {
      const date = new Date(time);
      const year = date.getFullYear();
      let month = date.getMonth();
      if (month < 3) {
        month = "1";
      } else if (month >= 3 && month < 6) {
        month = "2";
      } else if (month >= 6 && month < 9) {
        month = "3";
      } else {
        month = "4";
      }

      return ` ${month} - ${this.$t("quarter")} ${year} ${this.$t(
        "of_the_year"
      )}`;
    },
  },
};
</script>

<template>
  <div class="main__content">
    <!--   IMAGE SLIDER     -->
    <div class="slider-content">
      <div class="swiper" v-swiper="swiperOption">
        <!--     MAIN CONTENT OF SLIDE       -->
        <div class="swiper-wrapper">
          <div
            v-for="(image, index) in [apartment.upload.path]"
            :key="index"
            class="swiper-slide"
          >
            <div class="d-flex justify-content-center align-items-center">
              <img
                v-if="image"
                :data-fancybox="image"
                class="swiper-image"
                :src="image"
                alt="img-plan"
              />
              <img
                v-else
                class="swiper-image"
                :src="require('@/assets/img/no-image.jpg')"
                alt="img-no"
              />
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
          <base-arrow-left-icon />
        </div>

        <!--     BUTTON NEXT       -->
        <div
          slot="button-next"
          class="swiper-button-next swiper-button d-flex justify-content-center align-items-center"
        >
          <base-arrow-right-icon />
        </div>
      </div>
    </div>
    <b-tabs card class="calculator-tab">
      <template #tabs-start>
        <div class="bottom__line" />
      </template>
      <b-tab :title="$t('details')" active>
        <!--   PRICE CONTENT     -->
        <div
          class="price__section d-flex justify-content-between align-items-center"
        >
          <span class="price__section-amount">{{ price }}</span>
        </div>

        <PromoSection :promo="apartment.promo" />

        <ParkingPrimaryTabItem :apartment="apartment" />
      </b-tab>

      <b-tab :title="$t('type_payment')">

        <ParkingCalculator @for-print="forPrint" :apartment="apartment" />

        <PromoSection :promo="apartment.promo" />
      </b-tab>
    </b-tabs>
  </div>
</template>

<style lang="sass" scoped>
::v-deep .main__content
    .slider__image
        object-fit: contain

::v-deep .slider-content
    margin: 1rem

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


::v-deep .calculator-tab

    .bottom__line
        height: 8px
        width: 100%
        position: absolute
        bottom: 0
        left: 0
        border-radius: 1rem 1rem 0 0
        background-color: var(--gray-100)

    .card-header
        padding: 0
        background-color: transparent
        margin: 0
        border-bottom: none

    .tab-content
        position: relative
    //padding-top: 12px

    .card-body
        padding: 0

    .card-header-tabs
        margin: 0


    .nav-tabs
        display: flex
        flex-wrap: nowrap
        column-gap: .5rem
        justify-content: space-around
        position: relative

        .nav-item
            width: 100%

        .nav-link
            display: flex
            justify-content: center
            align-items: center
            border: none
            padding: 0 12px 12px
            color: var(--gray-600)

            &.active
                position: relative
                color: var(--violet-600)

                &:after
                    content: ''
                    height: 8px
                    width: 100%
                    position: absolute
                    bottom: 1px
                    left: 0
                    border-radius: 1rem 1rem 0 0
                    background-color: var(--violet-600)
                    z-index: 5


.price__section
    font-family: CraftworkSans, serif
    font-size: 1.5rem
    font-weight: 900
    margin: 1.5rem 0

    &-amount
        color: var(--gray-600) !important
        line-height: 28px
        text-align: end
        width: 100%

    &-square-amount
        color: var(--gray-500) !important
        font-size: 18px
        line-height: 22px


.button__view
    display: inline-block
    padding: 1rem 1.5rem
    background-color: var(--gray-100)
    border-radius: 2rem
    font-family: Inter, sans-serif


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
