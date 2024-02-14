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
                {{ $t("Договор") }}
                <span>{{ order.contract }}</span>
              </div>
              <span class="head"> Оформить доп соглашение </span>
            </div>
          </div>
        </div>
      </template>
    </AppHeader>
    <div class="d-flex justify-content-end">
      <base-button
        :loading="isLoading"
        :text="'Оформить'"
        class="violet-gradient"
        @click="createSubOrder"
      >
      </base-button>
    </div>
    <ValidationObserver ref="validation-observer">
      <!-- DATE && NUMBER -->
      <div class="row">
        <div class="col-8">
          <div class="row">
            <div class="col-6">
              <ValidationProvider
                class="mt-4"
                rules="required"
                v-slot="{ errors }"
              >
                <base-date-picker
                  v-model="subContractDate"
                  :range="false"
                  class="data-picker"
                  :class="{ warning__border: errors[0] }"
                  format="DD.MM.YYYY"
                  :placeholder="'Дата соглашения'"
                  icon-fill="var(--violet-600)"
                />
              </ValidationProvider>
            </div>
            <div class="col-6 d-flex">
              <div class="input-left">
                <x-form-input
                  style="width: 100%"
                  v-model="order.contract"
                  :label="true"
                  type="text"
                  placeholder="Контракт"
                  readonly
                />
              </div>
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                class="input-right"
              >
                <x-form-input
                  class="w-100"
                  :class="{ warning__border: errors[0] }"
                  v-model="subContractNumber"
                  :label="true"
                  type="text"
                  placeholder="Номер доп соглашения"
                />
              </ValidationProvider>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-8">
          <div class="row">
            <div class="col-6">
              <x-form-input
                class="w-100"
                :value="subContractType"
                :label="true"
                type="text"
                readonly
                placeholder="Тип"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- CLIENT INFO -->
      <div v-if="showClientInfo">
        <div class="row mt-4">
          <div class="col client-label">Информация и клиенте</div>
        </div>
        <div class="row mt-4">
          <div class="col-8">
            <div class="row">
              <div class="col-6">
                <ValidationProvider
                  rules="required"
                  v-slot="{ errors }"
                  class="w-100"
                >
                  <x-form-input
                    :class="{ warning__border: errors[0] }"
                    v-model="cardNumber"
                    :label="true"
                    class="w-100"
                    type="text"
                    placeholder="Номер карты"
                  />
                </ValidationProvider>
              </div>
              <div class="col-6">
                <ValidationProvider
                  rules="required"
                  v-slot="{ errors }"
                  class="w-100"
                >
                  <x-form-input
                    :class="{ warning__border: errors[0] }"
                    v-model="bank"
                    :label="true"
                    class="w-100"
                    type="text"
                    placeholder="Адрес банка"
                  />
                </ValidationProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4" style="min-height: 57px" v-if="showPrice">
        <div class="col-8">
          <div class="row">
            <div class="col-6" v-if="showPrice">
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                class="w-100"
              >
                <base-price-input
                  class="discount-per-m2"
                  :class="{
                    warning__border: errors[0],
                  }"
                  :label="true"
                  :currency="`${$t('ye')}`"
                  :placeholder="'Цена за м2, ' + $t('ye')"
                  top-placeholder
                  v-model="m2_price"
                  :permission-change="true"
                  @input="updateFullPrice"
                />
              </ValidationProvider>
            </div>
            <div class="col-6" v-if="showFullPrice">
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                class="w-100"
              >
                <base-price-input
                  :class="{ warning__border: errors[0] }"
                  class="discount-per-m2"
                  :label="true"
                  :currency="`${$t('ye')}`"
                  :placeholder="'Полная цена, ' + $t('ye')"
                  top-placeholder
                  v-model="fullPrice"
                  :permission-change="true"
                  @input="updateMPrice"
                />
              </ValidationProvider>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col client-label">{{ $t("hello8") }}</div>
      </div>
      <div class="row mt-4">
        <div class="col client-label">Список квартир</div>
      </div>
      <div class="row mt-4 flex-wrap" v-if="apartments">
        <div class="col-4" v-for="a in apartments" :key="a.id">
          <apartment-card
            style="width: 100%"
            title="Квартиры"
            :floor="a.apartment.floor"
            :number="a.apartment.number"
            :rooms="a.apartment.rooms"
            :entrance="a.entrance"
            :type="$route.params.type"
            :block="a.block.name"
            :area="a.apartment.plan.area"
            :balcony="a.apartment.plan.balcony_area"
            :object="a.object.id"
            @apartment-changed="(e) => setNewApartment(a, e)"
            @area-changed="(e) => setNewArea(a, e)"
          >
          </apartment-card>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-8">
          <div class="row">
            <div class="col-6" v-if="showStartDate">
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                class="w-100"
              >
                <base-date-picker
                  :class="{ warning__border: errors[0] }"
                  v-model="paymentStart"
                  :range="false"
                  class="data-picker"
                  format="DD.MM.YYYY"
                  placeholder="Дата начала рассрочки"
                  icon-fill="var(--violet-600)"
                />
              </ValidationProvider>
            </div>
            <div class="col-6" v-if="showEndDate">
              <ValidationProvider
                rules="required"
                v-slot="{ errors }"
                class="w-100"
              >
                <base-date-picker
                  :class="{ warning__border: errors[0] }"
                  v-model="paymentEnd"
                  :range="false"
                  class="data-picker"
                  format="DD.MM.YYYY"
                  placeholder="Дата окончания рассрочки"
                  icon-fill="var(--violet-600)"
                />
              </ValidationProvider>
            </div>
          </div>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch, onMounted } from "vue";
