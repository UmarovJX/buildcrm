<template>
  <div class="search">
    <DocHeader title="search"/>
    <div class="search-content">
      <div class="search-content-item">
        <BaseSearchInput/>
        <BaseSearchInput value="Введенные слова для поиска"/>
      </div>
      <div class="search-content-item">
        <BaseSearchInput/>
        <BaseSearchInput value="Введенные слова для поиска"/>
      </div>
      <div class="search-content-item">
        <BaseSearchInput/>
        <BaseSearchInput value="Введенные слова для поиска"/>
      </div>
    </div>
  </div>
</template>
<script>

import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import DocHeader from "@/views/Documentation/DocHeader";
export default {
  name: "search",
  components: {DocHeader, BaseSearchInput},
}
</script>

<style scoped lang="scss">
.search {
  &-content {
    display: flex;
    gap: 64px;
    flex-wrap: wrap;
    padding: 0 64px 64px;
    &-item {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      gap: 32px;
      .search__content {
        min-width: 380px;
      }
    }
  }
  .search-content-item:nth-child(2){
    ::v-deep .search__content-input {
      background-color: #E5E7EB;
    }
  }
  .search-content-item:nth-child(3){
    ::v-deep .search__content-input {
      border: 4px solid #E5E7EB;
    }
  }
}
</style>