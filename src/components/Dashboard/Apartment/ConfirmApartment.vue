<script>
// import VueNumeric from "vue-numeric";
// import QuickViewApartments from "./Components/QuickViewApartments";
import { mapActions, mapGetters } from "vuex";
// import FlipCountdown from "vue2-flip-countdown";
import SuccessAgree from "./Components/SuccessAgree";
import ClientInputConfirm from "./Components/ClientInputConfirm";
import MonthlyPayments from "./Contract/MonthlyPayments";
import ClientInformation from "./Contract/ClientInformation";
import ApartmentsList from "./Contract/ApartmentsList";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import BaseValidationBottomWarning from "@/components/Reusable/BaseValidationBottomWarning";
import Calculator from "./Contract/Calculator";
import Confirm from "./Contract/Confirm";
import CountDown from "@/components/Reusable/CountDown";
import {
  editedCreditMonths,
  getDebt,
  getDiscount,
  getPrepay,
  getPrice,
  getPricePerM2,
  getTotal,
} from "@/util/calculator";
import api from "@/services/api";

import CheckoutPermission from "@/permission/checkout";
import { formatDateWithDot } from "@/util/reusable";

import AppHeader from "@/components/Header/AppHeader";

export default {
  name: "ConfirmApartment",
  components: {
    BaseValidationBottomWarning,
    // FlipCountdown,
    ClientInputConfirm,
    SuccessAgree,
    MonthlyPayments,
    ClientInformation,
    ApartmentsList,
    BaseBreadCrumb,
    Calculator,
    Confirm,
    AppHeader,
    CountDown,
  },

  data() {
    return {
      expiry_at: null,
      order: {},
      hasValidationError: false,
      apartments: [],
      discounts: [],

      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },

      client: {
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
        passport_series: null,
        issued_by_whom: null,
        date_of_issue: null,
        language: "uz",
        type_client: "unknown",
        birth_day: null,
        phone: null,
        other_phone: null,
        first_payment_date: null,
        payment_date: null,
      },

      contract: {
        step: 1,
        month: 0,
        number: null,
        date: null,
        first_payment_date: null,
        payment_date: null,

        initial_payments: [],
        monthly_payments: [],
        credit_months: [],

        discount: {},
        discount_amount: 0,
        discount_square: 0,

        prepay_amount: 0,
        prepay_edited: false,

        comment: null,
        edited: 0,
      },

      calc: {
        price_for_m2: null,
      },

      buttons: {
        loading: false,
        confirm: false,
        next: false,
      },

      edited: {
        contract_number: false,
        toggle: false,
        monthly: false,
        apartmentsPrice: false,
        // edit_pri
      },

      error: false,
      errors: {},
      getErrors: [],
      editDatePermission: CheckoutPermission.getEditDatePermission(),
      monthlyPermission: CheckoutPermission.getMonthlyPaymentPermission(),
    };
  },

  computed: {
    ...mapGetters([
      "getReserveClient",
      "getPermission",
      "getMe",
      "getApartmentOrder",
      "getCalcData",
    ]),
    flexCenter() {
      return "d-flex justify-content-center align-items-center";
    },
    objectName() {
      if (this.order.apartments?.length) {
        return this.order.apartments[0].object.name;
      }
      return "";
    },
    apartmentNumber() {
      if (this.order && this.order.apartments) {
        return this.order.apartments[0].number;
      }
      return "";
    },
    breadCrumbs() {
      return [
        {
          routeName: "objects",
          textContent: this.$t("objects.title"),
        },
        {
          routeName: "apartments",
          textContent: this.objectName,
          params: {
            object: this.$route.params.object,
          },
        },
        {
          routeName: "",
          textContent: this.$t("objects.create.apartment"),
        },
      ];
    },
    activeContent() {
      return this.$t("objects.contract");
    },
  },

  created() {
    this.backToView();
    this.expiry_at = this.$moment(this.getApartmentOrder.expiry_at)
      .utcOffset("+0500")
      .format("YYYY-MM-DD H:mm:ss");
  },

  async mounted() {
    await this.fetchApartmentOrder(this);
    this.order = this.deepClone(this.getApartmentOrder);
    this.contract.number = this.deepClone(this.order.contract_number);

    const current = this.$moment(new Date())
      .utcOffset("+0500")
      .format("YYYY-MM-DD H:mm:ss");

    const expired = this.$moment(this.order.expiry_at)
      .utcOffset("+0500")
      .format("YYYY-MM-DD H:mm:ss");

    this.expiry_at = expired;

    const time = new Date(current) - new Date(expired);
    if (time > 0) {
      this.timeElapsedHandler();
    }
  },

  methods: {
    ...mapActions(["fetchApartmentOrder"]),
    async showValidationMessage() {
      const validate = await this.$refs.observer.validate();
      this.hasValidationError = !validate;
    },

    redirectToTheMainPage() {
      this.expiredConfirm();
    },

    userFocused() {
      this.hasValidationError = false;
    },

    backToView() {
      // if (this.apartmentInfoItem.status == "contract") {
      //   this.$router.push({
      //     name: "apartment-view",
      //     params: {id: this.$route.params.id},
      //   });
      // }
    },

    goBackToLastStep() {
      if (this.contract.step === 1) {
        this.$router.go(-1);
      }

      if (this.contract.step === 2) {
        this.contract.step = 1;
      }
    },

    deepClone(obj) {
      let temp;
      if (obj === null || typeof obj !== "object") return obj;
      if (obj instanceof Date) temp = new obj.constructor();
      else temp = obj.constructor();

      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          temp[key] = this.deepClone(obj[key]);
        }
      }
      return temp;
    },

    async postStore() {
      this.buttons.loading = true;
      await api.clientsV2
        .createClient(this.client)
        .then((response) => {
          this.buttons.loading = false;
          if (response) {
            this.client = {
              ...response.data,
              type_client: "unknown",
            };
            this.onSubmit();
          }
        })
        .catch((error) => {
          console.log(error);

          this.buttons.loading = false;
          if (!error.response) {
            this.toasted("Error: Network Error", "error");
          } else {
            if (error.response.status === 403) {
              this.toasted(error.response.data.message, "error");
            } else if (error.response.status === 401) {
              this.toasted(error.response.data, "error");
            } else if (error.response.status === 500) {
              this.toasted(error.response.data.message, "error");
            } else if (error.response.status === 422) {
              this.error = true;
              this.getErrors = error.response.data;
            } else {
              this.toasted(error.response.data.message, "error");
            }
          }
        });
    },

    onSubmit() {
      this.contract.step = 2;
      this.buttons.confirm = true;
      this.buttons.next = false;
      const hasLength = Object.keys(this.getCalcData).length;
      if (hasLength) {
        this.contract.month = parseInt(this.getCalcData.month);
      } else {
        this.contract.month = this.deepClone(
          this.order.apartments[0].object.credit_month
        );
      }
      this.setData();
    },

    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },

    cancelForm() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_agree"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes_close"),
      }).then((result) => {
        if (result.value) {
          this.expiredConfirm();
        }
      });
    },

    ClientSet(event) {
      this.client = event;
    },

    timeElapsedHandler() {
      console.log("Time is up!");
      this.expiredConfirm();
    },

    async expiredConfirm() {
      try {
        this.loading = true;
        await api.orders
          .deactivateOrderHold(this.getApartmentOrder.uuid)
          .then(() => {
            this.$router.push({
              name: "apartments",
            });
          })
          .catch();
      } catch (error) {
        this.toastedWithErrorCode(error);
      } finally {
        this.loading = false;
      }
    },

    setData() {
      // this.order = this.deepCloneFromApartments(
      //     this.getApartmentOrder.apartments
      // );

      this.apartments = this.deepClone(this.order.apartments);

      let discounts = this.apartments[0].discounts;

      discounts = discounts.sort((a, b) => a.prepay - b.prepay);

      this.discounts = discounts;
      this.contract.discount = discounts[0];
      // console.log(getPrice(this.apartments, this.contract))
      this.initialCalc();
    },

    initialCalc() {
      // this.calc.prepay = this.getPrepay();
      getTotal(this.apartments, this.contract);
      getPrepay(this.apartments, this.contract);
      getDiscount(this.apartments, this.contract);
      getPrice(this.apartments, this.contract);
      getDebt(this.apartments, this.contract);
      getPricePerM2(this.apartments, this.contract);
      editedCreditMonths(this.apartments, this.contract);
      this.contract.edited = this.contract.edited + 1;
      // this.contract.prepay_amount = getPrepay(this.apartments, this.contract)
    },

    editMonthly() {
      this.edited.monthly = true;
    },

    datePrettier(value) {
      if (typeof value === "string") return value;
      return formatDateWithDot(value);
    },

    async sendForm() {
      if (this.contract.discount && this.contract.discount.id === null) return;

      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_agree"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes_agree"),
      }).then((result) => {
        if (result.value) {
          this.buttons.loading = true;
          const formData = new FormData();
          formData.append("discount_id", this.contract.discount.id);

          if (this.edited.contract_number)
            formData.append("type_client", this.client.type_client);

          // formData.append("monthly_edited", this.edit.monthly_edited ? 1 : 0);
          formData.append("client_id", this.client?.id);

          if (this.monthlyPermission) {
            if (this.edited.monthly) {
              for (
                let monthly = 0;
                monthly < this.contract.credit_months.length;
                monthly++
              ) {
                let date = "";
                if (
                  typeof this.contract.credit_months[monthly].month === "string"
                ) {
                  date = this.contract.credit_months[monthly].month;
                } else {
                  date = this.datePrettier(
                    this.contract.credit_months[monthly].month
                  );
                }
                // let date = moment(this.contract.credit_months[monthly].month).format(
                //     "YYYY-MM-DD"
                // );

                formData.append(
                  "monthly[" + monthly + "][edited]",
                  this.contract.credit_months[monthly].edited ? 1 : 0
                );
                formData.append(
                  "monthly[" + monthly + "][amount]",
                  this.contract.credit_months[monthly].amount
                );
                formData.append("monthly[" + monthly + "][date]", date);
              }
            }
          }

          if (this.contract.initial_payments.length > 1) {
            for (
              let initial_payment = 0;
              initial_payment < this.contract.initial_payments.length;
              initial_payment++
            ) {
              formData.append(
                "initial_payments[" + initial_payment + "][edited]",
                this.contract.initial_payments[initial_payment].edited ? 1 : 0
              );
              formData.append(
                "initial_payments[" + initial_payment + "][amount]",
                this.contract.initial_payments[initial_payment].amount
              );
              formData.append(
                "initial_payments[" + initial_payment + "][date]",
                this.contract.initial_payments[initial_payment].date
              );
            }
          } else {
            if (this.contract.prepay_edited) {
              formData.append("prepay_edited", 1);

              formData.append("initial_payments[0][edited]", 1);
              formData.append(
                "initial_payments[0][amount]",
                this.contract.prepay_amount
              );
              formData.append(
                "initial_payments[0][date]",
                this.contract.first_payment_date
              );
            }
          }

          formData.append("comment", this.contract.comment);
          formData.append("months", this.contract.month);

          formData.append(
            "first_payment_date",
            this.contract.first_payment_date
          );

          formData.append("discount_amount", this.contract.discount_amount);
          // }

          if (this.contract.discount.id === "other") {
            for (let index = 0; index < this.apartments.length; index++) {
              formData.append(
                "apartments[" + index + "][id]",
                this.apartments[index].id
              );

              formData.append(
                "apartments[" + index + "][price]",
                this.apartments[index].price_calc
              );
            }
          }

          // formData.append("date_change", 1);
          if (this.contract.date) {
            formData.append("contract_date", this.contract.date);
          }

          if (this.contract.payment_date) {
            formData.append("payment_date", this.contract.payment_date);
          }

          // if(this.contract.discount_amount > 0) {
          //   console.log("DDD " + this.contract.discount_amount)

          // if (this.contract.step === 1 && this.status.discount.prepay !== 100) {
          // formData.append("months", this.month);
          // }

          if (
            this.edited.contract_number &&
            this.contract.number !== this.order.contract_number
          ) {
            formData.append("contract_number", this.contract.number);
          }

          api.orders
            .reserveApartment(this.order?.uuid, formData)
            .then((response) => {
              this.toasted(response.data.message, "success");
              this.$bvModal.hide("modal-agree");
              this.contract = response.data;
              this.$bvModal.show("modal-success-agree");
            })
            .catch((error) => {
              if (!error.response) {
                this.toasted("Error: Network Error", "error");
              } else {
                if (error.response.status === 403) {
                  this.toasted(error.response.data.message, "error");
                } else if (error.response.status === 401) {
                  this.toasted(error.response.data, "error");
                } else if (error.response.status === 500) {
                  this.toasted(error.response.data.message, "error");
                } else if (error.response.status === 422) {
                  this.error = true;
                  this.geteErrors = error.response.data;
                } else {
                  this.toasted(error.response.data.message, "error");
                }
              }
            })
            .finally(() => {
              this.buttons.loading = false;
            });
        }
      });
    },

    changeDiscount() {
      this.initialCalc();
      // this.$emit('changeApartments', this.apartments)
      editedCreditMonths(this.apartments, this.contract);
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("apartment_make_contract") }} №{{ apartmentNumber }}
      </template>

      <template #header-actions>
        <div
          v-if="expiry_at"
          :class="flexCenter"
          class="checkout-timer background-violet-gradient mr-2"
        >
          <CountDown
            :deadline="expiry_at"
            :showDays="false"
            :showHours="false"
            @timeElapsed="timeElapsedHandler"
          />
        </div>
      </template>
    </app-header>

    <div>
      <!--      <div class="go__back__button">-->
      <!--        <button-->
      <!--            class="btn-back d-block"-->
      <!--            @click="goBackToLastStep"-->
      <!--        >-->
      <!--          <i class="fal fa-arrow-left mr-2"></i>-->
      <!--          <span>{{ $t('go_back') }}</span>-->
      <!--        </button>-->
      <!--      </div>-->
      <!--      <div class="countdown-timer" draggable="true">-->
      <!--        <flip-countdown-->
      <!--            :deadline="expiry_at"-->
      <!--            :showDays="false"-->
      <!--            :showHours="false"-->
      <!--            @timeElapsed="timeElapsedHandler"-->
      <!--        ></flip-countdown>-->
      <!--      </div>-->

      <base-bread-crumb
        :bread-crumbs="breadCrumbs"
        :active-content="activeContent"
        class="mb-4"
      >
      </base-bread-crumb>
      <!-- Step 1 -->
      <div class="new-object p-3" v-if="contract.step === 1">
        <validation-observer ref="observer" v-slot="{ handleSubmit }">
          <form
            ref="form"
            @submit.prevent="
              handleSubmit(postStore);
              showValidationMessage();
            "
          >
            <div class="row">
              <!-- Изменить дата договора -->
              <div class="col-12 mb-2">
                <div class="row">
                  <div class="col-md-4">
                    <div class="row">
                      <div class="col-10 pr-0">
                        <validation-provider
                          :name="`'${$t('apartments.agree.number')}'`"
                          :rules="{ required: true }"
                          v-slot="validationContext"
                          class="mb-3"
                        >
                          <b-form-group
                            :label="$t('apartments.agree.number')"
                            label-for="number"
                          >
                            <b-form-input
                              id="number"
                              name="number"
                              type="text"
                              :placeholder="
                                $t('apartments.agree.placeholder.number')
                              "
                              v-model="contract.number"
                              :state="getValidationState(validationContext)"
                              aria-describedby="number-feedback"
                              :disabled="!edited.toggle"
                              @focus="userFocused"
                            ></b-form-input>

                            <b-form-invalid-feedback
                              class="error__provider"
                              id="number-feedback"
                            >
                              {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </div>
                      <div class="col-2 p-0 mt-2">
                        <b-button
                          type="button"
                          v-if="!edited.toggle"
                          @click="[(edited.toggle = true)]"
                          variant="primary"
                          size="sm"
                          class="mt-4 ml-auto w-100"
                          style="height: 38px"
                        >
                          <i class="fal fa-edit"></i>
                        </b-button>
                        <b-button
                          type="button"
                          v-else
                          @click="
                            [
                              (edited.toggle = false),
                              (edited.contract_number = true),
                            ]
                          "
                          variant="success"
                          size="sm"
                          class="mt-4 ml-auto w-100"
                          style="height: 38px"
                        >
                          <i class="fal fa-save"></i>
                        </b-button>
                      </div>
                    </div>
                  </div>

                  <div v-if="editDatePermission" class="col-md-4">
                    <validation-provider
                      :name="`'${$t('apartments.agree.date_contract')}'`"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                      class="mb-3"
                    >
                      <b-form-group
                        :label="$t('apartments.agree.date_contract')"
                        label-for="date"
                      >
                        <b-form-input
                          id="date"
                          name="date"
                          type="date"
                          :placeholder="
                            $t('apartments.agree.placeholder.date_contract')
                          "
                          v-model="contract.date"
                          :state="getValidationState(validationContext)"
                          aria-describedby="date-feedback"
                          @focus="userFocused"
                        ></b-form-input>

                        <b-form-invalid-feedback
                          id="date-feedback"
                          class="error__provider"
                        >
                          {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>

                <hr />
              </div>
              <!-- Изменить дата договора END -->

              <!--  status form -->
              <div class="col-md-12">
                <ClientInputConfirm
                  :client="client"
                  @clientSet="ClientSet"
                  @focus="userFocused"
                ></ClientInputConfirm>
              </div>

              <!-- apartments.agree.first_payment_date -->
              <div class="col-md-4">
                <validation-provider
                  :name="`${$t('apartments.agree.first_payment_date')}`"
                  :rules="{ required: true }"
                  v-slot="validationContext"
                  class="mb-3"
                >
                  <b-form-group
                    :label="$t('apartments.agree.first_payment_date')"
                    label-for="first_payment_date"
                  >
                    <b-form-input
                      id="first_payment_date"
                      name="first_payment_date"
                      type="date"
                      v-model="contract.first_payment_date"
                      :state="getValidationState(validationContext)"
                      aria-describedby="first_payment_date-feedback"
                      @focus="userFocused"
                    ></b-form-input>

                    <b-form-invalid-feedback
                      id="first_payment_date-feedback"
                      class="error__provider"
                    >
                      {{ validationContext.errors[0] }}
                    </b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>

              <!-- apartments.agree.payment_date -->
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="d-block" for="payment_date">
                    {{ $t("apartments.agree.payment_date") }}
                  </label>
                  <input
                    v-model="contract.payment_date"
                    id="payment_date"
                    type="date"
                    class="form-control"
                    @focus="userFocused"
                  />
                </div>
              </div>
            </div>
            <!-- row end  -->

            <base-validation-bottom-warning v-if="hasValidationError" />

            <!-- removeBlock -->
            <div
              class="mt-4 d-flex justify-content-end flex-md-row flex-column"
            >
              <button
                type="button"
                class="btn btn-default mx-md-2"
                @click="cancelForm"
              >
                {{ $t("cancel") }}
              </button>
              <button
                v-if="!buttons.loading"
                type="submit"
                class="btn btn-success"
              >
                {{ $t("next") }}
                <i class="fa fa-file-contract"></i>
              </button>
              <button
                v-if="buttons.loading && buttons.confirm"
                type="button"
                class="btn btn-success"
              >
                {{ $t("next") }}
                <i class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </form>
        </validation-observer>
      </div>

      <!-- Step 2 -->
      <div class="container-fluid px-0 mx-0" v-show="contract.step === 2">
        <form ref="form" @submit.stop.prevent="sendForm">
          <div class="row">
            <!-- Таблица ежемесячных платежей -->
            <div class="col-xl-8">
              <MonthlyPayments
                :client="client"
                :contract="contract"
                :apartments="apartments"
                @monthly-edit="editMonthly"
              />
            </div>

            <div class="col-xl-4 h-auto">
              <div class="sticky-top">
                <ClientInformation :client="client"></ClientInformation>
                <ApartmentsList
                  :apartments="apartments"
                  :contract="contract"
                  @changePrice="initialCalc"
                ></ApartmentsList>
                <Calculator
                  :client="client"
                  :apartments="apartments"
                  :contract="contract"
                  :discounts="discounts"
                  @changeDiscount="changeDiscount"
                ></Calculator>
                <Confirm
                  :order="order"
                  :client="client"
                  :apartments="apartments"
                  :contract="contract"
                  :discounts="discounts"
                  :buttons="buttons"
                  @redirect-to-contract="redirectToTheMainPage"
                >
                </Confirm>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <b-overlay
      :show="buttons.loading"
      no-wrap
      opacity="0.5"
      style="z-index: 9999"
    >
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>

    <success-agree
      :uuid="order.uuid"
      :contract="contract"
      :apartments="apartments.length"
    />
  </div>
</template>

<style lang="scss" scoped>
.checkout-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 30px;
  color: var(--white);
  border-radius: 28px;
  height: 56px;
  min-width: 102px;

  &-inner {
    padding: 13px 16px;
  }
}

.error__provider {
  color: red;
  display: block;
  font-size: 14px;
}

::v-deep .dropdown-menu {
  z-index: 10000 !important;
}
</style>
