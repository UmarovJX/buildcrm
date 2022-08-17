<template>
  <div class="base-tabs">
    <div class="tab" v-for="({tab, number, is_active}, index) in tabs" :key="index">
      <span :class="is_active ? 'tab-active' : 'tab-inactive'">
        <p class="tab-text">{{$t(tab)}}</p>
        <span class="tab-number">{{number}}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseTabs",
  components: {},
  props: {
    tabs: {
      type: Array,
      required: true
    }
  }
}
</script>

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
        background: #EDE9FE;
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
        background: #F3F4F6;
        border-radius: 16px 16px 0px 0px;
      }
      &:hover {
        color: #7C3AED;
        cursor: pointer;
        &::after {
          background: #E5E7EB;
        }
      }
    }
    &-active {
      display: flex;
      align-items: center;
      position: relative;
      gap: 8px;
      color: #7C3AED;
      p {
        margin: 0;
      }
      .tab-number {
        font-family: "Inter", serif;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        background: #EDE9FE;
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
        background: #7C3AED;
        border-radius: 16px 16px 0px 0px;
      }
    }
  }
}
</style>