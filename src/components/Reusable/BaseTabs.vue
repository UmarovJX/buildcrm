<script>
export default {
  name: 'BaseTabs',
  components: {},
  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    activeTab(index) {
      const i = this.tabs.findIndex(item => item.is_active)
      this.tabs[i].is_active = false
      this.tabs[index].is_active = true
    },
  },
}
</script>

<template>
  <div class="base-tabs">
    <div
      v-for="({ tab, number, is_active }, index) in tabs"
      :key="index"
      class="tab"
    >
      <span
        :class="is_active ? 'tab-active' : 'tab-inactive'"
        @click="activeTab(index)"
      >
        <p class="tab-text">{{ $t(tab) }}</p>
        <span class="tab-number">{{ number }}</span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-tabs {
  display: flex;
  gap: 64px;
  .tab {
    &-inactive {
      display: flex;
      position: relative;
      align-items: center;
      gap: 8px;
      p {
        margin: 0;
      }
      .tab-number {
        font-family: "Inter", serif;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: #9ca3af;
        background: #ede9fe;
        border-radius: 32px;
        padding: 4px 8px;
      }
      .tab-text {
        font-family: "Inter", serif;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
      }
      &::after {
        content: "";
        position: absolute;
        width: 100%;
        bottom: -20px;
        height: 6px;
        background: #f3f4f6;
        border-radius: 16px 16px 0px 0px;
      }
      &:hover {
        color: #7c3aed;
        cursor: pointer;
        &::after {
          background: #e5e7eb;
        }
        .tab-number {
          color: #7c3aed;
        }
      }
    }
    &-active {
      display: flex;
      align-items: center;
      position: relative;
      gap: 8px;
      color: #7c3aed;
      p {
        margin: 0;
      }
      .tab-number {
        font-family: "Inter", serif;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        background: #ede9fe;
        border-radius: 32px;
        padding: 4px 8px;
      }
      .tab-text {
        font-family: "Inter", serif;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: -20px;
        width: 100%;
        height: 6px;
        background: #7c3aed;
        border-radius: 16px 16px 0px 0px;
      }
    }
  }
}
</style>
