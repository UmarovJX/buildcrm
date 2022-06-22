<template>
  <main>
    <div class="app-content">
      <!--
       <div class="go__back__button">-->
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
      <!--      </div>
      -->

      <base-bread-crumb
          :bread-crumbs="breadCrumbs"
          :active-content="activeContent"
          class="mb-4"
      >
      </base-bread-crumb>

      <!-- Step 1 -->
      <div class="new-object p-3" v-if="contract.step === 1">
        <validation-observer ref="observer" v-slot="{handleSubmit}">
          <form ref="form" @submit.prevent="handleSubmit(postStore);showValidationMessage()">
            <div class="row">
              <!-- Изменить дата договора -->
              <div
                  class="col-12 mb-2"
                  v-if="
                  (getMe.role && getMe.role.id === 1) ||
                    (getPermission.contracts && getPermission.contracts.date)
                "
              >
                <div class="row">
                  <div class="col-md-4">
                    <div class="row">
                      <div class="col-10 pr-0">
                        <validation-provider
                            :name="`'${$t('apartments.agree.number')}'`"
                            :rules="{required: true}"
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
                                v-model="order.contract_number"
                                :state="getValidationState(validationContext)"
                                aria-describedby="number-feedback"
                                disabled
                                @focus="userFocused"
                            ></b-form-input>

                            <b-form-invalid-feedback class="error__provider" id="number-feedback">
                              {{ validationContext.errors[0] }}
                            </b-form-invalid-feedback>
                          </b-form-group>
                        </validation-provider>
                      </div>
                      <!--                      <div class="col-2 p-0 mt-2">-->
                      <!--                        <b-button-->
                      <!--                            type="button"-->
                      <!--                            v-if="!edited.toggle"-->
                      <!--                            @click="[(edited.toggle = true)]"-->
                      <!--                            variant="primary"-->
                      <!--                            size="sm"-->
                      <!--                            class="mt-4 ml-auto w-100"-->
                      <!--                            style="height: 38px"-->
                      <!--                        >-->
                      <!--                          <i class="fal fa-edit"></i>-->
                      <!--                        </b-button>-->
                      <!--                        <b-button-->
                      <!--                            type="button"-->
                      <!--                            v-else-->
                      <!--                            @click="-->
                      <!--                            [-->
                      <!--                              (edited.toggle = false),-->
                      <!--                              (edited.contract_number = true),-->
                      <!--                            ]-->
                      <!--                          "-->
                      <!--                            variant="success"-->
                      <!--                            size="sm"-->
                      <!--                            class="mt-4 ml-auto w-100"-->
                      <!--                            style="height: 38px"-->
                      <!--                        >-->
                      <!--                          <i class="fal fa-save"></i>-->
                      <!--                        </b-button>-->
                      <!--                      </div>-->
                    </div>
                  </div>

                  <div class="col-md-4">
                    <validation-provider
                        :name="`'${$t('apartments.agree.date_contract')}'`"
                        :rules="{required: false}"
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
                            :disabled="order.status === 'sold'"
                            v-model="order.contract_date"
                            :state="getValidationState(validationContext)"
                            aria-describedby="date-feedback"
                            @focus="userFocused"
                        ></b-form-input>

                        <b-form-invalid-feedback id="date-feedback" class="error__provider">
                          {{ validationContext.errors[0] }}
                        </b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>

                <hr/>
              </div> <!-- Изменить дата договора END -->


              <!--  client form -->
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
                    :name="$t('apartments.agree.first_payment_date')"
                    :rules="{required: false}"
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
                        :disabled="order.status === 'sold'"
                        v-model="order.first_payment_date"
                        :state="getValidationState(validationContext)"
                        aria-describedby="first_payment_date-feedback"
                        @focus="userFocused"
                    ></b-form-input>

                    <b-form-invalid-feedback id="first_payment_date-feedback" class="error__provider">
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
                      v-model="order.payment_date"
                      id="payment_date"
                      :disabled="order.status === 'sold'"
                      type="date"
                      class="form-control"
                      @focus="userFocused"
                  />
                </div>
              </div>

            </div>
            <!-- row end  -->

            <base-validation-bottom-warning v-if="hasValidationError"/>

            <!-- removeBlock -->
            <div class=" d-flex justify-content-end flex-md-row flex-column">
              <button
                  type="button"
                  class="btn btn-default mx-md-2"
                  @click="cancelForm"
              >
                {{ $t("cancel") }}
              </button>
              <button v-if="!buttons.loading" type="submit" class="btn btn-success">
                Продолжить
                <i class="fa fa-file-contract"></i>
              </button>
              <button
                  v-if="buttons.loading && buttons.confirm"
                  type="button"
                  class="btn btn-success"
              >
                Продолжить
                <i class="fas fa-spinner fa-spin"></i>
              </button>
            </div>
          </form>
        </validation-observer>
      </div>

      <!--      Step 2-->
      <div
          v-if="(order.status !== 'sold') && contract.step === 2"
          class="container-fluid px-0 mx-0"
      >
        <form ref="form" @submit.stop.prevent="sendForm">
          <div class="row">
            <!-- Таблица ежемесячных платежей -->
            <div class="col-xl-8">
              <MonthlyPayments
                  :client="client"
                  :contract="contract"
                  :apartments="apartments"
                  @MonthlyEdit="MonthlyEdit"
              ></MonthlyPayments>
            </div>

            <div class="col-xl-4 h-auto">
              <div class="sticky-top" style="z-index: 1">
                <ClientInformation
                    :client="client"
                />
                <ApartmentsList
                    :apartments="apartments"
                    :contract="contract"
                    @changePrice="initialCalc"
                />
                <Calculator
                    :client="client"
                    :apartments="apartments"
                    :contract="contract"
                    :discounts="discounts"
                    :payment-details="paymentDetails"
                    :schedule="schedule"
                    @changeDiscount="changeDiscount"
                />
                <Confirm
                    :order="order"
                    :client="client"
                    :apartments="apartments"
                    :contract="contract"
                    :discounts="discounts"
                    :buttons="buttons"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <b-overlay
        :show="buttons.loading"
        no-wrap opacity="0.5"
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

    <SuccessAgree
        :contract="contract"
        :apartments="2"
        @redirect-to-main-page="redirectToTheMainPage"
    />
  </main>
