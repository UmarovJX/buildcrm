<template>
    <div class="main__content">
        <!--   IMAGE SLIDER     -->
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
                            <img v-if="image" :data-fancybox="image" class="swiper-image" :src="image" alt="img-plan">
                            <img v-else class="swiper-image" :src="require('@/assets/img/no-image.jpg')" alt="img-no">
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


        <b-tabs card class="calculator-tab">
            <template #tabs-start>
                <div class="bottom__line"/>
            </template>
            <b-tab :title="$t('details')" active>
                <!--   PRICE CONTENT     -->
                <div v-if="!statusSold" class="price__section d-flex justify-content-between align-items-center">
           <span class="price__section-square-amount">
            {{ squareMetrePrice }} / m<sup class="color-gray-400">2</sup>
          </span>
                    <span class="price__section-amount">{{ price }}</span>
                </div>

                <PromoSection :promo="apartment.promo"/>

                <PrimaryTabItem :apartment="apartment"/>

            </b-tab>

            <b-tab :title="$t('type_payment')">

                <!--   PRICE CONTENT     -->
                <div v-if="!statusSold" class="price__section d-flex justify-content-between align-items-center">
           <span class="price__section-square-amount">
            {{ squareMetrePrice }} / m<sup class="color-gray-400">2</sup>
          </span>
                    <span class="price__section-amount">{{ price }}</span>
                </div>

                <Calculator @for-print="forPrint" :apartment="apartment"/>

                <PromoSection :promo="apartment.promo"/>
                <!--        &lt;!&ndash;   PROMO SECTION &ndash;&gt;-->
                <!--        <div v-if="apartment.promo.length" class="promos">-->
                <!--          <div v-for="promo in apartment.promo" :key="promo.id" class="promo__section">-->
                <!--            <div class="d-flex justify-content-between mb-3">-->
                <!--             <span class="d-block">-->
                <!--            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">-->
                <!--              <path d="M0.576446 10L10 0.576446L19.4236 10L10 19.4236L0.576446 10Z" fill="#7C3AED" stroke="white"-->
                <!--                    stroke-width="0.815217"/>-->
                <!--            </svg>-->
                <!--            <span class="ml-2 promo__section-title">{{ getName(promo.name) }}</span>-->
                <!--          </span>-->
                <!--              <span class="promo__section-subtitle">До {{ startDate(promo.start_date) }}</span>-->
                <!--            </div>-->
                <!--            <span v-for="discount in promo.discounts" :key="discount.promo_id" class="apartment__details-row">-->
                <!--            <span class="property">{{ $t('apartments.first_payment') }} {{ discount.discount }}%</span>-->
                <!--            <span class="value">{{ priceDiscount(discount.price) }} {{ $t('ye') }}/M<sup>2</sup></span>-->
                <!--          </span>-->
                <!--          </div>-->
                <!--        </div>-->

            </b-tab>
        </b-tabs>


        <!--   LINK TO APARTMENT VIEW     -->
        <!--    <div class="mt-5 mb-4">-->
        <!--      <router-link to="/" class="button__view">Вариант оплаты</router-link>-->
        <!--    </div>-->


        <!--      PARTICULAR QUALITIES-->
        <!-- <div class="particular__qualities font-inter">
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
import PrimaryTabItem from "@/components/Objects/View/elements/PrimaryTabItem";
import Calculator from "@/components/Objects/View/elements/Calculator";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {formatToPrice} from "@/util/reusable";
import {directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import PromoSection from "@/components/Objects/View/elements/PromoSection";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox.css";

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
        Calculator,
        PrimaryTabItem,
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
    mounted() {
        Fancybox.bind("[data-fancybox]");
    },
    computed: {
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

    methods: {
        forPrint(value) {
            this.$emit('for-print', value)
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