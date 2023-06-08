<script>
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import api from "@/services/api";
import { mapGetters } from "vuex";

export default {
  name: "AccordionContentInput",
  components: {
    BaseNumericInput,
  },
  emits: ["delete-input-content", "save-entered-data"],
  props: {
    block: {
      type: Object,
      required: true,
    },
    inputVariable: {
      type: Object,
      required: true,
    },
    sumOptions: {
      type: Array,
      required: true,
    },
    typeOptions: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    const floorLabel = {
      type: "apartment",
      label: this.$t("apartments.title"),
    };

    const validationsName = {
      price: {
        name: this.$t("promo.select_price"),
      },
      promoType: {
        name: this.$t("promo.select_type"),
      },
    };

    return {
      floorLabel,
      validationsName,
      floor: null,
      price: null,
      currency_type: null,
      apartmentsByType: [],
      apartmentListByType: [],
      showingListType: {},
      currentError: "",
    };
  },
  computed: {
    ...mapGetters({
      getInputValidationError: "getInputValidationError",
    }),
    inputPrefixSymbol() {
      const { value } = this.currency_type;
      if (value === "usd") {
        return this.$t("usd");
      }
      return this.$t("ye");
    },
    labelApartmentSelection() {
      if (this.showingListType.type === "plan") return "name";
      return "number";
    },
  },
  watch: {
    floor() {
      this.getApartmentsListByType();
      this.currentError = "";
    },
    "showingListType.type"() {
      this.getApartmentsListByType();
      this.currentError = "";
    },
    price() {
      this.saveEnteredData();
      this.currentError = "";
    },
    apartmentsByType() {
      this.currentError = "";
      this.saveEnteredData();
    },
    currency_type() {
      this.saveEnteredData();
    },
    getInputValidationError() {
      this.showValidationErrors();
    },
  },
  created() {
    this.setDefaultListType();
    this.setPriceDefaultCurrency();
    this.setHistoryVariables();
    this.setCloningVariables();
  },
  methods: {
    setDefaultListType() {
      this.showingListType = this.typeOptions[0];
    },
    setPriceDefaultCurrency() {
      this.currency_type = this.sumOptions[0];
    },
    setHistoryVariables() {
      if (this.inputVariable.history) {
        this.initializer();
      }
    },
    setCloningVariables() {
      if (this.inputVariable.clone) {
        this.initializer();
      }
    },
    initializer() {
      const { price, currency_type, type, floor } = this.inputVariable;
      this.price = price;
      this.floor = floor;
      this.currency_type = this.sumOptions.find(
        (option) => option.value === currency_type
      );
      this.showingListType = this.typeOptions.find(
        (option) => option.type === type
      );
    },
    async getApartmentsListByType() {
      const { floor: apartmentNumber, showingListType } = this;
      if (apartmentNumber) {
        const objectID = this.$route.params.id;
        const blockID = this.block.id;
        const getApartments = async () => {
          this.apartmentsByType = [];
          await api.promo
            .fetchApartments({ objectID, blockID, apartmentNumber })
            .then((response) => {
              this.apartmentListByType = response.data;
            })
            .catch((error) => this.toastedWithErrorCode(error));
        };

        const getPlans = async () => {
          this.apartmentsByType = [];
          await api.promo
            .fetchPlans(objectID, blockID, apartmentNumber)
            .then((response) => {
              this.apartmentListByType = response.data;
            })
            .catch((error) => this.toastedWithErrorCode(error));
        };

        const type = showingListType.type;
        if (type === "apartment") {
          await getApartments();
          await this.initializeList();
        } else {
          await getPlans();
          await this.initializeList();
        }
      }
    },
    initializeList() {
      if (this.block.history || this.block.clone) {
        const type = this.block.types.find(
          (type) => type.id === this.inputVariable.id
        );
        this.apartmentsByType = this.apartmentListByType.filter((listType) => {
          const hasInHistory = type.values.findIndex(
            (value) => value === listType.id
          );
          return hasInHistory !== -1;
        });
      }
    },
    deleteInputContent() {
      this.$emit("delete-input-content");
    },
    saveEnteredData() {
      const {
        showingListType,
        price,
        currency_type,
        apartmentsByType,
        inputVariable,
      } = this;
      const values = apartmentsByType.map(
        (apartmentByType) => apartmentByType.id
      );
      const sendingContext = {
        price,
        values,
        id: inputVariable.id,
        type: showingListType.type,
        currency_type: currency_type.value,
        floor: this.floor,
      };
      this.$emit("save-entered-data", sendingContext);
    },
    showValidationErrors() {
      const { floor, apartmentsByType, price } = this;

      if (!floor) {
        const floorProviderErrors =
          this.$refs["validation-provider-floor"]["errors"];
        if (floorProviderErrors.length) {
          this.currentError = floorProviderErrors[0];
          return;
        }
      }

      if (!apartmentsByType.length) {
        const apartmentProviderErrors =
          this.$refs["provider-apartment-select"]["errors"];
        if (apartmentProviderErrors.length) {
          this.currentError = apartmentProviderErrors[0];
          return;
        }
      }

      if (!price) {
        const priceProviderErrors = this.$refs["provider-price"]["errors"];
        if (priceProviderErrors.length) {
          this.currentError = priceProviderErrors[0];
          return;
        }
      }

      this.currentError = "";
    },
  },
};
</script>

