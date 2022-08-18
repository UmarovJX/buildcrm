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
            <ValidationObserver ref="form-validation">
              <section class="tab-section">
                <h3 class="section-title">Детали договора</h3>
                <div class="section-container">
                  <output-information property="Номер договора" value="J45TKL076">
                    <template #actions>
                    <span class="d-flex align-items-center cursor-pointer">
                      <base-circle-wrapper :class="flexCenter" class="edit-icon-wrapper">
                        <base-edit-icon :width="13.5" :height="13.5" fill="#fff"/>
                      </base-circle-wrapper>
                    </span>
                    </template>
                  </output-information>
                  <ValidationProvider
                      :name="$t('create_date')"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-date-picker
                        v-model="client.contract_date"
                        :range="false"
                        class="data-picker"
                        format="DD.MM.YYYY"
                        :error="errors[0]"
                        :icon-fill="datePickerIconFill"
                        :placeholder="`${ $t('create_date') }`"
                    />
                  </ValidationProvider>
                </div>
              </section>

              <section class="tab-section mt-5 mb-5">
                <h3 class="section-title">Детали клиента</h3>
                <div class="section-container row-gap-1">
                  <ValidationProvider
                      name="Номер паспорта (напр. AB1234567)"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.passport_series"
                        :label="true"
                        :error="errors[0]"
                        class="w-100"
                        placeholder="Номер паспорта (напр. AB1234567)"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Место выдачи паспорта"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.issued_by_whom"
                        :label="true"
                        :error="errors[0]"
                        placeholder="Место выдачи паспорта"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Дата выдачи паспорта"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-date-picker
                        v-model="client.date_of_issue"
                        :range="false"
                        :error="errors[0]"
                        class="data-picker"
                        format="DD.MM.YYYY"
                        placeholder="Дата выдачи паспорта"
                        :icon-fill="datePickerIconFill"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Дата рождения"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-date-picker
                        v-model="client.birth_day"
                        class="w-100"
                        :range="false"
                        :error="errors[0]"
                        format="DD.MM.YYYY"
                        placeholder="Дата рождения"
                        :icon-fill="datePickerIconFill"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Фамилия (кир.)"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.last_name.kirill"
                        :label="true"
                        :error="errors[0]"
                        placeholder="Фамилия (кир.)"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Фамилия (лат.)"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.last_name.lotin"
                        :label="true"
                        :error="errors[0]"
                        placeholder="Фамилия (лат.)"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Имя (кир.)"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.first_name.kirill"
                        :label="true"
                        :error="errors[0]"
                        placeholder="Имя (кир.)"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Имя (лат.)"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.first_name.lotin"
                        :label="true"
                        :error="errors[0]"
                        placeholder="Имя (лат.)"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Отчество (кир.)"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.second_name.lotin"
                        :label="true"
                        :error="errors[0]"
                        placeholder="Отчество (кир.)"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Отчество (лат.)"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.second_name.kirill"
                        :label="true"
                        :error="errors[0]"
                        placeholder="Отчество (лат.)"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Номер телефона"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.phone"
                        type="tel"
                        :label="true"
                        :error="errors[0]"
                        mask="+### ## ### ## ##"
                        placeholder="Номер телефона"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Дополнительный номер телефона"
                      v-slot="{ errors }"
                  >
                    <base-input
                        v-model="client.other_phone"
                        type="tel"
                        :label="true"
                        mask="+### ## ### ## ##"
                        placeholder="Дополнительный номер телефона"
                        class="w-100"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Язык"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-select
                        v-model="client.contract_language"
                        :label="true"
                        :error="errors[0]"
                        :noPlaceholder="true"
                        :options="options"
                        placeholder="Язык"
                    />
                  </ValidationProvider>
                  <ValidationProvider
                      name="Тип клиента"
                      rules="required"
                      v-slot="{ errors }"
                  >
                    <base-select
                        v-model="client.friends"
                        :label="true"
                        :error="errors[0]"
                        :noPlaceholder="true"
                        :options="clientTypeOption"
                        placeholder="Тип клиента"
                    />
                  </ValidationProvider>
                </div>
              </section>
            </ValidationObserver>
          </div>
        </b-tab>
        <!--  END OF FIRST TAB    -->

        <!--   SECOND TAB   -->
        <b-tab :disabled="stepTwoDisable">
          <template #title>
            <div class="app-tab-title d-flex align-items-center">
              <span :class="flexCenter" class="app-tab-title-number">2</span>
              <p class="app-tab-title-content">Детали платежей</p>
            </div>
          </template>

          <div v-if="tabIndex===1" class="app-tab-content">
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

        <!--        TABS END -->
        <template #tabs-end>
          <b-nav-item role="presentation" href="#">
            <base-button @click="changeTab"
                         class="violet-gradient"
                         :text="$t('next')">
              <template #right-icon>
                <BaseArrowRightIcon fill="var(--white)"/>
              </template>
            </base-button>

          </b-nav-item>
        </template>

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
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseSelect from "@/components/Reusable/BaseSelect";
import BaseButton from "@/components/Reusable/BaseButton";
import ClientInformation from "@/views/Checkout/ClientInformation";
import ApartmentItem from "@/views/Checkout/ApartmentItem";
import Calculator from "@/components/Dashboard/Apartment/Contract/Calculator";
import {mapActions, mapGetters} from "vuex";
import api from "@/services/api";

