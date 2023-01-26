<template>
    <div class="position-relative d-flex" style="min-height: 300px; overflow-x: auto">
        <div v-for="(apartment,index) in apartments" :key="apartment.id" class="d-flex" style="margin-bottom: 50px">

            <div class="vertical">
                <h5>
                    {{ $t('object.level') }}
                </h5>
            </div>

            <div class="block">
                <div class="list-number">
                    <div v-for="level in levelLarge(index)" :key="level" class="counter">
                        {{ level }}
                    </div>
                </div>

                <template v-for="value in apartment.blocks">
                    <div
                        v-if="showBlock(value.blockActive)"
                        :key="value.id"
                        class="d-flex flex-column position-relative"
                    >

                        <div class="header">
                            <div>
                                {{ apartment.name }} / {{ value.name }}
                            </div>
                        </div>

                        <div class="item" style="margin-right: 30px">
                            <div v-for="item in value.floors" :key="item.name">
                                <div v-if="item.apartments.length" class="d-flex flex-nowrap block-content">
                                    <div
                                        v-for="elem in item.apartments"
                                        :key="elem.id"
                                        class="block-item"
                                        :class="{
                                          'inactive-apartment':
                                          hasQuery &&
                                          inactiveApartment(elem.apartmentActive,item.floorActive,value.blockActive)
                                        }"
                                    >
                                        <div class="square"
                                             @click="showExpressSidebar(elem,item.floorActive,value.blockActive)"
                                             :class="[status(elem.order.status).class, elem.is_sold ? '' : 'disable']">
                                            <div class="square-header">
                                                <p class="apartment-number">Кв. № {{ elem.number }}</p>
                                                <div v-if="elem.is_promo" class="h-auto d-flex apartment-promo-icon">
                                                    <img src="../../../../assets/icons/bonuses.svg" alt="">
                                                </div>
                                            </div>
                                            <div class="square-body">
                                                <h5 v-if="!elem.is_sold">
                                                    <template>
                                                      <span class="apartment-status">
                                                        {{ $t('not_for_sale') }}
                                                      </span>
                                                    </template>
                                                </h5>
                                                <h5 v-else>
                                                    <template v-if="status(elem.order.status).statusText">
                                                      <span class="apartment-status">
                                                        {{ status(elem.order.status).statusText }}
                                                      </span>
                                                    </template>
                                                    <template v-else>
                                                        <span class="apartment-price">{{ price(elem.prices.price, 2) }} сум</span>
                                                    </template>
                                                </h5>
                                            </div>
                                            <div class="square-footer">
                                                <p class="apartment-area">{{ elem.plan.area }} m<sup>2</sup></p>
                                                <p
                                                    class="apartment-square-price"
                                                    v-if="elem.order.status !== 'sold' && elem.is_sold && !isHidePrice"
                                                >
                                                    {{ price(elem.prices.price_m2) }} {{ $t('ye') }}/m<sup>2</sup>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-else class="block-item">
                                    <div class="square">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <b-overlay :show="loading" no-wrap opacity="0" style="z-index: 2222">
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
import {mapGetters} from "vuex";
import {formatToPrice} from "@/util/reusable";

