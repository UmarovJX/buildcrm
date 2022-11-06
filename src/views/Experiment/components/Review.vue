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
    <div class="apn-result">
      <div class="apn-result__item" v-for="apartment in apartments" :key="apartment.id">
        <section-title :bilingual="true" :title="$t('apartment')+' '+apartment.number" class="km-b-2"/>
        <div class="apn-result__item-content">
          <ch-plan-details :apartment="apartment" :remove="true"/>
          <ch-payment-result :apm="apartment" :result="true" class="pd-payment-result"/>
        </div>
      </div>
      <div class="apn-result__total">
        <p>{{ $t('final_total_price') }}</p>
        <p>{{ prettier(totalForAll) }} сум</p>
      </div>
    </div>
  </div>
</template>

<script>
import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import ChPaymentResult from "@/views/Experiment/components/PaymentResult";
import ChPlanDetails from "@/views/Experiment/components/PlanDetails";
import FieldInformation from "@/views/Experiment/elements/FieldInformation";
import {mapGetters} from "vuex";
import {formatToPrice} from "@/util/reusable";

export default {
  name: "ChReviewSide",
  components: {
    SectionTitle,
    ChPaymentResult,
    ChPlanDetails,
    FieldInformation,
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
  computed: {
    ...mapGetters('Experiment', {
      apartments: 'gtsApartments',
      totalForAll: 'totalForAll',
    })
  },
  methods: {
    prettier: formatToPrice
  }
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

.apn-result {
  display: flex;
  flex-direction: column;
  row-gap: 3rem;

  &__item {
    &-content {
      display: flex;
      column-gap: 3rem;

      .apartment-details-content,
      .pd-payment-result {
        flex-basis: 50%;
      }
    }

  }

  &__total {
    display: flex;
    padding: 3rem 0;
    align-items: center;
    justify-content: space-between;
    border-top: 6px dashed var(--gray-200);
    //background-image: linear-gradient(to right, black 33%, rgba(255,255,255,0) 0%);;
    //background-position: bottom;
    //background-repeat: repeat-x;
    //background-size: 16px 16px;

    p {
      font-family: CraftworkSans, serif;
      font-style: normal;
      font-weight: 900;
      font-size: 36px;
      line-height: 42px;
      color: var(--violet-700);
      margin-bottom: 0;
    }
  }
}
</style>