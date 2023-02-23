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
              :showDays="false"
              :showHours="false"
              @timeElapsed="expiredConfirm"
          />
        </div>
      </template>
    </app-header>

    <div class="app-checkout-main">
      <b-tabs
          pills
          v-model="stepStateIdx"
          content-class="app-tabs-content"
          nav-class="app-tabs-content-header"
      >

        <!--  ?FIRST TAB 1   -->
        <b-tab active>
          <template #title>
            <tab-title :step="1" :content="$t('client_details')"/>
          </template>

          <x-loading-wrapper :loading="isFetching">
            <ch-client-details ref="client-details-observer"/>
          </x-loading-wrapper>
        </b-tab>
        <!--  ?END OF FIRST TAB    -->

        <!--   ?SECOND TAB 2  -->
        <b-tab :disabled="actionTracker.disable.second">
          <template #title>
            <tab-title :step="2" :content="$t('apartment_detail')"/>
          </template>

          <ch-apartments-overview
              ref="apartments-overview"
              @go-review="showReviewSection"
          />
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

          <ch-review/>
        </b-tab>
        <!--   ?END OF THIRD TAB   -->

        <!--   ?TABS END -->
        <template #tabs-end>
          <div class="d-flex justify-content-end align-items-center w-100">
            <div :class="flexCenter">
              <base-button
                  :text="`${ $t('next') }`"
                  :loading="isSubmitting"
                  class="violet-gradient"
                  @click="moveToNextForm"
              >
                <template #right-icon>
                  <x-icon name="keyboard_arrow_right" size="32" class="color-white"/>
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
          {{ $t('create_agree_apartments') }}
        </h3>
      </template>

      <template #body>
        <div class="ch-comment-body">
          <div class="ch-comment-body-comment">
            {{ $t('comment_required_to_complete') }}
          </div>
          <x-form-input
              class="w-100"
              :label="true"
              v-model="userComment.vBind"
              :placeholder="`${ $t('commentary') }`"
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
        <h3 class="x-font-size-36px font-craftworksans color-gray-600 d-flex align-items-center ">
          <x-circular-background class="bg-red-300 mr-2">
            <x-icon name="priority_high" class="red-500"/>
          </x-circular-background>
          <span class="d-block">
            {{ $t('create_agree_apartments') }}
          </span>
        </h3>
      </template>

      <template #body>
        <div class="warning-before-cancel-wrapper">
          <p class="mb-0"> {{ $t('checkout_warning_before_cancel') }} </p>
          <p class="mb-0"> {{ $t('this_action_cannot_be_undone') }} </p>
        </div>
      </template>
    </x-modal-center>
  </div>
</template>

