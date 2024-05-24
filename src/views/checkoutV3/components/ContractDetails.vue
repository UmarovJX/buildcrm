<script>
import { makeProp as p } from "@/util/props";
import { PROP_TYPE_OBJECT } from "@/constants/props";

import SectionTitle from "@/views/checkoutV2/elements/SectionTitle";
import OutputInformation from "@/components/Elements/Outputs/OutputInformation";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseInput from "@/components/Reusable/BaseInput";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import { XIcon } from "@/components/ui-components/material-icons";
import { mapActions, mapState } from "vuex";
import { formatDateToYMD } from "@/util/calendar";

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
    XIcon,
  },
  props: {
    order: p(PROP_TYPE_OBJECT, {}),
  },
  data() {
    return {
      contractDate: formatDateToYMD(this.order.contract_date),
      datePickerIconFill: "var(--violet-600)",
      newContractNumber: this.order.contract_number,
    };
  },
  computed: {
    changedContractNumber() {
      return (
        this.newContractNumber &&
        this.newContractNumber.length &&
        !(this.newContractNumber === this.order.contract_number)
      );
    },
  },
  watch: {
    contractDate(ltsValue) {
      this.$emit("contract-date", {
        value: ltsValue,
        uuid: this.order.uuid,
      });
    },
  },

  methods: {
    closeEditNumberModal() {
      this.$refs["edit-contract-number"].closeModal();
    },
    setNewContractNumber() {
      this.$emit("contract-number", {
        value: this.newContractNumber,
        uuid: this.order.uuid,
      });
      this.closeEditNumberModal();
    },
    openEditNumberModal() {
      this.$refs["edit-contract-number"].openModal();
    },
  },
};
</script>

<template>
  <div class="ch-contract-details">
    <section-title
      :bilingual="true"
      title="contract_details"
      class="cd-title km-b-2"
    />
    <div class="ch-details-wrapper">
      <output-information
        :translate="true"
        property="contract_number"
        class="cd-number w-100"
      >
        <template #value>
          <div class="d-flex align-items-center" style="column-gap: 1rem">
            <span>{{ order.contract_number }}</span>
            <span class="edit-icon-wrapper" @click="openEditNumberModal">
              <x-icon name="edit" size="13.5" class="color-white" />
            </span>
          </div>
        </template>
      </output-information>
      <base-date-picker
        v-model="contractDate"
        class="cd-date w-100"
        :range="false"
        format="DD.MM.YYYY"
        :placeholder="`${$t('contracts.agreement_date')}`"
        :icon-fill="datePickerIconFill"
      />
    </div>

    <base-modal ref="edit-contract-number" design="auto-height">
      <template #header>
        <span class="d-flex align-items-center justify-content-between">
          <!--    TITLE      -->
          <span class="title">{{ $t("apartments.agree.number") }}</span>
          <!--   CLOSE    -->
          <span class="go__back" @click="closeEditNumberModal">
            <BaseCloseIcon :width="56" :height="56" />
          </span>
        </span>
      </template>

      <template #main>
        <div>
          <base-input
            v-model="newContractNumber"
            :label="true"
            class="w-100"
            padding-left="2px !important"
            :placeholder="`${$t('apartments.agree.number')}`"
          />
        </div>
      </template>
      <template #footer>
        <base-button
          :disabled="!changedContractNumber"
          class="violet-gradient w-100"
          :text="`${$t('apply')}`"
          @click="setNewContractNumber"
        />
      </template>
    </base-modal>
  </div>
</template>

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
