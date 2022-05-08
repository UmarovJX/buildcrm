<template>
  <div class="position-relative" style="min-height: 300px">
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
              {{ value.name }}
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
                    <div class="square" @click="showExpressSidebar(elem,item.floorActive,value.blockActive)"
                         :class="status(elem.order.status).class">
                      <div class="square-header">
                        <p class="apartment-number">Кв. № {{ elem.number }}</p>
                        <div v-if="elem.is_promo" class="h-auto d-flex apartment-promo-icon">
                          <img src="../../../../assets/icons/bonuses.svg" alt="">
                        </div>
                      </div>
                      <div class="square-body">
                        <h5>
                          <template v-if="status(elem.order.status).statusText">
                          <span class="apartment-status">
                            {{ status(elem.order.status).statusText }}
                          </span>
                          </template>
                          <template v-else>
                            <span class="apartment-price">{{ price(elem.price) }} сум</span>
                          </template>
                        </h5>
                      </div>
                      <div class="square-footer">
                        <p class="apartment-area">{{ elem.plan.area }} M<sup>2</sup></p>
                        <p class="apartment-square-price">{{ price(elem.price_m2) }} сум/M<sup>2</sup></p>
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

export default {
  name: "ObjectBlock",
  props: {
    apartments: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
    }
  },
  emits: ['show-express-sidebar'],
  computed: {
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
    price(value) {
      return value.toLocaleString()
    },
    levelLarge(index) {
      const apartmentFloorsNumbers = this.apartments[index].blocks.map(item => item.floors.length)
      if (apartmentFloorsNumbers.length) {
        return Math.max(...apartmentFloorsNumbers)
      }
      return 0
    },
    showExpressSidebar(item) {
      this.$emit('show-express-sidebar', item)
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
  gap: 4px;
  width: 16.5rem;
  height: 96px;
  background-color: var(--gray-50);
  font-family: Inter, sans-serif;
  border: 1px solid var(--gray-100);

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
    h5 {
      color: var(--yellow-500);
    }

    &:hover {
      background-color: var(--yellow-500);

      p, h5 {
        color: var(--white);
      }
    }
  }

  &.teal {
    h5 {
      color: var(--teal-500);
    }

    &:hover {
      background-color: var(--teal-500);

      p, h5 {
        color: var(--white);
      }
    }
  }

  &.blue {
    .square-footer {
      p {
        color: var(--gray-400);
      }
    }

    h5 {
      color: var(--light-blue-500);
    }

    &:hover {
      background-color: var(--light-blue-500);

      p, h5 {
        color: var(--white);
      }
    }


  }

  &.gray {
    h5 {
      color: var(--gray-500);
    }

    .square-footer {
      p {
        color: var(--gray-400);
      }
    }

    &:hover {
      background-color: var(--gray-500);

      p, h5 {
        color: var(--white);
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

.block {
  display: flex;
  height: 100%;
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  overflow-y: visible;

  &-content {
    //border: 1px solid var(--gray-100);
    //min-height: 56px;
    height: auto;
  }


  &-item {
    color: var(--teal-500);
    width: 100%;
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
  position: sticky;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray-400);
  text-transform: capitalize;
  width: 100%;
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
      &:hover {
        background-color: var(--gray-50);

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
    &-number {
      display: none;
    }
  }
}
</style>