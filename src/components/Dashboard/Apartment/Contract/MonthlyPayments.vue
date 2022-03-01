<template>
  <div>
    <div
        class="d-flex justify-content-between align-items-center sticky-top bg-custom-white px-3 py-2 rounded shadow-sm "
        v-if="(contract.discount && contract.discount.prepay !== 100) || contract.discount.prepay < 100 ">
      <h6 class="mb-0">Таблица ежемесячных платежей:</h6>
      <div class="d-flex justify-content-end align-items-center">
        <div class="mr-2 w-25">
          <input
              id="month"
              class="my-form__input w-100"
              type="number"
              min="0"
              required
              v-model="contract.month"
              @change="changeMonth"
              @click="changeMonth"
          />
        </div>
        <span
            v-if="contract.month > 0 && contract.discount && (contract.discount.prepay !== 100 || contract.discount.prepay < 100)">
            {{ contract.month }} месяцев по <br/>
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
            Месяцы
          </th>

          <th>
            Тип
          </th>

          <th>
            Сумма
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
            Первоначальный взнос
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
              {{ initialPayment.month | moment("DD.MM.YYYY") }}
            </span>

            <div
                class="col-md-12 float-left"
                v-if="initialPayment.edit && index !== 0"
            >
              <div class="row">
                <input
                    type="date"
                    class="form-control"
                    v-model="initialPayment.month"
                />

              </div>
            </div>
          </td>

          <td>
            Первоначальный взнос
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
                    v-if="(getMe.role.id === 1 && !initialPayment.edit) || (getPermission.contracts.monthly && !initialPayment.edit)"
                    type="button"
                    @click="editInitialPayment(index)"
                    class="btn btn-sm btn-primary mt-0 mr-1"
                >
                  <i class="fa fa-edit"></i>
                </button>

                <div v-if="initialPayment.edit">
                  <button
                      v-if="getMe.role.id === 1 || getPermission.contracts.monthly"
                      type="button"
                      @click="editInitialPayment(index)"
                      class="btn btn-sm btn-success mt-0 mr-1">
                    <i class="fa fa-save"></i>
                  </button>
                </div>

                <button
                    v-if="(index !== 0 && getMe.role.id === 1) || (index !== 0 && getPermission.contracts.monthly)"
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
            {{ month.month | moment("DD.MM.YYYY") }}
          </td>

          <td>
            Ежемесячно
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
                  v-if="(getMe.role.id === 1 && !month.edit) || (getPermission.contracts.monthly && !month.edit)"
                  type="button"
                  @click="editMonthlyPayment(index)"
                  class="btn btn-sm btn-primary mr-0 mt-0"
              >
                <i class="fa fa-edit"></i>
              </button>

              <div v-if="month.edit">
                <button
                    v-if="getMe.role.id === 1 || getPermission.contracts.monthly"
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
import {mapGetters} from "vuex";

// import * as Calc from "../../../../util/calculator";
const {getMonth, getPrepay, CreditMonths, editedCreditMonths, getTotal} = require("../../../../util/calculator");

export default {
  name: "MonthlyPayments",

  components: {
    BaseNumericInput
  },

  props: {
    apartments: {},
    client: {},
    contract: {},
    // prepay: {},
    // totalOther: {}
  },

  data() {
    return {
      edit: {
        initial_edited: false
      }
    }
  },

  mounted() {
    CreditMonths(this.apartments, this.contract)
  },

  computed: {
    ...mapGetters([
      "getReserveClient",
      "getPermission",
      "getMe",
    ]),
  },

  methods: {
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

      return;
    },

    addInitialPayment() {
      let today = this.contract.first_payment_date
          ? new Date(this.contract.first_payment_date)
          : new Date();

      if (this.contract.initial_payments.length === 0) {
        let month = parseInt(this.month);
        let amount = month === 0 ? getTotal(this.apartments, this.contract) : getPrepay(this.apartments, this.contract);

        this.contract.initial_payments.push({
          amount: amount,
          edit: false,
          edited: false,
          month: moment(today).format("YYYY-MM-DD"),
        });
      }

      this.contract.initial_payments.push({
        amount: 0,
        edit: false,
        edited: false,
        month: moment(today).format("YYYY-MM-DD"), //today,
      });
      // this.getPrepay();
      this.initialCalc();
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

          this.$emit('MonthlyEdit', {})
        }

        return;
      }

      this.contract.credit_months[index].edit = true;
      this.contract.credit_months[index].edited = true;
      this.initialCalc();
    },

  }
}
</script>

<style scoped>

</style>