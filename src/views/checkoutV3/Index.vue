<script>
import { XIcon } from "@/components/ui-components/material-icons";
import BaseButton from "@/components/Reusable/BaseButton";
import CountDown from "@/components/Reusable/CountDown";
import AppHeader from "@/components/Header/AppHeader";
import TabTitle from "@/views/checkoutV3/elements/TabTitle";
import ChClientDetails from "@/views/checkoutV3/components/ClientDetails";
import ChApartmentsOverview from "@/views/checkoutV3/components/ApartmentsOverview";
import ChReview from "@/views/checkoutV3/components/Review";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { XModalCenter } from "@/components/ui-components/modal-center";
import { XFormInput } from "@/components/ui-components/form-input";
import { XLoadingWrapper } from "@/components/ui-components/loading";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import api from "@/services/api";
import { checkoutV1 } from "@/services/checkout";
import { dateProperties } from "@/util/calendar";
import { NOTIFY } from "@/constants/names";
import { headerItems } from "@/views/checkoutV3/helper/headerComputed";
import Permission from "@/permission";

import { formatDateToYMD } from "@/util/calendar";
import {
  addMonth,
  getFullMonthDifference,
  dateForPicker,
} from "@/views/checkoutV3/helper/dateHelpers.js";

import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "Index",
  components: {
    AppBreadcrumb,
    XLoadingWrapper,
    XIcon,
    BaseButton,
    CountDown,
    AppHeader,
    TabTitle,
    ChClientDetails,
    ChApartmentsOverview,
    ChReview,
    XModalCenter,
    XFormInput,
    XCircularBackground,
  },
  // beforeRouteLeave(to, from, next) {
  //   this.clearCheckoutState();
  //   return next();
  // },
  data() {
    return {
      userComment: {
        vBind: "",
        showModal: false,
        applyButtonLoading: false,
      },
      showWarningModal: false,
      isFetching: false,
      isSubmitting: false,
      stepStateIdx: 1,
      expiry_at: undefined,
      actionTracker: {
        allowNavigate: {
          first: true,
          second: false,
          third: false,
        },
        disable: {
          first: false,
          second: true,
          third: true,
        },
      },
      permission: Permission,

      clientData: {},
      countryList: [],
      clientTypeList: [],

      order: {
        orders: [
          {
            apartment: {
              uuid: 0,
            },
            contract_number: "",
            numberUpdated: false,
            contract_date: null,
            dateUpdated: false,
            calculation: {
              type: null,
              discount: null,
              months: null,
              prepay: null,
              discount_amount: null,
              first_payment_date: null,
              monthly_payment_date: null,
              price: 0,

              installments: [],
              currentInstallment: null,
              initial_payments: 0,
            },
            pms: {
              payments: [],
              initial: false,
            },
          },
        ],
      },
      currentApartment: 0,
      calculations: {},
    };
  },

  async created() {
    this.setFunctionType(this.$route);

    if (this.isUpdateMode) {
      await this.fetchUpdateClientData();
    } else {
      await this.init();
    }
  },

  computed: {
    totalForAll() {
      if (this.stepStateIdx <= 1) return 0;
      if (this.order.orders.length > 1)
        return this.order.orders
          .map((ord) =>
            this.$refs[
              `apartment-overview-${ord.apartment.uuid}`
            ][0].getFullPayment()
          )
          .reduce((acc, el) => acc + el, 0);
      return this.$refs[
        `apartment-overview-${this.order.orders[0].apartment.uuid}`
      ].getFullPayment();
    },
    isUpdateMode() {
      const pathUnits = this.$route.path.split("/");
      return pathUnits[pathUnits.length - 1] === "update";
    },
    isCreateMode() {
      const pathUnits = this.$route.path.split("/");
      return pathUnits[pathUnits.length - 1] !== "update";
    },
    headerItems,
    flexCenter() {
      return "d-flex justify-content-center align-items-center";
    },
  },

  methods: {
    handleContractDate(e) {
      const ord = this.order.orders.find((el) => el.uuid === e.uuid);
      ord.contract_date = e.value;
      ord.dateUpdated = true;
    },
    handleContractNumber(e) {
      const ord = this.order.orders.find((el) => el.uuid === e.uuid);
      ord.contract_number = e.value;
      ord.numberUpdated = true;
    },
    handlePaymentsUpd(e) {
      const ord = this.order.orders.find((el) => el.uuid === e.uuid);
      ord.pms.payments = e.payments;
    },
    async handleCalcUpdate(e) {
      const ord = this.order.orders.find((el) => el.uuid === e.uuid);

      if (e.field === "discount") {
        ord.calculation.discount = e.value.id;
        ord.calculation.prepay = e.value.prepay;
        ord.calculation.price =
          e.value.id === "other" ? ord.apartment.price : 0;
        if (ord.calculation.type === "installment") {
          this.updateInstallments(
            ord,
            ord.apartment.discounts.find(
              (el) => el.id === ord.calculation.discount
            )
          );
        }
        return;
      }

      if (e.field === "type") {
        if (e.value === "installment") {
          const d = ord.apartment.discounts.find((el) => el.type !== "percent");
          if (
            ord.calculation.discount === "other" ||
            ord.apartment.discounts.find(
              (el) => el.id === ord.calculation.discount
            ).type === "percent"
          ) {
            ord.calculation.discount = d.id;
          }
          await this.updateInstallments(ord, d);
        }
        ord.calculation.type = e.value;
        return;
      }
      if (e.field === "currentInstallment") {
        ord.calculation[e.field] = e.value;

        ord.calculation.months = ord.calculation.installments.find(
          (el) => el.id === ord.calculation.currentInstallment
        ).months;
        return;
      }
      if (e.field === "initial_payments") {
        ord.calculation[e.field] = e.value;
        const newD = addMonth(
          new Date(ord.calculation.first_payment_date),
          ord.calculation.initial_payments
        );
        if (new Date(ord.calculation.monthly_payment_date) < newD)
          ord.calculation.monthly_payment_date = dateForPicker(newD);
        return;
      }

      if (e.field === "first_payment_date") {
        ord.calculation[e.field] = e.value;
        const newD = addMonth(
          new Date(ord.calculation.first_payment_date),
          ord.calculation.initial_payments
        );
        if (new Date(ord.calculation.monthly_payment_date) < newD)
          ord.calculation.monthly_payment_date = dateForPicker(newD);
        return;
      }
      if (e.field === "monthly_payment_date") {
        ord.calculation[e.field] = e.value;
        const diff = getFullMonthDifference(
          new Date(ord.calculation.monthly_payment_date),
          new Date(ord.calculation.first_payment_date)
        );
        ord.calculation.initial_payments = Math.max(Math.min(diff, 2), 1);
        return;
      }

      ord.calculation[e.field] = e.value;
    },
    handleCountryList(e) {
      this.countryList = e;
    },
    handleClientTypeList(e) {
      this.clientTypeList = e;
    },
    ...mapMutations("CheckoutV2", ["reset", "setFunctionType"]),
    ...mapActions("notify", ["openNotify"]),
    async init() {
      try {
        this.startFetching();
        const orderId = this.$route.params.id;
        const { data } = await api.orders.fetchCheckoutData(orderId);
        if (data) {
          this.expiry_at = data.expiry_at;
          data.orders.forEach((e) => {
            e.contract_date || (e.contract_date = dateForPicker(new Date()));
            e.calculation = {
              type: "custom",
              discount: e.apartment.discounts[0].id,
              months: e.apartment.object.credit_month,
              prepay: e.apartment.discounts[0].prepay,
              discount_amount: 0,
              first_payment_date: formatDateToYMD(new Date()),
              monthly_payment_date: formatDateToYMD(addMonth(new Date(), 1)),
              price: 0,

              installments: [],
              currentInstallment: null,
              initial_payments: 1,
            };
            e.pms = {
              payments: [],
              initial: false,
            };
          });
          this.order = data;
          this.startCounter();
          this.turnOnValidation();
        }
      } catch (e) {
        this.toastedWithErrorCode(e);
        this.redirect();
      } finally {
        this.finishFetching();
      }
    },
    updateInstallments(ord, disc) {
      v3ServiceApi.installments
        .calculate({
          amount: disc.amount,
          discount_id: disc.id,
        })
        .then((res) => {
          ord.calculation.installments = res.data.result;
          if (!ord.calculation.currentInstallment)
            setTimeout(() => {
              ord.calculation.currentInstallment = res.data.result[0].id;
              ord.calculation.months = res.data.result[0].months;
            }, 0);
        });
    },

    redirect() {
      this.$router.push({
        name: "apartments",
        params: {
          object: this.$route.params.object,
        },
      });
    },

    startCounter() {
      this.expiry_at = this.$moment(this.expiry_at)
        .utcOffset("+0500")
        .format("YYYY-MM-DD H:mm:ss");

      const current = this.$moment(new Date())
        .utcOffset("+0500")
        .format("YYYY-MM-DD H:mm:ss");

      const expired = this.$moment(this.order.expiry_at)
        .utcOffset("+0500")
        .format("YYYY-MM-DD H:mm:ss");

      const time = new Date(current) - new Date(expired);
      if (time > 0) {
        this.expiredConfirm();
      }
    },

    startFetching() {
      this.isFetching = true;
    },

    finishFetching() {
      this.isFetching = false;
    },

    startSubmitting() {
      this.isSubmitting = true;
    },

    finishSubmitting() {
      this.isSubmitting = false;
    },

    async expiredConfirm() {
      if (this.isUpdateMode) {
        this.$router.go(-1);
        return;
      }

      try {
        this.startSubmitting();
        await api.orders
          .deleteOrderHold(this.order.uuid)
          .then(() => {
            this.$router.push({
              name: "apartments",
              params: {
                object: this.$route.params.object,
              },
            });
          })
          .catch(() => this.redirect());
      } catch (error) {
        this.redirect();
        this.toastedWithErrorCode(error);
      } finally {
        this.finishSubmitting();
      }
    },

    changeStepState(idx) {
      this.stepStateIdx = idx;
    },

    async firstStepReadyToNext() {
      const clientDetailsRef = this.$refs["client-details-observer"];
      const vld = await clientDetailsRef.validateFields();
      if (vld) {
        try {
          this.startSubmitting();
          const clientForm = clientDetailsRef.sendForm();
          const { data } = await api.clientsV2.createClient(clientForm);
          if (data) {
            this.clientData = {
              ...clientForm,
              clientId: data.id,
              id: data.id,
            };
            return true;
          }
          return false;
        } catch (e) {
          if (e.response.status === 422) {
            await this.openNotify({
              type: "error",
              message: Object.values(e.response.data)[0],
            });
          } else {
            await this.openNotify({
              type: "error",
              message: e.message,
            });
          }
          return false;
        } finally {
          this.finishSubmitting();
        }
      } else {
        await this.openNotify({
          type: "error",
          message: this.$t("fields_not_filled_out_or_incorrectly"),
        });
        return false;
      }
    },

    async secondStepReadyToNext() {
      // const isInitialZero = this.order.orders.some((ord) =>
      //   console.log(this.$refs[`apartment-overview-${ord.apartment.uuid}`])
      // );
      const isInitialZero =
        this.order.orders.length > 1
          ? this.order.orders.some(
              (ord) =>
                this.$refs[
                  `apartment-overview-${ord.apartment.uuid}`
                ][0].getPrepay() < 1
            )
          : this.$refs[
              `apartment-overview-${this.order.orders[0].apartment.uuid}`
            ].getPrepay() < 1;

      if (isInitialZero) {
        if (this.permission.hasAdminRole() || this.permission.isMainManager()) {
          await this.openNotify({
            type: "warning",
            message: this.$t("checkout_warning_when_initial_set_to_zero"),
            duration: 6000,
          });
        } else {
          await this.openNotify({
            type: "error",
            message: this.$t(
              "checkout_permission_error_when_initial_set_to_zero"
            ),
            duration: 6000,
          });
          return false;
        }
      }

      const vR =
        this.order.orders.length > 1
          ? await Promise.allSettled(
              this.order.orders.map((ord) =>
                this.$refs[
                  `apartment-overview-${ord.apartment.uuid}`
                ][0].completeFields()
              )
            )
          : this.$refs[
              `apartment-overview-${this.order.orders[0].apartment.uuid}`
            ].completeFields();
      const invalidIndex =
        this.order.orders.length > 1
          ? vR.findIndex((el) => el.value === false)
          : vR
          ? -1
          : 0;
      if (~invalidIndex) {
        await this.openNotify({
          type: "error",
          message: this.$t("fields_not_filled_out_or_incorrectly"),
        });
      }
      console.log(this.currentApartment);
      console.log(this.order.orders.length - 1);
      if (this.currentApartment === this.order.orders.length - 1) {
        return !~invalidIndex;
      }
      this.currentApartment =
        invalidIndex === -1 ? this.currentApartment + 1 : invalidIndex;
      return false;
    },

    async submitOnUpdate() {
      try {
        /* ? ENABLE TO EDIT IN ALL STATUS */
        this.handleActionTracker({
          step: "second",
          condition: true,
        });
        this.permissionToNavigate("second");
        this.$nextTick(() => this.changeStepState(1));
      } catch (e) {
        await this.openNotify({
          type: "error",
          message: e.response.data.message ?? e.message,
        });
      }
    },

    async moveToNextForm() {
      switch (this.stepStateIdx) {
        case 0: {
          const isFirstStepReady = await this.firstStepReadyToNext();
          if (isFirstStepReady) {
            if (this.isUpdateMode) {
              await this.submitOnUpdate();
            } else {
              this.handleActionTracker({
                step: "second",
                condition: true,
              });
              this.permissionToNavigate("second");
              this.$nextTick(() => this.changeStepState(1));
            }
          } else {
            this.handleActionTracker({
              step: "second",
              condition: false,
            });
          }
          break;
        }
        case 1: {
          const isSecondStepReady = await this.secondStepReadyToNext();
          if (isSecondStepReady) {
            this.handleActionTracker({
              step: "third",
              condition: true,
            });
            this.permissionToNavigate("third");
            this.$nextTick(() => this.changeStepState(2));
          } else {
            this.handleActionTracker({
              step: "third",
              condition: false,
            });
          }
          break;
        }
        case 2: {
          this.openCommentModal();
        }
      }
    },

    generateOrdersBody() {
      try {
        return this.order.orders.map((ord) => {
          const req = {
            uuid: ord.uuid,
            discount_id: ord.calculation.discount,
            months: ord.calculation.months,
            first_payment_date: ord.calculation.first_payment_date,
            payment_date: ord.calculation.monthly_payment_date,
            contract_date: ord.contract_date,
            discount_amount: ord.calculation.discount_amount,
            comment: this.userComment.vBind,
          };

          if (ord.numberUpdated) req.contract_number = ord.contract_number;

          const p =
            this.order.orders.length > 1
              ? this.$refs[
                  `apartment-overview-${ord.apartment.uuid}`
                ][0].getPayments()
              : this.$refs[
                  `apartment-overview-${ord.apartment.uuid}`
                ].getPayments();

          req.monthly = p
            .filter((el) => el.type === "monthly")
            .map((el) => ({
              amount: el.amount,
              date: formatDateToYMD(el.date),
              edited: +(el.editedDate || el.editedAmount) + "",
            }));

          if (
            ord.calculation.initial_payments > 1 ||
            ord.calculation.discount === "other" ||
            ord.apartment.discounts.find(
              (el) => el.id === ord.calculation.discount
            ).prepay !== ord.calculation.prepay
          ) {
            req.prepay_edited = true;
            req.initial_payments = p
              .filter((el) => el.type === "initial")
              .map((el) => ({
                amount: el.amount,
                date: formatDateToYMD(el.date),
                edited: +(el.editedDate || el.editedAmount) + "",
              }));
          }

          if (ord.calculation.type === "installment") {
            req.installment_month_id = ord.calculation.currentInstallment;
          }
          if (ord.calculation.discount === "other") {
            req.apartments = [
              {
                id: ord.apartment.uuid,
                price: ord.calculation.price,
              },
            ];
          }

          return req;
        });
      } catch (error) {}
      try {
        return this.apartments.map((a) => {
          const orderCtx = {
            uuid: a.order_uuid,
            discount_id: a.calc.discount.id,
            months: parseInt(a.calc.monthly_payment_period),
            first_payment_date: a.calc.first_payment_date,
            payment_date: a.calc.payment_date,
            contract_date: a.calc.contract_date,
            discount_amount: a.calc.total_discount,
            comment: this.userComment.vBind,
          };

          if (a.edit.contract_number) {
            orderCtx.contract_number = a.contract_number;
          }

          const hasEditOnMonthly = a.calc.credit_months.some((crd) => crd.edit);
          if (a.edit.monthly && hasEditOnMonthly) {
            orderCtx.monthly = [];
            for (let i = 0; i < a.calc.credit_months.length; i++) {
              const p = a.calc.credit_months[i];
              const { ymd } = dateProperties(p.month, "string");
              orderCtx.monthly.push({
                date: ymd,
                amount: p.amount,
                edited: (+p.edit).toString(),
              });
            }
          }

          const hasEditOnInitial = a.calc.initial_payments.some(
            (initial) => initial.edit
          );

          if (
            a.edit.first_payment ||
            hasEditOnInitial ||
            a.calc.initial_payments.length > 1 ||
            a.edit.initial_price ||
            a.edit.prepay ||
            a.edit.discount
          ) {
            orderCtx.initial_payments = [];
            for (let i = 0; i < a.calc.initial_payments.length; i++) {
              const p = a.calc.initial_payments[i];
              const { ymd } = dateProperties(p.month, "string");
              // const isEdited =
              //   p.edit || a.edit.first_payment || a.edit.initial_price;
              orderCtx.initial_payments.push({
                date: ymd,
                amount: p.amount,
                edited: "1",
              });
            }
          }

          if (a.edit.prepay || a.edit.initial_price) {
            orderCtx.prepay_edited = true;
          }

          // orderCtx.prepay = a.calc.prepay;

          if (a.calc.discount.id === "other") {
            orderCtx.apartments = [
              {
                id: a.id,
                price: a.calc.base_price,
              },
            ];
          }

          if (a.edit.contract_number) {
            orderCtx.contract_number = a.contract_number;
          }

          return orderCtx;
        });
      } catch (e) {
        console.error(e);
      }
    },
    // FINAL CALL
    async authenticateApartments() {
      try {
        this.startSubmitting();
        if (this.isUpdateMode) {
          await api.contractV2
            .contractOrderUpdate(this.apartments[0].order_uuid, {
              ...this.generateOrdersBody()[0],
              client_id: this.clientData.id,
            })
            .then(() => {
              this.$router.push({
                name: "contracts-view",
                params: {
                  id: this.$route.params.id,
                },
              });
              this.openNotify({
                type: NOTIFY.type.success,
                message: this.$t("changes_successfully_saved"),
                duration: 6000,
              });
            });
        } else {
          const { data } = await checkoutV1.authenticateApartments({
            uuid: this.$route.params.id,
            body: {
              orders: this.generateOrdersBody(),
              client_id: this.clientData.id,
            },
          });
          await this.$router.push({
            name: "checkout-contract-review",
            params: {
              object: data[0].object.id,
              ids: data.map((contract) => contract.contract_number).join(","),
            },
          });
        }
      } catch (e) {
        this.closeCommentModal();
        await this.openNotify({
          type: NOTIFY.type.error,
          message: e.response.data.message,
        });
      } finally {
        this.finishSubmitting();
      }
    },

    handleActionTracker({ step, condition }) {
      this.actionTracker.allowNavigate[step] = condition;
    },

    navigationPmHandler(step, condition) {
      this.actionTracker.disable[step] = condition;
    },

    getAllowNavProperty(property) {
      return this.actionTracker.allowNavigate[property];
    },

    showReviewSection() {
      this.changeStepState(2);
    },

    permissionToNavigate(position) {
      switch (position) {
        case "second": {
          const isValid =
            this.getAllowNavProperty("second") &&
            this.$refs["client-details-observer"].getObserverFlags().valid;
          this.navigationPmHandler("second", !isValid);
          break;
        }
        case "third": {
          const isValid =
            this.$refs["client-details-observer"].getObserverFlags().passed;
          if (!isValid) {
            this.navigationPmHandler("third", true);
          } else {
            const thirdState = this.getAllowNavProperty("second");
            this.navigationPmHandler("third", !thirdState);
          }
          break;
        }
      }
    },

    closeCommentModal() {
      this.userComment.showModal = false;
      this.userComment.vBind = "";
    },

    openCommentModal() {
      this.userComment.showModal = true;
    },

    deactivateOrder() {
      if (this.isUpdateMode) {
        return this.$router.go(-1);
      }
      this.openWarningModal();
    },

    hideWarningModal() {
      this.closeWarningModal();
    },

    openWarningModal() {
      this.showWarningModal = true;
    },

    closeWarningModal() {
      this.showWarningModal = false;
    },

    async fetchUpdateClientData() {
      try {
        this.startFetching();
        const { data } = await api.contractV2.getUpdateContractView(
          this.$route.params.id
        );
        // this.initEditItems(data)
        const d = {
          orders: data,
        };
        data.calculation = {
          type: "custom",
          discount: data.discount_id,
          months: data.payments_details.month,
          prepay: data.payments_details.discount.prepay_to,
          discount_amount: data.discount_amount,
          first_payment_date: data.first_payment_date,
          monthly_payment_date: data.payment_date,
          price: data.discount_id === "other" ? data.apartments[0].price : 0,

          installments: [],
          currentInstallment: null,
          initial_payments: data.schedule.initial_payment?.length || 1,
        };

        this.$refs["client-details-observer"].fillFormInUpdateMode({
          client: data.client,
        });

        if (this.getUpdateStatus === "contract") {
          this.turnOnValidation();
        }
      } catch (e) {
        console.error(e);
        await this.openNotify({
          type: "error",
          message: e?.response?.data?.message ?? e.message,
        });
      } finally {
        this.finishFetching();
      }
    },

    turnOnValidation() {
      this.permissionToNavigate("second");
      this.permissionToNavigate("third");
    },
  },
};
</script>

