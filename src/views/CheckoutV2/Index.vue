<template>
  <div>
    <app-header ref="app-header">
      <template #header-breadcrumb>
        <app-breadcrumb
            :page="headerItems.page"
            :page-info="headerItems.pageInfo"
            :breadcrumbs="headerItems.breadcrumbs"
        />
      </template>
      <template v-if="expiry_at" #header-actions>
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

    <x-modal-center
        v-if="comment.showModal"
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
          <validation-provider
              ref="commentInputProvider"
              :name="`${ $t('commentary')} }`"
              rules="required|min:3"
              v-slot="{ errors }"
          >
            <x-form-input
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                v-model="comment.vBind"
                :placeholder="`${ $t('commentary') }`"
            />
          </validation-provider>
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
import {mapActions, mapMutations, mapState} from "vuex";
import api from "@/services/api";
import {checkoutV1} from "@/services/checkout";
import {dateProperties} from "@/util/calendar";
import {headerItems} from "@/views/CheckoutV2/helper/headerComputed";

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
    XFormInput
  },

  data() {
    return {
      comment: {
        vBind: '',
        showModal: false,
        applyButtonLoading: false
      },
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
    await this.init()
  },

  mounted() {
    this.permissionToNavigate('second')
    this.permissionToNavigate('third')
  },

  computed: {
    ...mapState('Experiment', [
      'apartments',
      'created_by',
      'contract_number',
      'expiry_at',
      'uuid',
      'order',
      'comment',
      'trashStorage',
      'clientData'
    ]),
    headerItems,
    flexCenter() {
      return 'd-flex justify-content-center align-items-center'
    }
  },

  methods: {
    ...mapMutations('Experiment', ['reset', 'setClientData']),
    ...mapActions('Experiment', ['setup']),
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
      try {
        this.startFetching()
        const {data} = api.orders.deactivateOrderHold(this.order.uuid)
            .catch(() => this.redirect())

        data && await this.$router.push({
          name: "apartments",
          params: {
            object: this.$route.params.object
          }
        })
      } catch (error) {
        this.redirect()
        this.toastedWithErrorCode(error)
      } finally {
        this.finishFetching()
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

    async moveToNextForm() {
      switch (this.stepStateIdx) {
        case 0: {
          const isFirstStepReady = await this.firstStepReadyToNext()
          if (isFirstStepReady) {
            this.handleActionTracker({
              step: 'second',
              condition: true
            })
            this.permissionToNavigate('second')
            this.$nextTick(() => this.changeStepState(1))
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
      return this.apartments.map(a => {
        const orderCtx = {
          uuid: a.order_uuid,
          discount_id: a.calc.discount.id,
          months: parseInt(a.calc.monthly_payment_period),
          first_payment_date: a.calc.first_payment_date,
          payment_date: a.calc.payment_date,
          contract_date: a.calc.contract_date,
          discount_amount: a.calc.discount_per_m2 * a.calc.plan.area,
          comment: this.comment.vBind
        }

        if (a.edit.monthly) {
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

        if (a.calc.initial_payments.length > 1 || a.edit.initial_price) {
          orderCtx.initial_payments = []
          for (let i = 0; i < a.calc.initial_payments.length; i++) {
            const p = a.calc.initial_payments[i]
            const {ymd} = dateProperties(p.month, 'string')
            orderCtx.initial_payments.push({
              date: ymd,
              amount: p.amount,
              edited: (+p.edit).toString()
            })
          }
        }

        if (a.edit.prepay) {
          orderCtx.prepay_edited = a.calc.prepay
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
    },

    async authenticateApartments() {
      const {valid} = await this.$refs.commentInputProvider.validate()
      if (valid) {
        try {
          this.startSubmitting()
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
        } catch (e) {
          this.closeCommentModal()
          await this.openNotify({
            type: 'error',
            message: e.response.data.message
          })
        } finally {
          this.finishSubmitting()
        }
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
      this.comment.showModal = false
      this.comment.vBind = ''
    },

    openCommentModal() {
      this.comment.showModal = true
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
</style>