<template>
  <div class="mb-4">
    <div class="content__input">
      <!-- SELECT FLOOR   -->
      <div class="d-flex">
        <ValidationProvider
          :name="`${$t('floor')}`"
          rules="required"
          v-slot="{ errors }"
          ref="validation-provider-floor"
          tag="div"
        >
          <div>
            <label for="select-floor">
              {{ $t("floor") }}
            </label>
            <multiselect
              id="select-floor"
              v-model="floor"
              :options="block.floors"
              :hide-selected="true"
              :searchable="false"
              :show-labels="false"
              :placeholder="$t('floor')"
              class="floor__selection"
            ></multiselect>
          </div>
        </ValidationProvider>

        <!--    FIRST SECTION      -->
        <div class="apartment__selection">
          <label for="select-type-promo">
            {{ floorLabel.label }}
          </label>
          <div
            class="d-flex m-0 select__type__promo mb-2"
            id="select-type-promo"
          >
            <ValidationProvider
              :name="` ${$t('apartments.title')} `"
              rules="required"
              v-slot="{ errors }"
              ref="provider-apartment-select"
              class="multiselect__parent multiselect__parent__border w-100"
              tag="div"
            >
              <multiselect
                track-by="id"
                :label="labelApartmentSelection"
                id="selection-block"
                tag-placeholder="Add this as new tag"
                v-model="apartmentsByType"
                :placeholder="floorLabel.label"
                :options="apartmentListByType"
                :multiple="true"
                :searchable="false"
                :hide-selected="true"
              ></multiselect>
            </ValidationProvider>

            <div class="multiselect__parent apartment__type-multiselect">
              <multiselect
                label="name"
                v-model="showingListType"
                :options="typeOptions"
                :searchable="false"
                :show-labels="false"
                :hide-selected="true"
                :placeholder="$t('promo.select_by_floor')"
              ></multiselect>
            </div>
          </div>
        </div>
      </div>
      <!--    SECOND SECTION      -->
      <div class="d-flex">
        <div class="plan__group p-0 mb-4 mb-xl-0">
          <label for="select-price-group">
            {{ $t("promo.select_price") }}
          </label>
          <b-input-group
            class="input__group price__content"
            id="select-price-group"
          >
            <template #append>
              <div class="multiselect__parent">
                <div class="">
                  <multiselect
                    v-model="currency_type"
                    :options="sumOptions"
                    :hide-selected="true"
                    :searchable="false"
                    :show-labels="false"
                    label="name"
                  ></multiselect>
                </div>
              </div>
            </template>
            <ValidationProvider
              :name="validationsName.price.name"
              rules="required|min:3"
              v-slot="{ errors }"
              ref="provider-price"
              class="d-flex justify-content-center align-items-center multiselect__parent__border"
              tag="div"
            >
              <base-numeric-input
                v-model="price"
                class="plan__group-input"
                :precision="2"
                decimal-separator=","
                :currency="inputPrefixSymbol"
                currency-symbol-position="suffix"
                separator="space"
              ></base-numeric-input>
            </ValidationProvider>
          </b-input-group>
        </div>
        <div v-if="index" @click="deleteInputContent" class="delete__button">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
    <p class="error__provider mt-2" v-if="currentError">
      {{ currentError }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.content__input {
  display: flex;
}

.select__type__promo {
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
}

.select_wrapper {
  padding: 0.1rem;
  border-right: 1px solid rgb(206, 212, 218);
}

.delete__button {
  outline: none;
  border: none;
  background-color: #eb5757;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  height: 40px;
  margin-top: 32px;
  cursor: pointer;
}

.error__provider {
  color: red;
  font-size: 14px;
}

.floor__selection {
  width: 5rem;
  margin-right: 1rem;
}

.plan__group {
  width: auto;
  margin-left: 1rem;
  margin-right: 1rem;

  .input__group {
    border: 1px solid rgb(206, 212, 218);
    border-radius: 0.25rem;
    margin: 0 0 0.5rem 0;
    padding: 0;
  }

  &-input {
    max-width: 16rem;
    border: none;
    padding-left: 0.5rem;
    background-color: transparent;
  }
}

.apartment__selection {
  width: 32rem;
}

.apartment__type-multiselect {
  width: 15rem;
}

.price__content {
  width: 20.625rem;
}

@media (max-width: 1280px) {
  .content__input {
    flex-direction: column;
    background-color: #fff;
    border: 1px solid rgb(206, 212, 218);
    border-radius: 0.5rem;
    padding: 1rem;

    & > div {
      margin-bottom: 1rem;
    }
  }

  .plan__group {
    margin-left: 0;
  }

  .floor__selection {
    width: 10rem;
  }
}
</style>
