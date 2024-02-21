<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDotsIcon from "@/components/icons/BaseDotsIcon";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import { v3ServiceApi } from "@/services/v3/v3.service";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import ContractsPermission from "@/permission/contract";
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";
import { isObject } from "@/util/inspect";
import { hasOwnProperty } from "@/util/object";
import { formatToPrice, getDateProperty } from "@/util/reusable";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import BaseLoading from "@/components/Reusable/BaseLoading";
import { XFormInput } from "@/components/ui-components/form-input";
import BasePriceInput from "@/views/contracts/subContract/BasePriceInput";

export default {
  name: "SubContracts",
  components: {
    XCircularBackground,
    XIcon,
    AppDropdown,
    BaseDeleteIcon,
    BaseButton,
    BasePlusIcon,
    BaseDotsIcon,
    BaseEditIcon,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseDownIcon,
    BaseCloseIcon,
    BaseModal,
    BaseLoading,
    XFormInput,
    BasePriceInput,
  },

  data() {
    const showByOptions = [];

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number,
      });
    }
    const fields = [
      {
        key: "contract_number",
        label: "Номер",
      },
      {
        key: "edit_type",
        label: "Тип",
      },
      {
        key: "contract_date",
        label: "Дата",
        formatter: (datePayment) => {
          const { year, month, day } = getDateProperty(
            datePayment.split("T")[0]
          );
          /* const lastYear = year.toString().slice(-2) */
          return `${day}.${month}.${year}`;
        },
      },
      {
        key: "actions",
        label: "",
      },
    ];

    return {
      fields,
      subContracts: null,
      isLoading: true,
      loading: false,
      current: null,
    };
  },
  computed: {
    apartments() {
      if (!this.current) return [];
      return this.current.apartments;
    },
    currentTypeName() {
      if (!this.current) return "";
      return this.current.edit_type.name[this.$i18n.locale];
    },
    currentType() {
      if (!this.current) return "";
      return this.current.edit_type.type;
    },
    currentDiscount() {
      if (!this.current) return "";
      return "Предоплата " + this.current.extra_data.discount.prepay_to + "%";
    },
    currentDiscountAmount() {
      if (!this.current) return "";
      return formatToPrice(this.current.extra_data.discount_amount);
    },
    currentDate() {
      if (!this.current) return "";
      const { year, month, day } = getDateProperty(
        this.current.contract_date.split("T")[0]
      );
      return `${day}.${month}.${year}`;
    },
    currentStartDate() {
      if (!this.current) return "";
      const { year, month, day } = getDateProperty(
        this.current.extra_data.start_date.split("T")[0]
      );
      return `${day}.${month}.${year}`;
    },
    currentEndDate() {
      if (!this.current) return "";
      const { year, month, day } = getDateProperty(
        this.current.extra_data.end_date.split("T")[0]
      );
      return `${day}.${month}.${year}`;
    },
    currentInitialPaymentDate() {
      if (!this.current) return "";
      const { year, month, day } = getDateProperty(
        this.current.extra_data.initial_payment_date.split("T")[0]
      );
      return `${day}.${month}.${year}`;
    },
    currentm2() {
      if (!this.current) return "";
      return formatToPrice(this.current.per_square_price);
    },
    currentTransaction() {
      if (!this.current) return "";
      return formatToPrice(this.current.transaction_price);
    },
    card() {
      if (!this.current) return "";
      return this.current.extra_data.card_number;
    },
    bank() {
      if (!this.current) return "";
      return this.current.extra_data.bank_address;
    },
    paymentDue() {
      if (!this.current) return "";
      const { year, month, day } = getDateProperty(
        this.current.extra_data.payment_due
      );
      return `${day}.${month}.${year}`;
    },
  },
  async mounted() {
    this.getSubContracts();
  },
  methods: {
    openModal(item) {
      this.$refs["detail-modal"].openModal();
    },
    closeModal() {
      this.$refs["detail-modal"].closeModal();
    },
    viewDetails(item) {
      this.loading = true;
      this.openModal();
      const d = new FormData();
      d.append("uuid", item.id);
      v3ServiceApi.subOrder
        .view(d)
        .then((res) => {
          this.current = res.data.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getSubContracts() {
      this.isLoading = true;
      const id = this.$route.params.id;
      const d = new FormData();
      d.append("uuid", id);
      v3ServiceApi.subOrder
        .getAll(d)
        .then((res) => {
          this.subContracts = res.data.result;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<template>
  <div class="main">
    <!--  TABLE PAYMENTS LIST -->
    <div>
      <h3 class="title mt-4">Доп.соглашения к контракту</h3>
      <div class="addition__button" />
    </div>
    <b-table
      :items="subContracts"
      :fields="fields"
      class="table__list mt-4 border-bottom"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border"
      show-empty
      sticky-header
      responsive
      :busy="isLoading"
    >
      <!--    CELL OF COMMENT      -->
      <template #cell(edit_type)="{ item }">
        <span>{{ item.edit_type?.name?.[$i18n.locale] }}</span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="d-flex x-gap-1">
          <x-circular-background
            class="bg-violet-600 cursor-pointer"
            @click="viewDetails(item)"
          >
            <x-icon name="visibility" class="color-white" />
          </x-circular-background>
        </div>
      </template>

      <!--   CONTENT WHEN EMPTY SCOPE       -->
      <template #empty="scope" class="text-center">
        <div
          class="d-flex justify-content-center align-items-center empty__scope"
        >
          {{ $t("no_data") }}
        </div>
      </template>
      <!--  Busy Animation    -->
      <template #table-busy>
        <base-loading />
      </template>
    </b-table>

    <base-modal ref="detail-modal" design="payment-modal">
      <template #header>
        <!--   GO BACK     -->
        <span class="d-flex align-items-center">
          <span class="go__back" @click="closeModal">
            <base-arrow-left-icon :width="32" :height="32" />
          </span>
          <!--    TITLE      -->
          <span class="title ml-3"
            >Детали доп.соглашения
            <span v-if="current">{{ current.contract_number }}</span>
          </span>
        </span>
      </template>
      <template #main>
        <base-loading v-if="loading" style="min-width: 506px"></base-loading>
        <div v-else>
          <div class="row">
            <div class="col-12 no-pointer">
              <x-form-input
                class="w-100"
                :value="currentTypeName"
                :label="true"
                type="text"
                placeholder="Тип доп.соглашения"
                readonly
              />
            </div>
            <div class="col-12 mt-2 no-pointer">
              <x-form-input
                class="w-100"
                :value="currentDate"
                :label="true"
                type="text"
                placeholder="Дата"
                readonly
              />
            </div>
          </div>
          <div v-if="currentType === 'add'">
            <div class="row mt-2">
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentm2"
                  :label="true"
                  type="text"
                  placeholder="Цена за м2"
                  readonly
                />
              </div>
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentTransaction"
                  :label="true"
                  type="text"
                  :placeholder="
                    currentType === 'kadastr' ? 'Скидка' : 'Полная сумма'
                  "
                  readonly
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentStartDate"
                  :label="true"
                  type="text"
                  placeholder="Начало рассрочки"
                  readonly
                />
              </div>
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentEndDate"
                  :label="true"
                  type="text"
                  placeholder="Конец рассрочки"
                  readonly
                />
              </div>
            </div>
          </div>

          <div v-if="currentType === 'subtract'">
            <div class="row mt-2">
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentm2"
                  :label="true"
                  type="text"
                  placeholder="Цена за м2"
                  readonly
                />
              </div>
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentTransaction"
                  :label="true"
                  type="text"
                  placeholder="Полная сумма"
                  readonly
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="card"
                  :label="true"
                  type="text"
                  placeholder="Номер карты"
                  readonly
                />
              </div>
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="bank"
                  :label="true"
                  type="text"
                  placeholder="Адрес банка"
                  readonly
                />
              </div>
            </div>
            <div class="row mt-2 no-pointer">
              <div class="col-6">
                <x-form-input
                  class="w-100"
                  :value="paymentDue"
                  :label="true"
                  type="text"
                  placeholder="Дата платежа"
                  readonly
                />
              </div>
            </div>
          </div>

          <div v-if="currentType === 'kadastr'">
            <div class="row mt-2">
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentm2"
                  :label="true"
                  type="text"
                  placeholder="Цена за м2"
                  readonly
                />
              </div>
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentTransaction"
                  :label="true"
                  type="text"
                  placeholder="Полная сумма"
                  readonly
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentDiscount"
                  :label="true"
                  type="text"
                  placeholder="Дискоунт"
                  readonly
                />
              </div>
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentDiscountAmount"
                  :label="true"
                  type="text"
                  placeholder="Сумма дискоунта"
                  readonly
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentStartDate"
                  :label="true"
                  type="text"
                  placeholder="Начало рассрочки"
                  readonly
                />
              </div>
              <div class="col-6 no-pointer">
                <x-form-input
                  class="w-100"
                  :value="currentEndDate"
                  :label="true"
                  type="text"
                  placeholder="Конец рассрочки"
                  readonly
                />
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <x-form-input
                  class="w-100"
                  :value="currentEndDate"
                  :label="true"
                  type="text"
                  placeholder="Первый платеж"
                  readonly
                />
              </div>
            </div>
          </div>

          <!-- Apartments -->
          <div class="section-title mt-4 mb-2">Квартиры</div>
          <div v-if="current">
            <div class="apartment" v-for="a of apartments" :key="a.old.id">
              <div class="d-flex justify-content-between">
                <div class="label">Номер</div>
                <div class="value">
                  {{ a.old.number }} --> {{ a.new.number }}
                </div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <div class="label">Этаж</div>
                <div class="value">{{ a.old.floor }} --> {{ a.new.floor }}</div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <div class="label">Блок</div>
                <div class="value">
                  {{ a.old.block.name }} --> {{ a.new.block.name }}
                </div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <div class="label">Комнаты</div>
                <div class="value">
                  {{ a.old.rooms }}
                </div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <div class="label">Площадь</div>
                <div class="value">{{ a.old.area }} --> {{ a.new.area }}m2</div>
              </div>
              <div class="d-flex justify-content-between mt-2">
                <div class="label">Площадь балкона</div>
                <div class="value">{{ a.old.balcony_area }} m2</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </base-modal>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../assets/scss/utils/pagination";
.no-pointer {
  pointer-events: none;
}
.section-title {
  color: var(--gray-600);
  font-size: 24px;
}
.apartment {
  font-family: Inter;
  border-radius: 32px;
  background-color: var(--gray-100);
  padding: 20px;
  margin-bottom: 10px;
  & .label {
    font-weight: 600;
    color: #9ca3af;
  }
  & .value {
    font-weight: 600;
    color: var(--gray-600);
  }
}
::v-deep .table__list {
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 600;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.25rem 1rem;
    }

    td {
      vertical-align: middle;
    }
  }

  .table.b-table[aria-busy="true"] {
    opacity: 1 !important;
  }
}

.title {
  font-family: CraftworkSans, serif;
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 28px;
  color: var(--gray-600);
}
</style>
