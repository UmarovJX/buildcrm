<template>
  <div>
    <base-modal ref="create" id="modal-create-discount" design="large-modal">
      <template #header>

        <span class="d-flex align-items-center justify-content-between">

          <!--    TITLE      -->
          <span class="title">{{ $t('apartments.add_tariff') }}</span>

          <!--   CLOSE    -->
          <span class="go__back" @click="closeModal">
            <BaseCLose :width="56" :height="56"/>
          </span>
        </span>
      </template>

      <template #main>
        <div class="create">
          <h5 class="create-title">Основные</h5>
          <ValidationProvider
              name="Название тарифа"
              ref="tariff-name"
              rules="required"
              v-slot="{ errors }"
              class="w-100 create-input"
              tag="div"
          >
            <base-input class="w-100" v-model="tariff.prepay" placeholder="Название тарифа" required
                        :label="true"/>
            <span class="error__provider" v-if="errors[0]">
              {{ errors[0] }}
            </span>
          </ValidationProvider>
          <p class="create-tab__name">
            Тип тарифа
          </p>
        </div>

        <b-tabs v-model="tariffIndex" pills nav-class="tariff-header" content-class="tariff-item" id="tariff">

          <b-tab title="Фиксированный" active>

            <div class="price-block">

              <h5 class="create-title">Цены</h5>

              <div class="add-inputs">
                <div v-for="(deflt,index) in tariff.defaultTariff" :key="`default`+index" class="add-inputs__row">

                  <b-dropdown left>
                    <template v-if="true" #button-content>
                      <div class="input-block">
                        <span class="input-label">Этажи или спецификации</span>
                        <p class="input-text">
                          {{ formatSelectPlaceholder(deflt.floors) }}
                          <!--                          Этажи или спецификации-->
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
                            v-model="deflt.floors"
                            :aria-describedby="ariaDescribedby"
                            name="flavour-2"
                        >
                          <b-form-checkbox v-for="option in floors" :key="`default`+option" :value="option">
                            {{ option }}
                          </b-form-checkbox>
                        </b-form-checkbox-group>
                      </b-form-group>
                    </b-dropdown-text>
                  </b-dropdown>

                  <!--  Сум  -->
                  <div class="filter__apartment__price">
                    <b-form-select
                        v-model="deflt.currency"
                        :options="currencyOptions"
                        class="inline price__currency"
                    />

                    <base-numeric-input
                        v-model.number="deflt.amount"
                        :currency="` `"
                        :minus="false"
                        :value="null"
                        currency-symbol-position="suffix"
                        separator="space"
                        :placeholder="$t('objects.create.price_m2')"
                        class="filter__price"
                    ></base-numeric-input>

                  </div>

                  <div @click="deleteDefaultPrice(index)" class="price-delete">
                    <img :src="require('@/assets/icons/delete.svg')" alt="">
                  </div>
                </div>

              </div>

              <base-button @click="addDefaultPrice" text="Добавить цену">
                <template #left-icon>
                  <base-plus-icon fill="var(--violet-600)"/>
                </template>
              </base-button>

            </div>

            <div class="price-block">

              <h5 class="create-title">Цены balkoni</h5>

              <div class="add-inputs">
                <div v-for="(other,index) in tariff.otherTariff" :key="`other`+index" class="add-inputs__row">

                  <b-dropdown left>
                    <template v-if="true" #button-content>
                      <div class="input-block">
                        <span class="input-label">Этажи или спецификации</span>
                        <p class="input-text">
                          {{ formatSelectPlaceholder(other.floors) }}
                          <!--                          Этажи или спецификации-->
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
                            v-model="other.floors"
                            :aria-describedby="ariaDescribedby"
                            name="flavour-2"
                        >
                          <b-form-checkbox v-for="option in floors" :key="`other`+option" :value="option">
                            {{ option }}
                          </b-form-checkbox>
                        </b-form-checkbox-group>
                      </b-form-group>
                    </b-dropdown-text>
                  </b-dropdown>

                  <!--  Сум  -->
                  <div class="filter__apartment__price">
                    <b-form-select
                        v-model="other.currency"
                        :options="currencyOptions"
                        class="inline price__currency"
                    />
                    <base-numeric-input
                        v-model.number="other.amount"
                        :currency="` `"
                        :minus="false"
                        :value="null"
                        currency-symbol-position="suffix"
                        separator="space"
                        :placeholder="$t('objects.create.price_m2')"
                        class="filter__price"
                    ></base-numeric-input>

                  </div>

                  <div @click="deleteOtherPrice(index)" class="price-delete">
                    <img :src="require('@/assets/icons/delete.svg')" alt="">
                  </div>

                </div>

              </div>

              <base-button @click="addOtherPrice" text="Добавить цену">
                <template #left-icon>
                  <base-plus-icon fill="var(--violet-600)"/>
                </template>
              </base-button>

            </div>

          </b-tab>

          <b-tab title="Процентный">

            <div class="price-block">

              <h5 class="create-title">Цены</h5>

              <div class="add-inputs">
                <div class="add-inputs__row">
                  <div class="filter__apartment__price">
                    <ValidationProvider
                        name="Добавичный процент"
                        ref="percent"
                        rules="required|max_value:100|min_value:0"
                        v-slot="{ errors }"
                        class="w-100"
                        tag="div"
                    >
                      <base-numeric-input v-model.number="tariff.discount"
                                          name="percent"
                                          :currency="` `"
                                          :minus="false"
                                          :value="null"
                                          :state="errors[0]"
                                          currency-symbol-position="suffix"
                                          separator="space"
                                          placeholder="Добавичный процент" class="filter__price"
                                          style="border:none"/>

                    </ValidationProvider>


                  </div>


                </div>

              </div>


            </div>


          </b-tab>


        </b-tabs>


      </template>

      <template #footer>
        <div class="footer-btn">
          <base-button @click="closeModal" text="Отменить"/>
          <base-button @click="saveDiscount" class="violet-gradient" text="Добавить"/>
        </div>
      </template>

    </base-modal>

  </div>
