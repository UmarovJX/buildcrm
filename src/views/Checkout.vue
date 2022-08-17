<template>
  <div class="app-checkout">
    <app-header>
      <template #header-right>
        <div :class="flexCenter" class="checkout-timer background-violet-gradient mr-1">
          <span class="checkout-timer-inner">29:59</span>
        </div>
      </template>
    </app-header>
    <div class="app-checkout-main">
      <b-tabs
          pills
          v-model="tabIndex"
          content-class="app-tabs-content"
          nav-class="app-tabs-content-header"
      >
        <!--  FIRST TAB    -->
        <b-tab active>
          <template #title>
            <div class="app-tab-title d-flex align-items-center">
              <span :class="flexCenter" class="app-tab-title-number">1</span>
              <p class="app-tab-title-content">Детали договора</p>
              <span :class="flexCenter" class="app-tab-title-right-icon">
              <base-right-icon :width="18" :height="18"/>
            </span>
            </div>
          </template>

          <div class="app-tab-content">
            <section class="tab-section">
              <h3 class="section-title">Детали договора</h3>
              <div class="section-container">
                <output-information property="Номер договора" value="J45TKL076">
                  <template #actions>
                    <span class="d-block ml-2 cursor-pointer">
                      <base-circle-wrapper :class="flexCenter" class="edit-icon-wrapper">
                        <base-edit-icon :width="13.5" :height="13.5" fill="#fff"/>
                      </base-circle-wrapper>
                    </span>
                  </template>
                </output-information>
                <base-date-picker
                    v-model="form.contract_date"
                    :range="false"
                    class="data-picker"
                    :icon-fill="datePickerIconFill"
                    :placeholder="`${ $t('create_date') }`"
                />
              </div>
            </section>

            <section class="tab-section mt-5 mb-5">
              <h3 class="section-title">Детали клиента</h3>
              <div class="section-container row-gap-1">
                <base-input
                    v-model="form.passport_number"
                    :label="true"
                    class="w-100"
                    placeholder="Номер паспорта (напр. AB1234567)"
                />
                <base-input
                    v-model="form.passport_issue"
                    :label="true"
                    placeholder="Место выдачи паспорта"
                    class="w-100"
                />
                <base-date-picker
                    v-model="form.passport_date"
                    :range="false"
                    class="data-picker"
                    placeholder="Дата выдачи паспорта"
                    :icon-fill="datePickerIconFill"
                />
                <base-date-picker
                    v-model="form.birthday"
                    class="w-100"
                    :range="false"
                    placeholder="Дата рождения"
                    :icon-fill="datePickerIconFill"
                />
                <base-input
                    v-model="form.last_name.kirill"
                    :label="true"
                    placeholder="Фамилия (кир.)"
                    class="w-100"
                />
                <base-input
                    v-model="form.last_name.latin"
                    :label="true"
                    placeholder="Фамилия (лат.)"
                    class="w-100"
                />
                <base-input
                    v-model="form.first_name.kirill"
                    :label="true"
                    placeholder="Имя (кир.)"
                    class="w-100"
                />
                <base-input
                    v-model="form.first_name.latin"
                    :label="true"
                    placeholder="Имя (лат.)"
                    class="w-100"
                />
                <base-input
                    v-model="form.surname.latin"
                    :label="true"
                    placeholder="Отчество (кир.)"
                    class="w-100"
                />
                <base-input
                    v-model="form.surname.kirill"
                    :label="true"
                    placeholder="Отчество (лат.)"
                    class="w-100"
                />
                <base-input
                    v-model="form.phone_number"
                    type="tel"
                    :label="true"
                    mask="+### ## ### ## ##"
                    placeholder="Номер телефона"
                    class="w-100"
                />
                <base-input
                    v-model="form.second_phone_number"
                    type="tel"
                    :label="true"
                    mask="+### ## ### ## ##"
                    placeholder="Дополнительный номер телефона"
                    class="w-100"
                />
                <base-select
                    v-model="form.contract_language"
                    :label="true"
                    :noPlaceholder="true"
                    :options="options"
                    placeholder="Язык"
                />
                <base-select
                    v-model="form.client_type"
                    :label="true"
                    :noPlaceholder="true"
                    :options="options"
                    placeholder="Тип клиента"
                />
              </div>
            </section>
          </div>
        </b-tab>
        <!--  END OF FIRST TAB    -->

        <!--   SECOND TAB   -->
        <b-tab>
          <template #title>
            <div class="app-tab-title d-flex align-items-center">
              <span :class="flexCenter" class="app-tab-title-number">2</span>
              <p class="app-tab-title-content">Детали платежей</p>
            </div>
          </template>

          <div class="app-tab-content">
            <div>
              <div class="app-tab__header-collapse" v-b-toggle.accordion-1>
                <h3 class="section-title">Информация клиента</h3>
                <img class="collapse-icon" :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
              <b-collapse id="accordion-1">
                <ClientInformation :client="client"/>
              </b-collapse>
              <div class="app-tab__header-collapse" v-b-toggle.accordion-2>
                <h3 class="section-title">Список квартир</h3>
                <img class="collapse-icon" :src="require('@/assets/icons/icon-down.svg')" alt="">
              </div>
              <b-collapse id="accordion-2">
                <ApartmentItem :apartments="apartments"/>
              </b-collapse>
              <div class="app-tab__header">
                <h3 class="section-title">Детали платежа</h3>
              </div>
              <div class="app-checkout__calculator">
                <Calculator/>
              </div>
            </div>
          </div>
        </b-tab>
        <!--   END OF SECOND TAB   -->
      </b-tabs>
    </div>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import BaseRightIcon from "@/components/icons/BaseRightIcon";
