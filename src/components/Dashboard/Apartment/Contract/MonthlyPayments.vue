<template>
  <div>
    <div
        class="d-flex justify-content-between align-items-center sticky-top bg-custom-white px-3 py-2 rounded shadow-sm "
        v-if="(contract.discount && contract.discount.prepay !== 100) || contract.discount.prepay < 100 ">
      <h6 class="mb-0">{{ $t('table_months_payment') }}:</h6>
      <div class="d-flex justify-content-end align-items-center">
        <div class="mr-2 w-25">
          <input
              id="month"
              class="my-form__input w-100"
              type="number"
              :disabled="!monthlyPermission"
              min="0"
              required
              v-model="contract.month"
              @change="changeMonth"
              @click="changeMonth"
          />
        </div>
        <span
            v-if="contract.month > 0 && contract.discount && (contract.discount.prepay !== 100 || contract.discount.prepay < 100)">
            {{ contract.month }} {{ $t('months_to') }} <br/>
            {{ getCalMonth() | number("0,0.00", {thousandsSeparator: " ", decimalSeparator: ",",}) }}
            {{ $t("ye") }}
        </span>
      </div>
    </div>

    <div class="table-responsive custom-table mt-0">
      <table class="table">
        <thead>
        <tr>
          <th>
            {{ $t('months') }}
          </th>

          <th>
            {{ $t('contracts.view.type') }}
          </th>

          <th>
            {{ $t('contracts.view.sum') }}
          </th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="contract.initial_payments.length === 0 || contract.initial_payments.length === 1">
          <td>
            {{
              this.contract.first_payment_date ? this.contract.first_payment_date : new Date() | moment("DD.MM.YYYY")
            }}
          </td>

          <td>
            {{ $t('contracts.view.initial_fee') }}
          </td>

          <td>
            <div class="d-flex justify-content-between align-items-center">
              <span class="table-sm-width">
                {{ getCalcPrepay() | number("0,0.00", {thousandsSeparator: " ", decimalSeparator: ",",}) }}
                {{ $t("ye") }}
              </span>

              <button
                  class="btn btn-success btn-sm mr-0 mt-0"
                  type="button"
                  @click="addInitialPayment"
              >
                <i class="fa fa-plus-circle"></i>
              </button>
            </div>
          </td>
        </tr>

        <tr v-else v-for="(initialPayment, index) in contract.initial_payments" :key="'initial' + index">
          <td>
            <span v-if="!initialPayment.edit">
              {{ initialPayment.date }}
            </span>

            <div
                class="col-md-12 float-left"
                v-if="initialPayment.edit && index !== 0"
            >
              <div class="row">
                <date-picker v-model="initialPayment.date" value-type="DD.MM.YYYY" format="DD.MM.YYYY"/>
              </div>
            </div>
          </td>

          <td>
            {{ $t('contracts.view.initial_fee') }}
          </td>

          <td>
            <div class=" d-flex justify-content-between align-items-center">
                <span v-if="!initialPayment.edit">
                  {{ initialPayment.amount | number("0,0.00", {thousandsSeparator: " ", decimalSeparator: ",",}) }}
                  {{ $t("ye") }}
                </span>

              <div class="col-md-6 float-left" v-if="initialPayment.edit">
                <div class="row">
                  <!--                  <input-->
                  <!--                      type="text"-->
                  <!--                      class="form-control"-->
                  <!--                      v-model="initialPayment.amount"-->
                  <!--                      min="0"-->
                  <!--                  />-->

                  <base-numeric-input
                      id="prepay_to"
                      v-model="initialPayment.amount"
                      class="form-control"
                      :currency="$t('ye')"
                      :precision="2"
                      currency-symbol-position="suffix"
                      separator="space"
                  ></base-numeric-input>
                </div>
              </div>

              <div class=" d-flex justify-content-between align-items-center ">
                <button
                    class="btn btn-success btn-sm mr-1 mt-0"
                    v-if="index === contract.initial_payments.length - 1"
                    type="button"
                    @click="addInitialPayment">
                  <i class="fa fa-plus-circle"></i>
                </button>

                <button
                    v-if="(monthlyPermission && !initialPayment.edit)"
                    type="button"
                    @click="editInitialPayment(index)"
                    class="btn btn-sm btn-primary mt-0 mr-1"
                >
                  <i class="fa fa-edit"></i>
                </button>

                <div v-if="initialPayment.edit">
                  <button
                      v-if="monthlyPermission"
                      type="button"
                      @click="editInitialPayment(index)"
                      class="btn btn-sm btn-success mt-0 mr-1">
                    <i class="fa fa-save"></i>
                  </button>
                </div>

                <button
                    v-if="(index !== 0 && monthlyPermission)"
                    type="button"
                    @click="deleteInitialPayment(index)"
                    class="btn btn-sm btn-danger mt-0 mr-0">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>


        <tbody v-if="contract.discount && (contract.discount.prepay !== 100 || contract.discount.prepay < 100)">
        <tr v-for="(month, index) in contract.credit_months" :key="index">
          <td>
            <span v-if="!month.edit">
              {{ datePrettier(month.month) }}
            </span>
            <div
                class="col-md-12 float-left"
                v-else
            >
              <div class="row">
                <date-picker @input="month.month = $event" :value="datePrettier(month.month)" value-type="DD.MM.YYYY"
                             format="DD.MM.YYYY"/>
              </div>
            </div>
          </td>

          <td>
            {{ $t('monthly') }}
          </td>

          <td>
            <div class="d-flex d-flex justify-content-between align-items-center">
                <span v-if="!month.edit">
                  {{
                    month.amount
                        | number("0,0.00", {
                      thousandsSeparator: " ",
                      decimalSeparator: ",",
                    })
                  }}
                  {{ $t("ye") }}
                </span>

              <div class="col-md-6 float-left" v-if="month.edit">
                <div class="row">
                  <!--                  <input-->
                  <!--                      type="text"-->
                  <!--                      class="form-control"-->
                  <!--                      v-model="month.amount"-->
                  <!--                      min="0"-->
                  <!--                  />-->

                  <base-numeric-input
                      id="prepay_to"
                      v-model="month.amount"
                      class="form-control"
                      :currency="$t('ye')"
                      :precision="2"
                      currency-symbol-position="suffix"
                      separator="space"
                  ></base-numeric-input>

                </div>
              </div>

              <button
                  v-if="(monthlyPermission && !month.edit)"
                  type="button"
                  @click="editMonthlyPayment(index)"
                  class="btn btn-sm btn-primary mr-0 mt-0"
              >
                <i class="fa fa-edit"></i>
              </button>

              <div v-if="month.edit">
                <button
                    v-if="monthlyPermission"
                    type="button"
                    @click="editMonthlyPayment(index)"
                    class="btn btn-sm btn-success mr-0 mt-0"
                >
                  <i class="fa fa-save"></i>
                </button>
              </div>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import BaseNumericInput from "@/components/Reusable/BaseNumericInput";
