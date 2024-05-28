<script>
import { hasOwnProperty } from "@/util/object";
import { mapGetters, mapMutations } from "vuex";
import ChContractDetails from "@/views/checkoutV3/components/ContractDetails";
import ChApartmentCharacters from "@/views/checkoutV2/components/ApartmentCharacters";
import ChPaymentSchedule from "@/views/checkoutV3/components/PaymentSchedule";
import SectionTitle from "@/views/checkoutV3/elements/SectionTitle";
import ChCalculator from "@/views/checkoutV3/components/Calculator";
import ChPaymentResult from "@/views/checkoutV3/components/PaymentResult";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import { isObject } from "@/util/inspect";
import { XButton } from "@/components/ui-components/button";

export default {
  name: "ChApartmentsOverview",
  components: {
    ChContractDetails,
    ChApartmentCharacters,
    ChPaymentSchedule,
    SectionTitle,
    ChCalculator,
    ChPaymentResult,
    XIcon,
    XCircularBackground,
    XButton,
  },
  emits: ["go-review"],
  data() {
    return {
      upEvent: false,
      overviewApmTabIndex: 0,
      showNavigateToNextBtn: false,
    };
  },
  props: ["orderData"],
  computed: {
    ...mapGetters("CheckoutV2", {
      apartments: "gtsApartments",
      findApmIdx: "findApmIdx",
    }),
    navItemActiveClass() {
      if (
        this.apartments.length &&
        isObject(this.apartments[this.overviewApmTabIndex]) &&
        hasOwnProperty(this.apartments[this.overviewApmTabIndex], "validate")
      ) {
        if (this.apartments[this.overviewApmTabIndex]?.validate) {
          const { changed, touched, valid, dirty } =
            this.apartments[this.overviewApmTabIndex].validate;
          return {
            "nav-active-state-error": (changed || (dirty && touched)) && !valid,
          };
        }
      }
      return {};
    },
    isTheLastStep() {
      return this.overviewApmTabIndex === this.apartments.length - 1;
    },
  },
  mounted() {
    window.onwheel = (e) => {
      this.upEvent = e.deltaY < 0;
    };
    this.showNavigateToNextBtn =
      this.apartments[this.overviewApmTabIndex]?.validate?.valid;
  },
  methods: {
    getPayments() {
      return this.$refs[
        `payments-${this.orderData.apartment.uuid}`
      ].getPaymentSchedule();
    },
    initializePayments(data) {
      this.$refs[
        `payments-${this.orderData.apartment.uuid}`
      ].initializePayments(data);
    },
    getPrepay() {
      return this.$refs[`ch-calculator-${this.orderData.apartment.uuid}`]
        .prepayAmount;
    },
    getFullPayment() {
      return this.$refs[`ch-calculator-${this.orderData.apartment.uuid}`]
        .fullPayment;
    },
    ...mapMutations("CheckoutV2", ["updateApartment", "reset"]),
    apnName(number) {
      return `${this.$t("apartment")} №${number}`;
    },
    async completeFields() {
      return this.$refs[
        `ch-calculator-${this.orderData.apartment.uuid}`
      ].validate();
    },
    changeApmTabIndex(count = 1) {
      this.overviewApmTabIndex += count;
    },
    isCurrentFullFilled() {
      return this.apartments[this.overviewApmTabIndex].validate.valid;
    },
    navigateToNext() {
      if (this.showNavigateToNextBtn) {
        if (this.isTheLastStep) {
          this.$emit("go-review");
        } else {
          this.changeApmTabIndex();
        }
      }
    },
    changeVFlags(apmId, flags) {
      const isCurrentApm =
        this.apartments[this.overviewApmTabIndex].id === apmId;
      if (isCurrentApm) {
        this.showNavigateToNextBtn = flags.valid;
      }
    },
    showVStatus: (v) => v.changed && (v.dirty || v.touched),
    makeRedTitle: (v) => (v.changed || (v.dirty && v.touched)) && !v.valid,
  },
};
</script>

<template>
  <div class="position-relative">
    <div class="ch-apartment-overview ch-single-apartment-overview">
      <ch-apartment-characters
        :apartment="orderData.apartment"
        v-if="orderData.apartment.uuid"
      />
      <ch-contract-details
        v-if="orderData.apartment.uuid"
        :order="orderData"
        @contract-number="(e) => $emit('contract-number', e)"
        @contract-date="(e) => $emit('contract-date', e)"
      />
      <div class="ch-payment-details">
        <section-title
          :bilingual="true"
          title="payment_details_2"
          class="pd-title"
        />
        <ch-calculator
          v-if="orderData.apartment.uuid"
          :ref="`ch-calculator-${orderData.apartment.uuid}`"
          :order="orderData"
          class="pd-calculator"
          @update-calc="(e) => $emit('update-calc', e)"
        />
        <ch-payment-result :order="orderData" v-if="orderData.apartment.uuid" />
      </div>
      <ch-payment-schedule
        v-if="orderData.apartment.uuid"
        :order="orderData"
        @update-calc="(e) => $emit('update-calc', e)"
        @payments="(e) => $emit('payments', e)"
        :ref="`payments-${orderData.apartment.uuid}`"
      />
    </div>

    <div v-if="!isTheLastStep" class="next-button">
      <x-button
        class="b-shadow-3"
        right-icon="arrow_forward"
        :variant="showNavigateToNextBtn ? 'primary' : 'secondary'"
        :text="$t('next_apartment')"
        :color-icon="showNavigateToNextBtn ? 'white' : 'var(--gray-400)'"
        @click="navigateToNext"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "src/assets/scss/utils/tab";

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

.ch-apartment-overview {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;
  padding-top: 2rem;
}

.ch-payment-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  .pd-title {
    grid-column: span 2;
  }
}

.ch-v-status-wrapper {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
}

.icon-circle-wrapper {
  padding: 0.5rem;
  background-color: var(--violet-100);
}

::v-deep .custom-tab .nav-tabs .nav-link.active.nav-active-state-error:after {
  background-color: var(--red-600);
}

.next-button {
  position: fixed;
  bottom: 3rem;
  right: 3rem;
  z-index: 2;
}

.ch-single-apartment-overview {
  padding-top: 0 !important;
}
</style>
