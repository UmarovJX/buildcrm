<script>
import { formatDateWithDot, formatToPrice } from '@/util/reusable'
import BaseButton from '@/components/Reusable/BaseButton'
import BaseEditIcon from '@/components/icons/BaseEditIcon'
import BasePlusIcon from '@/components/icons/BasePlusIcon'
import BaseDeleteIcon from '@/components/icons/BaseDeleteIcon'
import BaseModal from '@/components/Reusable/BaseModal'
import BaseCloseIcon from '@/components/icons/BaseCloseIcon'
import BaseDatePicker from '@/components/Reusable/BaseDatePicker'
import BasePriceInput from '@/components/Reusable/BasePriceInput'
import { mapActions, mapGetters } from 'vuex'
import { dateProperties } from '@/util/calendar'

export default {
  name: 'PaymentMonths',
  components: {
    BaseDeleteIcon,
    BasePlusIcon,
    BaseButton,
    BaseEditIcon,
    BaseModal,
    BaseCloseIcon,
    BaseDatePicker,
    BasePriceInput,
  },
  props: {
    datePickerIconFill: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      editContext: {
        month: null,
        amount: null,
        tracker: {},
      },
    }
  },
  computed: {
    ...mapGetters('checkout', {
      initialPayments: 'getInitialPayments',
      creditMonths: 'getCreditMonths',
    }),
    paymentsSchedule() {
      return [...this.initialPayments, ...this.creditMonths]
    },
    fields() {
      return [
        {
          key: 'month',
          label: this.$t('date'),
        },
        {
          key: 'type',
          label: this.$t('type'),
        },
        {
          key: 'amount',
          label: this.$t('sum'),
          formatter: value => formatToPrice(value, 2),
        },
        {
          key: 'actions',
          label: this.$t('companies.actions'),
        },
      ]
    },
  },
  methods: {
    ...mapActions('checkout', {
      addNewPaymentSchedule: 'addNewPaymentSchedule',
      editPaymentSchedule: 'editPaymentSchedule',
      deletePaymentSchedule: 'deletePaymentSchedule',
    }),
    formatDate: formatDateWithDot,
    editSelectedPayment(payment) {
      const { ymd } = dateProperties(payment.month, 'string')
      this.editContext = {
        ...payment,
        month: ymd,
      }
      this.editContext.tracker = payment
      this.openEditModal()
    },
    openEditModal() {
      this.$refs['edit-payment-schedule'].openModal()
    },
    closeEditModal() {
      this.$refs['edit-payment-schedule'].closeModal()
    },
    addPayment(payment) {
      this.addNewPaymentSchedule(payment)
    },
    deletePayment(payment) {
      this.deletePaymentSchedule(payment)
    },
    editPayment() {
      const { time } = dateProperties(this.editContext.month, 'string')
      this.editPaymentSchedule({
        ...this.editContext,
        month: time,
      })
      this.closeEditModal()
    },
  },
}
</script>

<template>
  <div class="payments-list">
    <b-table
      sticky-header
      borderless
      responsive
      show-empty
      class="table__list font-inter"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border"
      :fields="fields"
      :items="paymentsSchedule"
      :empty-text="$t('no_data')"
    >
      <template
        #head(name)="data"
        class="header_label"
      >
        <span>
          {{ data.label }}
        </span>
      </template>

      <template #cell(type)="{ item }">
        <span v-if="item.type === 'monthly'">
          {{ $t("monthly_payment") }}
        </span>
        <span v-else>
          {{ $t("payments.initial_fee") }}
        </span>
      </template>

      <template #cell(month)="data">
        {{ formatDate(data.item.month) }}
      </template>

      <template #cell(edit)="data">
        {{ data.item.edit }}
      </template>

      <!--            <template #cell(amount)="data">-->
      <!--                {{ data.item.amount }}-->
      <!--            </template>-->

      <!--   ACTION   -->
      <template #cell(actions)="data">
        <div class="action-buttons">
          <BaseButton
            v-if="parseInt(data.index) > 0"
            text=""
            class="violet rounded-circle"
            @click="editSelectedPayment(data.item)"
          >
            <template #right-icon>
              <BaseEditIcon fill="var(--white)" />
            </template>
          </BaseButton>
          <BaseButton
            v-if="parseInt(data.index) > 0"
            text=""
            class="red rounded-circle"
            @click="deletePayment(data.item)"
          >
            <template #right-icon>
              <BaseDeleteIcon fill="var(--white)" />
            </template>
          </BaseButton>
          <BaseButton
            text=""
            class="green rounded-circle"
            @click="addPayment(data.item)"
          >
            <template #right-icon>
              <BasePlusIcon fill="var(--white)" />
            </template>
          </BaseButton>
        </div>
      </template>
    </b-table>
    <base-modal
      ref="edit-payment-schedule"
      design="auto-height"
    >
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <!--    TITLE      -->
          <p class="title">
            {{ $t("apartments.agree.number") }}
          </p>
          <!--   CLOSE    -->
          <p
            class="close-btn"
            @click="closeEditModal"
          >
            <BaseCloseIcon
              :width="56"
              :height="56"
            />
          </p>
        </div>
      </template>

      <template #main>
        <div class="main-wrapper">
          <base-date-picker
            v-model="editContext.month"
            :range="false"
            class="w-100"
            format="DD.MM.YYYY"
            :icon-fill="datePickerIconFill"
            :placeholder="`${$t('apartments.agree.first_payment_date')}`"
          />
          <base-price-input
            v-model="editContext.amount"
            :value="editContext.amount"
            :label="true"
            :permission-change="true"
            :top-placeholder="true"
            input-class="input-amount"
            :input-style="{ padding: 0 }"
            :currency="`${$t('ye')}`"
            :placeholder="$t('sum')"
            class="modal-price-input w-100"
          />
        </div>
      </template>
      <template #footer>
        <base-button
          :fixed="true"
          :text="`${$t('apply')}`"
          @click="editPayment"
        />
      </template>
    </base-modal>
  </div>
</template>

<style lang="scss" scoped>
.payments-list {
  margin-bottom: 3rem;
}

::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .table__list {
  min-height: 250px;
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.125rem 1rem;
      vertical-align: middle;
    }

    td {
      font-family: Inter, sans-serif;
      cursor: pointer;
      vertical-align: middle;
      padding: 21px 16px;
      font-size: 1rem;
      line-height: 22px;
      font-weight: 600;
      color: var(--gray-600);
    }
  }

  .table.b-table[aria-busy="true"] {
    opacity: 1 !important;
  }
}

::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 2) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort="ascending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="ascending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort="descending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  column-gap: 1rem;

  .base__button {
    width: 32px;
    height: 32px;
    padding: 0.25rem !important;

    ::v-deep .right__icon {
      margin: 0 !important;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
}

::v-deep .modal-content .main .modal-price-input .price-input {
  padding: 0 !important;
}

.modal-price-input {
  height: 56px;
  display: flex;
  min-width: 229.5px;
  border-radius: 32px;
  flex-direction: column;
  background-color: var(--gray-100);
  padding-left: 20px;
}

.main-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 2rem;
}

.close-btn {
  cursor: pointer;
}
</style>