import moment from "moment";
import CheckoutPermission from "@/permission/checkout";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import {formatDateWithDot} from "@/util/reusable";


// import * as Calc from "../../../../util/calculator";
const {getMonth, getPrepay, CreditMonths, editedCreditMonths, getTotal} = require("../../../../util/calculator");

export default {
  name: "MonthlyPayments",
  components: {
    DatePicker,
    BaseNumericInput
  },

  props: {
    apartments: {
      type: Array,
      required: true
    },
    client: {
      type: Object,
      required: true
    },
    contract: {
      type: Object,
      required: true
    }
  },

  emits: ['monthly-edit'],

  data() {
    return {
      edit: {
        initial_edited: false,
      },
      monthlyPermission: CheckoutPermission.getMonthlyPaymentPermission()
    }
  },

  mounted() {
    this.checkHasMonthly()
  },

  watch: {
    'contract.payment_date'() {
      this.checkHasMonthly()
    }
  },

  methods: {
    checkHasMonthly() {
      if (!this.contract.credit_months?.length) {
        CreditMonths(this.apartments, this.contract)
      }
    },
    datePrettier(value) {
      if (typeof value === 'string')
        return value
      return formatDateWithDot(value)
    },
    getInitialPaymentDate(initialPayment) {
      if (initialPayment.date) {
        return moment(initialPayment.date)
      }
      return moment(initialPayment.month)
    },
    changeMonth() {
      // this.monthly_price = this.getMonths();
      // this.contract.month = c;
      // console.log(this.contract.month);

      if (parseInt(this.contract.month) === 0) {
        getPrepay(this.apartments, this.contract)
      }

      CreditMonths(this.apartments, this.contract)
    },

    getCalMonth() {
      return getMonth(this.apartments, this.contract)
    },

    getCalcPrepay() {
      return getPrepay(this.apartments, this.contract)
    },

    initialCalc() {
      getTotal(this.apartments, this.contract)
      getPrepay(this.apartments, this.contract)
      editedCreditMonths(this.apartments, this.contract)
      console.log('lll')
    },

    editInitialPayment(index) {
      // this.initialCalc();

      if (this.contract.initial_payments[index].edit) {
        this.contract.initial_payments[index].edit = false;

        if (parseFloat(this.contract.initial_payments[index].amount) !== getMonth(this.apartments, this.contract)) {
          this.edit.initial_edited = true;
          this.contract.initial_payments[index].edited = true;
          editedCreditMonths(this.apartments, this.contract);
        }

        return;
      }

      this.contract.initial_payments[index].edit = true;
    },

    addInitialPayment() {
      let today = this.contract.first_payment_date
          ? new Date(this.contract.first_payment_date)
          : new Date();

      if (this.contract.initial_payments.length === 0) {
        // let month = parseInt(this.month ? this.month : 0)
        // const amount = month === 0 ? getTotal(this.apartments, this.contract) : getPrepay(this.apartments, this.contract);
        this.contract.initial_payments = [
          ...this.contract.initial_payments,
          {
            amount: this.contract.prepay_amount,
            edit: false,
            edited: false,
            date: moment(today).format("DD.MM.YYYY")
          }
        ]
      } else {
        const month = new Date(today.setMonth(today.getMonth() + 1))
        this.contract.initial_payments = [
          ...this.contract.initial_payments,
          {
            amount: 0,
            edit: false,
            edited: false,
            date: moment(month).format("DD.MM.YYYY")
          }
        ]
      }

      this.initialCalc()
    },

    deleteInitialPayment(index) {
      if (this.contract.initial_payments.length === 2) {
        this.contract.initial_payments.splice(index, 1);
        this.contract.initial_payments.splice(0, 1);
      } else {
        this.contract.initial_payments.splice(index, 1);
      }

      this.initialCalc();
    },

    editMonthlyPayment(index) {
      if (this.contract.credit_months[index].edit) {
        this.contract.credit_months[index].edit = false;

        if (parseFloat(this.contract.credit_months[index].amount) !== this.getCalMonth()) {
          // this.edit.monthly_edited = true;
          this.contract.credit_months[index].edited = true;
          // this.setNewPriceMonthly();
          editedCreditMonths(this.apartments, this.contract)

        } else {
          this.contract.credit_months[index].edited = true;
          editedCreditMonths(this.apartments, this.contract)
        }
        this.$emit('monthly-edit')
        return
      }
      this.contract.credit_months[index].edit = true;
      this.contract.credit_months[index].edited = true;
      this.initialCalc()
    },

  }
}
</script>

<style scoped>

</style>