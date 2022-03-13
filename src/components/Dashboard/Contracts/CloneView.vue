<template>
  <main class="main__class">
    <!--  Header Navigation  -->
    <div v-if="order" class="navigation__content">
      <span class="go__back" @click="backNavigation">
        <base-arrow-left :width="32" :height="32"></base-arrow-left>
      </span>
      <span class="breadcrumb__content">
        <span>
          Список договоров
          <base-arrow-right/>
          <span>{{ order.contract }}</span>
        </span>
        <span class="head">
          Договор <span class="contract__number">{{ order.contract }}</span>
        </span>
      </span>
    </div>
    <!--  Tabs  -->
    <base-filter-tabs-content :filter-tab-list="filterTabList"/>
    <div class="cards">
      <currency-chart
          v-for="(context) in currencyList"
          :key="context.title"
          :context="context"
      ></currency-chart>
    </div>
    <div class="payment__schedule">
      <h3 class="title">График оплаты</h3>
      <b-table
          :fields="scheduleFields"
          :items="scheduleItems"
          :bordered="false"
          :striped="false"
          thead-class="payment__schedule__thead"
          tbody-class="payment__schedule__tbody"
          class="payment__schedule-table"
      >
        <template #cell(price)="data">
          {{ data.item.price }} сум
        </template>

        <template #cell(paid)="data">
          {{ data.item.paid }} сум
        </template>
      </b-table>
    </div>
    <base-loading-content :loading="showLoading"/>
  </main>
</template>

<script>
import api from "@/services/api";
import {formatDateWithDot, formatToPrice} from '@/util/reusable'
import BaseLoadingContent from "@/components/BaseLoadingContent";
import BaseArrowRight     from "@/components/icons/BaseArrowRightIcon";
import CurrencyChart      from "@/components/Dashboard/Contracts/components/CurrencyChart";
import BaseFilterTabsContent from "@/components/Reusable/BaseFilterTabsContent";
import BaseArrowLeft         from "@/components/icons/BaseArrowLeftIcon";

export default {
  name: "CloneView",
  components: {
    CurrencyChart,
    BaseArrowRight,
    BaseLoadingContent,
    BaseFilterTabsContent,
    BaseArrowLeft
  },
  data() {
    return {
      order: null,
      showLoading: false
    }
  },
  computed: {
    filterTabList() {
      return [
        {
          name: this.$t('payment_schedule'),
          status: 0
        },
        {
          name: this.$t('object_details'),
          status: 1
        },
        {
          name: this.$t('client_details'),
          status: 2
        },
        {
          name: this.$t('contract_details'),
          status: 3
        }
      ]
    },
    monthlyPayments() {
      if (this.order)
        return this.order.payments.filter(payment => payment.type === 'monthly')
      return 0
    },
    initialPayments() {
      if (this.order)
        return this.order.payments.filter(payment => payment.type === 'initial_payment')
      return 0
    },
    firstChart() {
      const {transaction_price, currency} = this.order
      const usdPrice = formatToPrice(currency.usd)
      const bottom = `Курс: ${usdPrice} сум `
      return {
        index: 0,
        title: 'Сумма договора',
        price: formatToPrice(transaction_price),
        bottom,
        progress: 0
      }
    },
    secondChart() {
      const {initial_payment} = this.order
      const paidInitialPayment = this.initialPayments
          .filter(payment => payment.status === 'paid')
          .reduce((prev, current) => prev + current.amount, 0)
      const remainInitialPayment = initial_payment - paidInitialPayment

      const progress = () => {
        if (initial_payment) {
          return (paidInitialPayment / initial_payment * 100).toFixed()
        }
        return 0
      }

      return {
        index: 1,
        title: 'Первоначальный взнос',
        price: formatToPrice(initial_payment),
        bottom: `Остаток: ${formatToPrice(remainInitialPayment)} сум`,
        progress: progress()
      }
    },
    thirdChart() {
      const {transaction_price, initial_payment} = this.order
      const paidMonthlyPayment = this.monthlyPayments
          .filter(payment => payment.status === 'paid')
          .reduce((prev, current) => prev + current.amount, 0)
      const fullMonthlyPrice = transaction_price - initial_payment
      const remainMonthlyPayment = fullMonthlyPrice - paidMonthlyPayment

      const progress = () => {
        if (fullMonthlyPrice) {
          return (paidMonthlyPayment / fullMonthlyPrice * 100).toFixed()
        }
        return 0
      }

      return {
        index: 2,
        title: 'Рассрочка (12 месяцев)',
        price: formatToPrice(fullMonthlyPrice),
        bottom: `Остаток: ${formatToPrice(remainMonthlyPayment)} сум`,
        progress: progress()
      }
    },
    currencyList() {
      if (this.order) {
        return [this.firstChart, this.secondChart, this.thirdChart]
      }
      return []
    },
    scheduleFields() {
      return [
        {
          key: 'schedule',
          label: 'Расписание',
        },
        {
          key: 'price',
          label: 'Сумма'
        },
        {
          key: 'type',
          label: 'Тип'
        },
        {
          key: 'paid',
          label: 'Оплачено'
        },
        {
          key: 'status',
          label: 'Статус'
        }
      ]
    },
    scheduleItems() {
      if (this.order) {
        return this.order.payments.map((payment) => {
          const {date_payment, amount, type, amount_paid, status} = payment
          const schedule = formatDateWithDot(date_payment)
          let typeContext = this.$t('initial_payment')

          if (type === 'monthly') {
            typeContext = this.$t('monthly_pay')
          }

          const paid = amount_paid ? amount_paid : 0
          return {
            paid,
            status,
            schedule,
            type: typeContext,
            price: formatToPrice(amount),
          }
        })
      }
      return []
    }
  },
  async created() {
    await this.fetchContractData()
  },
  methods: {
    async fetchContractData() {
      this.showLoading = true
      const {id} = this.$route.params
      await api.contract.fetchContract(id)
          .then((response) => {
            this.order = response.data
          })
          .catch((error) => {
            this.toastedWithErrorCode(error)
          })
          .finally(() => {
            this.showLoading = false
          })
    },
    backNavigation() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.main__class {
  background-color: white;
  padding: 3rem;
  min-height: 100vh;
  color: var(--gray-600);
}

.navigation__content {
  display: flex;
  align-items: center;
  margin-bottom: 52px;

  .go__back {
    width: 56px;
    height: 56px;
    border-radius: 100%;
    background-color: #F3F4F6;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .breadcrumb__content {
    display: inline-flex;
    flex-direction: column;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 14px;
    color: #9CA3AF;
  }

  .head {
    font-size: 24px;
    line-height: 28px;
    color: #4B5563;

    .contract__number {
      color: var(--violet-600);
    }
  }
}

.cards {
  display: flex;
  gap: 24px;
}

.payment__schedule {
  margin-top: 4rem;

  .title {
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 1rem;
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
</style>