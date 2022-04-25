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
          <div v-for="level in levelLarge(index)" :key="level" class="counter">
            {{ level }}
          </div>
        </div>

        <div v-for="value in apartment.blocks" :key="value.id" class="d-flex flex-column position-relative">

          <div class="header">
            {{ value.name }}
          </div>

          <div class="item" style="margin-right: 30px">

          <span v-for="item in value.floors" :key="item.name" style="display:block;">
            <div v-if="item.apartments.length" class="d-flex flex-nowrap block-content">
              <div v-for="elem in item.apartments" :key="elem.id" class="block-item">
                <div class="square" @click="showExpressSidebar" :class="status(elem.order.status).class">
                    <h5>
                     {{ elem.id }}
                    </h5>
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
  name: "ChessSquareCard",
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
        case 'booked': {
          return {statusText: 'Забронировано', class: 'yellow'}
        }
        case 'cancelled': {
          return {statusText: 'cancelled', class: 'yellow'}
        }
        case 'hold': {
          return {statusText: 'hold', class: 'yellow'}
        }
        case 'waiting': {
          return {statusText: 'waiting', class: 'yellow'}
        }
        case 'closed': {
          return {statusText: 'closed', class: 'yellow'}
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 4rem;
  width: auto;
  height: 56px;
  background-color: var(--gray-50);
  font-family: Inter, sans-serif;
  border: 1px solid var(--gray-100);
  justify-content: center;
  align-items: center;

  h5 {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    margin: 0;
  }

  &.yellow {
    h5 {
      color: var(--yellow-500);
    }
  }

  &.teal {
    h5 {
      color: var(--teal-500);
    }
  }

  &.blue {
    h5 {
      color: var(--light-blue-500);
    }
  }

  &.gray {
    h5 {
      color: var(--gray-500);
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
  flex-direction: column-reverse;
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
  width: 100vw;
  max-width: 100vw;
  overflow-x: auto;
  overflow-y: visible;

  &-content {
    border: 0 solid var(--gray-100);
    height: auto;
  }


  &-item {
    color: var(--teal-500);
    width: 100%;
    height: 56px;
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
