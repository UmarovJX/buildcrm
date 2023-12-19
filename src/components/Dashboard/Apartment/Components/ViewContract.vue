<script>
// import Discount from './Discount'

import api from '@/services/api'

export default {

  components: {
    // Discount
  },
  props: {
    apartment: {},
  },

  data: () => ({
    step: 1,

    order: {
      id: null,

      contract: null,
      contract_path: null,
      initial_payment: null,
      payment_status: null,
      status: 'contract',
      transaction_price: null,
      contract_date: null,
      payments: [],

      companies: {
        name: null,
        payment_account: null,
        inn: null,
        mfo: null,
        bank_name: null,
        phone: null,
        first_name: null,
        last_name: null,
        second_name: null,
        type: null,
      },

      client: {
        id: null,
        first_name: '',
        last_name: '',
        second_name: '',
        passport_series: '',
        issued_by_whom: '',
        birth_day: null,
        language: 'uz',
        phone: '',
        other_phone: null,
        date_of_issue: null,
        discount: { id: null },
        edit: false,
      },
      getLoading: false,
    },

    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    },
  }),

  mounted() {
    this.fetchOrder()
  },

  methods: {
    async fetchOrder() {
      this.getLoading = true
      try {
        const { data } = await api.orders.fetchOrder(this.apartment.order.id)
        this.step = 1
        this.order = {
          id: data.id,
          contract: data.contract,
          contract_path: data.contract_path,
          initial_payment: data.initial_payment,
          payment_status: data.payment_status,
          status: data.status,
          transaction_price: data.transaction_price,
          discount: data.discount,
          contract_date: data.contract_date,
          payments: data.payments,

          companies: {
            name: data.company.name,
            payment_account: data.company.payment_account,
            inn: data.company.inn,
            mfo: data.company.mfo,
            bank_name: data.company.bank_name.uz,
            phone: data.company.phone,
            first_name: data.company.first_name,
            last_name: data.company.last_name,
            middle_name: data.company.second_name,
            type: data.company.type.name.kr,
          },

          status: {
            id: data.client.id,
            first_name: data.client.first_name,
            birth_day: data.client.birth_day,
            last_name: data.client.last_name,
            middle_name: data.client.second_name,
            passport_series: data.client.passport_series,
            issued_by_whom: data.client.issued_by_whom,
            language: data.client.language,
            phone: data.client.phone,
            other_phone: data.client.other_phone,
            date_of_issue: data.client.date_of_issue,
          },
        }

        this.getLoading = false
      } catch (error) {
        this.getLoading = false
        if (!error.response) {
          this.toasted('Error: Network Error', 'error')
        } else if (error.response.status === 403) {
          this.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 401) {
          this.toasted(error.response.data.message, 'error')
        } else if (error.response.status === 500) {
          this.toasted(error.response.data.message, 'error')
        } else {
          this.toasted(error.response.data.message, 'error')
        }
      }
    },

    removeBlock() {
      this.$bvModal.hide('modal-contract-info')
    },

    getPrepay() {
      const total_discount = this.getDiscount()

      const total = this.apartment.price - total_discount

      return (this.client.discount.prepay_to * total) / 100
    },

    getDiscount() {
      return (this.client.discount.discount * this.apartment.price) / 100
    },

    getMonth() {
      return (this.getTotal() - this.getPrepay()) / this.month
    },

    getDebt() {
      return this.getTotal() - this.getPrepay()
    },

    getStatusPayment(payment) {
      switch (payment.status) {
        case 'waiting':
          return 'Ожидает оплату'
        case 'paid':
          return 'Оплачено'
        default:
          return 'Отказано'
      }
    },

    getTotal() {
      const total_discount = this.getDiscount()

      // let total = price * area;
      const total = this.apartment.price - total_discount

      return total
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="modal-contract-info"
      ref="modal"
      class="py-4"
      :title="$t('apartments.list.contract')"
      size="lg"
      hide-footer
      hide-header-close
    >
      <div class="invoice-box">
        <table
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr class="top">
              <td colspan="3">
                <table>
                  <tbody>
                    <tr>
                      <td class="title">
                        <!--                                    <img src="/images/logo.png" style="width:100%; max-width:300px;">-->
                      </td>
                      <td>
                        {{ $t("apartments.list.contract") }} #:
                        {{ order.contract }}<br>
                        Дата контракта:
                        {{ order.contract_date | moment("DD.MM.YYYY") }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr class="information">
              <td colspan="3">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        {{ order.companies.type }} "{{
                          order.companies.name
                        }}"<br>
                        {{ order.companies.first_name }}
                        {{ order.companies.last_name }}
                        {{ order.companies.second_name }} <br>
                        р/с: {{ order.companies.payment_account }} <br>
                        ИНН: {{ order.companies.inn }}, МФО:
                        {{ order.companies.mfo }} <br>
                      </td>
                      <td>
                        {{ order.client.first_name }}
                        {{ order.client.last_name }}
                        {{ order.client.second_name }}<br>
                        {{ order.client.passport_series }}<br>
                        {{ order.client.issued_by_whom }}<br>
                        {{ order.client.date_of_issue | moment("DD.MM.YYYY") }}
                        берилган<br>
                        {{ order.client.birth_day | moment("DD.MM.YYYY") }}
                        тугилган<br>
                        {{ order.client.phone }}<br>
                        {{ order.client.other_phone }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr class="heading">
              <td colspan="3">
                Первоначальный взнос
              </td>
            </tr>
            <tr class="details">
              <td colspan="3">
                {{
                  order.initial_payment
                    | number("0,0.00", {
                      thousandsSeparator: " ",
                      decimalSeparator: ",",
                    })
                }}
                {{ $t("ye") }}
              </td>
            </tr>
            <tr class="heading">
              <td>Расписание для оплаты</td>

              <td class="text-center">
                Статус
              </td>

              <td>Сумма</td>
            </tr>

            <tr
              v-for="(month, index) in order.payments"
              :key="index"
            >
              <td>
                {{ month.date_payment | moment("DD.MM.YYYY") }}
              </td>

              <td class="text-center">
                {{ getStatusPayment(month) }}
              </td>

              <td>
                {{
                  month.amount
                    | number("0,0.00", {
                      thousandsSeparator: " ",
                      decimalSeparator: ",",
                    })
                }}
                {{ $t("ye") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <a
        :href="order.contract_path"
        class="btn btn-success float-right mt-2"
      >
        <i class="fa fa-download" /> Скачать договор
      </a>
    </b-modal>

    <b-overlay
      :show="getLoading"
      no-wrap
      opacity="0.5"
      style="z-index: 2222"
    >
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<style scoped>
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #a4a4a4;
  opacity: 0.8; /* Firefox */
}

.invoice-box {
  max-width: 800px;
  margin: auto;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 16px;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}

.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(2) {
  border-top: 2px solid #eee;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }

  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}
</style>
