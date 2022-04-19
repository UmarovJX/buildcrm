<template>
  <div>
    <!--  CURRENCY CHART  -->
    <div class="cards">
      <currency-chart
          class="currency__chart"
          v-for="(context) in currencyList"
          :key="context.title"
          :context="context"
      ></currency-chart>
    </div>

    <!--  PAYMENTS HISTORY  -->
    <div class="payments__history">
      <!--  HEADING    -->
      <div class="heading">
        <h3 class="title">Список оплат</h3>
        <div class="d-flex">
          <base-button
              v-if="paidPermission"
              @click="openPaymentsImportModal"
              text="Импорт оплат"
              design="import__button"
          >
            <template #left-icon>
              <span class="mr-3">
                <base-arrow-down-icon :width="20" :height="20" fill="#7C3AED"/>
              </span>
            </template>
          </base-button>
          <base-button
              v-if="uploadFilePermission"
              @click="openPaymentAdditionModal"
              text="Добавить оплату"
              design="add__button"
          >
            <template #left-icon>
              <span class="mr-3">
                <base-plus-icon :width="20" :height="20" fill="#ffffff"/>
              </span>
            </template>
          </base-button>
        </div>
      </div>

      <!--   PAYMENT ADDITION MODAL   -->
      <base-modal ref="payment-addition-modal">
        <template #header>
          <!--   GO BACK     -->
          <span class="d-flex align-items-center">
            <span class="go__back" @click="closePaymentAdditionModal">
              <base-arrow-left-icon :width="32" :height="32"></base-arrow-left-icon>
            </span>
            <!--    TITLE      -->
            <span class="title">Добавить оплату</span>
        </span>
        </template>

        <template #main>
          <ValidationObserver ref="payment-observer">
            <div class="d-flex justify-content-between mb-3">
              <ValidationProvider
                  name="payment_date"
                  rules="required"
                  class="w-50 mr-3 content__form__select"
                  :class="{'warning__border':validationWarnings.payment_date}"
              >
                <input type="date" v-model="appendPayment.payment_date" class="w-100"/>
              </ValidationProvider>
              <ValidationProvider
                  name="type"
                  rules="required"
                  class="content__form__select"
                  :class="{'warning__border':validationWarnings.type}"
              >
                <b-form-select
                    v-model="appendPayment.type"
                    class="form__select"
                    :options="paymentTypeOptionsForCreate"
                >
                  <template #first>
                    <b-form-select-option
                        :value="null"
                        disabled
                    >
                  <span class="disabled__option">
                    Тип
                  </span>
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </ValidationProvider>
            </div>
            <div class="d-flex justify-content-between mb-3">
              <ValidationProvider
                  name="amount"
                  rules="required|min:2"
                  class="w-50 mr-3 content__form__select"
                  :class="{'warning__border':validationWarnings.amount}"
              >
                <base-numeric-input
                    v-model="appendPayment.amount"
                    :currency="`${$t('ye')}`"
                    :minus="false"
                    currency-symbol-position="suffix"
                    separator="space"
                    placeholder="Сумма"
                    class="w-100"
                ></base-numeric-input>
              </ValidationProvider>
              <ValidationProvider
                  name="payment_type"
                  rules="required"
                  class="content__form__select"
                  :class="{'warning__border':validationWarnings.payment_type}"
              >
                <b-form-select
                    v-model="appendPayment.payment_type"
                    class="form__select"
                    :options="paymentMethodOptions"
                >
                  <template #first>
                    <b-form-select-option
                        :value="null"
                        disabled
                    >
                  <span class="disabled__option">
                    Способ
                  </span>
                    </b-form-select-option>
                  </template>
                </b-form-select>
              </ValidationProvider>
            </div>
            <input type="text" v-model="appendPayment.comment" placeholder="Комментарий" class="w-100">
          </ValidationObserver>
        </template>

        <template #footer>
          <b-overlay
              :show="buttonLoading"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block w-100"
          >
            <base-button text="Добавить" @click="submitNewPayment" class="w-100 add__button"/>
          </b-overlay>
        </template>
      </base-modal>

      <!--   MAIN    -->
      <div class="main">
        <!--  TABLE PAYMENTS LIST -->
        <b-table
            v-if="!paymentHistory.appLoading"
            :items="paymentHistory.items"
            :fields="paymentsField"
            class="table__list"
            :empty-text="$t('no_data')"
            thead-tr-class="row__head__bottom-border"
            tbody-tr-class="row__body__bottom-border"
            show-empty
            sticky-header
            borderless
            responsive
        >
          <!--    CELL OF COMMENT      -->
          <template #cell(comment)="{item}">
            <span v-if="item.comment">{{ item.comment }}</span>
            <span v-else class=""> - </span>
          </template>

          <!--     ACTIONS     -->
          <template #cell(actions)="{item}">
            <span class="actions">
              <!--     EDIT PAYMENT       -->
              <span
                  v-if="userInteraction(item.type)"
                  @click="editPaymentTransaction(item)"
                  class="edit__icon icon"
              >
                <base-edit-icon :width="18" :height="18" fill="#ffff"/>
              </span>
              <!--      DELETE PAYMENT        -->
              <span
                  v-if="userInteraction(item.type)"
                  class="delete__icon icon"
                  @click="warnBeforeDelete(item.id)"
              >
                <base-delete-icon :width="18" :height="18" fill="#ffff"/>
              </span>
            </span>
          </template>

          <!--   CONTENT WHEN EMPTY SCOPE       -->
          <template #empty="scope" class="text-center">
            <div class="d-flex justify-content-center align-items-center empty__scope">
              {{ $t('no_data') }}
            </div>
          </template>
        </b-table>

        <!--   PAYMENT PAGINATION     -->
        <div v-if="showPaymentsPagination" class="pagination__vue">
          <!--   Pagination   -->
          <vue-paginate
              :page-count="paymentHistory.pagination.total"
              :value="paymentHistory.pagination.current"
              :container-class="'container'"
              :page-class="'page-item'"
              :page-link-class="'page-link'"
              :next-class="'page-item'"
              :prev-class="'page-item'"
              :prev-link-class="'page-link'"
              :next-link-class="'page-link'"
              @change-page="swipePaymentsPage"
          >
            <template #next-content>
              <span class="d-flex align-items-center justify-content-center">
                <base-arrow-right-icon/>
              </span>
            </template>

            <template #prev-content>
              <span class="d-flex align-items-center justify-content-center">
                <base-arrow-left-icon/>
              </span>
            </template>
          </vue-paginate>

          <!--  Show By Select    -->
          <div class="show__by">
        <span class="show__by__content">
          <span class="description">{{ $t('contracts.show_by') }}:</span>
          <b-form-select
              @input="changePaymentsShowingLimit"
              v-model="paymentHistory.params.limit"
              :options="showByOptions"
          ></b-form-select>
          <span class="arrow__down">
            <base-down-icon/>
          </span>
        </span>
          </div>
        </div>

        <!--  PAYMENTS LOADING    -->
        <base-loading v-if="paymentHistory.appLoading"/>
      </div>

      <!--  WARNING BEFORE DELETE PAYMENT    -->
      <base-modal ref="warning-before-delete">
        <template #header>
          <span class="warning__before__delete-head">
            <span>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.4"
                      d="M51.3346 27.9996C51.3346 40.8889 40.8883 51.3329 28.0013 51.3329C15.1143 51.3329 4.66797 40.8889 4.66797 27.9996C4.66797 15.1149 15.1143 4.66626 28.0013 4.66626C40.8883 4.66626 51.3346 15.1149 51.3346 27.9996"
                      fill="#EF4444"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M30.3081 29.5574C30.3081 30.7612 29.2661 31.7427 27.988 31.7427C26.71 31.7427 25.668 30.7612 25.668 29.5574V18.5185C25.668 17.3148 26.71 16.3333 27.988 16.3333C29.2661 16.3333 30.3081 17.3148 30.3081 18.5185V29.5574ZM25.6811 37.4814C25.6811 36.2776 26.7178 35.2961 27.9879 35.2961C29.2951 35.2961 30.3345 36.2776 30.3345 37.4814C30.3345 38.6852 29.2951 39.6667 28.0144 39.6667C26.7284 39.6667 25.6811 38.6852 25.6811 37.4814Z"
                      fill="#EF4444"/>
              </svg>
            </span>
            <span class="title">Удалить оплату?</span>
          </span>
        </template>

        <template #main>
          <span class="warning__before__delete-main">
            Вы уверены, что хотите удалить оплату? Данное действие нельзя отменить.
          </span>
        </template>

        <template #footer>
          <div class="d-flex justify-content-between align-items-center warning__before__delete-footer">
            <base-button
                @click="cancelRemovingPayment"
                text="Нет, отменить"
            >
            </base-button>
            <base-button
                @click="deletePaymentTransaction(deletionPaymentId)"
                text="Да, удалить"
                class="add__button"
            >
            </base-button>
          </div>
        </template>
      </base-modal>
    </div>

    <!--  PAYMENT SCHEDULE  -->
    <div class="payment__schedule">
      <div>
        <h3 class="title">График оплаты</h3>
        <div class="addition__button"></div>
      </div>
      <!--   SCHEDULE TABLE   -->
      <b-table
          :fields="scheduleFields"
          :items="paymentSchedule.items"
          :bordered="false"
          :striped="false"
          thead-class="payment__schedule__thead"
          tbody-class="payment__schedule__tbody"
          class="payment__schedule-table"
          v-if="!paymentSchedule.appLoading"
      >
        <template #cell(status)="{item}">
          <span
              v-if="item.status === 'waiting'"
              class="payment__schedule-waiting payment__schedule-status"
          >
            {{ $t('waiting_to_payment') }}
          </span>
          <span
              v-else-if="item.status === 'paid'"
              class="payment__schedule-paid payment__schedule-status"
          >
            {{ $t('paid') }}
          </span>
          <span
              v-else-if="item.status === 'partially'"
              class="payment__schedule-partially payment__schedule-status"
          >
            {{ $t('partially') }}
          </span>
          <span
              v-else class="payment__schedule-uncertain payment__schedule-status"
          >
            {{ item.status }}
          </span>
        </template>
      </b-table>

      <!--  SCHEDULE PAGINATION    -->
      <div v-if="showSchedulePagination" class="pagination__vue">
        <!--   Pagination   -->
        <vue-paginate
            :page-count="paymentSchedule.pagination.total"
            :value="paymentSchedule.pagination.current"
            :container-class="'container'"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :next-class="'page-item'"
            :prev-class="'page-item'"
            :prev-link-class="'page-link'"
            :next-link-class="'page-link'"
            @change-page="swipeSchedulePage"
        >
          <template #next-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-right-icon/>
          </span>
          </template>

          <template #prev-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-left-icon/>
          </span>
          </template>
        </vue-paginate>

        <!--  Show By Select    -->
        <div class="show__by">
        <span class="show__by__content">
          <span class="description">{{ $t('contracts.show_by') }}:</span>
          <b-form-select
              @input="changeScheduleShowingLimit"
              v-model="paymentSchedule.params.limit"
              :options="showByOptions"
          ></b-form-select>
          <span class="arrow__down">
            <base-down-icon/>
          </span>
        </span>
        </div>
      </div>

      <!--  PAYMENT SCHEDULE LOADING    -->
      <base-loading v-if="paymentSchedule.appLoading"/>
    </div>

    <!--  IMPORT PAYMENTS MODAL  -->
    <import-payments-modal ref="import-payments" :contract="order"/>

    <!--  MODIFY PAYMENT TRANSACTION  -->
    <modify-payment-transaction
        ref="modify-payment-transaction"
        :payment-method-options="paymentMethodOptions"
        :payment-type-options="paymentTypeOptionsPermission"
        :toggle-modal="toggleModifyTransaction"
        :properties="modifyTransactionProperties"
        @hide-modal="modifyTransactionModalHide"
        @update-content="refreshDetails"
    />

    <!-- WARNING MODAL -->
    <base-modal
        design="small-modal"
        ref="initial-payment-warning"
    >
      <template #header>
        <span class="d-flex justify-content-center align-items-center">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4"
                d="M110 59.9991C110 87.6191 87.615 109.999 60 109.999C32.385 109.999 10 87.6191 10 59.9991C10 32.3891 32.385 9.99908 60 9.99908C87.615 9.99908 110 32.3891 110 59.9991Z"
                fill="#F87171"/>
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M64.9432 63.3374C64.9432 65.917 62.7102 68.0202 59.9716 68.0202C57.233 68.0202 55 65.917 55 63.3374V39.6828C55 37.1032 57.233 35 59.9716 35C62.7102 35 64.9432 37.1032 64.9432 39.6828V63.3374ZM55.0281 80.3174C55.0281 77.7379 57.2497 75.6347 59.9713 75.6347C62.7724 75.6347 64.9997 77.7379 64.9997 80.3174C64.9997 82.897 62.7724 85.0002 60.0281 85.0002C57.2724 85.0002 55.0281 82.897 55.0281 80.3174Z"
                fill="#F87171"/>
        </svg>
        </span>
      </template>

      <template #main>
        <h3 class="d-flex justify-content-center">{{ $t('contracts.warning') }}</h3>
        <p>
          {{ $t('contracts.warning_in_payment', {price: increasedPrice}) }}
        </p>
      </template>

      <template #footer>
        <div class="d-flex justify-content-end align-items-center">
          <b-overlay
              :show="initialPaymentLoading"
              rounded
              opacity="0.2"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block w-100 mr-3"
          >
            <base-button @click="payOnlyInitialPayment" text="Отменить" class="w-100"/>
          </b-overlay>
          <b-overlay
              :show="monthlyPaymentLoading"
              rounded
              opacity="0.6"
              spinner-small
              spinner-variant="primary"
              class="d-inline-block w-100"
          >
            <base-button @click="exchangeToMonthlyPayment" text="ОК" class="add__button w-100"/>
          </b-overlay>
        </div>
      </template>
    </base-modal>
  </div>
