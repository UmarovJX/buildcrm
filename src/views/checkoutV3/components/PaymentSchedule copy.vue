<script>
import { formatDateWithDot, formatToPrice } from "@/util/reusable";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BasePriceInput from "@/components/Reusable/BasePriceInput";
import { mapActions } from "vuex";
import { dateProperties, formatDateToYMD } from "@/util/calendar";
import { makeProp as p } from "@/util/props";
import { PROP_TYPE_OBJECT } from "@/constants/props";
import { hasChild } from "@/util/object";
import {
  addMonth,
  getFullMonthDifference,
  dateForPicker,
  keyGen,
} from "@/views/checkoutV3/helper/dateHelpers.js";

import {
  monthly,
  fullPrice,
  currentInstallmentObj,
  basePrice,
  m2Price,
  fullPayment,
  prepayAmount,
} from "@/views/checkoutV3/helper/calculator.js";
export default {
  name: "ChPaymentSchedule",
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
      default: "var(--violet-600)",
    },
    order: p(PROP_TYPE_OBJECT, {}),
  },
  data() {
    return {
      payments: [],
      current: {},
    };
  },
  watch: {
    "order.calculation": {
      handler() {
        const res = [];
        const restAmount = this.fullPayment - this.prepayAmount;
        let d = new Date(this.order.calculation.first_payment_date);
        for (let i = 0; i < this.order.calculation.initial_payments; i++) {
          res.push({
            type: "initial",
            amount: this.prepayAmount / this.order.calculation.initial_payments,
            editedAmount: false,
            editedDate: false,
            date: d,
            key: keyGen(),
          });
          d = addMonth(d, 1);
        }
        if (
          this.discount.type === "percent" &&
          this.order.calculation.prepay === 100
        )
          return (this.payments = res);

        d = new Date(this.order.calculation.monthly_payment_date);

        for (let i = 0; i < this.order.calculation.months - 1; i++) {
          res.push({
            type: "monthly",
            amount: monthly(this.order.calculation.months, restAmount),
            editedAmount: false,
            editedDate: false,
            date: d,
            key: keyGen(),
          });
          d = addMonth(d, 1);
        }
        res.push({
          type: "monthly",
          amount:
            restAmount -
            monthly(this.order.calculation.months, restAmount) *
              (this.order.calculation.months - 1),
          editedAmount: false,
          editedDate: false,
          date: d,
          key: keyGen(),
        });
        this.payments = res;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    discount() {
      return this.paymentOptions.find(
        (el) => el.id === this.order.calculation.discount
      );
    },
    paymentOptions() {
      if (this.order.apartment.discounts) {
        const discounts = this.order.apartment.discounts.map(
          (discount, index) => {
            let text = this.$t("apartments.view.variant");
            if (discount.type === "promo") {
              text += ` ${this.$t("promo.by_promo")}`;
            }
            text += `  ${index + 1} - ${discount.prepay}%`;
            return {
              text,
              value: discount.id,
              ...discount,
            };
          }
        );
        if (this.order.calculation.type === "installment") {
          return discounts.filter((el) => el.type !== "percent");
        } else {
          discounts.push({
            text: ` ${this.$t("apartments.view.other_variant")}`,
            value: "other",
            type: "percent",
            currency: null,
            amount: 0,
            id: "other",
            prepay: 30,
          });
          return discounts;
        }
      }
      return [];
    },
    fullPrice,
    currentInstallmentObj,
    basePrice,
    m2Price,
    prepayAmount,
    fullPayment,
    fields() {
      return [
        {
          key: "month",
          label: this.$t("date"),
        },
        {
          key: "type",
          label: this.$t("type"),
        },
        {
          key: "amount",
          label: this.$t("sum"),
          formatter: (value) => formatToPrice(value, 2),
        },
        {
          key: "actions",
          label: this.$t("companies.actions"),
        },
      ];
    },
  },
  methods: {
    emitCalc(field, v) {
      this.$emit("update-calc", {
        uuid: this.order.uuid,
        field: field,
        value: v,
      });
    },
    formatDate: formatDateWithDot,
    editSelectedPayment(payment) {
      // const { ymd } = dateProperties(payment.month, "string");
      // this.editContext = {
      //   ...payment,
      //   month: ymd,
      // };
      this.current = { ...payment, date: formatDateToYMD(payment.date) };
      this.openEditModal();
    },
    openEditModal() {
      this.$refs["edit-payment-schedule"].openModal();
    },
    closeEditModal() {
      this.$refs["edit-payment-schedule"].closeModal();
    },
    addPayment(payment) {
      const field = payment.type === "initial" ? "initial_payments" : "months";
      this.emitCalc(field, this.order.calculation[field] + 1);
    },
    deletePayment(payment) {
      const field = payment.type === "initial" ? "initial_payments" : "months";
      this.emitCalc(field, this.order.calculation[field] - 1);
    },

    editPayment() {
      const { key } = this.current;
      const oldObj = this.payments.find((el) => el.key === key);
      // amount update
      if (oldObj.amount !== this.current.amount) {
        if (this.current.type === "monthly") {
          console.log(this.current);
          oldObj.amount = this.current.amount;
          oldObj.editedAmount = true;
          const fixedAMount = this.payments
            .filter((el) => el.type === "monthly" && el.editedAmount === true)
            .reduce((acc, el) => acc + el.amount, 0);
          const nonFixedCount = this.payments.reduce(
            (acc, el) =>
              acc + +(el.type === "monthly" && el.editedAmount === false),
            0
          );
          const monthlyPayment = monthly(
            nonFixedCount,
            this.fullPayment - this.prepayAmount - fixedAMount
          );

          for (let i = 0; i < this.payments.length - 1; i++) {
            const p = this.payments[i];
            if (p.type === "monthly" && p.editedAmount === false)
              p.amount = monthlyPayment;
          }
          this.payments[this.payments.length - 1].amount =
            this.fullPayment -
            this.prepayAmount -
            fixedAMount -
            monthlyPayment * (nonFixedCount - 1);
        } else {
          oldObj.editedAmount = true;
          const second = this.payments.find(
            (el) => el.type === "initial" && el.key !== key
          );
          console.log(second);
          if (this.current.amount > this.prepayAmount) {
            oldObj.amount = this.prepayAmount;

            second.amount = 0;
          } else {
            oldObj.amount = this.current.amount;
            second.amount = this.prepayAmount - this.current.amount;
          }
        }
      }
      // Date update
      if (formatDateToYMD(oldObj.date) !== this.current.date) {
        if (
          this.current.type === "monthly" &&
          new Date(this.current.date) >
            new Date(this.order.calculation.monthly_payment_date)
        ) {
          oldObj.date = new Date(this.current.date);
          oldObj.editedDate = true;
          let found = false;
          for (let i = 0; i < this.payments.length; i++) {
            if (!found) found = this.payments[i].key === key;
            else {
              this.payments[i].editedDate ||
                (this.payments[i].date = addMonth(
                  this.payments[i - 1].date,
                  1
                ));
            }
          }
        }
        if (
          this.current.type === "initial" &&
          new Date(this.current.date) <
            new Date(this.order.calculation.monthly_payment_date) &&
          new Date(this.current.date) >
            new Date(this.order.calculation.first_payment_date)
        ) {
          oldObj.date = new Date(this.current.date);
          let found = false;
          this.payments
            .filter((el) => el.type === "initial")
            .forEach((el, i, arr) => {
              if (!found) found = el.key === key;
              else {
                el.key !== key && (el.date = addMonth(arr[i - 1].date, 1));
              }
            });
        }
      }
      this.closeEditModal();
    },
    showDeleteButton(payment) {
      if (payment.type === "initial") {
        return this.order.calculation.initial_payments > 1;
      }
      return (
        this.order.calculation.type !== "installment" &&
        this.order.calculation.months > 1
      );
    },
    showAddButton(payment) {
      if (payment.type === "initial") {
        return this.order.calculation.initial_payments < 2;
      }
      return this.order.calculation.type !== "installment";
    },
    showEditButton(payment, i) {
      if (payment.type === "initial") {
        return this.order.calculation.initial_payments > 1;
      }
      return i < this.payments.length - 1;
    },
  },
};
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
      :items="payments"
      :empty-text="$t('no_data')"
    >
      <template #cell(type)="{ item }">
        <span v-if="item.type === 'monthly'">
          {{ $t("monthly_payment") }}
        </span>
        <span v-else>
          {{ $t("payments.initial_fee") }}
        </span>
      </template>

      <template #cell(month)="data">
        {{ formatDate(data.item.date) }} {{ data.index }}
      </template>

      <template #cell(edit)="data">
        {{ data.item.amount }}
      </template>

      <!--   ACTION   -->
      <template #cell(actions)="data">
        <div class="action-buttons">
          <BaseButton
            v-if="showEditButton(data.item, data.index)"
            text=""
            class="violet rounded-circle"
            @click="editSelectedPayment(data.item)"
          >
            <template #right-icon>
              <BaseEditIcon fill="var(--white)" />
            </template>
          </BaseButton>
          <BaseButton
            v-if="showDeleteButton(data.item)"
            text=""
            class="red rounded-circle"
            @click="deletePayment(data.item)"
          >
            <template #right-icon>
              <BaseDeleteIcon fill="var(--white)" />
            </template>
          </BaseButton>
          <BaseButton
            v-if="showAddButton(data.item)"
            text=""
            class="green rounded-circle"
            @click="addPayment(data.item, data.index)"
          >
            <template #right-icon>
              <BasePlusIcon fill="var(--white)" />
            </template>
          </BaseButton>
        </div>
      </template>
    </b-table>
    <base-modal ref="edit-payment-schedule" design="auto-height">
      <template #header>
        <div class="d-flex align-items-center justify-content-between">
          <!--    TITLE      -->
          <p class="title">
            {{ $t("apartments.agree.number") }}
          </p>
          <!--   CLOSE    -->
          <p class="close-btn" @click="closeEditModal">
            <BaseCloseIcon :width="56" :height="56" />
          </p>
        </div>
      </template>

      <template #main>
        <div class="main-wrapper">
          <base-date-picker
            v-model="current.date"
            :range="false"
            class="w-100"
            format="DD.MM.YYYY"
            :icon-fill="datePickerIconFill"
            :placeholder="
              $t(
                current.type === 'initial'
                  ? 'first_payment_date'
                  : 'payment_date'
              )
            "
          />
          <base-price-input
            v-model="current.amount"
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
  background-image: url("../../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort="descending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../../assets/icons/icon-arrow-up.svg") !important;
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
