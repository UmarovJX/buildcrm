<script>
import BaseSearchInput from "@/components/Reusable/BaseSearchInput";
import BaseFilterIcon from "@/components/icons/BaseFilterIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";
// import BaseMultiselect from "@/components/Reusable/BaseMultiselect";
import { XFormSelect } from "@/components/ui-components/form-select";
import "vue2-datepicker/index.css";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import {
  debounce,
  isPrimitiveValue,
  sortInFirstRelationship,
  sortObjectValues,
} from "@/util/reusable";
import api from "@/services/api";
import {
  isArray,
  isNUNEZ,
  isString,
  isUndefinedOrNullOrEmpty,
} from "@/util/inspect";
import { hasOwnProperty } from "@/util/object";

export default {
  name: "SearchBarContent",
  components: {
    XFormSelect: XFormSelect,
    BaseFilterIcon,
    BaseArrowLeftIcon,
    BaseNumericInput,
    BaseFormTagInput,
    // BaseMultiselect,
    BaseDatePicker,
    BaseButton,
    BaseSearchInput,
  },
  emits: ["trigger-input", "search-by-filter", "replace-router"],
  data() {
    return {
      isFetching: false,
      objectsFields: [],
      filter: {
        object_id: [],
        contract_number: null,
        date: [],
        date_type: null,
        client_type_id: null,
        contract_price: null,
        price_to: null,
        price_from: null,
        apartment_number: [],
        blocks: [],
        floors: [],
        branch: [],
        manager: [],
      },
      dateTypeOptions: [],
      branchOption: [],
      objectOptions: [],
      managerOptions: [],
      clientTypeOptions: [],
      currencyOptions: [
        {
          value: this.$t("uzs"),
          text: this.$t("uzs"),
        },
        {
          value: this.$t("_usd"),
          text: this.$t("_usd"),
        },
      ],
      searchInput: this.$route.query.search,
      debounceInput: this.$route.query.search,
      showClearIcon: false,
      selectingObject: null,
      contractDate: null,
      contractPrice: null,
      currency: this.$t("uzs"),
    };
  },
  computed: {
    query() {
      return Object.assign({}, this.$route.query);
    },
    blocksOptions() {
      let blocksOptionList = [];
      this.objectsFields.forEach((fields) => {
        fields.blocks.forEach((block) => {
          blocksOptionList.push({
            ...block,
            name: `${fields.name} - ${block.name}`,
          });
        });
      });

      return blocksOptionList;
    },
    availableFloors() {
      const floorsOption = [];
      this.objectsFields.forEach((objectFields) => {
        objectFields.floors.forEach((floor) => {
          const idx = floorsOption.findIndex(
            (floorOption) => floorOption.value === floor
          );
          if (idx === -1) {
            floorsOption.push({
              text: floor,
              value: floor,
            });
          }
        });
      });

      return floorsOption.sort((a, b) => a.value - b.value);
    },
  },
  watch: {
    searchInput: debounce(function (newValue) {
      this.debounceInput = newValue;
    }, 350),
    debounceInput() {
      this.toggleClearIcon();
      this.triggerInputEvent();
    },
    "filter.object_id"(newObjectId) {
      if (newObjectId?.length) {
        this.fetchObjectFilterFields();
      }
    },
  },
  mounted() {
    if (this.searchInput?.length) {
      this.toggleClearIcon();
    }

    this.filterModalOpened();
    this.fetchObjectFilterFields();
    this.fetchObjectsOption();
  },
  methods: {
    startFetching() {
      this.isFetching = true;
    },
    finishFetching() {
      this.isFetching = false;
    },
    getInputValue(value) {
      this.searchInput = value;
    },
    async getObjectFields(objectCtx) {
      const response = await api.objectsV2.fetchObjectFields(objectCtx.id);
      return {
        response,
        id: objectCtx.id,
        name: objectCtx.name,
      };
    },
    async fetchObjectFilterFields() {
      try {
        this.startFetching();
        const objectPromiseFields = this.filter.object_id
          .filter(({ id }) => {
            const idx = this.objectsFields.findIndex(
              (objectFields) => objectFields.id === id
            );
            return idx === -1;
          })
          .map((objectCtx) => {
            return this.getObjectFields(objectCtx);
          });

        const rspFields = await Promise.all(objectPromiseFields);
        rspFields.forEach(({ id: objectId, name, response }) => {
          const hasInStack = this.objectsFields.findIndex(
            (objField) => objField.id === objectId
          );
          if (hasInStack === -1) {
            this.objectsFields.push({
              id: objectId,
              name,
              ...response.data,
            });
          }
        });
      } finally {
        this.finishFetching();
      }
    },
    async fetchObjectsOption() {
      await api.contractV2
        .fetchObjectsOption()
        .then((response) => {
          const {
            objects,
            "client-types": clientTypes,
            date_types,
            branches,
            managers,
          } = response.data;
          this.objectOptions = objects;
          this.branchOption = branches;
          this.managerOptions = managers.map((m) => {
            let text = "";
            if (isNUNEZ(m.last_name)) {
              text += m.last_name;
            }

            if (isNUNEZ(m.first_name)) {
              text += " " + m.first_name;
            }

            if (isNUNEZ(m.second_name)) {
              text += " " + m.second_name;
            }

            return {
              id: m.id,
              text: text.trim(),
            };
          });
          for (let [idx, client] of Object.entries(clientTypes)) {
            this.clientTypeOptions.push({
              value: client.id,
              text: client.name,
            });
          }
          this.dateTypeOptions = date_types.map((item) => {
            return {
              value: item.type,
              text: item.name[localStorage.locale],
            };
          });
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
    },
    clearFilter() {
      const sortingValues = sortInFirstRelationship(this.filter);
      const loopQuery = Object.assign({}, this.query);
      for (let [key] of Object.entries(sortingValues)) {
        const haveInQuery = hasOwnProperty(this.query, key);
        if (haveInQuery) {
          delete loopQuery[key];
        }
      }
      this.$emit("replace-router", loopQuery);
      this.hideFilterModal();
      this.$refs["base-form-tag-input"].clear();
    },
    searchByFilterField() {
      const object_id = this.filter.object_id
        ? this.filter.object_id.map((obj) => obj.id)
        : null;
      const sortingQuery = Object.assign({}, this.query, {
        ...this.filter,
        object_id,
      });
      this.$emit("search-by-filter", sortInFirstRelationship(sortingQuery));
      this.$refs["filter-modal"].hide();
    },
    hideFilterModal() {
      this.$refs["filter-modal"].hide();
      this.resetFilter();
    },
    resetFilter() {
      this.filter = {
        object_id: [],
        contract_number: null,
        date: [],
        date_type: null,
        client_type_id: null,
        contract_price: null,
        price_to: null,
        price_from: null,
        apartment_number: [],
        blocks: [],
        floors: [],
        branch: [],
        manager: [],
      };
    },
    async showFilterModal() {
      this.$refs["filter-modal"].show();
    },
    focusOnSearchInput() {
      this.$refs["search-input"].focus();
    },
    clearSearchInput() {
      this.searchInput = "";
    },
    toggleClearIcon() {
      this.showClearIcon = !!this.searchInput.length;
    },
    triggerInputEvent() {
      const query = Object.assign({}, this.query);
      const searchValue = this.debounceInput;
      if (searchValue?.length) {
        query.search = searchValue;
        this.pushRouter(query);
      } else {
        query.search = null;
        this.pushRouter(query);
      }
    },
    pushRouter(query) {
      const sortQuery = sortObjectValues(query);
      this.$router.push({ query: {} });
      this.$router.push({ query: sortQuery });
    },
    setApartments(apartments) {
      this.filter.apartment_number = apartments;
    },
    filterModalOpened() {
      const haveInRouteQuery = (property) => {
        const query = Object.assign({}, this.query);
        const hasInQuery = hasOwnProperty(query, property);
        if (hasInQuery) return query[property];
        return false;
      };

      for (let property of Object.keys(this.filter)) {
        const query = haveInRouteQuery(property);
        if (property === "apartment_number" && typeof query === "string") {
          const toNumber = parseInt(query);
          this.filter[property] = isNaN(toNumber) ? [] : [toNumber];
          continue;
        }

        if (property === "object_id" && query) {
          if (isPrimitiveValue(query)) {
            const cObj = this.objectOptions.find(
              (opObj) => opObj.id === parseInt(query)
            );
            if (cObj) {
              this.filter[property] = [cObj];
            }
          } else {
            this.filter[property] = query.map((value) => {
              const obj = this.objectOptions.find(
                (opObj) => opObj.id === parseInt(value)
              );
              if (obj) {
                return obj;
              }
              return value;
            });
          }
          continue;
        }

        const arrayProps = ["blocks", "floors", "branch", "manager"];
        if (arrayProps.includes(property)) {
          if (isArray(query)) {
            this.filter[property] = query.map((p) => parseInt(p));
          } else if (isString(query)) {
            this.filter[property] = [parseInt(query)];
          } else if (query) {
            this.filter[property] = query;
          }
        } else if (query && property === "client_type_id") {
          if (!isUndefinedOrNullOrEmpty(query)) {
            this.filter[property] = parseInt(query);
          }
        } else {
          if (query) {
            this.filter[property] = query;
          }
        }
      }
    },
  },
};
</script>

<template>
  <div class="filter-block">
    <BaseSearchInput
      class="w-100"
      :placeholder="`${$t('contract_number_or_full_name')}`"
      @trigger-input="getInputValue"
    />
    <base-button @click="showFilterModal" :text="`${$t('contracts.filter')}`">
      <template #left-icon>
        <base-filter-icon fill="#7C3AED" />
      </template>
    </base-button>

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
            <base-arrow-left-icon
              :width="32"
              :height="32"
            ></base-arrow-left-icon>
          </span>
          <!--    Title      -->
          <span class="title"> {{ $t("contracts.filter_title") }} </span>
        </span>

        <div class="modal__content-main">
          <div class="filter__inputs">
            <x-form-select
              value-field="id"
              text-field="name"
              getter="full"
              v-model="filter.object_id"
              :multiple="true"
              :options="objectOptions"
              :placeholder="$t('contracts.object_name')"
            />

            <x-form-select
              v-if="filter.object_id && blocksOptions.length"
              class="mt-3"
              value-field="id"
              text-field="name"
              v-model="filter.blocks"
              :multiple="true"
              :options="blocksOptions"
              :placeholder="$t('promo.blocks')"
            />

            <x-form-select
              class="mt-3"
              v-model="filter.floors"
              :multiple="true"
              :options="availableFloors"
              :placeholder="$t('floor')"
            />

            <x-form-select
              value-field="id"
              text-field="name"
              v-model="filter.branch"
              :multiple="true"
              :options="branchOption"
              class="mt-3"
              :placeholder="$t('branches.title')"
            />

            <!--    Filter Apartment Number      -->
            <div class="filter__inputs-input">
              <base-form-tag-input
                @set-tags="setApartments"
                :default-tags="filter.apartment_number"
                ref="base-form-tag-input"
                :placeholder="`${$t('contracts.apartment_number')}`"
              >
                <template #delete-content>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10" r="10" fill="#9CA3AF" />
                    <path
                      d="M13.125 6.875L6.875 13.125"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.875 6.875L13.125 13.125"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </template>
              </base-form-tag-input>
            </div>

            <div class="d-flex align-items-center x-gap-1 mt-3">
              <base-date-picker
                style="width: 55%"
                :default-value="filter.date"
                :placeholder="`${$t('contracts.agreement_date')}`"
                @input="filter.date = $event"
              />
              <x-form-select
                v-model="filter.date_type"
                :options="dateTypeOptions"
                :placeholder="$t('contracts.date_type')"
                :multilingual="true"
                style="width: 45%"
              />
            </div>

            <!--     Apartment Price     -->
            <div class="filter__apartment__price">
              <x-form-select
                v-model="currency"
                :label="false"
                :options="currencyOptions"
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

            <x-form-select
              v-model="filter.manager"
              :options="managerOptions"
              value-field="id"
              text-field="text"
              class="mt-3"
              :multiple="true"
              :placeholder="$t('manager')"
            />

            <!--   Client Type     -->
            <x-form-select
              class="mt-4"
              v-model="filter.client_type_id"
              :options="clientTypeOptions"
              :placeholder="$t('contracts.client_type')"
              :multilingual="true"
            />

            <!--              <b-form-select-->
            <!--                  v-model="filter.client_type_id"-->
            <!--                  :options="clientTypeOptions"-->
            <!--                  class="inline"-->
            <!--              >-->
            <!--                <template #first>-->
            <!--                  <b-form-select-option-->
            <!--                      :value="null"-->
            <!--                      disabled-->
            <!--                  >-->
            <!--                    <span class="disabled__option">-->
            <!--                      {{ $t('contracts.client_type_id') }}-->
            <!--                    </span>-->
            <!--                  </b-form-select-option>-->
            <!--                </template>-->
            <!--              </b-form-select>-->
          </div>

          <!--  Modal Footer    -->
          <div class="modal__footer">
            <base-button
              @click="clearFilter"
              :fixed="true"
              design="transparent"
              :text="`${$t('contracts.reset_filter')}`"
            />
            <base-button
              design="violet-gradient"
              :fixed="true"
              @click="searchByFilterField"
              :text="`${$t('contracts.apply_filter')}`"
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<style lang="scss" scoped>
.filter-block {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
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

  .modal-body {
    height: 100%;
    overflow-x: auto;
  }

  .modal__content {
    margin: 3rem;
    font-family: CraftworkSans, serif;
    font-weight: 900;
    height: 92%;
    position: relative;

    &-main {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      row-gap: 100px;
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
      margin-bottom: 3rem;

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

  &:hover {
    background-color: var(--gray-200);
  }
}

.modal__footer {
  display: flex;
  column-gap: 0.5rem;
  padding-bottom: 3rem;
}

::v-deep .filter__inputs-tag {
  li.b-form-tag {
    background-color: #ffffff;
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
</style>
