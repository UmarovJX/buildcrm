<template>
  <div class="ch-contract-details">
    <section-title :bilingual="true" title="contract_details" class="cd-title km-b-2"/>
    <div class="ch-details-wrapper">
      <output-information :translate="true" property="contract_number" class="cd-number w-100">
        <template #value>
          <div class="d-flex align-items-center" style="column-gap: 1rem">
            <span>{{ contractNumber }}</span>
            <span class="edit-icon-wrapper">
            <k-icon name="edit" size="13.5" class="color-white"/>
          </span>
          </div>
        </template>
      </output-information>
      <base-date-picker
          v-model="contractDate"
          class="cd-date w-100"
          :range="false"
          format="DD.MM.YYYY"
          :placeholder="`${ $t('contracts.agreement_date') }`"
          :icon-fill="datePickerIconFill"
      />
    </div>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_OBJECT} from "@/constants/props";

import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import {KIcon} from "@/components/ui-components/material-icons";

export default {
  name: "ChContractDetails",
  components: {
    SectionTitle,
    OutputInformation,
    BaseDatePicker,
    KIcon
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, {})
  },
  data() {
    return {
      contractDate: null,
      contractNumber: 'J45TKL076',
      datePickerIconFill: 'var(--violet-600)'
    }
  },
}
</script>

<style lang="scss" scoped>
.ch-details-wrapper {
  display: flex;
  column-gap: 2rem;
}

.edit-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  background-color: var(--violet-600);
  border-radius: 50%;
  cursor: pointer;
}
</style>