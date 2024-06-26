<script>
import { formatToPrice } from "@/util/reusable";

export default {
  name: "ChessSquareCard",
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
    },
  },
  emits: ["show-express-sidebar"],

  computed: {
    query() {
      return this.$route.query;
    },
    hasQuery() {
      return Object.keys(this.query).length > 0;
    },
  },

  methods: {
    status(value) {
      switch (value) {
        case "available": {
          return { statusText: "", class: "teal" };
        }
        case "hold": {
          return { statusText: this.$t("object.status.hold"), class: "yellow" };
        }
        case "waiting":
        case "sold":
        case "closed": {
          return { statusText: this.$t("object.status.sold"), class: "gray" };
        }
        case "booked": {
          return {
            statusText: this.$t("object.status.booked"),
            class: "yellow",
          };
        }
        case "contract": {
          return {
            statusText: this.$t("object.status.contract"),
            class: "blue",
          };
        }
        default:
          return { statusText: "", class: "teal" };
      }
    },
    price(value) {
      return formatToPrice(value);
    },
    levelLarge(index) {
      const apartmentFloorsNumbers = this.apartments[index].blocks.map(
        (item) => item.floors.length
      );
      if (apartmentFloorsNumbers.length) {
        return Math.max(...apartmentFloorsNumbers);
      }
      return 0;
    },
    showExpressSidebar(item) {
      // const isActive = !this.inactiveApartment(item.apartmentActive, floorActive, blockActive)
      // if (isActive) {
      // if (this.getPermission.apartments && this.getPermission.apartments.show) {
      this.$emit("show-express-sidebar", item);
      // }
      // }
    },
    inactiveApartment(apartmentActive, floorActive, blockActive) {
      return !(blockActive && floorActive && apartmentActive);
    },
    showBlock(blockActive) {
      if (blockActive === undefined) {
        return true;
      } else {
        return blockActive;
      }
    },
  },
};
</script>

<template>
  <div
    class="position-relative d-flex"
    style="min-height: 300px; overflow-x: auto"
  >
    <div
      v-for="(apartment, index) in apartments"
      :key="apartment.id"
      class="d-flex"
      style="margin-bottom: 50px"
    >
      <div class="vertical">
        <h5>
          {{ $t("object.level") }}
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
              <span> {{ apartment.name }} / {{ value.name }} </span>
            </div>

            <div class="item" style="margin-right: 30px">
              <div
                v-for="item in value.floors"
                :key="item.name"
                class="items-row"
              >
                <div
                  v-if="item.apartments.length"
                  class="d-flex flex-nowrap block-content"
                >
                  <div
                    v-for="elem in item.apartments"
                    :key="elem.id"
                    class="block-item"
                    :class="[
                      hasQuery &&
                      inactiveApartment(
                        elem.apartmentActive,
                        item.floorActive,
                        value.blockActive
                      )
                        ? 'apartment-inactive'
                        : [
                            status(elem.order.status).class,
                            elem.is_sold ? '' : 'disable',
                          ],
                    ]"
                  >
                    <div
                      :id="elem.is_sold ? 'tolltip' + elem.number : 'disable'"
                      class="box"
                      @click="showExpressSidebar(elem)"
                    >
                      <h5 class="apartment-number" style="white-space: nowrap">
                        {{ elem.number }}
                      </h5>
                    </div>
                    <span
                      class="tooltip-content"
                      :class="[
                        status(elem.order.status).class + '-tool',
                        elem.is_sold ? '' : 'disable-tool',
                      ]"
                    >
                      <b-tooltip
                        class="custom-tooltip"
                        :target="'tolltip' + elem.number"
                        variant="light"
                        triggers="hover"
                      >
                        <!--                        placement="bottomright"-->
                        <div
                          class="square"
                          :class="[
                            status(elem.order.status).class + '-tool',
                            elem.is_sold ? '' : 'disable-tool',
                          ]"
                        >
                          <div class="square-header">
                            <p>Кв. №{{ elem.number }}</p>
                            <div v-if="elem.is_promo" class="h-auto d-flex">
                              <img
                                src="../../../../assets/icons/bonuses.svg"
                                alt=""
                              />
                            </div>
                          </div>
                          <div class="square-body">
                            <h5 v-if="!elem.is_sold">
                              <template>
                                <span class="apartment-status">
                                  {{ $t("not_for_sale") }}
                                </span>
                              </template>
                            </h5>
                            <h5 v-else>
                              <template
                                v-if="status(elem.order.status).statusText"
                              >
                                {{ status(elem.order.status).statusText }}
                              </template>
                              <template v-else>
                                {{ price(elem.prices.price, 2) }} сум
                              </template>
                            </h5>
                          </div>
                          <div class="square-footer">
                            <p>{{ elem.plan.area }} m<sup>2</sup></p>
                            <p
                              v-if="
                                elem.order.status !== 'sold' && !isHidePrice
                              "
                            >
                              {{ price(elem.prices.price_m2) }}
                              {{ $t("ye") }}/m<sup>2</sup>
                            </p>
                          </div>
                        </div>
                      </b-tooltip>
                    </span>
                  </div>
                </div>

                <div v-else class="block-item">
                  <div class="square"></div>
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

