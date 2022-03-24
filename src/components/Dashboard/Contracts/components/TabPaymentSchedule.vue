<template>
  <div>
    <div class="cards">
      <currency-chart
          class="currency__chart"
          v-for="(context) in currencyList"
          :key="context.title"
          :context="context"
      ></currency-chart>
    </div>
    <div class="payment__schedule">
      <div>
        <h3 class="title">График оплаты</h3>
        <div class="addition__button"></div>
      </div>
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

        <template #cell(status)="{item}">
          <span v-if="item.status === 'waiting'" class="payment__schedule-waiting">
            {{ $t('contracts.waiting_to_payment') }}
          </span>
          <span v-else-if="item.status === 'paid'" class="payment__schedule-paid">
            {{ $t('contracts.paid') }}
          </span>
          <span v-else class="payment__schedule-uncertain">
            {{ item.status }}
          </span>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import {formatDateWithDot, formatToPrice} from "@/util/reusable";
import CurrencyChart from "@/components/Dashboard/Contracts/components/CurrencyChart";

export default {
  name: "TabPaymentSchedule",
  components: {
    CurrencyChart,
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
  computed: {
    monthlyPayments() {
      if (this.hasConstructorOrder)
        return this.order.payments.filter(payment => payment.type === 'monthly')
      return 0
    },
    initialPayments() {
      if (this.hasConstructorOrder)
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
      if (this.hasConstructorOrder) {
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
      if (this.hasConstructorOrder) {
        return this.order.payments.map((payment) => {
          const {date_payment, amount, type, amount_paid, status} = payment
          const schedule = formatDateWithDot(date_payment)
          let typeContext = this.$t('initial_payment')

          if (type === 'monthly') {
            typeContext = this.$t('monthly_pay')
          }

          const paid = amount_paid ? amount_paid : 0
          return {
            paid: formatToPrice(paid),
            status,
            schedule,
            type: typeContext,
            price: formatToPrice(amount),
          }
        })
      }
      return []
    }
  }
}
</script>

<style lang="scss" scoped>
.cards {
  display: flex;
  gap: 24px;

  .currency__chart {
    width: 306px;
    height: 160px;
    border-radius: 32px;
    margin-top: 54px;
    background-color: var(--gray-50);
    border: 2px solid var(--gray-200);
    padding: 24px;
  }
}

.payment__schedule {
  margin-top: 4rem;

  .title {
    font-size: 24px;
    line-height: 28px;
    margin-bottom: 1rem;
  }

  &-paid {
    background-color: var(--green-100);
    color: var(--green-600);
    border-radius: 2rem;
    padding: 0.5rem 2rem;
  }

  &-waiting {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
    border-radius: 2rem;
    padding: 0.5rem 2rem;
  }

  &-uncertain {
    background-color: var(--gray-100);
    color: var(--gray-600);
    border-radius: 2rem;
    padding: 0.5rem 2rem;
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