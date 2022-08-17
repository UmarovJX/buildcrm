<template>
  <div class="tabs">
    <header>
      <p>Xon Saroy Design System • Component</p>
      <h1>tabs</h1>
    </header>
    <div class="tabs-content">
      <BaseTabs :tabs="tabs"/>
    </div>
  </div>
</template>
<script>

import BaseTabs from "@/components/Reusable/BaseTabs";
export default {
  name: "documentation",
  components: {BaseTabs},
  data() {
    return {
      tabs: [
        {
          tab: "selected",
          number: 900,
          is_active: true
        },
        {
          tab: "pointed",
          number: 100,
          is_active: false
        },
        {
          tab: "not_selected",
          number: 45,
          is_active: false
        },
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.tabs {
  header {
    display: flex;
    background: #F3F4F6;
    padding: 64px;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 60px;
    p {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      font-weight: 900;
      color: #9CA3AF;
      font-size: 16px;
      line-height: 19px;
      margin: 0;
    }
    h1 {
      text-transform: uppercase;
      font-family: 'CraftworkSans', serif;
      margin: 0;
      font-weight: 900;
      font-size: 64px;
      line-height: 77px;
      color: #4B5563;
    }
  }
  &-content {
    padding: 0 64px 64px;
  }
}
</style>