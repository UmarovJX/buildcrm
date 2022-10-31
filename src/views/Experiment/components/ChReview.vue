<template>
  <div>
    <ch-review-client-information/>
    <ch-review-apartment/>
  </div>
</template>

<script>
import ChReviewClientInformation from "@/views/Experiment/components/ChReviewClientInformation";
import ChReviewApartment from "@/views/Experiment/components/ChReviewApartment";

export default {
  name: "ChReviewSide",
  components: {
    ChReviewClientInformation,
    ChReviewApartment
  }
}
</script>

<style scoped>

</style>