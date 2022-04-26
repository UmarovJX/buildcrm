<template>
  <div class="sort-list">
    <div class="sort-top">
      <b-dropdown left>
        <template #button-content>
          Комнат
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <b-dropdown left>
        <template #button-content>
          Этаж
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <b-dropdown left>
        <template #button-content>
          Блок
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <div class="filter__apartment__price">
        <b-form-select
            v-model="currency"
            :options="currencyOptions"
            class="inline price__currency"
        />
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

      <div class="filter__apartment__price">
        <div class="filter-value">
          <span>M<sup>2</sup></span>
        </div>
        <base-numeric-input
            v-model.number="filter.area_from"
            :currency="` `"
            :minus="false"
            :value="null"
            currency-symbol-position="suffix"
            separator="space"
            placeholder="от"
            class="filter__price"
        ></base-numeric-input>
        <base-numeric-input
            v-model.number="filter.area_to"
            :currency="` `"
            :minus="false"
            :value="null"
            currency-symbol-position="suffix"
            separator="space"
            placeholder="до"
            class="filter__price"
        ></base-numeric-input>
      </div>

      <b-dropdown left>
        <template #button-content>
          Статус
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <div class="detail-button" @click="openBar">
        <base-details-icon fill="#7C3AED"/>
      </div>

      <base-button text="Применить" design="violet-gradient"/>

    </div>

    <div class="chess-tab">

      <base-button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: currentTab.name === tab.name }"
          @click="changeProduct(tab)"
          :text="tab.title">
        <template #left-icon>
          <component :is="tab.buttonIcon" :fill="currentTab.name === tab.name ? '#fff' : undefined"/>
        </template>
      </base-button>

    </div>

    <div v-if="sortBar" class="sort-hide">
      <div class="filter__inputs-input">
        <base-form-tag-input
            @set-tags="setApartments"
            :default-tags="filter.apartment_number"
            ref="base-form-tag-input"
            placeholder="Номер квартиры"
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

      <b-dropdown left>
        <template #button-content>
          Срок сдачи
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <b-dropdown left>
        <template #button-content>
          Жилая площадь
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <b-dropdown left>
        <template #button-content>
          Спецпредложения
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

    </div>

    <div v-if="sortBar" class="sort-hide">
      <b-dropdown left>
        <template #button-content>
          Срок сдачи
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>
      <b-dropdown left>
        <template #button-content>
          Жилая площадь
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>
      <b-dropdown left>
        <template #button-content>
          Тип отделки
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>
      <b-dropdown left>
        <template #button-content>
          Спецпредложения
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.flat"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in options" :key="option" :value="option">{{ option }}</b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import BaseChessOne from "@/components/icons/BaseChessOne";
import BaseChessTwo from "@/components/icons/BaseChessTwo";
import BaseDetailsIcon from "@/components/icons/BaseDetailsIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";

export default {
  name: "ObjectSort",
  components: {
    BaseChessOne,
    BaseChessTwo,
    BaseDetailsIcon,
    BaseNumericInput,
    BaseButton,
    BaseFormTagInput,
  },
  data() {
    return {
      currentTab: {id: 4, param: 'chess-table', name: 'ObjectTable', buttonIcon: 'BaseDetailsIcon', title: 'Этажи'},
      tabs: [
        // {id: 1, name: 'ObjectBlock', buttonIcon: 'BaseDetailsIcon', title: 'Фасады'},
        {id: 2, param: 'chess-one', name: 'ObjectBlock', buttonIcon: 'BaseChessOne', title: 'Шахматка 1.0'},
        {id: 3, param: 'chess-two', name: 'ChessSquareCard', buttonIcon: 'BaseChessTwo', title: 'Шахматка 2.0'},
        {id: 4, param: 'chess-table', name: 'ObjectTable', buttonIcon: 'BaseDetailsIcon', title: 'Этажи'},
        // {id: 5, name: 'ObjectBlock', buttonIcon: 'BaseDetailsIcon', title: 'Список'},
        // {id: 6, name: 'ChessSquareCard', buttonIcon: 'BaseDetailsIcon', title: 'Планировки'},
      ],
      setApartments: [],
      sortBar: false,
      form: {
        flat: [],
        level: null,
        block: null,
        status: null,
      },
      options: [1, 2, 3, 4, 5, 6, 7],
      currencyOptions: ["UZS", "USD"],
      areaOptions: 'M2',
      filter: {
        apartment_number: [],
        price_from: 0,
        price_to: 0,
      },
      currency: 'UZS'
    }
  },
  watch: {
    currentTab: {
      handler(val) {
        this.$router.push({name: val.param, params: {object: 18}})
        this.$emit('current-tab', val)
      },
      immediate: true,
      deep: true,
    }
  },
  methods: {
    setFormProperty(property, value) {
      this.form[property] = value
      this.errors[property] = false
    },
    openBar() {
      this.sortBar = !this.sortBar
    },
    clear() {
      this.$refs['base-form-tag-input'].clear()
    },
    changeProduct(name) {
      this.currentTab = name
    },
  }
}
</script>