<template>
  <div>
    <app-header ref="app-header">
      <template #header-breadcrumb>
        <app-breadcrumb
          :page="headerItems.page"
          :page-info="headerItems.pageInfo"
          :breadcrumbs="headerItems.breadcrumbs"
          :go-back-method="deactivateOrder"
        />
      </template>
      <template v-if="isCreateMode && expiry_at" #header-actions>
        <div
          :class="flexCenter"
          class="checkout-timer background-violet-gradient mr-2"
        >
          <CountDown
            :deadline="expiry_at"
            :show-days="false"
            :show-hours="false"
            @timeElapsed="expiredConfirm"
          />
        </div>
      </template>
    </app-header>
    <div class="app-checkout-main">
      <b-tabs
        v-model="stepStateIdx"
        pills
        content-class="app-tabs-content"
        nav-class="app-tabs-content-header"
      >
        <!--  ?FIRST TAB 1   -->
        <b-tab active>
          <template #title>
            <tab-title :step="1" :content="$t('client_details')" />
          </template>

          <x-loading-wrapper :loading="isFetching">
            <ch-client-details
              ref="client-details-observer"
              @country-list="handleCountryList"
              @client-type-list="handleClientTypeList"
            />
          </x-loading-wrapper>
        </b-tab>
        <!--  ?END OF FIRST TAB    -->

        <!--   ?SECOND TAB 2  -->
        <b-tab :disabled="actionTracker.disable.second">
          <template #title>
            <tab-title :step="2" :content="$t('apartment_detail')" />
          </template>
          <b-tabs
            v-if="order.orders?.length > 1"
            v-model="currentApartment"
            class="custom-tab"
          >
            <div class="ch-bottom__line" />
            <b-tab v-for="ord in order.orders" :key="ord.apartment.uuid">
              <template #title>
                <span class="ch-v-status-wrapper">
                  <span
                    >{{ $t("apartment") }} № {{ ord.apartment.number }}</span
                  >
                  <!-- <template v-if="showVStatus(apartment.validate)">
                    <span v-if="apartment.validate.valid">
                      <x-circular-background>
                        <x-icon name="check_circle" class="violet-600" />
                      </x-circular-background>
                    </span>
                    <span v-else>
                      <x-circular-background bg-color="var(--red-100)">
                        <x-icon name="error" class="red-600" />
                      </x-circular-background>
                    </span>
                  </template> -->
                </span>
              </template>
              <div>
                <ch-apartments-overview
                  :ref="`apartment-overview-${ord.apartment.uuid}`"
                  @go-review="showReviewSection"
                  :order-data="ord"
                  @update-calc="handleCalcUpdate"
                  @payments="handlePaymentsUpd"
                  @contract-number="handleContractNumber"
                  @contract-date="handleContractDate"
                />
              </div>
            </b-tab>
          </b-tabs>
          <div v-else>
            <ch-apartments-overview
              :ref="`apartment-overview-${order.orders[0].apartment.uuid}`"
              @go-review="showReviewSection"
              :order-data="order.orders[0]"
              @update-calc="handleCalcUpdate"
              @payments="handlePaymentsUpd"
              @contract-number="handleContractNumber"
              @contract-date="handleContractDate"
            />
          </div>
        </b-tab>
        <!--   ?END OF SECOND TAB   -->

        <!--   ?THIRD TAB 3  -->
        <b-tab :disabled="actionTracker.disable.third">
          <template #title>
            <tab-title
              :step="3"
              :content="$t('preview')"
              :show-right-icon="false"
            />
          </template>
          <ch-review
            :client="clientData"
            :country-list="countryList"
            :client-type-list="clientTypeList"
            :order="order"
            :total="totalForAll"
          />
        </b-tab>
        <!--   ?END OF THIRD TAB   -->

        <!--   ?TABS END -->
        <template #tabs-end>
          <div class="d-flex justify-content-end align-items-center w-100">
            <div :class="flexCenter">
              <base-button
                :text="`${$t('next')}`"
                :loading="isSubmitting"
                class="violet-gradient"
                @click="moveToNextForm"
              >
                <template #right-icon>
                  <x-icon
                    name="keyboard_arrow_right"
                    size="32"
                    class="color-white"
                  />
                </template>
              </base-button>
            </div>
          </div>
        </template>
      </b-tabs>
    </div>

    <!--  COMMENT MODAL  -->
    <x-modal-center
      v-if="userComment.showModal"
      :bilingual="true"
      cancel-button-text="cancel"
      apply-button-class="w-100"
      cancel-button-class="w-100"
      apply-button-text="create_agree"
      footer-class="d-flex justify-content-between x-gap-1"
      :apply-button-loading="isSubmitting"
      @close="closeCommentModal"
      @cancel="closeCommentModal"
      @apply="authenticateApartments"
    >
      <template #header>
        <h3 class="x-font-size-36px font-craftworksans color-gray-600">
          {{ $t("create_agree_apartments") }}
        </h3>
      </template>

      <template #body>
        <div class="ch-comment-body">
          <div class="ch-comment-body-comment">
            {{ $t("comment_required_to_complete") }}
          </div>
          <x-form-input
            v-model="userComment.vBind"
            class="w-100"
            :label="true"
            :placeholder="`${$t('commentary')}`"
          />
        </div>
      </template>
    </x-modal-center>

    <!--  WARNING MODAL BEFORE LEAVE  -->
    <x-modal-center
      v-if="showWarningModal"
      :bilingual="true"
      :show-exit-button="false"
      apply-button-class="w-100"
      cancel-button-class="w-100"
      cancel-button-text="no_cancel"
      apply-button-text="yes_cancel"
      footer-class="d-flex justify-content-between x-gap-1"
      :apply-button-loading="isSubmitting"
      @close="hideWarningModal"
      @cancel="hideWarningModal"
      @apply="expiredConfirm"
    >
      <template #header>
        <h3
          class="x-font-size-36px font-craftworksans color-gray-600 d-flex align-items-center"
        >
          <x-circular-background class="bg-red-300 mr-2">
            <x-icon name="priority_high" class="red-500" />
          </x-circular-background>
          <span class="d-block">
            {{ $t("create_agree_apartments") }}
          </span>
        </h3>
      </template>

      <template #body>
        <div class="warning-before-cancel-wrapper">
          <p class="mb-0">
            {{ $t("checkout_warning_before_cancel") }}
          </p>
          <p class="mb-0">
            {{ $t("this_action_cannot_be_undone") }}
          </p>
        </div>
      </template>
    </x-modal-center>
  </div>
