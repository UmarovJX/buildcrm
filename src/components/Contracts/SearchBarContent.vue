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
          :placeholder="$t('contracts.search')"
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
    <div class="search__content-filter" @click="showFilterModal">
      <span class="filter__icon">
        <base-filter-icon fill="#7C3AED"/>
      </span>
      <span>{{ $t('contracts.filter') }}</span>
    </div>

    <!--  FILTER MODAL   -->
    <b-modal
        ref="filter-modal"
        title="Using Component Methods"
        modal-class="filter__modal"
        @show="filterModalOpened"
        @hidden="hideFilterModal"
        hide-header
        hide-footer
    >
      <div class="modal__content">
        <!--   Go Back     -->
        <span class="d-flex align-items-center">
          <span class="go__back" @click="hideFilterModal">
            <base-arrow-left-icon :width="32" :height="32"></base-arrow-left-icon>
          </span>
          <!--    Title      -->
          <span class="title"> {{ $t('contracts.filter_title') }} </span>
        </span>

        <div class="modal__content-main">
          <div class="filter__inputs">

            <base-multiselect
                :default-values="filter.object_id"
                :options="objectOptions"
                :placeholder="`${ $t('contracts.object_name') }`"
                track-by="value"
                label="text"
                @input="inputFilterObject"
            />
            <!--    Filter Apartment Number      -->
            <div class="filter__inputs-input">
              <base-form-tag-input
                  @set-tags="setApartments"
                  :default-tags="filter.apartment_number"
                  ref="base-form-tag-input"
                  :placeholder="`${ $t('contracts.apartment_number') }`"
              >
                <template #delete-content>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#9CA3AF"/>
                    <path d="M13.125 6.875L6.875 13.125" stroke="white" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <path d="M6.875 6.875L13.125 13.125" stroke="white" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>
                  </svg>
                </template>
              </base-form-tag-input>
            </div>

            <div class="mt-3">
              <base-date-picker
                  class="w-100"
                  :default-value="filter.date"
                  :placeholder="`${$t('contracts.agreement_date')}`"
                  @input="filter.date = $event"
              />
            </div>

            <!--     Apartment Price     -->
            <div class="filter__apartment__price">
              <b-form-select
                  v-model="currency"
                  :options="currencyOptions"
                  class="inline price__currency"
              />
              <div class="middle__position">
                <base-numeric-input
                    v-model.number="filter.price_from"
                    :currency="` `"
                    :minus="false"
                    :value="null"
                    currency-symbol-position="suffix"
                    separator="space"
                    placeholder="от"
                    class="filter__price"
                ></base-numeric-input>
              </div>
              <base-numeric-input
                  v-model.number="filter.price_to"
                  :currency="` `"
                  :minus="false"
                  :value="null"
                  currency-symbol-position="suffix"
                  separator="space"
                  placeholder="до"
                  class="filter__price"
              ></base-numeric-input>
            </div>

            <!--   Client Type     -->
            <div class="filter__inputs-input">
              <b-form-select
                  v-model="filter.client_type" class="inline" :options="clientTypeOptions">
                <template #first>
                  <b-form-select-option
                      :value="null"
                      disabled
                  >
                  <span class="disabled__option">
                    {{ $t('contracts.client_type') }}
                  </span>
                  </b-form-select-option>
                </template>
              </b-form-select>
            </div>
          </div>

          <!--  Modal Footer    -->
          <div class="modal__footer">
            <button @click="clearFilter" class="clear__button">{{ $t('contracts.reset_filter') }}</button>
            <button @click="searchByFilterField" class="search__button">{{ $t('contracts.apply_filter') }}</button>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import BaseFilterIcon from "@/components/icons/BaseFilterIcon";
import BaseSearchIcon from "@/components/icons/BaseSearchIcon";
import BaseTimesCircleIcon from "@/components/icons/BaseTimesCircleIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";
import BaseMultiselect from "@/components/Reusable/BaseMultiselect";
import "vue2-datepicker/index.css";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import {debounce, isPrimitiveValue, sortInFirstRelationship, sortObjectValues} from "@/util/reusable";
import api from "@/services/api";

