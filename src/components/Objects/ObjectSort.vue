<template>
  <div class="sort-list">
    <div class="sort-top ">

      <!--   Номер квартиры   -->
      <div class="filter__inputs-input">
        <base-form-tag-input
            @set-tags="setApartmentNumbers"
            :default-tags="defaultApartments"
            ref="base-form-tag-input"
            :placeholder="$t('object.sort.number_flat')"
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

      <!--   Комнат    -->
      <b-dropdown left>
        <template v-if="form.rooms && form.rooms.length" #button-content>
          <div class="input-block">
            <span class="input-label">{{ $t('object.sort.flat') }}</span>
            <p class="input-text">
              {{ formatSelectPlaceholder(form.rooms) }}
            </p>
          </div>
        </template>
        <template v-else #button-content>
          <p class="default-label">
            {{ $t('object.sort.flat') }}
          </p>
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.rooms"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in filterFields.rooms" :key="option" :value="option">
                {{ option }}
              </b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <!--  Этаж    -->
      <b-dropdown left>
        <template v-if="form.floors && form.floors.length" #button-content>
          <div class="input-block">
            <span class="input-label">{{ $t('object.level') }}</span>
            <p class="input-text">
              {{ formatSelectPlaceholder(form.floors) }}
            </p>
          </div>
        </template>
        <template v-else #button-content>
          <p class="default-label">
            {{ $t('object.level') }}
          </p>
        </template>
        <!--        <template #button-content>-->
        <!--          {{ $t('object.level') }}-->
        <!--        </template>-->
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.floors"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox v-for="option in filterFields.floors" :key="option" :value="option">
                {{ option }}
              </b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <!--   Блок    -->
      <b-dropdown left>
        <template v-if="form.blocks && form.blocks.length" #button-content>
          <div class="input-block">
            <span class="input-label">{{ $t('object.sort.block') }}</span>
            <p class="input-text">
              {{ selectOutput(form.blocks) }}
            </p>
          </div>
        </template>
        <template v-else #button-content>
          <p class="default-label">
            {{ $t('object.sort.block') }}
          </p>
        </template>

        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.blocks"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox
                  v-for="option in filterFields.blocks"
                  :key="option.id"
                  :value="option.id"
              >
                {{ option.name }}
              </b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <!--   Жилая площадь    -->
      <b-dropdown v-show="sortBar" left>
        <template v-if="form.area && form.area.length" #button-content>
          <div class="input-block">
            <span class="input-label">{{ $t('object.sort.area') }}</span>
            <p class="input-text">
              {{ formatSelectPlaceholder(form.area) }}
            </p>
          </div>
        </template>
        <template v-else #button-content>
          <p class="default-label">
            {{ $t('object.sort.area') }}
          </p>
        </template>
        <b-dropdown-text href="#">
          <b-form-group v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                id="checkbox-group-2"
                v-model="form.area"
                :aria-describedby="ariaDescribedby"
                name="flavour-2"
            >
              <b-form-checkbox
                  v-for="option in filterFields.area"
                  :key="option"
                  :value="option"
              >
                {{ option }} m<sup>2</sup>
              </b-form-checkbox>
            </b-form-checkbox-group>
          </b-form-group>
        </b-dropdown-text>
      </b-dropdown>

      <div v-show="sortBar" class="filter__apartment__price">
        <b-form-select
            v-model="currency"
            :options="currencyOptions"
            class="inline price__currency"
        />
        <base-numeric-input
            v-model.number="form.price_from"
            :currency="` `"
            :minus="false"
            :value="null"
            currency-symbol-position="suffix"
            separator="space"
            :placeholder="$t('from')"
            class="filter__price"
        ></base-numeric-input>

        <base-numeric-input
            v-model.number="form.price_to"
            :currency="` `"
            :minus="false"
            :value="null"
            currency-symbol-position="suffix"
            separator="space"
            :placeholder="$t('to')"
            class="filter__price"
        ></base-numeric-input>
      </div>

      <!--  Сум  От / До  -->
      <div v-show="sortBar" class="filter__apartment__price">
        <div class="filter-value">
          <span>m<sup>2</sup></span>
        </div>
        <base-numeric-input
            v-model.number="form.area_from"
            :currency="` `"
            :minus="false"
            :value="null"
            currency-symbol-position="suffix"
            separator="space"
            :placeholder="$t('from')"
            class="filter__price"
        ></base-numeric-input>
        <base-numeric-input
            v-model.number="form.area_to"
            :currency="` `"
            :minus="false"
            :value="null"
            currency-symbol-position="suffix"
            separator="space"
            :placeholder="$t('to')"
            class="filter__price"
        ></base-numeric-input>
      </div>

      <div class="detail-button" @click="openBar" :class="sortBar ? 'active':''">
        <base-details-icon :fill="sortBar ? '#fff' : '#7C3AED'"/>
      </div>

      <base-button @click="clearFilter" :text="$t('clear')" design="violet-gradient"/>
    </div>

    <div class="chess-tab">
      <base-button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: currentTab.name === tab.name }"
          @click="changeProduct(tab)"
          :text="tab.title">
        <template #left-icon>
          <component
              :is="tab.buttonIcon"
              :fill="currentTab.name === tab.name ? '#F9FAFB' : undefined"
          />
        </template>
      </base-button>
    </div>
  </div>