</template>

<script>
import api from "@/services/api";
import BaseModal from "@/components/Reusable/BaseModal";
// import BaseModal from "@/components/Reusable/BaseModal";
import BaseCLose from "@/components/icons/BaseClose";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseInput from "@/components/Reusable/BaseInput";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
// import BaseSelect from "@/components/Reusable/BaseSelect";

export default {
  components: {
    BaseCLose,
    "base-modal": BaseModal,
    BaseButton,
    BaseInput,
    BasePlusIcon,
    BaseNumericInput,
    // BaseSelect
  },
  props: {
    object: {},
    discount: {
      type: Object,
      default: () => {
      }
    },
    visible: {
      type: Boolean,
      default: () => false
    }
  },

  data: () => ({
    // discount: {
    //   prepay_from: 0,
    //   prepay_to: 0,
    //   discount: 0,
    // },
    error: false,
    errors: [],

    tariffIndex: 0,
    floors: [],
    price: null,
    currencyOptions: ["uzs", "usd"],
    currency: 'uzs',
    tariff: {
      prepay: '',
      type: '',
      discount: 0,
      defaultTariff: [
        {
          type: 'default',
          amount: null,
          currency: 'usd',
          floors: []
        }
      ],
      otherTariff: [
        {
          type: 'other_price',
          amount: null,
          currency: 'usd',
          floors: []
        }
      ],
    },
    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
    planName: ''
  }),
  mounted() {
    this.$refs["create"].openModal()
    this.getFloors()
  },
  watch: {
    // discount: {
    //   deep: true,
    //   immediate: true,
    //   handler() {
    //     this.editDiscount()
    //   }
    // },
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.editDiscount()
        }
      }

    }
  },
  computed: {
    tariffType() {
      if (this.tariffIndex === 0)
        return 'fixed'
      if (this.tariffIndex === 1)
        return 'percent'
      return 'percent'
    }
  },
  methods: {
    editDiscount() {
      if (Object.keys(this.discount).length) {
        const {prepay, type, amount, prices} = this.discount
        this.tariff.prepay = prepay

        if (type === 'percent') {
          this.tariffIndex = 1
          this.tariff.discount = amount
        } else {
          this.tariffIndex = 0
        }
        if (prices.length) {
          prices.forEach((item) => {
            if (item.type === 'default') {
              this.tariff.defaultTariff.unshift(item)
            } else {
              this.tariff.otherTariff.unshift(item)
            }
          })
        }
      }
    },
    getFloors() {
      api.objectsV2.fetchObjectFields(this.$route.params.id).then((res) => {
        const {floors} = res.data
        this.floors = floors
      }).catch(err => {
        return err
      })
    },
    deleteOtherPrice(index) {
      this.tariff.otherTariff.splice(index, 1)
    },
    deleteDefaultPrice(index) {
      this.tariff.defaultTariff.splice(index, 1)
    },
    addDefaultPrice() {
      this.tariff.defaultTariff.push({
        type: 'default',
        amount: null,
        currency: 'usd',
        floors: []
      })
    },
    addOtherPrice() {
      this.tariff.otherTariff.push({
        type: 'other_price',
        amount: null,
        currency: 'usd',
        floors: []
      })
    },
    closeModal() {
      this.tariff = {
        prepay: '',
        type: '',
        discount: 0,
        defaultTariff: [
          {
            type: 'default',
            amount: null,
            currency: 'usd',
            floors: []
          }
        ],
        otherTariff: [
          {
            type: 'other_price',
            amount: null,
            currency: 'usd',
            floors: []
          }
        ],
      }
      this.$emit("RemoveDiscount");
      this.$refs["create"].closeModal()
    },
    openModal() {
      this.$refs["create"].openModal()
    },
    discountTrash() {
      this.$emit("RemoveDiscount");
      this.$bvModal.hide("modal-create-discount");
      this.clearDiscount();
    },

    clearDiscount() {
      this.discount.prepay_from = 0;
      this.discount.prepay_to = 0;
      this.discount.discount = 0;
    },

    async saveDiscount() {
      const checkTariff = await this.$refs['tariff-name'].validate().then((res) => {
        this.errors = res.errors
        return res.valid
      })

      const {discount, prepay} = this.tariff

      let filteredData = {}
      if (this.tariffType === 'fixed') {

        const otherFilter = this.tariff.otherTariff.filter((item) => {
              return item.floors.length > 0 && item.amount > 0
            }
        )
        const defaultFilter = this.tariff.defaultTariff.filter((item) => {
              return item.floors.length > 0 && item.amount > 0
            }
        )

        filteredData = {
          type: this.tariffType,
          prepay: prepay,
          prices: [...otherFilter.length > 0 ? otherFilter : null,
            ...defaultFilter.length > 0 ? defaultFilter : null,
          ],
        }
      } else {
        filteredData = {
          type: this.tariffType,
          prepay: prepay,
          amount: discount,
        }
      }

      if (checkTariff && !Object.keys(this.discount).length) {
        try {
          await api.objects.createDiscount(this.object.id, filteredData).then((res) => {
            if (res.status === 200) {
              this.$emit("SaveDiscount", res.data);
              this.$refs["create"].closeModal()
              // this.$bvModal.hide("modal-create-discount");
              this.clearDiscount();
              this.toasted('discount created', 'success');

            }
          }).catch((error) => {
            if (error.status === 422) {
              this.error = true;
              this.errors = error.response.data;
              this.toastedWithErrorCode(error);
            }

          })
        } catch {
          this.toastedWithErrorCode(this.error);
        }

      } else {
        // filteredData = {...filteredData, id: this.discount.id}
        try {
          await api.objects.updateDiscount(this.object.id, this.discount.id, filteredData).then((res) => {
            if (res.status === 200) {
              this.$emit("SaveDiscount", res.data);
              this.$refs["create"].closeModal()
              // this.$bvModal.hide("modal-create-discount");
              this.clearDiscount();
              this.toasted('discount update', 'success');

            }
          }).catch((error) => {
            if (error.status === 422) {
              this.error = true;
              this.errors = error.response.data;
              this.toastedWithErrorCode(error);
            }

          })
        } catch {
          this.toastedWithErrorCode(this.error);
        }
      }

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
  },
};
</script>

