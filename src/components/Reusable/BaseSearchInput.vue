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
          :placeholder="placeholder"
          @input="triggerInputEvent"
      />
      <span
          v-if="showClearIcon"
          class="clear__icon"
          @click="clearSearchInput"
      >
        <base-times-circle-icon/>
      </span>
    </div>
  </div>
</template>


<script>
import BaseSearchIcon from "@/components/icons/BaseSearchIcon";
import BaseTimesCircleIcon from "@/components/icons/BaseTimesCircleIcon";
import {debounce, sortInFirstRelationship} from "@/util/reusable";

export default {
  name: "BaseSearchInput",
  components: {
    BaseSearchIcon,
    BaseTimesCircleIcon,
  },
  props: {
    placeholder: {
      type: String,
      default: 'ФИО, телефон, номер договора',
    }
  },
  emits: ['trigger-input', 'search-by-filter', 'replace-router'],
  data() {
    return {
      searchInput: this.$route.query.search,
      debounceInput: this.$route.query.search,
      showClearIcon: false,
    }
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query)
    }
  },
  watch: {
    searchInput: debounce(function (newValue) {
      this.debounceInput = newValue
    }, 350),
    debounceInput() {
      this.toggleClearIcon()
      this.triggerInputEvent()
    }
  },
  // async created() {
  //   await this.fetchObjects()
  // },
  mounted() {
    if (this.searchInput?.length) {
      this.toggleClearIcon()
    }
  },
  methods: {
    searchByFilterField() {
      const sortingQuery = sortInFirstRelationship(this.filter)
      this.$emit('search-by-filter', sortingQuery)
      this.hideFilterModal()
    },
    focusOnSearchInput() {
      this.$refs['search-input'].focus()
    },
    clearSearchInput() {
      this.searchInput = ''
    },
    toggleClearIcon() {
      this.showClearIcon = !!this.searchInput.length
    },
    triggerInputEvent() {
      this.$emit('trigger-input', this.debounceInput)
    },

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
    border: 0.25rem solid transparent;
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
      margin-left: 1rem;
      padding-left: .25rem;
      height: 100%;
      outline: none;
      border: none;
      font-weight: 700;
      color: var(--gray-600);
      border-radius: 0 2rem 2rem 0;

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


::placeholder {
  color: var(--gray-600);
  opacity: 1;
}

input[type="date"] {
  padding-right: 2rem;
}

input[type="date"]::-webkit-datetime-edit-text,
input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: var(--gray-600);
}

::-webkit-calendar-picker-indicator {
  position: absolute;
  top: 60%;
  right: 2rem;
  transform: translateY(-60%);
}

@media (max-width: 996px) {
  .search__content-input {
    width: 60%;
  }
}
</style>