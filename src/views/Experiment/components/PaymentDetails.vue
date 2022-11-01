<template>
  <div class="ch-payment-details">
    <section-title :bilingual="true" title="payment_details_2" class="pd-title"/>
    <ch-calculator :apartment="apartment" class="pd-calculator"/>
    <ch-payment-result :apm="apartment" class="pd-payment-result"/>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_OBJECT} from "@/constants/props";

import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import ChCalculator from "@/views/Experiment/components/Calculator";
import ChPaymentResult from "@/views/Experiment/components/PaymentResult";
import {mapGetters} from "vuex";

export default {
  name: "ChPaymentDetails",
  components: {
    SectionTitle,
    ChCalculator,
    ChPaymentResult
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, {}),
  },
  computed: {
    ...mapGetters('Experiment', ['getApm']),
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
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
</style>