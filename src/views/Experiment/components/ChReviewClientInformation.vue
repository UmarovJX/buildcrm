<template>
  <div>
    <section-title :bilingual="true" title="characteristics_of_the_apartment" class="km-b-2"/>
    <field-information
        :bilingual="true"
        content="physical_person"
        title="person_type"
        icon-name="assignment_ind"
    />
  </div>
</template>

<script>
import FieldInformation from "@/views/Experiment/elements/FieldInformation";
import SectionTitle from "@/views/Experiment/elements/SectionTitle";

export default {
  name: "ChReviewClientInformation",
  components: {
    FieldInformation,
    SectionTitle
  }
}
</script>

<style scoped>

</style>