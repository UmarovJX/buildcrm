<template>
  <div v-if="order">
    <AppHeader>
      <template #header-breadcrumb>
        <div class="navigation__content justify-content-between">
          <div class="d-flex align-items-center">
            <div class="go__back" @click="backNavigation">
              <BaseArrowLeft :width="32" :height="32" />
            </div>
            <div class="breadcrumb__content">
              <div>
                {{ $t("Доп соглашение к договору") }}
                <BaseArrowRight :width="18" :height="18" />
                <span>{{ order.contract }}</span>
              </div>
              <span class="head">
                {{ subContractType }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>
    <div class="d-flex justify-content-end">
      <base-button :text="'Оформить'" class="violet-gradient"> </base-button>
    </div>

    <div class="mt-4">
      <div class="row">
        <div class="col-6">
          <base-date-picker
            v-model="subContractDate"
            :range="false"
            class="data-picker"
            format="DD.MM.YYYY"
            :placeholder="`${$t('passport_issue_date')}`"
            icon-fill="var(--violet-600)"
          />
        </div>
      </div>
    </div>
    <div class="mt-4">
      <div class="row">
        <div class="col-6 d-flex">
          <div class="input-left">
            <x-form-input
              v-model="order.contract"
              :label="true"
              type="text"
              placeholder="Контракт"
              readonly
            />
          </div>
          <div class="input-right">
            <x-form-input
              class="w-100"
              v-model="subContractNumber"
              :label="true"
              type="text"
              placeholder="Номер доп соглашения"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex mt-4 apartments">
      <apartment-card
        v-for="a in order.apartments"
        :key="a.id"
        title="Квартиры"
        :floor="a.floor"
        :number="a.number"
        :rooms="a.rooms"
        :entrance="a.entrance"
        apartment="2"
      ></apartment-card>
    </div>

    <div class="row mt-4" v-if="showPrice">
      <dov class="col-6">
        <!-- <base-price-input
          class="discount-per-m2"
          :label="true"
          :currency="`${$t('ye')}`"
          placeholder="Цена за м2"
          v-model="price_m2"
          :permission-change="true"
          @input="changeDiscount_price"
        /> -->

        <x-form-input
          v-model="m2_price"
          :label="true"
          class="w-100"
          type="text"
          placeholder="Цена за м2"
        />
      </dov>
    </div>

    <!-- CLIENT INFO -->
    <div class="row mt-4" v-if="showClientInfo">
      <div class="col">Информация и клиенте</div>
    </div>
    <div class="row mt-4" v-if="showClientInfo">
      <dov class="col-6">
        <x-form-input
          v-model="cardNumber"
          :label="true"
          class="w-100"
          type="text"
          placeholder="Номер карты"
        />
      </dov>
    </div>
    <div class="row mt-4" v-if="showClientInfo">
      <dov class="col-6">
        <x-form-input
          v-model="bank"
          :label="true"
          class="w-100"
          type="text"
          placeholder="Адрес банка"
        />
      </dov>
    </div>
    <!-- CLIENT INFO -->

    <div class="row mt-4" v-if="showStartDate">
      <dov class="col-6">
        <base-date-picker
          v-model="bank"
          :range="false"
          class="data-picker"
          format="DD.MM.YYYY"
          placeholder="Дата начала рассрочки"
          icon-fill="var(--violet-600)"
        />
      </dov>
    </div>
    <div class="row mt-4" v-if="showEndDate">
      <dov class="col-6">
        <base-date-picker
          v-model="paymentEnd"
          :range="false"
          class="data-picker"
          format="DD.MM.YYYY"
          placeholder="Дата окончания рассрочки"
          icon-fill="var(--violet-600)"
        />
      </dov>
    </div>
    <div class="row mt-4" v-if="showFullPrice">
      <dov class="col-6">
        <x-form-input
          v-model="fullPrice"
          :label="true"
          class="w-100"
          type="text"
          placeholder="Итоговая цена"
        />
      </dov>
    </div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch, onMounted } from "vue";
import api from "@/services/api";
import AppHeader from "@/components/Header/AppHeader";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import { XFormInput } from "@/components/ui-components/form-input";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import ApartmentCard from "@/views/contracts/subContract/Card";
import BasePriceInput from "@/components/Reusable/BasePriceInput";

export default {
  components: {
    AppHeader,
    BaseArrowRight,
    BaseArrowLeft,
    BaseButton,
    XFormInput,
    BaseDatePicker,
    ApartmentCard,
    BasePriceInput,
  },
  setup() {
    const vm = getCurrentInstance().proxy;
    const order = ref(null);
    const subContractDate = ref(new Date().toISOString().split("T")[0]);
    const subContractNumber = ref("");
    const subContractType = computed(() => {
      const type = vm.$route.params.type;
      return {
        add: "Увеличить квадратуру",
        subtract: "Возврат",
        swap: "Поменять квартиру",
      }[type];
    });
    const showPrice = computed(() => vm.$route.params.type !== "swap");
    const showFullPrice = computed(() => vm.$route.params.type === "add");
    const showEndDate = computed(() => vm.$route.params.type !== "swap");
    const showStartDate = computed(() => vm.$route.params.type === "add");
    const showClientInfo = computed(() => vm.$route.params.type === "subtract");

    const m2_price = ref(null);
    const paymentStart = ref(null);
    const paymentEnd = ref(null);
    const fullPrice = ref(null);
    const cardNumber = ref(null);
    const bank = ref(null);

    function backNavigation() {
      vm.$router.back();
    }

    onMounted(() => {
      const { id } = vm.$route.params;
      api.contractV2
        .fetchContractView(id)
        .then((response) => {
          vm.order = response.data;
        })
        .catch((error) => {
          vm.toastedWithErrorCode(error);
        });
    });

    return {
      order,
      subContractType,
      subContractDate,
      subContractNumber,
      backNavigation,
      m2_price,
      fullPrice,
      paymentStart,
      paymentEnd,

      showPrice,
      showFullPrice,
      showStartDate,
      showEndDate,
      showClientInfo,
      cardNumber,
      bank,
    };
  },
};
</script>

<style lang="scss" scoped>
.apartments {
  gap: 20px;
}
.navigation__content {
  display: flex;
  align-items: center;
  //margin-bottom: 52px;

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9ca3af;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4b5563;

    .contract__number {
      color: var(--violet-600);
    }
  }
}
.input-left {
  background-color: var(--gray-100);
  border-top-left-radius: 100%;
  border-bottom-left-radius: 100%;
  border-right: 2px var(--gray-300) solid;
  width: 200px;
  &:focus-within,
  &:hover {
    background-color: var(--gray-200);
  }
}
.input-right {
  background-color: var(--gray-100);
  border-top-right-radius: 100%;
  border-bottom-right-radius: 100%;
  flex-grow: 1;
  &:focus-within,
  &:hover {
    background-color: var(--gray-200);
  }
}
.discount-per-m2 {
  border-radius: 2rem;
  background-color: var(--gray-100);
  margin-top: 1.5rem;
  width: 100%;
  border: none;
  padding: 0.75rem 1.25rem;
}
</style>