import { v3ServiceApi } from "@/services/v3/v3.service";
import api from "@/services/api";
import AppHeader from "@/components/Header/AppHeader";
import BaseArrowRight from "@/components/icons/BaseArrowRightIcon";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";
import BaseButton from "@/components/Reusable/BaseButton";
import { XFormInput } from "@/components/ui-components/form-input";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import ApartmentCard from "@/views/contracts/subContract/Card";
import BasePriceInput from "@/views/contracts/subContract/BasePriceInput";

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
    const isLoading = ref(false);
    const options = ref({});
    const subContractType = computed(() => {
      return options.value[vm.$route.params.type];
    });
    v3ServiceApi.subOrder.getOptions().then((r) => {
      const d = r.data;
      const res = {};
      Object.keys(d).forEach((el) => {
        res[el] = d[el].name[vm.$i18n.locale];
      });
      options.value = res;
      console.log(res);
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

    const apartments = ref(null);
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
      api.contractV2.getContractObjectDetails(id, "apartments").then(
        (r) =>
          (apartments.value = r.data.map((e) => ({
            ...e,
            newApartment: null,
            areaChange: 0,
          })))
      );
    });
    function setNewApartment(apartment, newA) {
      apartment.newApartment = newA;
    }
    function setNewArea(apartment, areaChange) {
      apartment.areaChange = areaChange;
      fullPrice.value = m2_price.value = 0;
    }
    function updateFullPrice() {
      const fullM = apartments.value
        .map((el) => el.areaChange)
        .reduce((a, b) => a + b, 0);
      if (!fullM) return;
      fullPrice.value = fullM * m2_price.value;
    }
    function updateMPrice() {
      const fullM = apartments.value
        .map((el) => el.areaChange)
        .reduce((a, b) => a + b, 0);
      if (!fullM) return;
      m2_price.value = fullPrice.value / fullM;
    }
    async function createSubOrder() {
      if (isLoading.value) return;
      const v = await vm.$refs["validation-observer"].validate();
      if (!v) return;

      let d = new FormData();
      const type = vm.$route.params.type;
      d.append("type", type);
      d.append("change_date", subContractDate.value);
      d.append("contract_number", subContractNumber.value);
      d.append("order_uuid", order.value.id);
      d.append("category", "additional");

      // SWAP
      if (type === "swap") {
        const aparts = apartments.value
          .filter((el) => el.newApartment)
          .map((el) => ({
            uuid: el.id,
            new_uuid: el.newApartment.uuid,
          }));
        if (aparts.length === 0) {
          return vm.toasted("No changes in order", "error");
        }

        for (let i in aparts) {
          console.log(aparts[i]);
          d.append(`apartments[${i}][uuid]`, aparts[i].uuid);
          d.append(`apartments[${i}][new_uuid]`, aparts[i].new_uuid);
        }
      }
      // ADD
      else if (type === "add") {
        const fullM = apartments.value
          .map((el) => el.areaChange)
          .reduce((a, b) => a + b, 0);
        if (fullM === 0) return vm.toasted("No area changes!", "error");
        const aparts = apartments.value
          .filter((el) => el.areaChange)
          .map((el) => ({
            uuid: el.id,
            area: el.areaChange,
          }));
        d.append("start_date", paymentStart.value);
        d.append("end_date", paymentEnd.value);
        d.append("price", m2_price.value);
        for (let i in aparts) {
          console.log(aparts[i]);
          d.append(`apartments[${i}][uuid]`, aparts[i].uuid);
          d.append(`apartments[${i}][area]`, aparts[i].area);
        }
      }
      // SUBTRACT
      else if (type === "subtract") {
        const fullM = apartments.value
          .map((el) => el.areaChange)
          .reduce((a, b) => a + b, 0);
        if (fullM === 0) return vm.toasted("No area changes!", "error");
        const aparts = apartments.value
          .filter((el) => el.areaChange)
          .map((el) => ({
            uuid: el.id,
            area: el.areaChange,
          }));
        d.append("end_date", paymentEnd.value);
        d.append("payment_due", paymentEnd.value);

        d.append("price", m2_price.value);
        for (let i in aparts) {
          console.log(aparts[i]);
          d.append(`apartments[${i}][uuid]`, aparts[i].uuid);
          d.append(`apartments[${i}][area]`, 0 - aparts[i].area);
        }
        d.append("card_number", cardNumber.value);
        d.append("bank_address", bank.value);
      }
      isLoading.value = true;
      v3ServiceApi.subOrder
        .create(d)
        .then(() => {
          vm.toasted("Доп. соглашение создано", "success");
          vm.$router.push({
            name: "contracts-view",
            params: { id: vm.$route.params.id },
          });
        })
        .catch((e) => vm.toastedWithErrorCode(e))
        .finally(() => (isLoading.value = false));
    }
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

      apartments,
      showPrice,
      showFullPrice,
      showStartDate,
      showEndDate,
      showClientInfo,
      cardNumber,
      bank,

      setNewApartment,
      setNewArea,
      createSubOrder,
      updateFullPrice,
      updateMPrice,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
// .apartments {
//   gap: 20px;
// }
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
  width: 150px;
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
  width: 100%;
  border: none;
  padding: 12px 22px;
}
.warning__border {
  border: 1px solid var(--red-600) !important;
}
.data-picker {
  border-radius: 2rem;
}

.client-label {
  font-weight: 600;
  font-size: 24px;
  color: #4b5563;
}
</style>