import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BaseCircleWrapper from "@/components/Reusable/BaseCircleWrapper";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseSelect from "@/components/Reusable/BaseSelect";
import ClientInformation from "@/views/Checkout/ClientInformation";
import ApartmentItem from "@/views/Checkout/ApartmentItem";
import Calculator from "@/components/Dashboard/Apartment/Contract/Calculator";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Checkout",
  components: {
    Calculator,
    ApartmentItem,
    ClientInformation,
    AppHeader,
    BaseInput,
    BaseSelect,
    BaseEditIcon,
    BaseRightIcon,
    BaseDatePicker,
    OutputInformation,
    BaseCircleWrapper,
  },
  data() {
    return {
      datePickerIconFill: 'var(--violet-600)',
      tabIndex: 0,
      form: {
        contract_date: '',
        passport_number: '',
        passport_issue: '',
        passport_date: '',
        birthday: '',
        last_name: {
          latin: '',
          kirill: ''
        },
        first_name: {
          latin: '',
          kirill: ''
        },
        surname: {
          latin: '',
          kirill: ''
        },
        phone_number: '',
        second_phone_number: '',
        contract_language: '',
        client_type: ''
      },
      options: [
        {
          text: 'UZ',
          value: '1'
        },
        {
          text: 'RU',
          value: '2'
        }
      ],
      client: {
        first_name: {
          lotin: "",
          kirill: "",
        },
        last_name: {
          lotin: "",
          kirill: "",
        },
        second_name: {
          lotin: "",
          kirill: "",
        },
        passport_series: null,
        issued_by_whom: null,
        date_of_issue: null,
        language: "uz",
        type_client: "unknown",
        birth_day: null,
        phone: null,
        other_phone: null,
        first_payment_date: null,
        payment_date: null,
      },
      apartments: [
        {
          discount_id: "other",
          entrance: 2,
          floor: 3,
          block: {
            address: null,
            build_date: null,
            credit_month: null,
            id: 1,
            location: null,
            name: "Блок K",
          },
          building: {
            address: null,
            build_date: null,
            credit_month: null,
            id: 1,
            location: null,
            name: "87605",
          },
          plan: {
            area: 94.1,
            balcony: false,
            balcony_area: 0,
            id: 6,
          },
          object: {
            address: "71351 Von Hill Suite 928\nLake Napoleon, AK 91071-9471",
            build_date: "2022-11-03",
            credit_month: 32,
            id: 1,
          },
          id: "dab7329e-e6a8-42cc-a934-666c786747ff",
          number: "N-45",
          price: 617510924,
          price_calc: 617510924.4,
          price_edited: true,
          price_m2: 6562284,
          price_sold: 617510924,
          rooms: 3,
        }
      ],
      order: {},
    }
  },
  watch: {
    tabIndex(value) {
      if (value) {
        console.log(value, 'value');
      }
    },
  },
  computed: {
    ...mapGetters([
      "getApartmentOrder",
    ]),
    flexCenter() {
      return 'd-flex justify-content-center align-items-center'
    }
  },
  created() {
    this.fetchApartmentOrder()
    this.order = this.getApartmentOrder()
  },
  methods: {
    ...mapActions(["fetchApartmentOrder"]),
  }
}
</script>

<style lang="scss" scoped>

.app-checkout {
  .checkout-timer {
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 30px;
    color: var(--white);
    border-radius: 28px;

    &-inner {
      padding: 13px 16px;
    }
  }

  &__calculator {

  }
}

::v-deep .app-tabs-content {
  &-header {
    display: flex;
    align-items: center !important;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-bottom: 2rem;
    border-top: 6px solid var(--gray-100);
    border-bottom: 6px solid var(--gray-100);
    padding: 20px 3rem;

    .nav-item {
      min-width: max-content;

      .nav-link {
        padding: 8px 6px;
      }

      .active {
        background-color: transparent;

        .app-tab-title-number {
          background-color: var(--violet-600);
          color: white;
        }

        p {
          color: var(--violet-600);
        }
      }
    }
  }
}

.app-tab {
  &-title {
    display: flex;
    justify-content: center;
    font-family: Inter, sans-serif;
    font-style: normal;
    font-weight: 600;


    &-number {
      width: 2rem;
      height: 2rem;
      font-size: 14px;
      line-height: 20px;
      border-radius: 50%;
      margin-right: .5rem;
      color: var(--gray-400);
      background-color: var(--gray-100);
    }

    &-content {
      display: flex;
      align-items: center;
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 0;
      color: var(--gray-400);
    }


    &-right-icon {
      display: flex;
      align-items: center;
      margin-left: 12px;
    }
  }

  &-content {
    margin-left: 3rem;
    margin-right: 3rem;
  }

  &__header-collapse {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;

    .section-title {
      margin-bottom: 0;
    }

    .collapse-icon {
      transition: all .3s linear;
    }

    &.not-collapsed {

      .collapse-icon {
        transform: rotate(-180deg);
      }
    }
  }
}

.section {
  &-title {
    font-size: 24px;
    font-weight: 900;
    margin-bottom: 2rem;
    color: var(--gray-400);
    font-family: CraftworkSans, serif;
  }

  &-container {
    display: grid;
    column-gap: 2rem;
    grid-template-columns: 1fr 1fr;
  }

  .data-picker {
    height: 56px;
    max-height: 56px;
    width: 100%;
    border: 2px solid #E5E7EB;
    border-radius: 32px;
  }
}

.edit-icon-wrapper {
  padding: 5.25px;
  background-color: var(--violet-600);
  width: 24px;
  height: 24px;
}

.row-gap-1 {
  row-gap: 1rem;
}

</style>