</template>

<script>
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import BaseChessOne from "@/components/icons/BaseChessOne";
import BaseChessTwo from "@/components/icons/BaseChessTwo";
import BaseDetailsIcon from "@/components/icons/BaseDetailsIcon";
import BaseChessList from "@/components/icons/BaseChessList";
import BaseChessPlan from "@/components/icons/BaseChessPlan";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";
import {clearObjectProperties} from "@/util/reusable";
import {sortInFirstRelationship} from "@/util/reusable";

export default {
  name: "ObjectSort",
  components: {
    BaseChessOne,
    BaseChessTwo,
    BaseDetailsIcon,
    BaseNumericInput,
    BaseButton,
    BaseFormTagInput,
    BaseChessList,
    BaseChessPlan,
  },

  props: {
    filterFields: {
      type: Object,
      required: true
    },
    appLoading: {
      type: Boolean,
      required: true
    }
  },

  emits: ['filter-values'],

  data() {
    return {
      currentTab: {
        id: 2,
        param: 'chess',
        name: 'ObjectBlock',
        buttonIcon: 'BaseChessOne',
        title: this.$t('object.chess') + ' 1.0'
      },
      tabs: [
        {
          id: 2,
          param: 'chess',
          name: 'ObjectBlock',
          buttonIcon: 'BaseChessOne',
          title: this.$t('object.chess') + ' 1.0'
        },
        {
          id: 3,
          param: 'chess',
          name: 'ChessSquareCard',
          buttonIcon: 'BaseChessTwo',
          title: this.$t('object.chess') + ' 2.0'
        },
        {
          id: 4,
          param: 'chess',
          name: 'ObjectTable',
          buttonIcon: 'BaseChessList',
          title: this.$t('object.list')
        },
        {
          id: 5,
          param: 'chess',
          name: 'ObjectPlan',
          buttonIcon: 'BaseChessPlan',
          title: this.$t('object.plan')
        },
      ],
      sortBar: false,
      defaultApartments: [],
      form: {
        status: null,
        price_m2: 0,
        price_from: 0,
        price_to: 0,
        area_from: 0,
        area_to: 0,
        blocks: [],
        area: [],
        rooms: [],
        floors: [],
        number: []
      },
      currencyOptions: ["UZS", "USD"],
      areaOptions: 'M2',
      currency: 'UZS',
    }
  },

  watch: {
    appLoading(finishLoading) {
      finishLoading && this.setRouteQuery()
    },
    currentTab: {
      handler(val) {
        this.$emit('current-tab', val)
      },
      immediate: true,
    },
    form: {
      handler() {
        this.filterApartments()
      },
      deep: true,
      immediate: false
    }
  },

  async created() {
    this.initSelectedApartments()
  },

  methods: {
    selectOutput(array, outputBy = 'name') {
      const selectedArray = array.map(arr => {
        const fullContext = this.filterFields.blocks.find(block => block.id === arr)
        return fullContext ?? arr
      })
      let output = ''
      for (let i = 0; i < selectedArray.length; i++) {
        output += selectedArray[i][outputBy] + ','
      }
      if (output.slice(-1) === ',') {
        output = output.slice(0, -1)
      }
      return output
    },
    formatSelectPlaceholder(array) {
      const items = [...array].sort((a, b) => a - b);
      let s = '';
      for (let i = 0; i < items.length; i++) {
        const distinctWithNext = Math.abs(items[i + 1] - items[i]);
        const distinctWithPrevious = Math.abs(items[i] - items[i - 1]);
        if (distinctWithNext === 1) {
          if (distinctWithPrevious === 1) {
            if (i === 0) {
              s += '-';
            }
          } else {
            s += items[i] + '-';
          }
        } else if (distinctWithPrevious === 1) {
          if (i === 0) {
            s += '-';
          }
          s += items[i] + ',';
        } else {
          s += items[i] + ',';
        }
      }

      if (s.slice(-1) === ',') {
        s = s.slice(0, -1)
      }

      return s
    },
    filterApartments() {
      const values = sortInFirstRelationship(this.form)
      const params = this.$route.params
      this.$router.push({
        query: {
          ...this.$route.query,
          ...values
        },
        params
      })
    },
    setApartmentNumbers(apartments) {
      this.form.number = apartments
    },
    setFormProperty(property, value) {
      this.form[property] = value
      this.errors[property] = false
    },
    setRouteQuery() {
      const filterQuery = Object.assign({}, this.$route.query)
      const queryProperties = Object.keys(filterQuery)
      const loopPackage = {}

      queryProperties.forEach((property) => {
        const hasFormProperty = this.form.hasOwnProperty(property)
        if (hasFormProperty) {
          if (property === 'blocks') {
            const values = filterQuery[property]
            const isQueryPrimitive = typeof values === 'number' || typeof values === 'string'
            if (isQueryPrimitive) {
              loopPackage[property] = this.filterFields.blocks.filter(block => {
                return block.id.toString() === values.toString()
              }).map(block => block.id)
            } else {
              loopPackage[property] = this.filterFields.blocks.filter(block => {
                return values.findIndex((value) => value === block.id.toString()) > -1
              }).map(block => block.id)
            }
          } else {
            const queryValue = filterQuery[property]
            const formValue = this.form[property]
            const isQueryPrimitive = typeof queryValue === 'number' || typeof queryValue === 'string'
            const isArray = Array.isArray(formValue) && (typeof formValue === 'object')
            if (isArray && isQueryPrimitive) {
              loopPackage[property] = [queryValue]
            } else {
              loopPackage[property] = queryValue
            }
          }
        }
      })

      if (Object.keys(loopPackage).length) {
        this.form = {...this.form, ...loopPackage}
      }
    },
    initSelectedApartments() {
      const filterQuery = Object.assign({}, this.$route.query)
      const hasApartments = filterQuery.hasOwnProperty('number')
      if (hasApartments) {
        const value = filterQuery['number']
        const isQueryPrimitive = typeof value === 'number' || typeof value === 'string'
        if (isQueryPrimitive) {
          this.defaultApartments = [parseInt(value)]
        } else
          this.defaultApartments = value.map(vs => parseInt(vs))
      }
    },
    openBar() {
      this.sortBar = !this.sortBar
    },
    clearApartments() {
      this.$refs['base-form-tag-input'].clear()
    },
    clearFilter() {
      this.form = clearObjectProperties(this.form)
      this.clearApartments()
      this.$emit('clear-status')
      const query = {}
      this.$router.push({
        query
      })
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
  //margin-bottom: 1rem;
  gap: 1rem;
  background-color: var(--white);
  font-family: Inter, sans-serif;
}

.sort-top, .sort-hide, .chess-tab {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem .5rem;
  color: var(--gray-600) !important;
  background-color: var(--white);
  font-family: Inter, sans-serif;
}

.sort-top {
  display: flex;
  flex-wrap: wrap;


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
  transition: all .2s linear;

  &.active {
    background-color: var(--violet-600);
  }

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
    font-family: Inter, sans-serif;
    padding: 1rem 1rem 1rem 1.5rem !important;
    height: 56px;
    font-style: normal;
    line-height: 22px !important;
    border-radius: 2rem !important;
    color: var(--gray-400) !important;
    font-size: 1rem !important;
    border: none !important;
    outline: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background-color: var(--gray-100) !important;
    margin: 0 !important;
    //width: 100%;

    &:hover {
      -webkit-box-shadow: 0 8px 25px -8px var(--gray-400) !important;
      box-shadow: 0 8px 25px -8px var(--gray-400) !important;
    }

    .input-block {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .input-label {
      font-weight: 900;
      font-size: 8px;
      line-height: 10px;
      margin: 0 2px 0 0;
      //margin-bottom: 2px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--gray-400);
    }

    .input-text {
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      color: var(--gray-600);
      margin: 0;
      max-width: 150px;
      overflow-x: hidden;
      text-overflow: ellipsis;
    }

    .default-label {
      line-height: 22px;
      font-size: 1rem;
      color: var(--gray-400);
      margin: 0;
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

  //@media (max-width: 1200px) {
  //  .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
  //    width: auto;
  //  }
  //}
}


</style>