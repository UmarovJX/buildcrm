<template>
  <div class="search__content">
    <div class="search__content-input">
      <label for="search-input" class="search__content-input-icon">
        <base-search-icon/>
      </label>
      <input type="search" id="search-input"/>
    </div>
    <div class="search__content-filter">
      Фильтры поиска
    </div>
  </div>
</template>

<script>
import BaseSearchIcon from "@/components/icons/BaseSearchIcon";

export default {
  name: "SearchBarContent",
  components: {
    BaseSearchIcon
  }
}
</script>

<style lang="scss" scoped>
.search__content {
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: 100%;

  &-input {
    width: 75%;
    height: 3.5rem;
    border-radius: 2rem;
    background-color: var(--gray-100);
    display: flex;
    align-items: center;
    padding-left: 1.25rem;

    input {
      width: 95%;
      background-color: transparent;
      margin-left: 1.25rem;
      height: 100%;
      outline: none;
      border: none;
    }

    &-icon {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>