<script>
export default {
  name: 'BaseTabPicker',
  emits: ['tab-selected'],
  props: {
    options: {
      type: Array,
      required: true,
    },
    current: {
      required: true,
    },
    noAll: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentValue: null,
    }
  },
  watch: {
    current(val) {
      this.currentValue = val
    },
  },
  methods: {
    tabSelected(item) {
      this.$emit('tab-selected', item)
    },
  },
}
</script>

<template>
  <div>
    <div class="tab__container">
      <div class="filter__content">
        <div
          v-if="!noAll"
          class="filter__content-item"
          :class="{
            'filter__content-item-active': 'all' === current,
          }"
          @click="tabSelected('all')"
        >
          <div class="filter__content-item-inline">
            <span style="white-space: nowrap">{{ $t(`tab_status.all`) }}</span>
          </div>
          <div class="bottom__line" />
        </div>
        <div
          v-for="(item, index) in options"
          :key="'status_' + index"
          class="filter__content-item"
          :class="{
            'filter__content-item-active': item === current,
          }"
          @click="tabSelected(item)"
        >
          <div class="filter__content-item-inline">
            <span style="white-space: nowrap">{{ $t(`${item}`) }}</span>
          </div>
          <div class="bottom__line" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
}

.tab__container {
  width: 100%;
  overflow-x: auto;
  height: 3rem;

  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
}

.filter__content {
  position: relative;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  font-family: Inter, serif;
  font-style: normal;
  font-weight: 600;
  //line-height: 22px;
  color: var(--gray-600);

  &-item {
    position: relative;
    transition: all 0.1s ease-in;
    //padding: 4px;
    cursor: pointer;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0 0.75rem;
    min-width: 100px;

    p {
      margin: 0;
      line-height: 22px;
      font-size: 16px;
      font-weight: 600;
    }

    &-active {
      border-top-left-radius: 100px;
      color: var(--violet-600);

      .filter__content-item-inline {
        //padding: 1rem 2rem;
        span {
          color: var(--violet-600);
        }
      }

      &:after {
        content: "";
        position: absolute;
        bottom: -16px;
        left: 0;
        width: 100%;
        height: 8px;
        border-radius: 16px 16px 0 0;
        background-color: var(--violet-600);
      }
    }
  }

  &-item-inline {
    display: flex;
    align-items: center;

    .counts {
      margin-left: 0.5rem;
      background-color: var(--gray-100);
      border-radius: 2rem;
      padding: 0.25rem 0.5rem;
      color: var(--gray-400);
    }

    .counts.active {
      color: var(--violet-600);
    }
  }
}

.bottom__line {
  position: absolute;
  bottom: -16px;
  width: 100%;
  height: 6px;
  border-bottom: 8px solid var(--gray-100);
}
</style>