<script>
import {XIcon} from "@/components/ui-components/material-icons";
import BaseButton from "@/components/Reusable/BaseButton";
import CountDown from "@/components/Reusable/CountDown";
import AppHeader from "@/components/Header/AppHeader";
import TabTitle from "@/views/CheckoutV2/elements/TabTitle";
import ChClientDetails from "@/views/CheckoutV2/components/ClientDetails";
import ChApartmentsOverview from "@/views/CheckoutV2/components/ApartmentsOverview";
import ChReview from "@/views/CheckoutV2/components/Review";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import {XModalCenter} from "@/components/ui-components/modal-center";
import {XFormInput} from "@/components/ui-components/form-input";
import {XLoadingWrapper} from "@/components/ui-components/loading"
import {XCircularBackground} from "@/components/ui-components/circular-background";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import api from "@/services/api";
import {checkoutV1} from "@/services/checkout";
import {dateProperties} from "@/util/calendar";
import {headerItems} from "@/views/CheckoutV2/helper/headerComputed";
import {NOTIFY} from "@/constants/names";

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
    XCircularBackground
  },
  beforeRouteLeave(to, from, next) {
    this.clearCheckoutState()
    return next()
  },
  data() {
    return {
      userComment: {
        vBind: '',
        showModal: false,
        applyButtonLoading: false
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
          third: false
        },
        disable: {
          first: false,
          second: true,
          third: true
        }
      }
    }
  },

  async created() {
    this.setFunctionType(this.$route)

    if (this.isUpdateMode) {
      await this.fetchUpdateClientData()
    } else {
      await this.init()
    }
  },

  computed: {
    ...mapState('CheckoutV2', [
      'apartments',
      'created_by',
      'contract_number',
      'uuid',
      'order',
      'comment',
      'trashStorage',
      'clientData',
      'componentFunction',
    ]),
    ...mapGetters('CheckoutV2', [
      'isCreateMode',
      'isUpdateMode',
      'getUpdateStatus',
      'findApmIdx'
    ]),
    headerItems,
    flexCenter() {
      return 'd-flex justify-content-center align-items-center'
    }
  },

  methods: {
    ...mapMutations('CheckoutV2', [
      'reset',
      'setClientData',
      'setFunctionType',
    ]),
    ...mapActions('CheckoutV2', [
      'setup',
      'initEditItems',
      'changeFirstAttempt',
      'clearCheckoutState'
    ]),
    ...mapActions('notify', ['openNotify']),
    async init() {
      try {
        this.startFetching()
        const orderId = this.$route.params.id
        const {data} = await api.orders.fetchCheckoutData(orderId)
        if (data) {
          const context = {
            order: data,
            uuid: data.uuid,
            expiry_at: data.expiry_at,
            orders: data.orders,
          }
          this.expiry_at = data.expiry_at
          await this.setup(context)
          this.startCounter()
          this.turnOnValidation()
        }
      } catch (e) {
        this.toastedWithErrorCode(e)
        this.redirect()
      } finally {
        this.finishFetching()
      }
    },

    redirect() {
      this.$router.push({
        name: 'apartments',
        params: {
          object: this.$route.params.object
        }
      })
    },

    startCounter() {
      this.expiry_at = this.$moment(this.expiry_at)
          .utcOffset("+0500")
          .format("YYYY-MM-DD H:mm:ss")

      const current = this.$moment(new Date())
          .utcOffset("+0500")
          .format("YYYY-MM-DD H:mm:ss")

      const expired = this.$moment(this.order.expiry_at)
          .utcOffset("+0500")
          .format("YYYY-MM-DD H:mm:ss")

      const time = new Date(current) - new Date(expired)
      if (time > 0) {
        this.expiredConfirm()
      }
    },

    startFetching() {
      this.isFetching = true
    },

    finishFetching() {
      this.isFetching = false
    },

    startSubmitting() {
      this.isSubmitting = true
    },

    finishSubmitting() {
      this.isSubmitting = false
    },

    async expiredConfirm() {
      if (this.isUpdateMode) {
        this.$router.go(-1)
        return
      }

      try {
        this.startSubmitting()
        await api.orders.deleteOrderHold(this.order.uuid)
            .then(() => {
              this.$router.push({
                name: "apartments",
                params: {
                  object: this.$route.params.object
                }
              })
            })
            .catch(() => this.redirect())
      } catch (error) {
        this.redirect()
        this.toastedWithErrorCode(error)
      } finally {
        this.finishSubmitting()
      }
    },

    changeStepState(idx) {
      this.stepStateIdx = idx
    },

    async firstStepReadyToNext() {
      const clientDetailsRef = this.$refs['client-details-observer']
      const vld = await clientDetailsRef.validateFields()
      if (vld) {
        try {
          this.startSubmitting()
          const clientForm = clientDetailsRef.sendForm()
          const {data} = await api.clientsV2.createClient(clientForm)
          if (data) {
            this.setClientData({
              ...clientForm,
              clientId: data.id,
              id: data.id
            })
            return true
          }
          return false
        } catch (e) {
          if (e.response.status === 422) {
            await this.openNotify({
              type: 'error',
              message: Object.values(e.response.data)[0]
            })
          } else {
            await this.openNotify({
              type: 'error',
              message: e.message
            })
          }
          return false
        } finally {
          this.finishSubmitting()
        }
      } else {
        await this.openNotify({
          type: 'error',
          message: this.$t('fields_not_filled_out_or_incorrectly')
        })
        return false
      }
    },

    async secondStepReadyToNext() {
      let {
        isTheLastStep,
        completeFields,
        checkValidation,
        isCurrentFullFilled,
        changeApmTabIndex,
      } = this.$refs['apartments-overview']

      const vR = await completeFields()

      if (!vR) {
        await this.openNotify({
          type: 'error',
          message: this.$t('fields_not_filled_out_or_incorrectly')
        })
      }

      if (isTheLastStep) {
        return vR
      } else if (await checkValidation() && isCurrentFullFilled()) {
        changeApmTabIndex()
      }

      this.reset()
      return false
    },

    async submitOnUpdate() {
      try {
        const {order_uuid} = this.apartments[0]
        if (this.getUpdateStatus === 'contract') {
          this.handleActionTracker({
            step: 'second',
            condition: true
          })
          this.permissionToNavigate('second')
          this.$nextTick(() => this.changeStepState(1))
        } else if (this.getUpdateStatus === 'sold') {
          this.startSubmitting()
          await api.contractV2
              .orderUpdate(
                  order_uuid,
                  {
                    client_id: this.clientData.id
                  }
              )
              .then(async () => {
                await this.$router.push({
                  name: "contracts-view",
                  params: {id: this.$route.params.id},
                })

                await this.openNotify({
                  type: NOTIFY.type.success,
                  message: this.$t('changes_successfully_saved'),
                  duration: 6000
                })
              })
              .finally(() => this.finishSubmitting())
        }
      } catch (e) {
        await this.openNotify({
          type: 'error',
          message: e.response.data.message ?? e.message
        })
      }
    },

    async moveToNextForm() {
      switch (this.stepStateIdx) {
        case 0: {
          const isFirstStepReady = await this.firstStepReadyToNext()
          if (isFirstStepReady) {
            if (this.isUpdateMode) {
              await this.submitOnUpdate()
            } else {
              this.handleActionTracker({
                step: 'second',
                condition: true
              })
              this.permissionToNavigate('second')
              this.$nextTick(() => this.changeStepState(1))
            }
          } else {
            this.handleActionTracker({
              step: 'second',
              condition: false
            })
          }
          break
        }
        case 1: {
          const isSecondStepReady = await this.secondStepReadyToNext()
          if (isSecondStepReady) {
            this.handleActionTracker({
              step: 'third',
              condition: true
            })
            this.permissionToNavigate('third')
            this.$nextTick(() => this.changeStepState(2))
          } else {
            this.handleActionTracker({
              step: 'third',
              condition: false
            })
          }
          break
        }
        case 2: {
          this.openCommentModal()
        }
      }
    },

    generateOrdersBody() {
      try {
        return this.apartments.map((a, idx) => {
          const orderCtx = {
            uuid: a.order_uuid,
            discount_id: a.calc.discount.id,
            months: parseInt(a.calc.monthly_payment_period),
            first_payment_date: a.calc.first_payment_date,
            payment_date: a.calc.payment_date,
            contract_date: a.calc.contract_date,
            discount_amount: a.calc.total_discount,
            comment: this.userComment.vBind
          }

          if (a.edit.contract_number) {
            orderCtx.contract_number = a.contract_number
          }

          const hasEditOnMonthly = a.calc.credit_months.some(crd => crd.edit)
          if (a.edit.monthly && hasEditOnMonthly) {
            orderCtx.monthly = []
            for (let i = 0; i < a.calc.credit_months.length; i++) {
              const p = a.calc.credit_months[i]
              const {ymd} = dateProperties(p.month, 'string')
              orderCtx.monthly.push({
                date: ymd,
                amount: p.amount,
                edited: (+p.edit).toString()
              })
            }
          }

          const hasEditOnInitial = a.calc.initial_payments.some(initial => initial.edit)
          if (a.edit.first_payment || hasEditOnInitial || a.calc.initial_payments.length > 1 || a.edit.initial_price || a.edit.prepay) {
            orderCtx.initial_payments = []
            for (let i = 0; i < a.calc.initial_payments.length; i++) {
              const p = a.calc.initial_payments[i]
              const {ymd} = dateProperties(p.month, 'string')
              const isEdited = p.edit || a.edit.first_payment || a.edit.initial_price
              orderCtx.initial_payments.push({
                date: ymd,
                amount: p.amount,
                edited: (+isEdited).toString()
              })
            }
          }

          if (a.edit.prepay || a.edit.initial_price) {
            orderCtx.prepay_edited = true
          }

          if (a.calc.discount.id === 'other') {
            orderCtx.apartments = [
              {
                id: a.id,
                price: a.calc.price
              }
            ]
          }

          if (a.edit.contract_number) {
            orderCtx.contract_number = a.contract_number
          }

          return orderCtx
        })
      } catch (e) {
        console.error(e)
      }
    },

    async authenticateApartments() {
      try {
        this.startSubmitting()
        if (this.isUpdateMode && this.getUpdateStatus === 'contract') {
          await api.contractV2.contractOrderUpdate(this.apartments[0].order_uuid, {
            ...this.generateOrdersBody()[0],
            client_id: this.clientData.id
          }).then(() => {

            this.$router.push({
              name: 'contracts-view',
              params: {
                id: this.$route.params.id,
              }
            })

            this.openNotify({
              type: NOTIFY.type.success,
              message: this.$t('changes_successfully_saved'),
              duration: 6000
            })

          })
        } else {
          const {data} = await checkoutV1.authenticateApartments({
            uuid: this.$route.params.id,
            body: {
              orders: this.generateOrdersBody(),
              client_id: this.clientData.id
            }
          })

          await this.$router.push({
            name: 'checkout-contract-review',
            params: {
              object: data[0].object.id,
              ids: data.map(contract => contract.contract_number).join(',')
            }
          })
        }
      } catch (e) {
        this.closeCommentModal()
        await this.openNotify({
          type: NOTIFY.type.error,
          message: e.response.data.message
        })
      } finally {
        this.finishSubmitting()
      }
    },

    handleActionTracker({step, condition}) {
      this.actionTracker.allowNavigate[step] = condition
    },

    navigationPmHandler(step, condition) {
      this.actionTracker.disable[step] = condition
    },

    getAllowNavProperty(property) {
      return this.actionTracker.allowNavigate[property]
    },

    showReviewSection() {
      this.changeStepState(2)
    },

    permissionToNavigate(position) {
      switch (position) {
        case 'second': {
          const isValid = this.getAllowNavProperty('second')
              && this.$refs['client-details-observer'].getObserverFlags().valid
          this.navigationPmHandler('second', !isValid)
          break
        }
        case 'third': {
          const isValid = this.$refs['client-details-observer'].getObserverFlags().passed
          if (!isValid) {
            this.navigationPmHandler('third', true)
          } else {
            const thirdState = this.getAllowNavProperty('second')
                && this.apartments.some(apm => !apm.validate.valid)
            this.navigationPmHandler('third', thirdState)
          }
          break
        }
      }
    },

    closeCommentModal() {
      this.userComment.showModal = false
      this.userComment.vBind = ''
    },

    openCommentModal() {
      this.userComment.showModal = true
    },

    deactivateOrder() {
      if (this.isUpdateMode) {
        return this.$router.go(-1)
      }
      this.openWarningModal()
    },

    hideWarningModal() {
      this.closeWarningModal()
    },

    openWarningModal() {
      this.showWarningModal = true
    },

    closeWarningModal() {
      this.showWarningModal = false
    },

    async fetchUpdateClientData() {
      try {
        this.startFetching()
        const {data} = await api.contractV2.getUpdateContractView(this.$route.params.id)
        this.initEditItems(data)
        this.$refs['client-details-observer']
            .fillFormInUpdateMode({
              client: data.client
            })

        if (this.getUpdateStatus === 'contract') {
          this.turnOnValidation()
        }
      } catch (e) {
        await this.openNotify({
          type: 'error',
          message: e.response.data.message ?? e.message
        })
      } finally {
        this.finishFetching()
      }
    },

    turnOnValidation() {
      this.permissionToNavigate('second')
      this.permissionToNavigate('third')
    }
  }
}
</script>

<style scoped lang="scss">
@import "./styles/tabs-style";

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
</style>