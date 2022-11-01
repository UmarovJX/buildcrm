<template>
  <div>
    <section-title :bilingual="true" title="client_information" class="km-b-2"/>
    <div class="information-block">
      <field-information
          v-for="(client,index) in clientDetails"
          :key="index"
          :bilingual="true"
          :content="client.content"
          :title="client.title"
          :icon-name="client.icon"
      />
    </div>
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
  },
  data() {
    const clientDetails = [
      {
        title: 'person_type',
        content: 'physical_person',
        icon: 'assignment_ind',
      },
      {
        title: 'nation',
        content: '',
        icon: 'flag',
      },
      {
        title: 'passport_series_example',
        content: '',
        icon: 'contact_page',
      },
      {
        title: 'birth_day',
        content: '',
        icon: 'cake',
      },
      {
        title: 'fio_full',
        content: '',
        icon: 'person',
      },
      {
        title: 'communication_language',
        content: '',
        icon: 'language',
      },
      {
        title: 'email',
        content: '',
        icon: 'mail',
      },
      {
        title: 'additional_email',
        content: '',
        icon: 'mail',
      },
      {
        title: 'phone',
        content: '',
        icon: 'call',
      },
      {
        title: 'additional_phone_number',
        content: '',
        icon: 'call',
      },
    ]
    return {
      clientDetails,
    }
  },
}
</script>

<style lang="scss" scoped>
.information-block {
  display: flex;
  flex-wrap: wrap;
  column-gap: 48px;
  row-gap: 24px;
  margin-bottom: 3rem;

  .field-information {
    flex-basis: calc(50% - 24px);
  }

}
</style>