export default {
    name: "ObjectBlock",
    props: {
        apartments: {
            type: Array,
            required: true,
        },
        isHidePrice: {
            type: Boolean,
            required: false,
        },
        loading: {
            type: Boolean,
            required: false,
        }
    },
    emits: ['show-express-sidebar'],
    computed: {
        ...mapGetters(["getPermission"]),
        query() {
            return this.$route.query
        },
        hasQuery() {
            return Object.keys(this.query).length > 0
        }
    },
    methods: {
        status(value) {
            switch (value) {
                case 'available': {
                    return {statusText: '', class: 'teal'}
                }
                case 'hold': {
                    return {statusText: this.$t('object.status.hold'), class: 'yellow'}
                }
                case 'waiting':
                case 'sold':
                case 'closed': {
                    return {statusText: this.$t('object.status.sold'), class: 'gray'}
                }
                case 'booked': {
                    return {statusText: this.$t('object.status.booked'), class: 'yellow'}
                }
                case 'contract': {
                    return {statusText: this.$t('object.status.contract'), class: 'blue'}
                }
                default:
                    return {statusText: '', class: 'teal'}
            }
        },
        price(value, decimalCount = 0) {
            return formatToPrice(value, decimalCount)
        },
        levelLarge(index) {
            const apartmentFloorsNumbers = this.apartments[index].blocks.map(item => item.floors.length)
            if (apartmentFloorsNumbers.length) {
                return Math.max(...apartmentFloorsNumbers)
            }
            return 0
        },
        showExpressSidebar(item, floorActive, blockActive) {
            const isActive = !this.inactiveApartment(item.apartmentActive, floorActive, blockActive)
            if (isActive) {
                this.$emit('show-express-sidebar', item)
            }
        },
        inactiveApartment(apartmentActive, floorActive, blockActive) {
            if (apartmentActive === undefined || floorActive === undefined || blockActive === undefined)
                return false
            return !(blockActive && floorActive && apartmentActive)
        },
        showBlock(blockActive) {
            if (blockActive === undefined) {
                return true
            } else {
                return blockActive
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.square {
    padding: 12px;
    display: flex;
    flex-direction: column;
    //gap: 4px;
    width: 16.5rem;
    height: 92px;
    background-color: var(--gray-50);
    font-family: Inter, sans-serif;
    //border: 2px solid var(--white);
    cursor: pointer;
    outline: none;


    p {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: var(--gray-500);
        margin-bottom: 0;
    }

    &-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    &-body {
        display: flex;

        h5 {
            font-weight: 600;
            font-size: 18px;
            line-height: 24px;
            margin: 0;
        }
    }

    &-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
            color: var(--gray-600);
        }
    }


    &.yellow {
        background-color: var(--yellow-100);


        h5 {
            color: var(--yellow-600);
        }

        .square {
            &-header {
                p {
                    color: var(--gray-600);
                }
            }

            &-footer {
                p {
                    color: var(--gray-700);
                }
            }
        }

        &:hover {
            outline: var(--yellow-600) solid 2px !important;
            background-color: var(--white);
        }

    }

    &.teal {
        background-color: var(--teal-100);

        h5 {
            color: var(--teal-600);
        }


        .square {
            &-header {
                p {
                    color: var(--gray-600);
                }
            }

            &-footer {
                p {
                    color: var(--gray-700);
                }
            }
        }

        &:hover {
            outline: var(--teal-600) solid 2px !important;
            background-color: var(--white);

        }


    }

    &.blue {
        background-color: var(--light-blue-100);

        h5 {
            color: var(--light-blue-600);
        }

        .square {
            &-header {
                p {
                    color: var(--gray-600);
                }
            }

            &-footer {
                p {
                    color: var(--gray-700);
                }
            }
        }

        &:hover {
            outline: var(--blue-600) solid 2px !important;
            background-color: var(--white);

            .square {
                &-header {
                    p {
                        color: var(--gray-600);
                    }
                }

                &-footer {
                    p {
                        color: var(--gray-400);
                    }
                }
            }
        }

    }

    &.gray {
        box-sizing: inherit;
        background-color: var(--red-100);

        h5 {
            color: var(--red-600);
        }

        .square {
            &-header {
                p {
                    color: var(--gray-700);
                }
            }

            &-footer {
                p {
                    color: var(--gray-600);
                }
            }
        }


        &:hover {
            outline: var(--red-600) solid 2px !important;
            background-color: var(--white);

            .square {
                &-header {
                    p {
                        color: var(--gray-600);
                    }
                }

                &-footer {
                    p {
                        color: var(--gray-400);
                    }
                }
            }
        }
    }

    &.disable {
        background-color: var(--gray-50);

        h5, p {
            color: var(--gray-400);
        }

        .square {
            &-header {
                p {
                    color: var(--gray-500);
                }
            }

            &-footer {
                p {
                    color: var(--gray-400);
                }
            }
        }

        &:hover {
            background-color: var(--gray-50);
            outline: none !important;

            h5, p {
                color: var(--gray-400);
            }

            .square {
                &-header {
                    p {
                        color: var(--gray-500);
                    }
                }
            }
        }

    }
}


.list-number {
    position: sticky;
    z-index: 5;
    top: 0;
    left: 0;
    display: flex;
    padding-top: 22px;
    background-color: var(--white);
    flex-direction: column;
}

.counter {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray-400);
    padding: 3px;
    height: 96px;
}

.item {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
    //padding-left: 4px;
    //padding-top: 4px;
    padding: 4px;
}

.block {
    display: flex;
    height: 100%;
    //width: 100vw;
    //max-width: 100vw;
    //overflow-x: auto;
    overflow-y: visible;

    &-content {
        //border: 1px solid var(--gray-100);
        //min-height: 56px;
        height: auto;
        column-gap: 2px;
    }


    &-item {
        color: var(--teal-500);
        //width: 100%;
        height: auto;
        min-height: 56px;
        //border-color: var(--gray-100);
        //border-style: solid;
        //border-top: 0;
        //border-bottom: 0;
        background-color: var(--gray-50);

    }

}


.header {
    position: relative;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: var(--gray-400);
    text-transform: capitalize;
    width: 100%;
    min-height: 20px;
    z-index: 3;
    background-color: #fff;

    span {
        display: block;
        position: sticky;
        left: 30px;
        margin-right: 30px;
        top: 0;
        width: max-content;
    }
}

.vertical {
    z-index: 3;
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    top: 0;
    left: 0;
    max-height: 100vh;
    padding-left: 18px;
    padding-right: 10px;
    background-color: #fff;

    h5 {
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: var(--gray-400);
        margin: 0;
        transform: rotate(180deg);
        writing-mode: vertical-lr;
        -webkit-writing-mode: vertical-lr;
        background-color: var(--white);

    }
}

.inactive-apartment {
    .square {
        &.yellow,
        &.teal,
        &.blue,
        &.gray {
            background-color: var(--gray-50) !important;

            &:hover {
                background-color: var(--gray-50) !important;

                p, h5 {
                    display: none;
                }
            }
        }

        .square-footer {
            .apartment-area,
            .apartment-square-price {
                display: none;
            }
        }
    }

    .apartment {
        &-square-price,
        &-price,
        &-status,
        &-number,
        &-promo-icon img {
            display: none !important;
        }
    }
}
</style>