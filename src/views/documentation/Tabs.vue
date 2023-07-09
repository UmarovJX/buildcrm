<script>
import BaseTabs from "@/components/Reusable/BaseTabs";
import DocHeader from "@/views/documentation/DocHeader";
export default {
  name: "documentation",
  components: { DocHeader, BaseTabs },
  data() {
    return {
      tabs: [
        {
          tab: "selected",
          number: 900,
          is_active: true,
        },
        {
          tab: "pointed",
          number: 100,
          is_active: false,
        },
        {
          tab: "not_selected",
          number: 45,
          is_active: false,
        },
      ],
    };
  },
};
</script>
<template>
  <main class="tabs">
    <DocHeader title="tabs" />
    <div class="tabs-content">
      <BaseTabs :tabs="tabs" />
    </div>
  </main>
</template>

<style scoped lang="scss">
.tabs {
  &-content {
    padding: 0 64px 64px;
  }
}
</style>
