<script>
export default {
  name: "SettingsTab",
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    currentTab: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ["change"],
  methods: {
    changeTab(v) {
      this.$emit("change", v);
    },
  },
};
</script>

<template>
  <div class="tab__container">
    <div class="filter__content">
      <div
        v-for="{ name, value, counts } in tabs"
        :key="name"
        class="filter__content-item"
        @click="changeTab(value)"
        :class="[value === currentTab ? 'filter__content-item-active' : '']"
      >
        <div class="filter__content-item-inline">
          <span>{{ $t(`${name}`) }}</span>
          <span
            v-if="counts"
            class="counts"
            :class="{ active: value === currentTab }"
          >
            {{ counts }}
          </span>
        </div>
      </div>
    </div>
    <div class="bottom__line"></div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
}

.filter__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 16px;
  margin-bottom: 8px;
  font-family: Inter, serif;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
  color: var(--gray-600);

  //&::before {
  //content: '';
  //position: absolute;
  //z-index: -1;
  //bottom: 0;
  //width: 100%;
  //height: 6px;
  //background: red;
  //border-top-left-radius: 3px;
  //border-top-right-radius: 3px;
  //}

  &-item {
    position: relative;
    transition: all 0.1s ease-in;
    //padding: 4px;
    cursor: pointer;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;

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
  width: 100%;
  height: 6px;
  border-bottom: 8px solid var(--gray-100);
}
</style>
