<template>
  <div>
    <app-header>
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

    <k-loading-wrapper :loading="appLoading">
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

            <ch-client-details ref="client-details-observer"/>
          </b-tab>
          <!--  ?END OF FIRST TAB    -->

          <!--   ?SECOND TAB 2  -->
          <b-tab :disabled="isStepTwoDisable">
            <template #title>
              <tab-title :step="2" :content="$t('apartment_detail')"/>
            </template>

            <ch-apartments-overview @go-review="showReviewSection" ref="apartments-overview"/>
          </b-tab>
          <!--   ?END OF SECOND TAB   -->

          <!--   ?THIRD TAB 3  -->
          <b-tab :disabled="isStepThirdDisable">
            <template #title>
              <tab-title :step="3" :show-right-icon="false" :content="$t('preview')"/>
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
                    class="violet-gradient"
                    @click="moveToNextForm"
                >
                  <template #right-icon>
                    <x-icon name="keyboard_arrow_right" class="color-white"/>
                  </template>
                </base-button>
              </div>
            </div>
          </template>
        </b-tabs>
      </div>
    </k-loading-wrapper>
  </div>
</template>

<script>
import {KLoadingWrapper} from "@/components/ui-components/loading";
import {XIcon} from "@/components/ui-components/material-icons";
import BaseButton from "@/components/Reusable/BaseButton";
import CountDown from "@/components/Reusable/CountDown";
import AppHeader from "@/components/Header/AppHeader";
import TabTitle from "@/views/Experiment/elements/TabTitle";
import ChClientDetails from "@/views/Experiment/components/ClientDetails";
import ChApartmentsOverview from "@/views/Experiment/components/ApartmentsOverview";
import ChReview from "@/views/Experiment/components/Review";

import {headerItems} from "@/views/Experiment/helper/headerComputed";
import api from "@/services/api";
import {mapActions, mapMutations, mapState} from "vuex";
import AppBreadcrumb from "@/components/AppBreadcrumb";


export default {
  name: "Index",
  components: {
    AppBreadcrumb, KLoadingWrapper,
    XIcon,
    BaseButton,
    CountDown,
    AppHeader,
    TabTitle,
    ChClientDetails,
    ChApartmentsOverview,
    ChReview
  },

  data() {
    return {
      appLoading: false,
      stepStateIdx: 0
    }
  },

  async created() {
    await this.init()
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
    ]),
    headerItems,
    flexCenter() {
      return 'd-flex justify-content-center align-items-center'
    },
    isStepTwoDisable() {
      return false
    },
    isStepThirdDisable() {
      return false
    }
  },

  methods: {
    ...mapMutations('Experiment', ['reset']),
    ...mapActions('Experiment', ['setup']),
    ...mapActions('notify', ['openNotify']),
    async init() {
      try {
        this.startLoading()
        const orderId = this.$route.params.id
        const {data} = await api.orders.fetchHoldOrder(orderId)
        if (data) {
          const context = {
            order: data,
            uuid: data.uuid,
            expiry_at: data.expiry_at,
            apartments: data.apartments,
            contract_number: data.contract_number,
          }
          this.setup(context)
          this.startCounter()
        }
      } catch (e) {
        this.toastedWithErrorCode(e)
        this.redirect(e)
      } finally {
        this.finishLoading()
      }
    },

    redirect(error) {
      if (error?.response?.status >= 400 && error?.response?.status < 600) {
        this.$router.push({name: 'objects'})
      }
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

    startLoading() {
      this.appLoading = true
    },

    finishLoading() {
      this.appLoading = false
    },

    async expiredConfirm() {
      try {
        this.startLoading()
        const {data} = api.orders.deactivateOrderHold(this.order.uuid)
        data && await this.$router.push({name: "apartments"})
      } catch (error) {
        this.toastedWithErrorCode(error)
      } finally {
        this.finishLoading()
      }
    },

    changeStepState(idx) {
      this.stepStateIdx = idx
    },

    async firstStepReadyToNext() {
      const vld = await this.$refs['client-details-observer'].validateFields()
      if (!vld) {
        this.openNotify({
          type: 'error',
          message: this.$t('fields_not_filled_out_or_incorrectly')
        })
      }
      return vld
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
        this.openNotify({
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
        case 1: {
          await this.secondStepReadyToNext() && this.changeStepState(2)
          break
        }
        default: {
          await this.firstStepReadyToNext() && this.changeStepState(1)
          break
        }
      }
    },

    showReviewSection() {
      this.changeStepState(2)
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

</style>