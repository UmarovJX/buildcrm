<template>
  <div>
    <div v-for="(apartment,index) in apartments" :key="apartment.id" class="d-flex" style="margin-bottom: 50px">
      <div class="vertical">
        <h5>
          Этажи
        </h5>
      </div>

      <div class="block">
        <div class="list-number">
          <div class="header" style="color: transparent">
            .
          </div>
          <div v-for="level in levelLarge(index)" :key="level" class="counter">
            {{ level }}
          </div>
        </div>

        <div v-for="value in apartment.blocks" :key="value.id" class="d-flex flex-column position-relative">

          <div class="header">
            {{ value.name }}
          </div>

          <div class="item">

          <span v-for="item in value.floors" :key="item.name">
            <div v-if="item.apartments.length" class="d-flex flex-nowrap block-content">
              <div v-for="elem in item.apartments" :key="elem.id" class="block-item">
                <div class="square" @click="showExpressSidebar(elem)">
                  <div class="square-header">
                    <p>Кв. №{{ elem.id }}</p>
                    <div v-if="!elem.discounts.length" class="h-auto d-flex">
                      <img src="../../assets/icons/bonuses.svg" alt="">
                    </div>
                  </div>
                  <div class="square-body">
                    <h5 :class="status(elem.order.status).class">
                      <template v-if="status(elem.order.status).statusText">
                        {{ status(elem.order.status).statusText }}
                      </template>
                      <template v-else>
                        {{ price(elem.price) }} сум
                      </template>
                    </h5>
                  </div>
                  <div class="square-footer">
                    <p>{{ elem.plan.area }}M<sup>2</sup></p>
                    <p>{{ price(elem.price_m2) }} сум/M<sup>2</sup></p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="block-item">
              <div class="square">
              </div>
            </div>
         </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: "ObjectBlock",
  props: {
    apartments: {
      type: Array,
      required: true,
    }
  },
  emits: ['show-express-sidebar'],
  methods: {
    status(value) {
      switch (value) {
        case 'available': {
          return {statusText: '', class: 'teal'}
        }
        case 'contract': {
          return {statusText: 'Оформлено', class: 'blue'}
        }
        case 'sold': {
          return {statusText: 'Продано', class: 'gray'}
        }
        case 'bron': {
          return {statusText: 'Забронировано', class: 'yellow'}
        }
        default:
          return {statusText: '', class: 'yellow'}
      }
    },
    price(value) {
      return value.toLocaleString()
    },
    levelLarge(index) {
      return Math.max(...this.apartments[index].blocks.map(item => {
        return item.floors.length
      }))
    },
    showExpressSidebar(item) {
      this.$emit('show-express-sidebar', item)
    },
  }
}
</script>

<style lang="scss" scoped>
.square {
  font-family: Inter, sans-serif;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 16.5rem;
  height: 96px;
  background-color: var(--gray-50);

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

    .yellow {
      color: var(--yellow-500);
    }

    .teal {
      color: var(--teal-500);
    }

    .blue {
      color: var(--light-blue-500);
    }

    .gray {
      color: var(--gray-500);
    }
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  flex-direction: column-reverse;
}

.counter {
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--gray-400);
  padding: 3px;
  height: 97px;
}

.block {
  display: flex;
  height: 100%;
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  overflow-y: visible;

  &-content {
    border: 1px solid var(--gray-100);
    //min-height: 56px;
    height: auto;
  }


  &-item {
    color: var(--teal-500);
    width: 100%;
    height: auto;
    min-height: 56px;
    border-color: var(--gray-100);
    border-style: solid;
    border-top: 0;
    border-bottom: 0;
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
</style>