<template>
  <div class="d-flex ">

    <div class="vertical">
      Этажи
    </div>


    <div class="d-flex block">

      <div v-for="(key, value, index) in object " :key="index + 'block'" class="d-flex ">
        <!--        <span v-if="index < 1">-->
        <!--          <div v-for="level in levelLarge" :key="level + 'level'" class="counter h-100">-->
        <!--          {{ (levelLarge + 1) - level }}-->
        <!--        </div>-->
        <!--        </span>-->
        <div v-if="index < 1">
          <div class="header">
            tr
          </div>
          <div v-for="level in levelLarge" :key="level + 'level'" class="counter">
            {{ (levelLarge + 1) - level }}
          </div>
        </div>
        <div>
          <div class="header">
            {{ value }}
          </div>
          <span class="d-flex flex-nowrap" v-for="item in key" :key="item+ 'item'">
          <div
              v-for="elem in item"
              :key="elem +'element'"
              class="block-item"
              @click="showExpressSidebar(item)"
          >
            {{ elem }} <br>
            {{ elem }}
          </div>
      </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "ObjectBlock",
  emits: ['show-express-sidebar'],
  data() {
    return {
      object: {
        block1: [
          [1, 2, 3, 432, 543, 5346],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block2: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block3: [
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block4: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block5: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block6: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block7: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
        block8: [
          [1, 2, 3],
          [1, 2, 3, 4, 5, 6, 7],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3],
          [1, 2, 3]
        ],
      },
      levelLarge: 0,
    }
  },
  mounted() {
    this.getMaxLength(this.object)
  },
  methods: {
    showExpressSidebar(item) {
      this.$emit('show-express-sidebar', item)
    },
    getMaxLength(arr) {
      this.levelLarge = Math.max(...Object.values(arr).map(item => {
        return item.length
      }))
    }

  }
}
</script>

<style scoped>
div {
  border: 1px solid red;
  /*  background-color: var(--gray-400);*/
  /*  min-height: 50px;*/
  /*  !*min-width: 50px;*!*/
  /*  !*width: 100%;*!*/
  /*  position: relative;*/

}

.list-num {
  max-height: 60vh;
  overflow: auto;
  height: 100%;
}

.counter {
  display: grid;
  grid-auto-rows: auto;
  /*display: flex;*/
  /*flex-basis: 100%;*/
  /*height: 100%;*/
  /*max-height: 300px;*/
  /*flex: auto;*/
}

.block {
  height: 100%;
  max-height: 60vh;
  max-width: 100vw;
  overflow: auto;
}

.block-item {
  /*height: 300px;*/
  /*max-height: 300px;*/
}

.header {
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
  /*max-height: 300px;*/
  transform: rotate(180deg);
  writing-mode: vertical-lr;
  -webkit-writing-mode: vertical-lr;
}
</style>