<style lang="scss" scoped>

.sort-list {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  gap: 1rem;
  background-color: var(--white);
}

.sort-top, .sort-hide, .chess-tab {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem .5rem;
  color: var(--gray-600) !important;
  background-color: var(--white);
}

.chess-tab {
  .base__button {
    &.active {
      background-color: var(--violet-600);
      color: var(--white);
    }

    &:hover {
      background-color: var(--violet-600);
      color: var(--white);

    }
  }
}


.sort-hide {
  //top: 100%;
  bottom: 0;
  position: absolute;
  padding-top: .5rem;
  padding-bottom: 1rem;
  z-index: 9;

  &:after {
    content: '';
    position: absolute;
    width: calc(100% + 3rem);
    left: -2rem;
    bottom: 0;
    height: 2px;
    background-color: var(--gray-300);
  }
}

.detail-button {
  display: flex;
  width: 3.5rem;
  min-width: 3.5rem;
  height: 3.5rem;
  justify-content: center;
  align-items: center;
  background-color: var(--gray-100);
  border-radius: 50%;
  cursor: pointer;
}

.filter__price {
  display: flex;
  align-self: stretch;
  align-items: center;
  border: none;
  outline: none;
  background-color: transparent;
  height: 100%;
  max-width: 156px;
  padding-left: 1rem;
  border-left: 2px solid var(--gray-200);
}

.filter-value {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
  color: var(--gray-400);
}

.filter__apartment__price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  //min-width: 20rem;
  height: 3.5rem;
  background-color: var(--gray-100);
  border-radius: 2rem;
  border: .25rem solid transparent;
  padding: 0 1.25rem;
  width: 100%;
  max-width: 25rem;
  color: var(--gray-600);
  position: relative;

  ::placeholder {
    color: var(--gray-400);
    opacity: 1;
  }

  .placeholder {
    color: var(--gray-400);
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
    min-width: 4rem;
    height: 100%;
  }

}

.filter__inputs-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 20rem;
  min-height: 3.5rem;
  background-color: var(--gray-100);
  border-radius: 2rem;
  padding: .5rem 1.25rem;
  width: 100%;
  max-width: 450px;
  border: none;
  color: var(--gray-600);
  position: relative;

  .tag-input {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: visible;
    border-radius: 2rem;
  }


  ::placeholder {
    color: var(--gray-400);
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

  .tag-input__text {
    width: auto !important;
  }

}


::v-deep {
  .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
    font-family: Inter, serif;
    padding: 1rem 1rem 1rem 1.5rem !important;
    height: 56px;
    font-weight: 600 !important;
    line-height: 22px !important;
    border-radius: 2rem !important;
    color: var(--gray-400) !important;
    font-size: 1rem !important;
    border: none !important;
    outline: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--gray-100) !important;
    margin: 0 !important;

    &:hover {
      -webkit-box-shadow: 0 8px 25px -8px var(--gray-400) !important;
      box-shadow: 0 8px 25px -8px var(--gray-400) !important;
    }
  }

  .dropdown-toggle::after {
    border: none;
    width: 24px;
    height: 24px;
    display: flex;
    margin-left: 1rem;
    background: url("../../assets/icons/icon-down.svg");
    transition: all .2s ease-in-out;
  }

  .show .dropdown-toggle::after {
    transform: rotate(-180deg);
  }

  .dropdown-menu {
    border: 1px solid var(--gray-200);
    box-sizing: border-box;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    padding: .5rem;


    .dropdown-item {
      font-weight: 600 !important;
      font-size: 16px !important;
      line-height: 22px !important;
      border-radius: 1rem;
      padding: 12px 17px;
      min-width: 256px;

      &:hover {
        background-color: var(--gray-200);
      }
    }

  }


  .b-dropdown-text {
    min-width: 16rem;
    padding: .5rem !important;

    .form-group {
      margin-bottom: 0;
    }
  }

  .custom-control-label {
    padding-left: .5rem;
    width: 100%;

  }

  .custom-control-input:focus ~ .custom-control-label::before {
    -webkit-box-shadow: 0 0 0 0.2rem rgba(196, 181, 253, 5%);
    box-shadow: 0 0 0 0.2rem rgba(196, 181, 253, 5%);
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: var(--violet-600);
    background-color: var(--violet-600);
  }

  .custom-checkbox {
    width: 100%;
    display: flex;
    align-items: center;
    padding: .15rem .15rem .15rem 2.5rem;
    height: 50px;
    font-weight: 600;
    border-radius: 1rem;
    color: var(--gray-600);
    font-size: 1rem;

    &:hover {
      background-color: var(--gray-200);
    }
  }


}


</style>