</template>

<script>
// import VueNumeric from "vue-numeric";
// import FlipCountdown from "vue2-flip-countdown";
// import QuickViewApartments from "./Components/QuickViewApartments";
import {mapActions, mapGetters} from "vuex";
import SuccessAgree from "./Components/SuccessAgree";
import ClientInputConfirm from "./Components/ClientInputConfirm";
import MonthlyPayments from "./Contract/MonthlyPayments";
import ClientInformation from "./Contract/ClientInformation";
import ApartmentsList from "./Contract/ApartmentsList";
import BaseBreadCrumb from "@/components/BaseBreadCrumb";
import Calculator from "./Contract/Calculator";
import Confirm from "./Contract/Confirm";
import BaseValidationBottomWarning from "@/components/Reusable/BaseValidationBottomWarning";

import {
  editedCreditMonths,
  getDebt,
  getDiscount,
  getPrepay,
  getPrice,
  getPricePerM2,
  getTotal
} from "@/util/calculator";

import moment from "moment";
import api from "@/services/api";

export default {
  name: "EditApartment",

  components: {
    // VueNumeric,
    // FlipCountdown,
    BaseValidationBottomWarning,
    ClientInputConfirm,
    SuccessAgree,
    MonthlyPayments,
    ClientInformation,
    ApartmentsList,
    BaseBreadCrumb,
    Calculator,
    Confirm,
  },

  data() {
    return {
      // expiry_at: null,
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

      // order: {},

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
        edited: 0
      },

      calc: {
        price_for_m2: null
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
      paymentDetails: {},
      schedule: {}
    }
  },

  computed: {
    ...mapGetters([
      "getReserveClient",
      "getPermission",
      "getMe",
      // "getApartmentOrder",
    ]),
    objectName() {
      if (this.apartments?.length) {
        return this.apartments[0].object.name
      }
      return '';
    },
    breadCrumbs() {
      return [
        {
          routeName: 'objects',
          textContent: this.$t('objects.title')
        },
        {
          routeName: 'apartments',
          textContent: this.objectName,
          params: {
            object: this.$route.params.object
          }
        },
        {
          routeName: '',
          textContent: this.$t('objects.create.apartment')
        },
      ]
    },
    activeContent() {
      return this.$t('objects.booking')
    },
    // apartmentInfoItem() {
    //   let val = this.getApartmentOrder;
    //   if (val) {
    //     return {
    //       contract_number: val.contract_number,
    //       created_by: val.created_by,
    //        : this.$moment(val.expiry_at)
    //           .utcOffset("+0500")
    //           .format("YYYY-MM-DD h:mm:ss"),
    //       status: val.status,
    //       uuid: val.uuid,
    //     };
    //   }
    //   return {};
    // },

  },

  watch: {
    'order.payment_date'(lastValue) {
      this.contract.payment_date = lastValue
    }
  },

  created() {
    // this.backToView();

    // this.expiry_at = this.$moment(this.getApartmentOrder.expiry_at)
    //     .utcOffset("+0500")
    //     .format("YYYY-MM-DD H:mm:ss");
  },

  async mounted() {
    await this.getClientData()
  },

  methods: {
    async getClientData() {
      const uuid = this.$route.params.id
      await api.contractV2.getUpdateContractView(uuid).then((res) => {
        this.order = res.data
        this.discounts = res.data.apartments[0].discounts
        this.contract.payment_date = res.data.payment_date
        if (res.data.status === 'contract') {
          this.contract = {
            ...this.contract,
            initial_payments: res.data.schedule.initial_payment,
            credit_months: res.data.schedule.monthly,
            first_payment_date: res.data.first_payment_date,
            monthly_payments: res.data.schedule.monthly,
            discount: res.data['payments_details']?.discount ?? this.discounts[0],
            discount_amount: res.data.discount_amount
          }
          this.paymentDetails = res.data['payments_details']
          this.schedule = res.data.schedule
        }
        this.apartments = this.order.apartments
        this.client = {...this.client, ...res.data.client}
      })
    },
    ...mapActions(["fetchApartmentOrder"]),

    async showValidationMessage() {
      const validate = await this.$refs.observer.validate()
      this.hasValidationError = !validate
    },

    userFocused() {
      this.hasValidationError = false
    },

    backToView() {
      if (this.order.status === "sold") {
        this.$router.push({
          name: "contracts-view",
          params: {id: this.$route.params.id},
        });
      }
    },

    redirectToTheMainPage() {
      this.$router.push({
        name: 'contracts-view',
        params: {
          id: this.$route.params.id
        }
      })
    },

    goBackToLastStep() {
      if (this.contract.step === 1) {
        this.$router.go(-1)
      }

      if (this.contract.step === 2) {
        this.contract.step = 1
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
      await api.clientsV2.createClient(this.client)
          .then((response) => {
            this.buttons.loading = false;
            if (response) {
              this.client = {
                ...response.data,
                type_client: 'unknown'
              }
              if (this.order.status === 'sold') {
                api.contractV2.orderUpdate(this.order.id,
                    {
                      client_id: response.data.id
                    }).then(res => {
                  this.toasted(res.data.message, "success");
                  this.backToView()
                  this.onSubmit();
                }).catch(error => {
                  this.toasted(error.response.data.message, "error");
                })
              } else if (this.order.status === 'contract') {
                this.onSubmit();
              } else {
                this.onSubmit();
              }
            }
          })
          .catch((error) => {
            console.log(error)

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
      this.contract.month = this.deepClone(this.order.payments_details.month)
      // this.setData();
    },

    getValidationState({dirty, validated, valid = null}) {
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
      this.client = event
    },

    // timeElapsedHandler() {
    //   console.log("Time is up!");
    //   this.expiredConfirm();
    // },

    // async expiredConfirm() {
    //   try {
    //     this.loading = true;
    //     await api.orders.deactivateOrderHold(this.getApartmentOrder.uuid)
    //         .then(() => {
    //           this.$router.push({
    //             name: "apartments",
    //           });
    //         })
    //         .catch();
    //   } catch (error) {
    //     this.toastedWithErrorCode(error);
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    deepCloneFromApartments(obj) {
      let temp;
      if (obj === null || typeof obj !== "object") return obj;
      if (obj instanceof Date) temp = new obj.constructor();
      else temp = obj.constructor();

      for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          temp[key] = this.deepCloneFromApartments(obj[key]);
        }
      }
      return temp;
    },
    // setData() {
    //   //   this.order = this.deepCloneFromApartments(
    //   //       this.getApartmentOrder.apartments
    //   //   );
    //   //
    //   this.apartments = this.deepClone(this.order.apartments);
    //   //
    //   let discounts = this.apartments[0].discounts;
    //   //
    //   discounts = discounts.sort((a, b) => a.prepay - b.prepay);
    //   //
    //   this.discounts = discounts;
    //   // this.contract.discount = discounts[0];
    //   //   // console.log(getPrice(this.apartments, this.contract))
    //   this.initialCalc();
    //   //
    // },

    initialCalc() {
      // this.calc.prepay = this.getPrepay();
      getTotal(this.apartments, this.contract)
      getPrepay(this.apartments, this.contract)
      getDiscount(this.apartments, this.contract)
      getPrice(this.apartments, this.contract)
      getDebt(this.apartments, this.contract)
      getPricePerM2(this.apartments, this.contract)
      editedCreditMonths(this.apartments, this.contract)
      this.contract.edited = this.contract.edited + 1
      // this.contract.prepay_amount = getPrepay(this.apartments, this.contract)
    },

    MonthlyEdit() {
      this.edited.monthly = true
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
          this.buttons.loading = true
          const context = {}
          context.discount_id = this.contract.discount.id

          if (this.edited.contract_number) {
            context.type_client = this.client.type_client
          }

          context.client_id = this.client?.id

          if (this.getMe.role.id === 1 || this.getPermission.contracts.monthly) {
            if (this.edited.monthly) {
              for (let monthly = 0; monthly < this.contract.monthly_payments.length; monthly++) {
                let date = moment(this.contract.monthly_payments[monthly].month).format(
                    "YYYY-MM-DD"
                )
                context.monthly[monthly]['edited'] = this.contract.monthly_payments[monthly].edited ? 1 : 0
                context.monthly[monthly]['amount'] = this.contract.monthly_payments[monthly].amount
                context.monthly[monthly]['date'] = date
              }
            }
          }

          if (this.contract.initial_payments.length > 1) {
            for (let initial_payment = 0; initial_payment < this.contract.initial_payments.length; initial_payment++) {
              context.initial_payments[initial_payment]['edited'] = this.contract.initial_payments[initial_payment].edited ? 1 : 0
              context.initial_payments[initial_payment]['amount'] = this.contract.initial_payments[initial_payment].amount
              context.initial_payments[initial_payment]['date'] = this.contract.initial_payments[initial_payment].date
            }
          } else {
            if (this.contract.prepay_edited) {
              context.prepay_edited = 1
              context.initial_payments[0]['edited'] = 1
              context.initial_payments[0]['amount'] = this.contract.prepay_amount
              context.initial_payments[0]['date'] = this.contract.first_payment_date
            }
          }

          context.comment = this.contract.comment
          context.months = parseInt(this.contract.month)
          context.first_payment_date = this.order.first_payment_date
          context.discount_amount = this.contract.discount_amount

          if (this.contract.discount?.id === 'other') {
            for (let index = 0; index < this.apartments.length; index++) {
              context.apartments[index]['id'] = this.apartments[index].id
              context.apartments[index]['price'] = this.apartments[index].price_calc
            }
          }

          context.contract_date = this.order.contract_date

          if (this.contract.payment_date) {
            context.payment_date = this.contract.payment_date
          }

          if (this.edited.contract_number && this.contract.number !== this.order.contract_number) {
            context.contract_number = this.contract.number
          }

          api.contractV2.contractOrderUpdate(this.order.id, context)
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
              }).finally(() => {
            this.buttons.loading = false;
          })
        }
      })

    },
    changeDiscount() {
      this.initialCalc()
      // this.$emit('changeApartments', this.apartments)
      editedCreditMonths(this.apartments, this.contract)
    }
  }
}
</script>

<style scoped>
.error__provider {
  color: red;
  display: block;
  font-size: 14px;
}
</style>