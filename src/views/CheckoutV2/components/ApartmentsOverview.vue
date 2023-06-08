<script>
import { hasOwnProperty } from "@/util/object";
import { mapGetters, mapMutations } from "vuex";
import ChContractDetails from "@/views/CheckoutV2/components/ContractDetails";
import ChApartmentCharacters from "@/views/CheckoutV2/components/ApartmentCharacters";
import ChPaymentSchedule from "@/views/CheckoutV2/components/PaymentSchedule";
import SectionTitle from "@/views/CheckoutV2/elements/SectionTitle";
import ChCalculator from "@/views/CheckoutV2/components/Calculator";
import ChPaymentResult from "@/views/CheckoutV2/components/PaymentResult";
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
    ...mapMutations("CheckoutV2", ["updateApartment", "reset"]),
    apnName(number) {
      return this.$t("apartment") + " №" + number;
    },
    async completeFields() {
      const collection = [];
      for (let i = 0; i < this.apartments.length; i++) {
        const ref = `ch-calculator-` + this.apartments[i].id;
        let validate;
        if (this.apartments.length > 1) {
          validate = this.$refs[ref][0].getValidationFlags();
        } else {
          validate = this.$refs[ref].getValidationFlags();
        }
        this.updateApartment({
          idx: this.findApmIdx(this.apartments[i].id),
          validate: { ...validate },
        });
        collection.push(await this.checkValidation(i));
      }
      this.reset();
      return collection.every((c) => c);
    },
    async checkValidation(idx) {
      const ref =
        `ch-calculator-` + this.apartments[idx ?? this.overviewApmTabIndex].id;
      if (this.apartments.length === 1) {
        return await this.$refs[ref].validate();
      }
      return await this.$refs[ref][0].validate();
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
    <b-tabs
      v-if="apartments.length > 1"
      v-model="overviewApmTabIndex"
      class="custom-tab"
      :nav-wrapper-class="[{ 'fixed-top': !upEvent }, 'sticky-top']"
      :active-nav-item-class="navItemActiveClass"
    >
      <div class="ch-bottom__line"></div>
      <b-tab v-for="apartment in apartments" :key="apartment.id">
        <template #title>
          <span
            class="ch-v-status-wrapper"
            :class="{ 'red-600': makeRedTitle(apartment.validate) }"
          >
            <span>{{ apnName(apartment.number) }}</span>
            <template v-if="showVStatus(apartment.validate)">
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
            </template>
          </span>
        </template>
        <div>
          <div class="ch-apartment-overview">
            <ch-apartment-characters :apartment="apartment" />
            <ch-contract-details :apartment="apartment" />
            <div class="ch-payment-details">
              <section-title
                :bilingual="true"
                title="payment_details_2"
                class="pd-title"
              />
              <ch-calculator
                :ref="`ch-calculator-${apartment.id}`"
                :apartment="apartment"
                class="pd-calculator"
                @set-v-flags="changeVFlags(apartment.id, $event)"
              />
              <ch-payment-result :apm="apartment" class="pd-payment-result" />
            </div>
            <ch-payment-schedule :apartment="apartment" />
          </div>
        </div>
      </b-tab>
    </b-tabs>

    <div
      class="ch-apartment-overview ch-single-apartment-overview"
      v-else-if="apartments.length === 1"
    >
      <ch-apartment-characters :apartment="apartments[0]" />
      <ch-contract-details :apartment="apartments[0]" />
      <div class="ch-payment-details">
        <section-title
          :bilingual="true"
          title="payment_details_2"
          class="pd-title"
        />
        <ch-calculator
          :ref="`ch-calculator-${apartments[0].id}`"
          :apartment="apartments[0]"
          class="pd-calculator"
          @set-v-flags="changeVFlags(apartments[0].id, $event)"
        />
        <ch-payment-result :apm="apartments[0]" class="pd-payment-result" />
      </div>
      <ch-payment-schedule :apartment="apartments[0]" />
    </div>

    <div v-if="!isTheLastStep" class="next-button">
      <x-button
        @click="navigateToNext"
        class="b-shadow-3"
        right-icon="arrow_forward"
        :variant="showNavigateToNextBtn ? 'primary' : 'secondary'"
        :text="$t('next_apartment')"
        :color-icon="showNavigateToNextBtn ? 'white' : 'var(--gray-400)'"
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
  grid-template-areas:
    "pdt pdt"
    "pdc pdpr";
  gap: 2rem;

  .pd-title {
    grid-area: pdt;
  }

  .pd-calculator {
    grid-area: pdc;
  }

  .pd-payment-result {
    grid-area: pdpr;
    align-self: start;
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