</template>

<style scoped lang="scss">
@import "./styles/tabs-style";
@import "src/assets/scss/utils/tab";

.app-checkout-main {
  margin-top: 2rem;
}

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

.ch-comment-body {
  font-family: Inter, sans-serif;
  margin-top: 3rem;
  margin-bottom: 3rem;

  &-comment {
    margin-bottom: 1rem;
  }
}

.warning-before-cancel-wrapper {
  margin: 3.5rem 0;
  color: var(--gray-600);
  font-family: Inter, sans-serif;
}

::v-deep {
  .custom-tab {
    margin-top: 0;
    position: relative;

    .ch-bottom__line {
      display: flex;
      height: 8px;
      width: calc(100% + 6rem);
      position: absolute;
      top: -8px;
      left: -3rem;
      background-color: var(--gray-100);
    }

    .sticky-top {
      position: -webkit-sticky !important; /* Safari */
      position: sticky !important;
      padding-top: 2rem;
      margin-top: -2rem;
      top: 0;
      z-index: 4;
      width: calc(100% + 6rem);
      right: auto !important;
      left: 0 !important;
      height: 100%;
      margin-left: -3rem;
      box-shadow: none;
      background-color: var(--white);
      transition: all 0.3s linear;

      .nav-tabs {
        background-color: var(--white);
        width: 100%;
        padding-left: 3rem;
        padding-right: 3rem;

        &:after {
          content: "";
          display: flex;
          height: 8px;
          width: calc(100% + 3rem);
          position: absolute;
          bottom: 0;
          left: -3rem;
          background-color: var(--gray-100);
        }
      }
    }

    .fixed-top {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.16);
      transition: all 0.3s linear;
    }
  }
}
.ch-v-status-wrapper {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}
</style>
