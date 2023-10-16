<script>
export default {
  name: "BaseFilterTabsContent",
  emits: ["get-new-content"],
  props: {
    filterTabList: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.setCurrentStatus();
  },
  data() {
    return {
      currentStatus: "",
    };
  },
  watch: {
    "$route.query": {
      handler: function () {
        this.setCurrentStatus();
      },
      deep: true,
    },
  },
  methods: {
    getFilteredContent(status) {
      console.log();
      this.currentStatus = status;
      this.$emit("get-new-content", status);
    },
    setCurrentStatus() {
      const { query } = this.$route;
      const hasQueryAndStatus = Object.keys(query).length > 0 && query.status;
      if (hasQueryAndStatus) {
        this.currentStatus = query.status;
      } else if (this.filterTabList && this.filterTabList[0]) {
        this.currentStatus = this.filterTabList[0].status;
      } else {
        this.currentStatus = "";
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="tab__container">
      <div class="filter__content">
        <div
          v-for="(fTab, index) in filterTabList"
          :key="'status_' + index"
          @click="getFilteredContent(fTab.status)"
          class="filter__content-item"
          :class="{
            'filter__content-item-active': fTab.status === currentStatus,
          }"
        >
          <div class="filter__content-item-inline">
            <span style="white-space: nowrap">{{ $t(`${fTab.name}`) }}</span>
            <span
              v-if="fTab.counts"
              class="counts"
              :class="{ active: fTab.status === currentStatus }"
            >
              {{ fTab.counts }}
            </span>
          </div>
          <div class="bottom__line"></div>
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
