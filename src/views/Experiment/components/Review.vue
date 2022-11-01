<template>
  <div>
    <ch-review-client-information/>
    <ch-review-apartment/>
  </div>
</template>

<script>
import ChReviewClientInformation from "@/views/Experiment/components/ReviewClientInformation";
import ChReviewApartment from "@/views/Experiment/components/ReviewApartment";

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