<script>
import { mapGetters } from "vuex";
import DiscountMultiple from "./DiscountMultiple";
import moment from "moment";
import api from "@/services/api";

export default {
  props: {
    apartment: {},
    apartments: [],
  },

  components: {
    DiscountMultiple,
  },

  computed: mapGetters(["getReserveClient", "getPermission", "getMe"]),

  name: "Agree",

  watch: {
    month: function (newVal) {
      this.CreditMonths(newVal);
    },

    step: function () {
      this.CreditMonths(this.month);
    },

    "apartment_edit.price": function () {
      this.getDiscountEdited();
      this.CreditMonths(this.month);
    },

    "apartment_edit.prepay_price": function () {
      this.getDiscountEdited();
      this.CreditMonths(this.month);
    },
  },

  data() {
    return {
      step: 1,
      search_label: "",
      client: {
        id: null,
        first_name: {
          lotin: "",
          kirill: "",
        },
        last_name: {
          lotin: "",
          kirill: "",
        },
        second_name: {
          lotin: "",
          kirill: "",
        },
        passport_series: "",
        issued_by_whom: "",
        birth_day: null,
        language: "uz",
        phone: "",
        other_phone: null,
        date_of_issue: null,
        discount: { id: null },
        edit: false,
        payment_date: null,
        first_payment_date: null,
      },
      type_client: "unknown",
      comment: "",

      apartment_edit: {
        price: 0,
        prepay_price: 0,
        percente: 0,
        contract_number: null,
        contract_date: null,
      },
      initial_payments: [],
      confirm: false,
      next: false,
      month: 6,
      date_change: false,
      edit: {
        price: false,
        monthly: false,

        monthly_edited: false,
      },
      error: false,
      errors: [],
      credit_months: [],
      getThisApartment: [],
      getThisApartmentForTable: [],

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    };
  },

  mounted() {
    this.getApartments();
  },

  methods: {
    BackOne() {
      this.step = 3;
      this.next = false;
      this.confirm = true;
    },

    BackTwo() {
      this.step = 2;
      this.next = true;
      this.confirm = false;
    },

    getTotalOther() {
      return parseFloat(this.apartment_edit.price);
    },

    getDiscountEdited() {
      let price = this.apartment_edit.price;
      let prepay_price = this.apartment_edit.prepay_price;

      let percente = (prepay_price * 100) / price;

      this.client.discount.prepay = percente;
    },

    deleteInitialPayment(index) {
      if (this.initial_payments.length === 2) {
        this.initial_payments.splice(index, 1);
        this.initial_payments.splice(0, 1);
      } else {
        this.initial_payments.splice(index, 1);
      }
    },

    editInitialPayment(index) {
      if (this.initial_payments[index].edit) {
        this.initial_payments[index].edit = false;

        if (
          parseFloat(this.initial_payments[index].amount) != this.getMonths()
        ) {
          this.edit.initial_edited = true;
          this.initial_payments[index].edited = true;
          this.setNewPriceMonthly();
        }

        return;
      }

      this.initial_payments[index].edit = true;

      return;
    },

    addInitialPayment() {
      let today = this.client.first_payment_date
        ? new Date(this.client.first_payment_date)
        : new Date();

      if (this.initial_payments.length === 0) {
        let month = parseInt(this.month);
        let amount =
          this.client.discount.id === "other" && month === 0
            ? this.getTotalOther()
            : this.getPrepay();

        this.initial_payments.push({
          amount: amount,
          edit: false,
          edited: false,
          month: moment(today).format("YYYY-MM-DD"),
        });
      }

      this.initial_payments.push({
        amount: 0,
        edit: false,
        edited: false,
        month: moment(today).format("YYYY-MM-DD"), //today,
      });

      this.getPrepay();
    },

    async getApartments() {
      try {
        const { data } = await api.apartments.fetchApartments(this.apartments);
        this.getThisApartment = data;
        if (this.getThisApartment.length > 0) {
          this.month = this.getThisApartment[0].object.credit_month;
        }
      } catch (error) {
        this.toastedWithErrorCode(error);
      }
    },

    SaveEditPrices() {
      this.apartment_edit.price = this.getPrice();
      this.getPrepay();
      // this.getDiscountEdited();
      this.edit.price = false;
    },

    async Search() {
      await api.clients
        .fetchClientData(this.search_label)
        .then((res) => {
          res = res.data;
          this.step = 2;
          this.client = {
            id: res.id,
            first_name: res.first_name ?? {
              lotin: null,
              kirill: null,
            },
            last_name: res.last_name ?? {
              lotin: null,
              kirill: null,
            },
            middle_name: res.second_name ?? {
              lotin: null,
              kirill: null,
            },
            passport_series: res.passport_series,
            issued_by_whom: res.issued_by_whom,
            language: res.language,
            birth_day: res.birth_day,
            phone: res.phone,
            other_phone: res.other_phone,
            date_of_issue: res.date_of_issue,
            discount: { id: null },
          };
          // eslint-disable-next-line no-debugger
          // debugger;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
    },

    async sendForm() {
      if (this.client.discount.id === null) return;

      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_agree"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes_agree"),
      }).then((result) => {
        if (result.value) {
          const formData = new FormData();

          // if (this.apartment.order.id)
          //     formData.append('order_id', this.apartment.order.id);

          formData.append("type", "multiple");

          formData.append("id", this.client.id);

          formData.append("first_name[lotin]", this.client.first_name.lotin);
          formData.append("first_name[kirill]", this.client.first_name.kirill);

          formData.append("last_name[lotin]", this.client.last_name.lotin);
          formData.append("last_name[kirill]", this.client.last_name.kirill);

          formData.append("second_name[lotin]", this.client.second_name.lotin);
          formData.append(
            "second_name[kirill]",
            this.client.second_name.kirill
          );

          formData.append("passport_series", this.client.passport_series);
          formData.append("issued_by_whom", this.client.issued_by_whom);
          formData.append("language", this.client.language);
          formData.append("phone", this.client.phone);
          formData.append("other_phone", this.client.other_phone);
          formData.append("date_of_issue", this.client.date_of_issue);
          formData.append("discount_id", this.client.discount.id);
          formData.append("birth_day", this.client.birth_day);

          formData.append("type_client", this.type_client);

          formData.append("monthly_edited", this.edit.monthly_edited ? 1 : 0);

          if (
            this.getMe.role.id === 1 ||
            this.getPermission.contracts.monthly
          ) {
            for (
              let monthly = 0;
              monthly < this.credit_months.length;
              monthly++
            ) {
              formData.append(
                "monthly[" + monthly + "][edited]",
                this.credit_months[monthly].edited ? 1 : 0
              );
              formData.append(
                "monthly[" + monthly + "][amount]",
                this.credit_months[monthly].amount
              );
              formData.append(
                "monthly[" + monthly + "][date]",
                this.credit_months[monthly].month
              );
            }
          }

          for (
            let initial_payment = 0;
            initial_payment < this.initial_payments.length;
            initial_payment++
          ) {
            formData.append(
              "initial_payments[" + initial_payment + "][edited]",
              this.initial_payments[initial_payment].edited ? 1 : 0
            );
            formData.append(
              "initial_payments[" + initial_payment + "][amount]",
              this.initial_payments[initial_payment].amount
            );
            formData.append(
              "initial_payments[" + initial_payment + "][date]",
              this.initial_payments[initial_payment].month
            );
          }

          formData.append("comment", this.comment);

          if (this.client.discount.id === "other") {
            formData.append("apartment_price", this.apartment_edit.price);
            formData.append(
              "apartment_prepay_price",
              this.apartment_edit.prepay_price
            );
          }

          formData.append("first_payment_date", this.client.first_payment_date);

          if (this.client.payment_date)
            formData.append("payment_date", this.client.payment_date);

          if (this.date_change) {
            formData.append("date_change", 1);
            formData.append(
              "contract_number",
              this.apartment_edit.contract_number
            );
            formData.append("contract_date", this.apartment_edit.contract_date);
          }

          if (this.step === 3 && this.client.discount.prepay != 100) {
            formData.append("months", this.month);
          }

          for (let i = 0; i < this.getThisApartment.length; i++) {
            formData.append(
              "apartments[" + i + "][id]",
              this.getThisApartment[i].id
            );
            formData.append(
              "apartments[" + i + "][price]",
              this.getThisApartment[i].price
            );
          }

          api.orders
            .orderMultipleApartment(formData)
            .then((response) => {
              this.toasted(response.data.message, "success");

              this.$bvModal.hide("modal-agree");

              this.$emit("successAgree", response.data);
            })
            .catch((error) => {
              this.toastedWithErrorCode(error);

              if (error.response.status === 422) {
                this.error = true;
                this.errors = error.response.data;
              }
            });
          // this.$nextTick(() => {
          //     this.$bvModal.hide('modal-upload-logo')
          // });

          // this.$emit('UploadLogo');
        }
      });
    },

    removeBlock() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_agree"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes_close"),
      }).then((result) => {
        if (result.value) {
          this.$bvModal.hide("modal-agree");
          this.step = 1;
          this.search_label = "";
          this.$emit("CloseAgree");
        }
      });
    },

    ChangeDiscount() {
      // eslint-disable-next-line no-debugger
      // debugger;
      if (this.client.discount.id === "other") {
        this.client.discount = {
          id: "other",
          prepay: 30,
          amount: 0,
        };

        this.apartment_edit.price = this.getPrice();
        this.apartment_edit.prepay_price = this.getPrepay();
      }

      this.CreditMonths(this.month);

      if (this.client.discount.id === null) {
        this.next = false;
        this.confirm = false;
        return;
      }

      if (this.client.discount.prepay === 100) {
        this.next = false;
        this.confirm = true;
        return;
      }

      this.confirm = false;
      this.next = true;
      return;
    },

    // Calc
    getPrice() {
      var price = [];
      switch (this.client.discount.type) {
        case "fixed":
          for (let i = 0; this.getThisApartment.length > i; i++) {
            const amountApartment = this.getThisApartment[i].discounts.find(
              (val) => val.prepay == this.client.discount.prepay
            ).amount;
            const totalAmount = parseFloat(
              amountApartment * this.getThisApartment[i].plan.area
            );
            price.push(parseFloat(totalAmount));
            this.getThisApartmentForTable[i] = {
              number: this.getThisApartment[i].number,
              price: totalAmount,
            };
          }
          break;
        default:
          for (let i = 0; this.getThisApartment.length > i; i++) {
            price.push(parseFloat(this.getThisApartment[i].price));
          }
          break;
      }

      return price.reduce((a, b) => a + b, 0);
    },

    getPrepay() {
      if (this.client.discount.prepay === 100) return this.getTotal();

      let total_discount = this.getDiscount();
      let price = this.getPrice();

      let total;

      if (this.client.discount.id === "other")
        total = this.apartment_edit.price / total_discount;
      else {
        switch (this.client.discount.type) {
          case "fixed":
            total = price;
            break;
          default:
            total = price / total_discount;
            break;
        }
      }

      if (this.initial_payments.length > 1) {
        total = 0;

        for (let i = 0; this.initial_payments.length > i; i++) {
          total += parseFloat(this.initial_payments[i].amount);
        }

        return total;
      }

      if (this.apartment_edit.prepay_price) {
        return parseFloat(this.apartment_edit.prepay_price);
      }

      return (this.client.discount.prepay * total) / 100;
    },

    getDiscount() {
      if (this.client.discount.prepay === 100) return 1;

      return 1 - this.client.discount.amount / 100;
    },

    getMonths() {
      let total = this.getTotal();
      let prepay = this.getPrepay();
      return (total - prepay) / this.month;
    },

    getDebt() {
      return this.getTotal() - this.getPrepay();
    },

    getTotal() {
      let total_discount = this.getDiscount();
      let price = this.getPrice();
      let total = 0;

      if (this.client.discount.id === "other")
        total = this.apartment_edit.price / total_discount;
      else {
        switch (this.client.discount.type) {
          case "fixed":
            total = price;
            break;
          default:
            total = price / total_discount;
            break;
        }
      }

      return total;
    },

    CreditMonths(newVal) {
      let today = this.client.payment_date
        ? new Date(this.client.payment_date)
        : new Date();

      this.credit_months = [];

      let month_amount = this.getMonths();

      for (let i = 0; i < newVal; i++) {
        this.credit_months.push({
          month: today.setMonth(today.getMonth() + 1),
          amount: month_amount,
          edit: false,
          edited: false,
        });
      }
    },

    editMonthlyPayment(index) {
      if (this.credit_months[index].edit) {
        this.credit_months[index].edit = false;

        if (parseFloat(this.credit_months[index].amount) != this.getMonths()) {
          this.edit.monthly_edited = true;
          this.credit_months[index].edited = true;
          this.setNewPriceMonthly();
        }

        return;
      }

      this.credit_months[index].edit = true;

      return;
    },

    setNewPriceMonthly() {
      let total = this.getPrepay();
      let months = 0;

      for (var i = 0; i < this.credit_months.length; i++) {
        if (this.credit_months[i].edited) {
          total += parseFloat(this.credit_months[i].amount);
        } else {
          months += 1;
        }
      }

      let monthly_amount = (this.getTotal() - total) / months;

      for (var m = 0; m < this.credit_months.length; m++) {
        if (!this.credit_months[m].edited) {
          // if (monthly_amount > 0)
          this.credit_months[m].amount = monthly_amount;
          // else
          //     this.credit_months.splice(m, 1)
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <b-modal
      id="modal-agree"
      class="py-4"
      ref="modal"
      :title="$t('apartments.list.confirm')"
      size="lg"
      hide-footer
      hide-header-close
      no-close-on-backdrop
    >
      <div v-if="step === 1">
        <div>
          <div class="input-group">
            <input
              type="text"
              :placeholder="$t('apartments.agree.placeholder.search')"
              class="form-control h-auto"
              v-model="search_label"
            />
            <div class="input-group-append">
              <button
                class="btn btn-success mt-0 mr-0"
                @click.prevent="Search"
                type="button"
              >
                <i class="fa fa-search"></i> {{ $t("search") }}
              </button>
            </div>
          </div>
        </div>

        <div
          class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
        >
          <button
            type="button"
            class="btn btn-default mr-2"
            @click="removeBlock"
          >
            {{ $t("cancel") }}
          </button>
        </div>
      </div>

      <form ref="form" @submit.stop.prevent="sendForm" v-else-if="step === 2">
        <div class="container px-0 mx-0">
          <div class="row">
            <div
              class="col-12 mb-2"
              v-if="getMe.role.id === 1 || getPermission.contracts.date"
            >
              <button
                class="btn btn-light mb-2"
                @click="date_change = true"
                type="button"
              >
                <i class="fa fa-calendar"></i> Изменить дата договора
              </button>

              <div class="row" v-if="date_change">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="d-block" for="number">{{
                      $t("apartments.agree.number")
                    }}</label>
                    <input
                      id="number"
                      class="my-form__input"
                      type="text"
                      required
                      v-model="apartment_edit.contract_number"
                      :placeholder="$t('apartments.agree.placeholder.number')"
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="d-block" for="date">{{
                      $t("apartments.agree.date_contract")
                    }}</label>
                    <input
                      id="date"
                      class="my-form__input"
                      type="date"
                      required
                      v-model="apartment_edit.contract_date"
                      :placeholder="
                        $t('apartments.agree.placeholder.date_contract')
                      "
                    />
                  </div>
                </div>
              </div>

              <hr />
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="last_name_lotin"
                  >{{ $t("apartments.agree.last_name") }} (lotin)</label
                >
                <input
                  id="last_name_lotin"
                  class="my-form__input"
                  type="text"
                  required
                  v-model="client.last_name.lotin"
                  :placeholder="
                    $t('apartments.agree.placeholder.last_name_lotin')
                  "
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="first_name_lotin"
                  >{{ $t("apartments.agree.first_name") }} (lotin)</label
                >
                <input
                  id="first_name_lotin"
                  class="my-form__input"
                  type="text"
                  required
                  v-model="client.first_name.lotin"
                  :placeholder="
                    $t('apartments.agree.placeholder.first_name_lotin')
                  "
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="second_name_lotin"
                  >{{ $t("apartments.agree.middle_name") }} (lotin)</label
                >
                <input
                  id="second_name_lotin"
                  class="my-form__input"
                  type="text"
                  required
                  v-model="client.second_name.lotin"
                  :placeholder="
                    $t('apartments.agree.placeholder.second_name_lotin')
                  "
                />
              </div>
            </div>

            <div class="col-md-12">
              <hr />
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="last_name_kirill"
                  >{{ $t("apartments.agree.last_name") }} (kirill)</label
                >
                <input
                  id="last_name_kirill"
                  class="my-form__input"
                  type="text"
                  required
                  v-model="client.last_name.kirill"
                  :placeholder="$t('apartments.agree.placeholder.last_name')"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="first_name_kirill"
                  >{{ $t("apartments.agree.first_name") }} (kirill)</label
                >
                <input
                  id="first_name_kirill"
                  class="my-form__input"
                  type="text"
                  required
                  v-model="client.first_name.kirill"
                  :placeholder="$t('apartments.agree.placeholder.first_name')"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="second_name_kirill"
                  >{{ $t("apartments.agree.middle_name") }} (kirill)</label
                >
                <input
                  id="second_namev"
                  class="my-form__input"
                  type="text"
                  required
                  v-model="client.second_name.kirill"
                  :placeholder="$t('apartments.agree.placeholder.second_name')"
                />
              </div>
            </div>

            <div class="col-md-12">
              <hr />
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="checkout-pasport">{{
                  $t("apartments.agree.passport_series")
                }}</label>
                <input
                  class="my-form__input"
                  type="text"
                  :placeholder="
                    $t('apartments.agree.placeholder.passport_series')
                  "
                  required
                  v-model="client.passport_series"
                  id="checkout-pasport"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="issue_passport">{{
                  $t("apartments.agree.issued_by_whom")
                }}</label>
                <input
                  class="my-form__input"
                  type="text"
                  :placeholder="
                    $t('apartments.agree.placeholder.issued_by_whom')
                  "
                  required
                  v-model="client.issued_by_whom"
                  id="issue_passport"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="date_of_issue">{{
                  $t("apartments.agree.date_of_issue")
                }}</label>
                <input
                  v-model="client.date_of_issue"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="birth_day">{{
                  $t("apartments.agree.birth_day")
                }}</label>
                <input
                  v-model="client.birth_day"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <div class="col-md-12">
              <hr />
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="phone">{{
                  $t("apartments.agree.phone")
                }}</label>
                <input
                  class="my-form__input"
                  type="tel"
                  :placeholder="$t('apartments.agree.placeholder.phone')"
                  v-model="client.phone"
                  id="phone"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="other_phone">{{
                  $t("apartments.agree.other_phone")
                }}</label>
                <input
                  class="my-form__input"
                  type="tel"
                  :placeholder="$t('apartments.agree.placeholder.other_phone')"
                  v-model="client.other_phone"
                  id="other_phone"
                />
              </div>
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="language">{{
                  $t("apartments.agree.language")
                }}</label>
                <select
                  class="form-control"
                  id="language"
                  v-model="client.language"
                >
                  <option value="uz">Узбекский</option>
                  <option value="ru">Русский</option>
                </select>
              </div>
            </div>

            <div
              class="col-md-6"
              v-if="getMe.role.id === 1 || getPermission.contracts.friends"
            >
              <div class="mb-3">
                <label class="d-block" for="type_client">{{
                  $t("apartments.agree.type_client")
                }}</label>
                <select
                  class="form-control"
                  id="type_client"
                  v-model="type_client"
                >
                  <option value="unknown">Незнакомый</option>
                  <option value="friends">Знакомый</option>
                </select>
              </div>
            </div>

            <div class="col-md-12">
              <hr />
            </div>

            <div class="col-md-6">
              <div class="mb-3">
                <label class="d-block" for="discounts">{{
                  $t("apartments.view.variant")
                }}</label>
                <select
                  class="form-control"
                  id="discounts"
                  v-model="client.discount"
                  @change="ChangeDiscount"
                >
                  <option :value="{ id: null }">
                    {{ $t("apartments.agree.placeholder.enter_discount") }}
                  </option>

                  <option
                    v-for="(discount, index) in getThisApartment[0].discounts"
                    :value="discount"
                    :key="index"
                  >
                    {{ $t("apartments.view.variant") }} {{ index + 1 }} -
                    {{ discount.prepay }}%
                  </option>

                  <option
                    v-if="
                      getMe.role.id === 1 || getPermission.contracts.other_price
                    "
                    :value="{ id: 'other', amount: 0, prepay: 30 }"
                  >
                    {{ $t("apartments.view.other_variant") }}
                  </option>
                </select>
              </div>
            </div>

            <div
              class="col-md-12 my-2"
              v-if="client.discount.id && client.discount.id != 'other'"
            >
              <DiscountMultiple
                :discount="client.discount"
                :apartments="getThisApartment"
              ></DiscountMultiple>
            </div>

            <div class="col-md-12">
              <hr />
            </div>

            <div class="col-md-6" v-if="client.discount.id">
              <div class="mb-3">
                <label class="d-block" for="first_payment_date">{{
                  $t("apartments.agree.first_payment_date")
                }}</label>
                <input
                  v-model="client.first_payment_date"
                  id="first_payment_date"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <div class="col-md-6" v-if="!confirm && client.discount.id">
              <div class="mb-3">
                <label class="d-block" for="payment_date">{{
                  $t("apartments.agree.payment_date")
                }}</label>
                <input
                  v-model="client.payment_date"
                  id="payment_date"
                  type="date"
                  class="form-control"
                />
              </div>
            </div>

            <div class="col-md-12">
              <hr />
            </div>
          </div>
        </div>

        <div class="col-md-12" v-if="confirm">
          <label>Комментария</label>
          <textarea
            rows="3"
            cols="3"
            v-model="comment"
            class="form-control"
          ></textarea>
        </div>

        <div class="alert alert-danger mt-3" v-if="error">
          <ul>
            <li v-for="(error, index) in errors" :key="index">
              <span v-for="msg in error" :key="msg">
                {{ msg }}
              </span>
            </li>
          </ul>
        </div>

        <div
          class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
        >
          <button
            type="button"
            class="btn btn-default mr-2"
            @click="removeBlock"
          >
            {{ $t("cancel") }}
          </button>

          <button
            type="button"
            class="btn btn-primary"
            @click.prevent="BackOne"
            v-if="next"
          >
            {{ $t("next") }} <i class="fa fa-chevron-circle-right"></i>
          </button>

          <button type="submit" class="btn btn-success" v-if="confirm">
            {{ $t("create_agree") }} <i class="fa fa-file-contract"></i>
          </button>
        </div>
      </form>

      <div class="" v-if="step == 3">
        <form ref="form" @submit.prevent="sendForm">
          <div v-if="!edit.price">
            <table
              class="table table-hover mx-0 mt-2 p-0 my-table-another-variant"
            >
              <thead>
                <tr>
                  <th scope="col">Квартиры</th>
                  <th scope="col" class="text-right">Цена</th>
                </tr>
              </thead>
              <tbody class="m-0 p-0" v-if="getThisApartmentForTable.length > 0">
                <tr
                  v-for="(apartment, index) in getThisApartmentForTable"
                  :key="index"
                >
                  <td>
                    {{ apartment.number }}
                  </td>
                  <td class="px-0 py-2 text-right">
                    {{
                      apartment.price
                        | number("0,0.00", {
                          thousandsSeparator: " ",
                          decimalSeparator: ",",
                        })
                    }}
                    {{ $t("ye") }}
                  </td>
                </tr>

                <tr>
                  <td></td>
                  <td class="px-0 py-2 text-right">
                    <h6 class="color-blue-darker">
                      Итого:
                      {{
                        client.discount.id === "other"
                          ? apartment_edit.price
                          : getPrice()
                            | number("0,0.00", {
                              thousandsSeparator: " ",
                              decimalSeparator: ",",
                            })
                      }}
                      {{ $t("ye") }}
                    </h6>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="container px-0 mx-0 mt-4">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3" v-if="month > 0">
                    <label class="d-block" for="initial-fee"
                      >Первоначальный взнос:</label
                    >
                    <div class="row">
                      <div class="col-md-6 col-8">
                        <input
                          id="initial-fee"
                          class="my-form__input"
                          disabled
                          type="text"
                          :value="
                            getPrepay()
                              | number('0,0.00', {
                                thousandsSeparator: ' ',
                                decimalSeparator: ',',
                              })
                          "
                        />
                      </div>
                      <div
                        class="col-md-6 col-4 pl-0 d-flex align-items-center justify-content-start"
                      >
                        <div class="h6 mb-0">
                          {{ client.discount.prepay.toFixed(2) }}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    v-if="client.discount.id === 'other'"
                    @click="edit.price = true"
                    class="btn btn-light"
                  >
                    <i class="fa fa-edit"></i>
                    {{ $t("apartments.agree.edit_prices") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="container px-0 mx-0">
              <div class="row">
                <div class="col-12">
                  <div
                    class="mb-3"
                    v-for="(apartment, index) in apartments"
                    :key="index"
                  >
                    <label class="d-block" :for="'apartment_price_' + index"
                      >{{ apartment.number }} цена:</label
                    >
                    <div class="row">
                      <div class="col-md-6 col-8">
                        <input
                          :id="'apartment_price_' + index"
                          class="my-form__input"
                          type="number"
                          step="100"
                          v-model="apartment.price"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="mb-3" v-if="month > 0">
                    <label class="d-block" for="initial-fee"
                      >Первоначальный взнос:</label
                    >
                    <div class="row">
                      <div class="col-md-6 col-8">
                        <input
                          id="initial-fee"
                          class="my-form__input"
                          type="number"
                          step="0.01"
                          v-model="apartment_edit.prepay_price"
                        />
                      </div>
                      <div
                        class="col-md-6 col-4 pl-0 d-flex align-items-center justify-content-start"
                      >
                        <div class="h6 mb-0">
                          {{ client.discount.prepay.toFixed(2) }}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    @click="SaveEditPrices"
                    class="btn btn-primary"
                  >
                    <i class="fa fa-save"></i> {{ $t("save") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <table
            class="table table-hover mx-0 mt-2 p-0 my-table-another-variant"
            v-if="month > 0"
          >
            <tbody class="m-0 p-0">
              <!--                            <tr>-->
              <!--                                <td class="px-0 py-2">Скидка - {{ status.discount.discount }}%</td>-->
              <!--                                <td class="px-0 py-2 text-right">{{ getDiscount() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</td>-->
              <!--                            </tr>-->

              <!--                            <tr>-->
              <!--                                <td class="px-0 py-2">Итого со скидкой</td>-->
              <!--                                <td class="px-0 py-2 text-right">{{ getTotal() | number('0,0.00', { 'thousandsSeparator': ' ', 'decimalSeparator': ',' }) }} {{ $t('ye') }}</td>-->
              <!--                            </tr>-->

              <tr>
                <td class="px-0 py-2">Сумма рассрочки</td>
                <td class="px-0 py-2 text-right">
                  {{
                    getDebt()
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

          <div
            class="col-md-12"
            v-if="client.discount.prepay != 100 || client.discount.prepay < 100"
          >
            <div class="row">
              <div class="mb-3">
                <label class="d-block" for="month">Месяцев</label>
                <input
                  id="month"
                  class="my-form__input"
                  type="number"
                  min="0"
                  required
                  v-model="month"
                />
              </div>
            </div>
          </div>

          <span
            v-if="
              month > 0 &&
              (client.discount.prepay != 100 || client.discount.prepay < 100)
            "
          >
            {{ month }} месяцев по
            {{
              getMonths()
                | number("0,0.00", {
                  thousandsSeparator: " ",
                  decimalSeparator: ",",
                })
            }}
            {{ $t("ye") }}
          </span>

          <table
            class="table"
            v-if="client.discount.prepay != 100 || client.discount.prepay < 100"
          >
            <thead>
              <tr>
                <th>Месяцы</th>

                <th>Тип</th>

                <th>Сумма</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-if="
                  initial_payments.length === 0 || initial_payments.length === 1
                "
              >
                <td>
                  {{
                    this.client.first_payment_date
                      ? this.client.first_payment_date
                      : new Date() | moment("DD.MM.YYYY")
                  }}
                </td>

                <td>Первоначальный взнос</td>

                <td>
                  {{
                    client.discount.id === "other" && month == 0
                      ? getTotalOther()
                      : getPrepay()
                        | number("0,0.00", {
                          thousandsSeparator: " ",
                          decimalSeparator: ",",
                        })
                  }}
                  {{ $t("ye") }}

                  <button
                    class="btn btn-success btn-sm float-right"
                    type="button"
                    @click="addInitialPayment"
                  >
                    <i class="fa fa-plus-circle"></i>
                  </button>
                </td>
              </tr>

              <tr
                v-else
                v-for="(initialPayment, index) in initial_payments"
                :key="'initial' + index"
              >
                <td>
                  <span v-if="!initialPayment.edit">
                    {{ initialPayment.month | moment("DD.MM.YYYY") }}
                  </span>

                  <div
                    class="col-md-12 float-left"
                    v-if="initialPayment.edit && index != 0"
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

                <td>Первоначальный взнос</td>

                <td>
                  <span v-if="!initialPayment.edit">
                    {{
                      initialPayment.amount
                        | number("0,0.00", {
                          thousandsSeparator: " ",
                          decimalSeparator: ",",
                        })
                    }}
                    {{ $t("ye") }}
                  </span>

                  <div class="col-md-6 float-left" v-if="initialPayment.edit">
                    <div class="row">
                      <input
                        type="text"
                        class="form-control"
                        v-model="initialPayment.amount"
                      />
                    </div>
                  </div>

                  <button
                    class="btn btn-success btn-sm float-right"
                    v-if="index === initial_payments.length - 1"
                    type="button"
                    @click="addInitialPayment"
                  >
                    <i class="fa fa-plus-circle"></i>
                  </button>

                  <button
                    v-if="
                      (getMe.role.id === 1 && !initialPayment.edit) ||
                      (getPermission.contracts.monthly && !initialPayment.edit)
                    "
                    type="button"
                    @click="editInitialPayment(index)"
                    class="btn btn-sm btn-primary float-right mr-1"
                  >
                    <i class="fa fa-edit"></i>
                  </button>

                  <div v-if="initialPayment.edit">
                    <button
                      v-if="
                        getMe.role.id === 1 || getPermission.contracts.monthly
                      "
                      type="button"
                      @click="editInitialPayment(index)"
                      class="btn btn-sm btn-success float-right mr-1"
                    >
                      <i class="fa fa-save"></i>
                    </button>
                  </div>

                  <button
                    v-if="
                      (index != 0 && getMe.role.id === 1 && !month.edit) ||
                      (index != 0 &&
                        getPermission.contracts.monthly &&
                        !month.edit)
                    "
                    type="button"
                    @click="deleteInitialPayment(index)"
                    class="btn btn-sm btn-danger float-right mr-1"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>

              <tr v-for="(month, index) in credit_months" :key="index">
                <td>
                  {{ month.month | moment("DD.MM.YYYY") }}
                </td>

                <td>Ежемесячно</td>

                <td>
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
                      <input
                        type="text"
                        class="form-control"
                        v-model="month.amount"
                      />
                    </div>
                  </div>

                  <button
                    v-if="
                      (getMe.role.id === 1 && !month.edit) ||
                      (getPermission.contracts.monthly && !month.edit)
                    "
                    type="button"
                    @click="editMonthlyPayment(index)"
                    class="btn btn-sm btn-primary float-right"
                  >
                    <i class="fa fa-edit"></i>
                  </button>

                  <div v-if="month.edit">
                    <button
                      v-if="
                        getMe.role.id === 1 || getPermission.contracts.monthly
                      "
                      type="button"
                      @click="editMonthlyPayment(index)"
                      class="btn btn-sm btn-success float-right"
                    >
                      <i class="fa fa-save"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="col-md-12">
            <label>Комментария</label>
            <textarea
              rows="3"
              cols="3"
              v-model="comment"
              class="form-control"
            ></textarea>
          </div>

          <div class="alert alert-danger mt-3" v-if="error">
            <ul>
              <li v-for="(error, index) in errors" :key="index">
                <span v-for="msg in error" :key="msg">
                  {{ msg }}
                </span>
              </li>
            </ul>
          </div>
          <div
            class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
          >
            <button
              type="button"
              class="btn btn-default mr-2"
              @click="removeBlock"
            >
              {{ $t("cancel") }}
            </button>

            <button
              type="button"
              class="btn btn-secondary mr-1"
              @click="BackTwo"
            >
              <i class="fa fa-chevron-circle-left"></i> {{ $t("back") }}
            </button>

            <button type="submit" class="btn btn-success" v-if="confirm">
              {{ $t("create_agree") }} <i class="fa fa-file-contract"></i>
            </button>
          </div>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<style scoped>
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #a4a4a4;
  opacity: 0.8; /* Firefox */
}
</style>