</template>
<script>
import {formatToPrice, getDateProperty} from "@/util/reusable";
import ModifyPaymentTransaction from "@/components/Contracts/view/ModifyPaymentTransaction";
import ImportPaymentsModal from "@/components/Contracts/view/ImportPaymentsModal";
import CurrencyChart from "@/components/Contracts/view/CurrencyChart";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseLoading from "@/components/Reusable/BaseLoading";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import api from "@/services/api";
import {mapGetters} from "vuex";

export default {
  name: "TabPaymentSchedule",
  components: {
    ModifyPaymentTransaction,
    ImportPaymentsModal,
    BaseNumericInput,
    BaseArrowRightIcon,
    BaseArrowDownIcon,
    BaseArrowLeftIcon,
    BaseDeleteIcon,
    BasePlusIcon,
    CurrencyChart,
    BaseEditIcon,
    BaseDownIcon,
    BaseLoading,
    BaseButton,
    BaseModal,
  },
  props: {
    order: {
      type: Object,
      required: true
    },
    hasConstructorOrder: {
      type: Boolean,
      required: true
    }
  },
  emits: ['start-loading', 'finish-loading', 'refresh-details'],
  data() {
    const paymentMethodOptions = [
      {
        value: 'cash',
        text: this.$t('cash')
      },
      {
        value: 'payme',
        text: this.$t('Payme')
      },
      {
        value: 'click',
        text: this.$t('Click')
      },
      {
        value: 'apelsin',
        text: this.$t('Apelsin')
      },
      {
        value: 'transfer',
        text: this.$t('contracts.transfer')
      },
      {
        value: 'other',
        text: this.$t('other')
      }
    ]

    const showByOptions = []

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number
      })
    }

    return {
      showByOptions,
      paymentMethodOptions,
      buttonLoading: false,
      appLoading: false,
      /* График оплаты */
      paymentSchedule: {
        items: [],
        pagination: {},
        params: {
          limit: 20,
          page: 1
        },
        appLoading: false
      },
      /* Список оплат */
      paymentHistory: {
        items: [],
        pagination: {},
        params: {
          limit: 20,
          page: 1
        },
        appLoading: false
      },
      appendPayment: {
        type: null,
        amount: null,
        payment_date: null,
        payment_type: null,
      },
      validationWarnings: {
        type: null,
        amount: null,
        payment_date: null,
        payment_type: null,
      },
      modifyTransactionProperties: {},
      toggleModifyTransaction: false,
      initialPaymentLoading: false,
      monthlyPaymentLoading: false,
      deletionPaymentId: null,
      warningForPayInitialPayment: {
        price: 0,
        overbalance: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      permission: 'getPermission'
    }),
    paidPermission() {
      return this.permission?.contracts?.paid
    },
    increasedPrice() {
      const {overbalance} = this.warningForPayInitialPayment
      return formatToPrice((overbalance / 100).toFixed(0))
    },
    paymentTypeOptionsPermission() {
      const listOption = []

      if (this.permission?.debtors?.first_payment?.edit) {
        listOption.push({
          value: 'initial_payment',
          text: this.$t('initial_payment')
        })
      }

      if (this.permission?.debtors?.monthly?.edit) {
        listOption.push({
          value: 'monthly',
          text: this.$t('monthly')
        })
      }

      return listOption
    },
    paymentTypeOptionsForCreate() {
      const remainedPriceInitialPayment = this.order?.payments?.initial_payment_remained
      if (!remainedPriceInitialPayment) {
        return this.paymentTypeOptionsPermission
            .filter(paymentOption => paymentOption.value !== 'initial_payment')
      }

      return this.paymentTypeOptionsPermission
    },
    uploadFilePermission() {
      const {debtors} = this.permission
      return debtors?.first_payment?.edit || debtors?.monthly?.edit
    },
    firstChart() {
      const {payments, currency} = this.order
      const currencyPrettier = formatToPrice(currency.toFixed(0))
      const bottom = `Курс: ${currencyPrettier} сум`
      return {
        index: 0,
        title: 'Сумма договора',
        price: formatToPrice(payments.transaction_price?.toFixed(0)),
        bottom,
        progress: 0
      }
    },
    secondChart() {
      const {initial_payment, initial_payment_remained, initial_payment_percent} = this.order.payments
      return {
        index: 1,
        title: 'Первоначальный взнос',
        price: formatToPrice(initial_payment),
        bottom: `Остаток: ${formatToPrice(initial_payment_remained)} сум`,
        progress: initial_payment_percent
      }
    },
    thirdChart() {
      const {
        installment_price,
        monthly_payments_count,
        installment_price_remained,
        installment_price_remained_percent
      } = this.order.payments
      return {
        index: 2,
        title: `Рассрочка (${monthly_payments_count} месяцев)`,
        price: formatToPrice(installment_price),
        bottom: `Остаток: ${formatToPrice(installment_price_remained)} сум`,
        progress: installment_price_remained_percent
      }
    },
    currencyList() {
      if (this.hasConstructorOrder) {
        return [this.firstChart, this.secondChart, this.thirdChart]
      }
      return []
    },
    scheduleFields() {
      return [
        {
          key: 'date_payment',
          label: 'Расписание',
          formatter: (datePayment) => {
            const {year, month, day} = getDateProperty(datePayment)
            /*const lastYear = year.toString().slice(-2)*/
            return `${day}.${month}.${year}`
          }
        },
        {
          key: 'amount',
          label: 'Сумма',
          formatter: (amount) => (formatToPrice(amount) + ' ' + this.$t('ye'))
        },
        {
          key: 'type',
          label: 'Тип',
          formatter: (type) => this.$t(type)
        },
        {
          key: 'balance',
          label: 'Оплачено',
          formatter: (balance) => (formatToPrice(balance) + ' ' + this.$t('ye'))
        },
        {
          key: 'status',
          label: 'Статус'
        }
      ]
    },
    paymentsField() {
      return [
        {
          key: 'date_paid',
          label: 'Дата',
          formatter: (datePayment) => {
            const {year, month, day} = getDateProperty(datePayment)
            /*const lastYear = year.toString().slice(-2)*/
            return `${day}.${month}.${year}`
          }
        },
        {
          key: 'amount',
          label: 'Сумма',
          formatter: (amount) => (formatToPrice(amount) + ' ' + this.$t('ye'))
        },
        {
          key: 'type',
          label: 'Тип',
          formatter: (type) => this.$t(type)
        },
        {
          key: 'payment_type',
          label: 'Способ',
          formatter: (paymentType) => {
            if (paymentType === 'cash') return this.$t('cash')
            if (paymentType === 'transfer') return this.$t('contracts.transfer')
            if (!paymentType) return '-'
            return paymentType
          }
        },
        {
          key: 'comment',
          label: 'Комментарий'
        },
        {
          key: 'actions',
          label: 'Действия'
        }
      ]
    },
    countOfScheduleItems() {
      const {items, pagination} = this.paymentSchedule
      return items.length && pagination['totalItems'] > 9
    },
    countOfPaymentItems() {
      const {items, pagination} = this.paymentHistory
      return items.length && pagination['totalItems'] > 9
    },
    showSchedulePagination() {
      const {paymentSchedule, appLoading, countOfScheduleItems} = this
      return countOfScheduleItems && !(appLoading || paymentSchedule.appLoading)
    },
    showPaymentsPagination() {
      const {paymentHistory, appLoading, countOfPaymentItems} = this
      return countOfPaymentItems && !(appLoading || paymentHistory.appLoading)
    }
  },
  watch: {
    'appendPayment.amount'(amount) {
      if (amount) {
        this.validationWarnings.amount = false
      }
    },
    'appendPayment.type'(type) {
      if (type?.length > 1) {
        this.validationWarnings.type = false
      }
    },
    'appendPayment.payment_date'(paymentDate) {
      if (paymentDate) {
        this.validationWarnings.payment_date = false
      }
    },
    'appendPayment.payment_type'(paymentType) {
      if (paymentType) {
        this.validationWarnings.payment_type = false
      }
    }
  },
  async created() {
    await this.fetchItems()
  },
  methods: {
    userInteraction(type) {
      if (type === 'initial_payment')
        return this.permission.debtors.first_payment.edit
      else if (type === 'monthly')
        return this.permission.debtors.monthly.edit
    },
    refreshDetails() {
      this.$emit('refresh-details')
      this.fetchItems()
    },
    async fetchItems() {
      this.startLoading()
      await Promise.any([this.getPaymentSchedule(), this.getPaymentHistory(),])
          .finally(() => {
            this.finishLoading()
          })
    },
    async getPaymentSchedule() {
      this.paymentSchedule.appLoading = true
      const {id} = this.$route.params
      const {params: scheduleParams} = this.paymentSchedule
      await api.contractV2.fetchPaymentSchedule(id, scheduleParams)
          .then((response) => {
            this.paymentSchedule.items = response.data.items
            this.paymentSchedule.pagination = response.data.pagination
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.paymentSchedule.appLoading = false
          })
    },
    async getPaymentHistory() {
      this.paymentHistory.appLoading = true
      const {id} = this.$route.params
      const {params: historyParams} = this.paymentHistory
      await api.contractV2.fetchPayments(id, historyParams)
          .then((response) => {
            this.paymentHistory.items = response.data.items
            this.paymentHistory.pagination = response.data.pagination
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.paymentHistory.appLoading = false
          })
    },
    startLoading() {
      this.appLoading = true
      this.$emit('start-loading')
    },
    finishLoading() {
      this.appLoading = false
      this.$emit('finish-loading')
    },
    swipePaymentsPage(page) {
      this.paymentHistory.params.page = page
      this.getPaymentHistory()
    },
    changePaymentsShowingLimit() {
      this.getPaymentHistory()
    },
    swipeSchedulePage(page) {
      this.paymentSchedule.params.page = page
      this.getPaymentSchedule()
    },
    changeScheduleShowingLimit() {
      this.getPaymentSchedule()
    },
    openPaymentAdditionModal() {
      this.$refs['payment-addition-modal'].openModal()
    },
    closePaymentAdditionModal() {
      this.$refs['payment-addition-modal'].closeModal()
      setTimeout(() => {
        this.initAppendPayment()
      }, 200)
    },
    openPaymentsImportModal() {
      this.$refs['import-payments'].openModal()
    },
    async submitNewPayment() {
      const paymentObserver = this.$refs['payment-observer']
      const formCompleted = await paymentObserver.validate()
      if (formCompleted) {
        const {id} = this.$route.params
        this.buttonLoading = true
        const form = Object.assign({}, this.appendPayment)
        form.amount *= 100
        await api.contractV2.appendPayment(id, form)
            .then(() => {
              this.closePaymentAdditionModal()
              this.$swal({
                title: "Muvaffaqiyatli!",
                text: "To'lovlar ro'yxatiga muvaffaqiyatli qo'shildi",
                icon: "success"
              }).then(() => {
                this.initAppendPayment()
                this.refreshDetails()
              })
            }).catch(async (error) => {
              const {response} = error
              if (response.status === 402) {
                const {available, available_amount} = response.data
                const initialForm = Object.assign({}, this.appendPayment)
                const overbalance = initialForm.amount * 100 - available_amount
                if (!available) {
                  this.warningForPayInitialPayment.price = available_amount
                  this.warningForPayInitialPayment.overbalance = overbalance
                  this.$refs['initial-payment-warning'].openModal()
                }
              } else {
                const {data} = error.response
                const index = Object.keys(data)[0]
                const text = data[index]
                this.$swal({
                  text,
                  icon: "error",
                  title: this.$t('error'),
                })
              }
            }).finally(() => {
              this.buttonLoading = false
            })
      } else {
        this.revalidateForm()
      }
    },
    revalidateForm() {
      const {errors} = this.$refs['payment-observer']
      const haveErrors = Object.keys(errors).length
      if (haveErrors) {
        const warningProperties = Object.keys(this.validationWarnings)
        warningProperties.forEach(warningProperty => {
          this.validationWarnings[warningProperty] = errors[warningProperty].length > 0
        })
      }
    },
    initAppendPayment() {
      for (let [key,] of Object.entries(this.appendPayment)) {
        this.appendPayment[key] = null
      }
    },
    warnBeforeDelete(id) {
      this.deletionPaymentId = id
      this.$refs['warning-before-delete'].openModal()
    },
    cancelRemovingPayment() {
      this.deletionPaymentId = null
      this.$refs['warning-before-delete'].closeModal()
    },
    async deletePaymentTransaction(transactionId) {
      const {id: contractId} = this.$route.params
      this.paymentHistory.appLoading = true
      this.$refs['warning-before-delete'].closeModal()
      await api.contractV2.removePaymentTransaction(contractId, transactionId)
          .then(() => {
            this.fetchItems()
            this.$swal({
              title: "O'chirildi!",
              text: "To'lovlar ro'yxatidan muvaffaqiyatli o'chirildi",
              icon: "success"
            })
            this.deletionPaymentId = null
          })
          .catch((error) => {
            const {data} = error.response
            const primaryKey = Object.keys(data)[0]
            this.$bvToast.toast(data[primaryKey], {
              title: `${this.$t('error')}`,
              variant: 'danger',
              solid: true
            })
          })
          .finally(() => {
            this.paymentHistory.appLoading = false
          })
    },
    editPaymentTransaction(item) {
      this.modifyTransactionProperties = item
      this.toggleModifyTransaction = true
    },
    modifyTransactionModalHide() {
      this.modifyTransactionProperties = {}
      this.toggleModifyTransaction = false
    },
    async payOnlyInitialPayment() {
      const {id} = this.$route.params
      const {price} = this.warningForPayInitialPayment
      const formInitial = Object.assign({}, this.appendPayment)
      formInitial.type = 'initial_payment'
      formInitial.amount = price
      this.initialPaymentLoading = true
      await api.contractV2.appendPayment(id, formInitial)
          .then(() => {
            this.closePaymentAdditionModal()
            this.$swal({
              title: "Muvaffaqiyatli!",
              text: "To'lovlar ro'yxatiga muvaffaqiyatli qo'shildi",
              icon: "success"
            }).then(() => {
              this.initAppendPayment()
              this.refreshDetails()
            })
          })
          .catch((error) => {
            const {data} = error.response
            const primaryKey = Object.keys(data)[0]
            this.$bvToast.toast(data[primaryKey], {
              title: `${this.$t('error')}`,
              variant: 'danger',
              solid: true
            })
          })
          .finally(() => {
            this.$refs['initial-payment-warning'].closeModal()
            this.initialPaymentLoading = false
          })
    },
    async exchangeToMonthlyPayment() {
      const {id} = this.$route.params
      this.monthlyPaymentLoading = true
      const {price, overbalance} = this.warningForPayInitialPayment

      const formInitial = Object.assign({}, this.appendPayment)
      formInitial.type = 'initial_payment'
      formInitial.amount = price
      await api.contractV2.appendPayment(id, formInitial)
          .then(async () => {
            this.closePaymentAdditionModal()
          })
          .catch((error) => {
            const {data} = error.response
            const primaryKey = Object.keys(data)[0]
            this.$bvToast.toast(data[primaryKey], {
              title: `${this.$t('error')}`,
              variant: 'danger',
              solid: true
            })
          })

      const formMonthly = Object.assign({}, this.appendPayment)
      formMonthly.type = 'monthly'
      formMonthly.amount = overbalance
      await api.contractV2.appendPayment(id, formMonthly)
          .then(() => {
            this.$swal({
              title: "Muvaffaqiyatli!",
              text: "To'lovlar ro'yxatiga muvaffaqiyatli qo'shildi",
              icon: "success"
            }).then(() => {
              this.initAppendPayment()
              this.refreshDetails()
            })
          })
          .catch((error) => {
            const {data} = error.response
            const primaryKey = Object.keys(data)[0]
            this.$bvToast.toast(data[primaryKey], {
              title: `${this.$t('error')}`,
              variant: 'danger',
              solid: true
            })
          }).finally(() => {
            this.$refs['initial-payment-warning'].closeModal()
            this.monthlyPaymentLoading = false
          })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/scss/utils/pagination";

* {
  font-family: Inter, serif;
  font-style: normal;
  color: var(--gray-600);
  font-weight: 600;
}

.cards {
  display: flex;
  gap: 24px;

  .currency__chart {
    //width: 306px;
    //height: 160px;
    max-width: 32rem;
    flex-grow: 1;
    border-radius: 32px;
    margin-top: 54px;
    margin-bottom: 2rem;
    background-color: var(--gray-50);
    border: 2px solid var(--gray-200);
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
}


/* PAYMENT HISTORY */
.payments__history {
  border-top: 6px solid var(--gray-100);
  border-bottom: 6px solid var(--gray-100);
  padding-top: 2rem;
  padding-bottom: 2rem;

  .heading {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .import__button {
      background-color: var(--gray-100);
      margin-right: 1rem;
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
        padding: 1.25rem 1rem 1.25rem 0.75rem;
      }

      td {
        vertical-align: middle;
      }
    }

    .table.b-table[aria-busy=true] {
      opacity: 1 !important;
    }

    .empty__scope {
      font-size: 1.5rem;
      min-height: 30rem;
    }
  }

  ::v-deep .row__head__bottom-border {
    border-bottom: 2px solid var(--gray-200) !important;
  }

  ::v-deep .row__body__bottom-border:not(:last-child) {
    border-bottom: 2px solid var(--gray-200) !important;
  }

  .actions {
    display: flex;
    align-items: center;

    .icon {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    .edit__icon {
      background-color: var(--violet-600);
    }

    .delete__icon {
      background-color: var(--red-600);
      margin-left: 1rem;
    }
  }
}

input[type="date"]::-webkit-datetime-edit-text,
input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: var(--gray-600);
}


.add__button {
  background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%);
  color: #FFFFFF;
}

.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.content__form__select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--gray-100);
  border-radius: 2rem;
  width: 50%;
  border: none;
  color: var(--gray-600);
  position: relative;

  .form__select {
    background-color: transparent;
    border: none;
    color: var(--gray-600);
    margin: 0 1rem;
    width: 100%;
  }
}