<style lang="scss" scoped>
.create {
  &-title {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 24px;
    line-height: 28px;
    color: var(--gray-400);
    margin-bottom: 2rem;

    &:first-child {
      margin-bottom: 1rem;
    }


  }

  &-input {
    width: 100%;
    max-width: 41rem;
    margin-bottom: 2rem;
  }

}

.price-block {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  .base__button {
    width: max-content !important;
  }
}

.price-delete {
  cursor: pointer;
}

.footer-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 2rem;
  max-width: 41rem;

  .base__button {
    width: 100%;
  }
}


.add-inputs {
  width: 70rem;
  display: flex;
  flex-direction: column;
  //align-items: center;
  margin-bottom: 30px;
  row-gap: 1rem;

  &__row {
    display: flex;
    align-items: center;
    column-gap: 8px;
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
    width: 32rem !important;

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
      max-width: 200px;
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
    background: url("../../../../../assets/icons/icon-down.svg");
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

  .tariff-header {
    display: flex;
    flex-wrap: nowrap;
    max-width: 41rem;
    font-weight: 600;
    line-height: 22px;
    column-gap: .5rem;
    margin-bottom: 3rem;

    .nav-item {
      display: flex;
      width: 100%;
    }

    .nav-link {
      width: 100%;
      font-family: Inter, serif;
      padding: 1rem 1.25rem;
      max-height: 56px;
      border-radius: 2rem;
      color: var(--gray-600);
      font-size: 1rem;
      border: none;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      background-color: var(--white);

      &.active {
        color: var(--gray-600);
        background-color: var(--gray-100);

      }
    }

  }


  .create .base__modal input {
    padding: 0 !important;
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
  width: 350px;
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
  max-width: 33rem;
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
    text-transform: uppercase;
    width: 10rem;
    height: 100%;
  }

}


@media (max-width: 1200px) {
  .add-inputs {
    width: 50rem;
  }
  .filter__price {
    width: 100%;
  }
  .filter__apartment__price {
    .price__currency {
      width: 5rem;
    }

  }
  ::v-deep {
    .b-dropdown .btn:not(.dropdown-item), .btn-secondary:not(.dropdown-item) {
      width: 23rem !important;

      .input-text {
        max-width: 150px;
      }
    }
  }
}


</style>
