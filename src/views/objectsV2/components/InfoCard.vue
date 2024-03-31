<template>
  <div class="building-card">
    <div class="title">
      <x-icon
        :name="icon"
        :size="28"
        class="violet-600 mr-4"
        color="var(--violet-600)"
      />
      {{ title }}
    </div>
    <div class="line"></div>
    <div class="info">
      <div class="entry" v-for="e in entries" :key="e">{{ e }}</div>
    </div>
  </div>
</template>

<script>
import { XIcon } from "@/components/ui-components/material-icons";

export default {
  components: { XIcon },
  props: {
    title: String,
    entries: Array,
    icon: String,
  },
};
</script>

<style lang="scss" scoped>
.building-card {
  padding: 32px;
  background-color: var(--gray-100);
  border-radius: 32px;
  & .title {
    display: flex;
    font-size: 24px;
    color: var(--violet-600);
    font-family: CraftworkSans;
    font-weight: 900;
    align-items: center;
  }
  & .line {
    border-bottom: 2px solid var(--gray-200);
    margin-top: 24px;
    margin-bottom: 24px;
  }
  & .info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    & .entry {
      font-family: Inter;
      font-weight: 600;
      font-size: 16px;
      color: var(--gray-400);
    }
  }
}
</style>