/* PAYMENT SCHEDULE */
.payment__schedule {
  margin-top: 2rem;

  .title {
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 1rem;
  }

  &-status {
    border-radius: 2rem;
    padding: 0.8rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18rem;
  }

  &-paid {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &-partially {
    background-color: var(--blue-100);
    color: var(--blue-600);
  }

  &-waiting {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &-uncertain {
    background-color: var(--gray-100);
    color: var(--gray-600);
  }
}

::v-deep .payment__schedule__thead {
  color: var(--gray-400);
  border-top: 2px solid white;

  th {
    padding: 20px 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-bottom: 2px solid var(--gray-200);

    &:nth-child(3) {
      border-right: 2px solid var(--gray-200);
    }
  }
}

::v-deep .payment__schedule__tbody {
  color: var(--gray-600);
  font-size: 16px;
  line-height: 22px;

  tr:nth-last-child(1) {
    border-bottom: 2px solid var(--gray-200);
  }

  td {
    padding: 20px 16px;
  }

  td:nth-child(3) {
    border-right: 2px solid var(--gray-200);
  }
}

::v-deep .initial__warning {
  .modal-content {
    width: 40rem;
    height: 30rem;
  }
}

.warning__border {
  border: 2px solid var(--red-600);
}

.warning__before__delete {
  &-head {
    display: flex;
    align-items: center;

    .title {
      font-size: 2.25rem;
      line-height: 42px;
    }
  }

  &-main {
    display: block;
    max-width: 60%;
    font-family: Inter, sans-serif;
    color: var(--gray-600);
    margin-left: 0.5rem;
  }

  &-footer {
    gap: 2rem;

    button {
      flex-grow: 1;
    }
  }
}


@media screen and (max-width: 1010px) {
  .cards {
    flex-direction: column;
    gap: 0;

    .currency__chart {
      width: 60%;
    }
  }
}
</style>