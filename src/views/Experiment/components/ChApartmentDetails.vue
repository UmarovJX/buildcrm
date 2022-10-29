<template>
  <div class="ch-apartment-overview">
    <ch-apartment-characters :apartment="apartment"/>
    <ch-contract-details :apartment="apartment"/>
    <ch-payment-details :apartment="apartment"/>
    <ch-payment-schedule :apartment="apartment"/>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_OBJECT} from "@/constants/props";

import ChContractDetails from "@/views/Experiment/components/ChContractDetails";
import ChApartmentCharacters from "@/views/Experiment/components/ChApartmentCharacters";
import ChPaymentDetails from "@/views/Experiment/components/ChPaymentDetails";
import ChPaymentSchedule from "@/views/Experiment/components/ChPaymentSchedule";

export default {
  name: 'ChApartmentDetails',
  components: {
    ChApartmentCharacters,
    ChContractDetails,
    ChPaymentDetails,
    ChPaymentSchedule
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, {})
  },
}
</script>

<style lang="scss" scoped>
.ch-apartment-overview {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 3rem;
}
</style>