export default {
  name: "Checkout",
  components: {
    Calculator,
    ApartmentItem,
    ClientInformation,
    AppHeader,
    BaseInput,
    BaseSelect,
    BaseButton,
    BaseEditIcon,
    BaseRightIcon,
    BaseDatePicker,
    OutputInformation,
    BaseCircleWrapper,
    BaseArrowRightIcon
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
          lotin: '',
          kirill: ''
        },
        first_name: {
          lotin: '',
          kirill: ''
        },
        second_name: {
          lotin: '',
          kirill: ''
        },
        phone_number: '',
        second_phone_number: '',
        contract_language: '',
        client_type: '',
        friends: false,
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
        friends: false,
        birth_day: null,
        phone: null,
        other_phone: null,
        first_payment_date: null,
        payment_date: null,
      },
      clientTypeOption: [
        {text: 'Незнакомый', value: false},
        {text: 'Знакомый', value: true},
      ],
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
      stepTwoDisable: true,
    }
  },
  watch: {
    // tabIndex(value) {
    //   if (value) {
    //
    //   }
    // },
  },
  computed: {
    ...mapGetters([
      "getApartmentOrder",
    ]),
    flexCenter() {
      return 'd-flex justify-content-center align-items-center'
    },
  },
  created() {
    this.$refs['form-validation'].validate()
    // this.$route.params.id = '2440b41-db43-46a5-b673-c4ef84e90ed8'
    const apartments = ['9450d1fc-a2f3-43c6-ba11-770c5a903738']
    api.orders.holdOrder(apartments)
        .then((response) => {
          if (response?.data) {
            this.$route.params.id = response.data.uuid
            console.log(response.data, 'response');
            // this.apartments = response.data.apartments
          }
        })
    this.$route.params.object = '3'
    // this.fetchApartmentOrder(this)
    // this.order = this.getApartmentOrder()
  },
  mounted() {
    this.getClientData()
  },
  methods: {
    ...mapActions(["fetchApartmentOrder"]),
    changeTab() {
      if (this.tabIndex === 0) {
        this.stepTwoDisable = false
        setTimeout(() => {
          this.tabIndex = 1
        }, 100)
      }
    },
    async getClientData() {
      const uuid = 'ef77be1c-cbd8-4b69-bc71-ce13456d3b61'
      await api.contractV2.getUpdateContractView(uuid).then((res) => {
        this.apartments = res.data.apartments
        this.client = res.data.client
        console.log(res.data.client, 'res.data.client');
      })
    }
  },
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
    height: 56px;

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

      &:last-child {
        width: 100%;

        .nav-link {
          display: flex;
          justify-content: flex-end;
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
  margin-left: 1rem;
}

.row-gap-1 {
  row-gap: 1rem;
}

</style>