export default {
  name: "SearchBarContent",
  components: {
    BaseSearchIcon,
    BaseFilterIcon,
    BaseArrowLeftIcon,
    BaseTimesCircleIcon,
    BaseNumericInput,
    BaseFormTagInput,
    BaseMultiselect,
    BaseDatePicker
  },
  emits: ['trigger-input', 'search-by-filter', 'replace-router'],
  data() {
    return {
      filter: {
        object_id: null,
        contract_number: null,
        date: [],
        client_type: null,
        contract_price: null,
        price_to: null,
        price_from: null,
        apartment_number: []
      },
      objectOptions: [],
      clientTypeOptions: [],
      currencyOptions: [this.$t('uzs'), this.$t('_usd')],
      searchInput: this.$route.query.search,
      debounceInput: this.$route.query.search,
      showClearIcon: false,
      selectingObject: null,
      contractDate: null,
      contractPrice: null,
      currency: this.$t('uzs'),
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
  mounted() {
    if (this.searchInput?.length) {
      this.toggleClearIcon()
    }
    this.fetchObjectsOption()
  },
  methods: {
    async fetchObjectsOption() {
      await api.contractV2.fetchObjectsOption()
          .then((response) => {
            const {objects, 'client-types': clientTypes} = response.data
            this.objectOptions = objects.map(({id, name}) => ({value: id, text: name}))
            for (let [key, value] of Object.entries(clientTypes)) {
              this.clientTypeOptions.push({
                value: key,
                text: value
              })
            }
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
    },
    clearFilter() {
      const sortingValues = sortInFirstRelationship(this.filter)
      const loopQuery = Object.assign({}, this.query)
      for (let [key,] of Object.entries(sortingValues)) {
        const haveInQuery = this.query.hasOwnProperty(key)
        if (haveInQuery) {
          delete loopQuery[key]
        }
      }
      this.$emit('replace-router', loopQuery)
      this.hideFilterModal()
      this.$refs['base-form-tag-input'].clear()
    },
    inputFilterObject(objects) {
      this.filter.object_id = objects.map(({value}) => value)
    },
    searchByFilterField() {
      const sortingQuery = Object.assign({}, this.filter, this.query)
      this.$emit('search-by-filter', sortInFirstRelationship(sortingQuery))
      this.$refs['filter-modal'].hide()
    },
    hideFilterModal() {
      this.$refs['filter-modal'].hide()
      this.resetFilter()
    },
    resetFilter() {
      this.filter = {
        object_id: null,
        contract_number: null,
        date: [],
        client_type: null,
        contract_price: null,
        price_to: null,
        price_from: null,
        apartment_number: []
      }
    },
    showFilterModal() {
      this.$refs['filter-modal'].show()
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
      const query = Object.assign({}, this.query)
      const searchValue = this.debounceInput
      if (searchValue?.length > 3) {
        query.search = searchValue
        this.pushRouter(query)
      } else {
        query.search = null
        this.pushRouter(query)
      }
    },
    pushRouter(query) {
      const sortQuery = sortObjectValues(query)
      this.$router.push({query: {}})
      this.$router.push({query: sortQuery})
    },
    setApartments(apartments) {
      this.filter.apartment_number = apartments
    },
    filterModalOpened() {
      const haveInRouteQuery = (property) => {
        const query = Object.assign({}, this.query)
        const hasOwnProperty = query.hasOwnProperty(property)
        if (hasOwnProperty)
          return query[property]
        return false
      }

      for (let property of Object.keys(this.filter)) {
        const query = haveInRouteQuery(property)
        if (property === 'apartment_number' && typeof query === 'string') {
          const toNumber = parseInt(query)
          this.filter[property] = isNaN(toNumber) ? [] : [toNumber]
          continue
        }

        /*if (property === 'object_id' && query) {
          if (Array.isArray(query)) {
            this.filter[property] = parseInt(query[0])
          } else {
            this.filter[property] = parseInt(query)
          }
          continue
        }*/

        if (property === 'object_id' && query) {
          if (isPrimitiveValue(query)) {
            this.filter[property] = [parseInt(query)]
          } else {
            this.filter[property] = query.map(value => parseInt(value))
          }
          continue
        }

        if (query) this.filter[property] = query
      }
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

::v-deep .filter__modal {
  overflow-y: hidden;
  background: rgba(156, 163, 175, 0.32);
  backdrop-filter: blur(16px);

  .modal-dialog {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: hidden;
    margin: 0;
    border-radius: 3.5rem 0 0 3.5rem;
    min-width: 40rem;


    .modal-content {
      height: 100%;
      overflow-y: hidden;
    }
  }

  .modal__content {
    margin: 3rem;
    font-family: CraftworkSans, serif;
    font-weight: 900;
    height: 80%;
    position: relative;

    &-main {
      position: relative;
      height: 100%;
    }

    .title {
      font-size: 1.75rem;
      line-height: 1.75rem;
      display: block;
      margin-left: 1.5rem;
      color: var(--gray-600);
      padding: 0.5rem 0;
    }

    .filter__inputs {
      margin-top: 2rem;

      .input__date.mx-datepicker.mx-datepicker-range {
        width: 60% !important;
      }

      &-input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 20rem;
        min-height: 4rem;
        background-color: var(--gray-100);
        border-radius: 2rem;
        padding: 1rem 1.25rem;
        margin-top: 1.5rem;
        width: 100%;
        border: none;
        color: var(--gray-600);
        position: relative;

        ::placeholder {
          color: var(--gray-600);
          opacity: 1;
        }

        .placeholder {
          color: var(--gray-600);
          //padding-left: 1rem;
        }

        .input__date {
          margin-left: 0.5rem;
          background-color: transparent;
          border: none;
        }

        .inline {
          background-color: transparent;
          border: none;
          color: var(--gray-600);
          padding: 0;

          .disabled__option {
            color: var(--gray-100) !important;
          }
        }
      }
    }
  }
}

.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.modal__footer {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  justify-content: space-between;

  .clear__button {
    border: none;
    outline: none;
    color: var(--gray-600);
    padding: 1rem 4rem;
    font-size: 1.2rem;
    border-radius: 2rem;
    background-color: var(--gray-100);
  }

  .search__button {
    border: none;
    outline: none;
    color: #FFFFFF;
    font-size: 1.2rem;
    padding: 1rem 4rem;
    border-radius: 2rem;
    background-color: var(--violet-600);
  }
}

::v-deep .filter__inputs-tag {
  li.b-form-tag {
    background-color: #FFFFFF;
    display: flex;
    border-radius: 1rem;
    align-items: center;

    .b-form-tag-content {
      color: var(--gray-600);
      font-family: Inter, sans-serif;
      font-size: 1rem;
      display: flex;
      align-items: flex-start;
    }

    .b-form-tag-remove {
      background-color: var(--gray-400);
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      font-size: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
    }
  }
}

.filter__price {
  border: none;
  outline: none;
  background-color: transparent;
  height: 100%;
  max-width: 156px;
  padding-left: 1rem;
}

.filter__apartment__price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 20rem;
  min-height: 4rem;
  background-color: var(--gray-100);
  border-radius: 2rem;
  padding: 0 1.25rem;
  margin-top: 1.5rem;
  width: 100%;
  border: none;
  color: var(--gray-600);
  position: relative;

  .middle__position {
    align-self: stretch;
    min-height: 4rem;
    height: 100%;
    display: flex;
    align-items: center;
    border-left: 2px solid var(--gray-200);
    border-right: 2px solid var(--gray-200);
  }

  ::placeholder {
    color: var(--gray-600);
    opacity: 1;
  }

  .placeholder {
    color: var(--gray-600);
  }

  .input__date {
    margin-left: 0.5rem;
    background-color: transparent;
    border: none;
    width: auto;
  }

  .inline {
    background-color: transparent;
    border: none;
    color: var(--gray-600);
    padding: 0;

    .disabled__option {
      color: var(--gray-100) !important;
    }
  }

  .price__currency {
    min-width: 6rem;
    height: 100%;
    //padding-left: 1rem;
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