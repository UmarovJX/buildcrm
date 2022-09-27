<template>
    <div class="position-relative" style="min-height: 300px">
        <div v-if="!planLoad && plans.length" class="object-cards">
            <div class="card" v-for="plan in plans" :key="plan.id"
                 @click="showExpressSidebar(plan)">
                <div class="card-body">
                    <div class="card-top">
                        <div class="card-top__content">
                            <h5 class="card-title">
                                {{ plan.name }}
                            </h5>
                            <div class="card-subtitle">
                                {{ plan.address }}
                            </div>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-block">
                            <p class="card-block__title">{{ plan.area }} m<sup>2</sup></p>
                            <p class="card-block__subtitle">{{ price(plan.price_m2) }} {{ $t('ye') }}/M<sup>2</sup></p>
                        </div>
                        <div class="card-block">
                            <p class="card-block__title">{{ plan.rooms }} {{ $t('object.flats') }}</p>
                            <p class="card-block__subtitle price">{{ price(plan.price) }} {{ $t('ye') }}</p>
                        </div>
                        <div class="card-block">
                            <p class="card-block__title">{{ plan.apartments_count }} {{ $t('object.rooms') }}</p>
                        </div>
                    </div>
                    <div class="card-bottom">
                        <div class="swiper" v-swiper="swiperOption" :id="plan.id" style="padding: 0 60px">

                            <!--     MAIN CONTENT OF SLIDE       -->
                            <div class="swiper-wrapper">
                                <div
                                    v-for="(key,index) of plan.images"
                                    :key="index"
                                    class="swiper-slide"
                                >
                                    <!--                                    <div class="d-flex justify-content-center align-items-center">-->
                                    <img v-if="key" class="swiper-image" :src="key" alt="no_image">
                                    <img v-else class="swiper-image" :src="require('@/assets/img/no-image.jpg')"
                                         alt="img">
                                    <!--                                    </div>-->
                                </div>
                            </div>

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
                </div>
            </div>
        </div>

        <b-overlay :show="planLoad" no-wrap opacity="0" style="z-index: 2222">
            <template #overlay>
                <div class="d-flex justify-content-center w-100">
                    <div class="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </template>
        </b-overlay>

    </div>
</template>

<script>
// import api from "@/services/api";
import {directive} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import {formatToPrice} from "@/util/reusable";
// import BaseEditIcon from "@/components/icons/BaseEditIcon";


export default {
    name: "ObjectPlan",

    components: {
        BaseArrowLeftIcon,
        BaseArrowRightIcon,
        // BaseEditIcon
    },

    /* DIRECTIVES */
    directives: {
        swiper: directive,
    },

    /* PROPS */
    props: {
        planLoad: {
            type: Boolean,
            default: () => false
        },
        plans: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            // plans: [],
            // loading: false,
            swiperOption: {
                slidesPerView: 1,
                spaceBetween: 80,
                direction: 'horizontal',
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
    mounted() {
        // this.getObjectPlans()
    },
    methods: {
        price(value) {
            return formatToPrice(value, 2)
        },
        showExpressSidebar(item) {
            this.$emit('show-plan-sidebar', item)
        },
    }
}
</script>

<style lang="scss" scoped>

.object-cards {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
}

.card {
    border-radius: 1rem;
    width: 412px;
    border: none;
    cursor: pointer;
    font-family: Inter, sans-serif;

    &-body {
        border-radius: 1rem;
        padding: 28px;
        background-color: var(--gray-100)
    }

    &:hover {
        .card-body {
            background-color: var(--violet-100)
        }
    }

    &-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom: 2px solid var(--gray-200);
        padding-bottom: 16px;
        margin-bottom: 16px;

        &__content {
        }
    }

    ::v-deep .card-bottom {
        margin-top: -1rem;

        .swiper-container {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 18rem;

            .swiper-slide {
                cursor: grab;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;

                .swiper-image {
                    //display: flex;
                    //justify-content: center;
                    //align-items: center;
                    width: 16rem;
                    height: 16rem;
                    object-fit: contain;
                }
            }

            .swiper-button {
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                background-color: var(--violet-100);
            }

            .swiper-button-next {
                right: 0;
            }

            .swiper-button-prev {
                left: 0;
            }

            .swiper-button-next::after,
            .swiper-button-prev::after {
                content: none;
            }

            .swiper-pagination {
                margin-top: 3rem;

                &-bullets {
                    bottom: 1rem;
                }

                &-bullet {
                    width: 0.75rem;
                    height: 0.75rem;
                    margin-right: 0.3rem;
                    background-color: var(--gray-400);

                    &-active {
                        background-color: var(--violet-400);
                    }
                }
            }
        }
    }

    &-title {
        color: var(--violet-600);
        font-weight: 900;
        font-size: 18px;
        line-height: 22px;
        margin-bottom: 16px;
    }

    &-subtitle {
        font-size: 1rem;
        line-height: 22px;
        font-weight: 600;
        color: var(--gray-500);
        margin: 0;
    }

    &-button {
        width: max-content;
        border-radius: 1rem;
        background-color: var(--white);
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: var(--gray-400);
        margin-bottom: 12px;
        padding: 5px 10px;
    }

    &-block {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;


        p {
            margin-bottom: 0;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            color: var(--gray-500);
        }

        .price {
            font-size: 18px;
            line-height: 24px;
            color: var(--violet-600);
        }

        &__title {

        }
    }

    &-img {
        height: 206px;

        img {
            border-radius: 0 0 1rem 1rem;
            max-height: 100%;
            width: 100%;
            object-fit: cover;
        }
    }
}
</style>