<template>
  <div class="search__content">
    <div class="search__content-input">
      <div @click="focusOnSearchInput" class="search__content-input-icon">
        <base-search-icon/>
      </div>
      <input
          v-model="searchInput"
          type="search"
          id="search-input"
          ref="search-input"
          placeholder="ФИО, телефон, номер договора"
      />
      <span
          v-if="showClearIcon"
          class="clear__icon"
          @click="clearSearchInput"
      >
        <base-times-circle-icon/>
      </span>
    </div>
    <div class="search__content-filter">
      <span class="filter__icon">
        <base-filter-icon fill="#7C3AED"/>
      </span>
      <span>Фильтры поиска</span>
    </div>
  </div>
</template>

<script>
import BaseFilterIcon from "@/components/icons/BaseFilterIcon";
import BaseSearchIcon from "@/components/icons/BaseSearchIcon";
import BaseTimesCircleIcon from "@/components/icons/BaseTimesCircleIcon";

export default {
  name: "SearchBarContent",
  components: {
    BaseSearchIcon,
    BaseFilterIcon,
    BaseTimesCircleIcon
  },
  data() {
    return {
      searchInput: '',
      showClearIcon: false
    }
  },
  watch: {
    searchInput() {
      this.toggleClearIcon()
    }
  },
  methods: {
    focusOnSearchInput() {
      this.$refs['search-input'].focus()
    },
    clearSearchInput() {
      this.searchInput = ''
    },
    toggleClearIcon() {
      this.showClearIcon = !!this.searchInput.length
    }
  }
}
</script>

<style lang="scss" scoped>
.search__content {
  margin-top: 2rem;
  margin-bottom: 1rem;
  width: 100%;
  display: flex;

  &-input {
    width: 75%;
    height: 3.5rem;
    border-radius: 2rem;
    background-color: var(--gray-100);
    display: flex;
    align-items: center;
    padding-left: 1.25rem;
    position: relative;

    &:focus-within {
      border: 0.25rem solid var(--gray-200);
      background-color: var(--gray-100);
    }

    &:hover {
      background-color: var(--gray-200);
    }

    input {
      width: 95%;
      background-color: transparent;
      margin-left: 1.25rem;
      height: 100%;
      outline: none;
      border: none;
      font-weight: 700;
      color: var(--gray-600);

      &::placeholder {
        font-weight: 600;
        color: var(--gray-400);
      }
    }

    &-icon {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }

  &-filter {
    height: 100%;
    border-radius: 2rem;
    padding: 1rem 1.5rem;
    background-color: var(--gray-100);
    margin-left: 0.5rem;
    cursor: pointer;

    .filter__icon {
      margin-right: 1.25rem;
    }
  }
}

.clear__icon {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  transition: transform 100ms ease-in;

  &:hover {
    transform: scale(1.1);
  }
}

@media (max-width: 996px) {
  .search__content-input {
    width: 60%;
  }
}
</style>