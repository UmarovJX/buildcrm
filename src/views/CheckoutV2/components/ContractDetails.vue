<template>
  <div class="ch-contract-details">
    <section-title :bilingual="true" title="contract_details" class="cd-title km-b-2"/>
    <div class="ch-details-wrapper">
      <output-information :translate="true" property="contract_number" class="cd-number w-100">
        <template #value>
          <div class="d-flex align-items-center" style="column-gap: 1rem">
            <span>{{ contractNumber }}</span>
            <span @click="openEditNumberModal" class="edit-icon-wrapper">
              <x-icon name="edit" size="13.5" class="color-white"/>
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

    <base-modal ref="edit-contract-number" design="auto-height">
      <template #header>
        <span class="d-flex align-items-center justify-content-between">
          <!--    TITLE      -->
          <span class="title">{{ $t('apartments.agree.number') }}</span>
          <!--   CLOSE    -->
          <span class="go__back" @click="closeEditNumberModal">
            <BaseCloseIcon :width="56" :height="56"/>
          </span>
        </span>
      </template>

      <template #main>
        <div>
          <base-input
              :label="true"
              class="w-100"
              padding-left="2px !important"
              v-model="newContractNumber"
              :placeholder="`${ $t('apartments.agree.number') }`"
          />
        </div>
      </template>
      <template #footer>
        <base-button
            @click="setNewContractNumber"
            :disabled="!changedContractNumber"
            class="violet-gradient w-100"
            :text="`${ $t('apply') }`"
        />
      </template>
    </base-modal>
  </div>
</template>

<script>
import {makeProp as p} from "@/util/props";
import {PROP_TYPE_OBJECT} from "@/constants/props";

import SectionTitle from "@/views/CheckoutV2/elements/SectionTitle";
import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import {XIcon} from "@/components/ui-components/material-icons";
import {mapActions, mapState} from "vuex";
import {formatDateToYMD} from "@/util/calendar";

export default {
  name: "ChContractDetails",
  components: {
    SectionTitle,
    OutputInformation,
    BaseDatePicker,
    BaseModal,
    BaseButton,
    BaseInput,
    BaseCloseIcon,
    XIcon
  },
  props: {
    apartment: p(PROP_TYPE_OBJECT, {})
  },
  data() {
    return {
      contractDate: formatDateToYMD(),
      datePickerIconFill: 'var(--violet-600)',
      changedContractNumber: false,
      newContractNumber: '',
      contractNumber: ''
    }
  },
  computed: {
    ...mapState('CheckoutV2', {
      stateContractNumber: 'contract_number'
    })
  },
  watch: {
    newContractNumber(value) {
      this.changedContractNumber = !!(value && value.length && !(value === this.contractNumber))
      if (this.changedContractNumber) {
        this.changeContractNumber({
          apmId: this.apartment.id,
          contractNumber: value
        })
      }
    }
  },
  mounted() {
    this.contractNumber = this.apartment.contract_number
  },
  methods: {
    ...mapActions('CheckoutV2', ['changeContractNumber']),
    closeEditNumberModal() {
      this.$refs['edit-contract-number'].closeModal()
      this.changedContractNumber = false
    },
    setNewContractNumber() {
      this.contractNumber = this.newContractNumber
      this.closeEditNumberModal()
    },
    openEditNumberModal() {
      this.newContractNumber = this.contractNumber
      this.$refs['edit-contract-number'].openModal()
    },
  }
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
  user-select: none;
}
</style>