<style lang="scss" scoped>
.block-content {
  .yellow {
    h5 {
      color: var(--yellow-600);
    }

    .box {
      background-color: var(--yellow-100);
    }

    &:hover {
      .box {
        outline: var(--yellow-600) solid 2px !important;
        background-color: var(--white);
      }
    }
  }

  .teal {
    h5 {
      color: var(--teal-600);
    }

    .box {
      background-color: var(--teal-100);
    }

    &:hover {
      .box {
        outline: var(--teal-600) solid 2px !important;
        background-color: var(--white);
      }
    }
  }

  .blue {
    h5 {
      color: var(--light-blue-600);
    }

    .box {
      background-color: var(--light-blue-100);
    }

    &:hover {
      .box {
        outline: var(--light-blue-600) solid 2px !important;
        background-color: var(--white);
      }
    }
  }

  .gray {
    h5 {
      color: var(--red-600);
    }

    .box {
      background-color: var(--red-100);
    }

    &:hover {
      .box {
        outline: var(--red-600) solid 2px !important;
        background-color: var(--white);
      }
    }
  }

  .disable {
    h5 {
      color: var(--gray-400);
    }

    .box {
      background-color: var(--gray-50);
    }

    &:hover {
      .box {
        background-color: var(--gray-50);
        outline: none !important;
      }
    }
  }
}

::v-deep.b-tooltip {
  //.arrow {
  //  display: none !important;
  //  left: -6px !important;
  //  bottom: .5rem !important;
  //  top: .5rem !important;
  //  margin: 0.5rem;
  //  transform: rotate(-90deg);
  //}

  //.arrow::before {
  //  border-left-color: red;
  //  border-right-color: red;
  //  border-top-color: red;
  //  border-bottom-color: red;
  //}

  .bs-tooltip-bottom {
    padding: 0.3rem 0;
  }

  .tooltip-inner {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
  }

  .square {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 16.5rem;
    height: 96px;
    background-color: var(--gray-50);
    font-family: Inter, sans-serif;
    border-radius: 0.5rem;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.5);

    //&::before {
    //  position: absolute;
    //  content: '';
    //  width: .5rem;
    //  height: .8rem;
    //  left: 0;
    //  top: 0;
    //  border-color: transparent;
    //  border-style: solid;
    //  border-left-color: black;
    //  border-width: .5rem;
    //}

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

    //&.yellow {
    //  color: var(--white) !important;
    //  background-color: var(--yellow-600) !important;
    //
    //
    //  h5 {
    //    color: var(--yellow-600);
    //  }
    //}
    //
    //&.teal {
    //  h5 {
    //    color: var(--teal-600);
    //  }
    //}
    //
    //&.blue {
    //  .square-footer {
    //    p {
    //      color: var(--gray-400);
    //    }
    //  }
    //
    //  h5 {
    //    color: var(--light-blue-600);
    //  }
    //
    //
    //}
    //
    //&.gray {
    //  h5 {
    //    color: var(--gray-600);
    //  }
    //
    //  .square-footer {
    //    p {
    //      color: var(--gray-400);
    //    }
    //  }
    //}
    //
    //&.disable {
    //  color: var(--white) !important;
    //  background-color: var(--gray-500) !important;
    //
    //
    //  h5 {
    //    color: var(--gray-500);
    //  }
    //}
  }

  .yellow-tool {
    //background-color: var(--yellow-600);

    //p, h5 {
    //  color: var(--white) !important;
    //}

    //&::before {
    //  border-left-color: var(--yellow-600);
    //}

    //&:hover {
    background-color: var(--gray-50);

    h5 {
      color: var(--yellow-600);
    }

    .square-footer {
      p {
        color: var(--gray-600);
      }
    }

    .square-header {
      p {
        color: var(--gray-500);
      }
    }

    //}
    //&::before {
    //  border-bottom-color: var(--gray-50) !important;
    //}
  }

  .teal-tool {
    background-color: var(--gray-50);

    h5 {
      color: var(--teal-600);
    }

    .square-footer {
      p {
        color: var(--gray-600);
      }
    }

    .square-header {
      p {
        color: var(--gray-500);
      }
    }
  }

  .blue-tool {
    background-color: var(--gray-50);

    h5 {
      color: var(--light-blue-600);
    }

    .square-footer {
      p {
        color: var(--gray-400);
      }
    }

    .square-header {
      p {
        color: var(--gray-500);
      }
    }
  }

  .gray-tool {
    background-color: var(--gray-50);

    h5 {
      color: var(--red-600);
    }

    .square-footer {
      p {
        color: var(--gray-400);
      }
    }

    .square-header {
      p {
        color: var(--gray-500);
      }
    }
  }

  .disable-tool {
    background-color: var(--gray-50) !important;

    h5 {
      color: var(--red-400);
    }

    .square-footer {
      p {
        color: var(--gray-600);
      }
    }

    .square-header {
      p {
        color: var(--gray-500);
      }
    }
  }
}

.box {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 4rem;
  width: auto;
  height: 56px;
  background-color: var(--gray-50);
  font-family: Inter, sans-serif;
  justify-content: center;
  align-items: center;

  h5 {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    margin: 0;
  }
}

.item {
  display: flex;
  flex-direction: column;
  row-gap: 2px;
  padding: 4px;
}

.items-row {
  display: flex;
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
  height: 56px;
}

.block {
  display: flex;
  height: 100%;
  //width: 100vw;
  //max-width: 100vw;
  //overflow-x: auto;
  overflow-y: visible;

  &-content {
    border: 0 solid var(--gray-100);
    height: auto;
    display: flex;
    column-gap: 2px;
  }

  &-item {
    color: var(--teal-500);
    //width: 100%;
    min-width: 4rem;
    width: 4rem;
    height: 3.5rem;
    background-color: var(--gray-50);
    //border: 1px solid var(--gray-100);
    cursor: pointer;
    box-sizing: border-box;
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
  left: -1px;
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
  .square-header .apartment-number,
  .square-header .apartment-promo-icon img {
    display: none !important;
  }
}

.apartment-inactive {
  .box {
    display: none;
  }

  ::v-deep .tooltip-content {
    display: none;
  }
}
</style>
