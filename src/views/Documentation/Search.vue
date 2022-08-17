<template>
  <div class="search">
    <header>
      <p>Xon Saroy Design System • Component</p>
      <h1>search</h1>
    </header>
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
export default {
  name: "documentation",
  components: {BaseSearchInput},
}
</script>

<style scoped lang="scss">
.search {
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