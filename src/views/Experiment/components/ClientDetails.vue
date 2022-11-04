<template>
  <validation-observer tag="div" ref="clients-data-observer">
    <!--! CLIENTS_PERSONAL_DATA  -->
    <section-title title="clients_personal_data" :bilingual="true" class="km-b-2"/>
    <div class="clients-data-wrapper">
      <!--? CLIENT_PERSON_TYPE  -->
      <k-form-select
          :placeholder="$t('person_type')"
          :options="clientTypeOptions"
          :bilingual="true"
          v-model="personalData.client_type"
      />

      <!--!  START OF THE LEGAL ENTITY FIELDS    -->
      <template v-if="showLegalEntityFields">
        <!--? COMPANY_NAME  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('company_name') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.company_name"
              :placeholder="`${ $t('company_name') }`"
          />
        </validation-provider>

        <!--? COMPANY_NAME  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('bank') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.bank"
              :placeholder="`${ $t('bank') }`"
          />
        </validation-provider>

        <!--? ACCOUNT_NUMBER  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('account_number') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.account_number"
              :placeholder="`${ $t('account_number') }`"
          />
        </validation-provider>

        <!--? MFO  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('mfo') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.mfo"
              :placeholder="`${ $t('mfo') }`"
          />
        </validation-provider>

        <!--? INN  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('inn') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.inn"
              :placeholder="`${ $t('inn') }`"
          />
        </validation-provider>

        <!--? NDC  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('ndc') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.ndc"
              :placeholder="`${ $t('ndc') }`"
          />
        </validation-provider>
      </template>
      <!--!  END OF THE LEGAL ENTITY FIELDS    -->

      <template v-else>
        <!--? CLIENT_NATION  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required"
            :name="`${ $t('nation') }`"
        >
          <k-form-select
              :bilingual="true"
              :error="!!errors[0]"
              :options="nationOptions"
              :placeholder="$t('nation')"
              v-model="personalData.nation"
          />
        </validation-provider>

        <!--? CLIENT_PASSPORT_ID  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:9"
            :name="`${ $t('passport_series_example') }`"
        >
          <x-form-input
              :label="true"
              class="w-100"
              mask="AA#######"
              :error="!!errors[0]"
              v-model="personalData.passport_series"
              :placeholder="`${ $t('passport_series_example') }`"
          />
        </validation-provider>

        <!--? CLIENT_PLACE_OF_ISSUE  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('place_of_issue__of_passport_id') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.place_of_issue"
              :placeholder="`${ $t('place_of_issue__of_passport_id') }`"
          />
        </validation-provider>

        <!--? CLIENT_ISSUE_DATE  -->
        <validation-provider
            :name="`${ $t('passport_issue_date') }`"
            rules="required"
            v-slot="{ errors }"
        >
          <base-date-picker
              v-model="personalData.date_of_issue"
              :range="false"
              :error="!!errors[0]"
              class="data-picker"
              format="DD.MM.YYYY"
              :placeholder="`${ $t('passport_issue_date') }`"
              :icon-fill="datePickerIconFill"
          />
        </validation-provider>

        <!--? CLIENT_BIRTHDAY  -->
        <validation-provider
            :name="`${ $t('birth_day') }`"
            rules="required"
            v-slot="{ errors }"
        >
          <base-date-picker
              v-model="personalData.birth_day"
              class="w-100"
              :range="false"
              :error="!!errors[0]"
              format="DD.MM.YYYY"
              :placeholder="`${ $t('birth_day') }`"
              :icon-fill="datePickerIconFill"
          />
        </validation-provider>

        <!--? CLIENT_LAST_NAME_CYRILLIC  -->
        <validation-provider
            :name="`${ $t('last_name') } (${ $t('cyrillic_shortcut') }.)`"
            rules="required|min:1"
            v-slot="{ errors }"
        >
          <x-form-input
              :label="true"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.last_name.kirill"
              @input="translateLatin('last_name', $event)"
              :placeholder="`${ $t('last_name') } (${ $t('cyrillic_shortcut') }.)`"
          />
        </validation-provider>

        <!--? CLIENT_LAST_NAME_LATIN  -->
        <validation-provider
            :name="`${ $t('last_name') } (${ $t('latin_shortcut') }.)`"
            rules="required|min:1"
            v-slot="{ errors }"
        >
          <x-form-input
              class="w-100"
              :label="true"
              :error="!!errors[0]"
              v-model="personalData.last_name.latin"
              @input="translateCyrillic('last_name', $event)"
              :placeholder="`${ $t('last_name') } (${ $t('latin_shortcut') }.)`"
          />
        </validation-provider>

        <!--? CLIENT_FIRST_NAME_CYRILLIC  -->
        <validation-provider
            :name="`${ $t('name') } (${ $t('cyrillic_shortcut') }.)`"
            rules="required|min:1"
            v-slot="{ errors }"
        >
          <x-form-input
              class="w-100"
              :label="true"
              :error="!!errors[0]"
              v-model="personalData.first_name.kirill"
              @input="translateLatin('first_name', $event)"
              :placeholder="`${ $t('name') } (${ $t('cyrillic_shortcut') }.)`"
          />
        </validation-provider>

        <!--? CLIENT_FIRST_NAME_CYRILLIC  -->
        <validation-provider
            :name="`${ $t('name') } (${ $t('latin_shortcut') }.)`"
            rules="required|min:1"
            v-slot="{ errors }"
        >
          <x-form-input
              class="w-100"
              :label="true"
              :error="!!errors[0]"
              v-model="personalData.first_name.lotin"
              @input="translateCyrillic('first_name', $event)"
              :placeholder="`${ $t('name') } (${ $t('latin_shortcut') }.)`"
          />
        </validation-provider>

        <!--? CLIENT_SECOND_NAME_LATIN  -->
        <validation-provider
            :name="`${ $t('second_name') } (${ $t('cyrillic_shortcut') }.)`"
            rules="required|min:1"
            v-slot="{ errors }"
        >
          <x-form-input
              class="w-100"
              :label="true"
              :error="!!errors[0]"
              v-model="personalData.second_name.kirill"
              @input="translateLatin('second_name', $event)"
              :placeholder="`${ $t('second_name') } (${ $t('cyrillic_shortcut') }.)`"
          />
        </validation-provider>

        <!--? CLIENT_SECOND_NAME_LATIN  -->
        <validation-provider
            :name="`${ $t('second_name') } (${ $t('latin_shortcut') }.)`"
            rules="required|min:1"
            v-slot="{ errors }"
        >
          <x-form-input
              class="w-100"
              :label="true"
              :error="!!errors[0]"
              v-model="personalData.second_name.lotin"
              @input="translateCyrillic('second_name', $event)"
              :placeholder="`${ $t('second_name') } (${ $t('latin_shortcut') }.)`"
          />
        </validation-provider>

        <!--? CLIENT_COMMUNICATION_LANGUAGE  -->
        <validation-provider
            :name="`${ $t('language') }`"
            rules="required"
            v-slot="{ errors }"
        >
          <k-form-select
              v-model="personalData.language"
              :options="languageOptions"
              :placeholder="`${ $t('communication_language') }`"
          />
        </validation-provider>
      </template>
    </div>

    <!--! CLIENT_CONTACT_DETAILS  -->
    <section-title title="client_contact_details" :bilingual="true" class="km-b-2"/>
    <div class="clients-contact-details">
      <!--? CLIENT_PHONE  -->
      <validation-provider
          :name="`${ $t('phone') }`"
          rules="required|min:12"
          v-slot="{ errors }"
      >
        <x-form-input
            class="w-100"
            :label="true"
            :error="!!errors[0]"
            v-model="personalData.phone"
            mask="+### ## ### ## ##"
            :placeholder="`${ $t('phone') }`"
        />
      </validation-provider>


      <!--? CLIENT_ADDITIONAL_PHONE  -->
      <x-form-input
          class="w-100"
          :label="true"
          v-model="personalData.other_phone"
          mask="+### ## ### ## ##"
          :placeholder="`${ $t('additional_phone_number') }`"
      />

      <!--!  THE CONTINUATION OF THE LEGAL ENTITY FIELDS   -->
      <template v-if="showLegalEntityFields">
        <!--? LEGAL ADDRESS  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('legal_address') }`"
            class="ch-legal-address"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.legal_address"
              :placeholder="`${ $t('legal_address') }`"
          />
        </validation-provider>

        <!--? FAX  -->
        <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${ $t('fax') }`"
        >
          <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="personalData.legal_entity.fax"
              :placeholder="`${ $t('fax') }`"
          />
        </validation-provider>
      </template>
      <!--!  END OF THE LEGAL ENTITY FIELDS    -->

      <template v-else>
        <!--? CLIENT_EMAIL  -->
        <x-form-input
            class="w-100 ch-client-email"
            :label="true"
            type="email"
            v-model="personalData.email"
            :placeholder="`${ $t('email') }`"
        />

        <!--? CLIENT_ADDITIONAL_EMAIL  -->
        <x-form-input
            class="w-100"
            :label="true"
            v-model="personalData.other_email"
            :placeholder="`${ $t('additional_email') }`"
        />
      </template>

      <!--? CLIENT_EXTRA_PHONES_FIELD  -->
      <div
          v-for="(extraPhone,idx) in personalData.extra_phones"
          :key="extraPhone.value + idx"
          class="extra-phones-wrapper"
      >
        <x-form-input
            :label="true"
            class="w-100"
            mask="+### ## ### ## ##"
            :placeholder="`${ $t('additional_phone_number') }`"
            v-model="personalData.extra_phones[idx].value"
        />
        <base-button
            @click="removePhoneField(extraPhone)"
            class="remove-extra-phone-btn"
        >
          <x-icon name="remove" class="gray-400"/>
        </base-button>
      </div>

      <!--? ADD_EXTRA_PHONE_BUTTON  -->
      <base-button
          text="add_another_number"
          class="add-extra-phone-btn gray-600"
          :bilingual="true"
          @click="createExtraPhoneField"
      >
        <template #left-icon>
          <x-icon name="add" class="violet-600"/>
        </template>
      </base-button>
    </div>
  </validation-observer>
</template>

<script>
import {KFormSelect} from "@/components/ui-components/form-select";
import {XFormInput} from "@/components/ui-components/form-input";
import {XIcon} from "@/components/ui-components/material-icons";
import SectionTitle from "@/views/Experiment/elements/SectionTitle";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseButton from "@/components/Reusable/BaseButton";
import {
  symbolLatinToCyrillic,
  symbolCyrillicToLatin
} from "@/util/language-helper"

export default {
  name: "CheckoutClientDetails",
  components: {
    XIcon,
    KFormSelect,
    XFormInput,
    SectionTitle,
    BaseDatePicker,
    BaseButton,
  },

  data() {
    return {
      personalData: {
        client_type: 1,
        nation: null,
        passport_series: null,
        place_of_issue: null,
        date_of_issue: null,
        birth_day: null,
        phone: null,
        other_phone: null,
        email: null,
        other_email: null,
        language: 'uz',
        first_name: {kirill: null, latin: null},
        last_name: {kirill: null, latin: null},
        second_name: {kirill: null, latin: null},
        extra_phones: [],
        legal_entity: {
          company_name: null, bank: null, account_number: null,
          mfo: null, inn: null, ndc: null,
          legal_address: null, fax: null
        }
      },
      languageOptions: [{text: 'UZ', value: 'uz'}, {text: 'RU', value: 'ru'}],
      clientTypeOptions: [{text: 'physical_person', value: 1}, {text: 'legal_entity', value: 2}],
      nationOptions: [{text: 'uzbek', value: 1}, {text: 'english', value: 2}],
      datePickerIconFill: 'var(--violet-600)',
      timeoutId: null,
    }
  },

  computed: {
    showLegalEntityFields() {
      return this.personalData.client_type === 2
    }
  },

  methods: {
    translateLatin(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case 'first_name':
            if (!this.personalData.first_name.lotin) {
              this.personalData.first_name.lotin = symbolCyrillicToLatin(event);
            }
            break;
          case 'last_name':
            if (!this.personalData.last_name.lotin) {
              this.personalData.last_name.lotin = symbolCyrillicToLatin(event);
            }
            break;
          case 'second_name':
            if (!this.personalData.second_name.lotin) {
              this.personalData.second_name.lotin = symbolCyrillicToLatin(event);
            }
            break;
        }
      }, 1000)

    },
    translateCyrillic(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case 'first_name':
            if (!this.personalData.first_name.kirill) {
              this.personalData.first_name.kirill = symbolLatinToCyrillic(event);
            }
            break;
          case 'last_name':
            if (!this.personalData.last_name.kirill) {
              this.personalData.last_name.kirill = symbolLatinToCyrillic(event);
            }
            break;
          case 'second_name':
            if (!this.personalData.second_name.kirill) {
              this.personalData.second_name.kirill = symbolLatinToCyrillic(event);
            }
            break;
        }
      }, 1000)
    },
    createExtraPhoneField() {
      const lengthOfExtra = this.personalData.extra_phones.length
      this.personalData.extra_phones.push({
        value: null,
        idx: lengthOfExtra + 1 + '_idx'
      })
    },
    removePhoneField({idx: rIdx}) {
      this.personalData.extra_phones = this.personalData.extra_phones.filter(({idx}) => idx !== rIdx)
    },
    async validateFields() {
      return await this.$refs['clients-data-observer'].validate()
    }
  }
}
</script>

<style lang="scss" scoped>
.clients-data-wrapper,
.clients-contact-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2rem;
  row-gap: 1rem;

  .ch-client-email,
  .ch-legal-address {
    grid-column: 2/3;
    grid-row: 1/2;
  }
}

.clients-data-wrapper {
  margin-bottom: 3rem;
}

.extra-phones-wrapper {
  grid-column: 1/2;
  display: flex;
  gap: 0.5rem;
}

.remove-extra-phone-btn {
  padding: 1rem;
}

.add-extra-phone-btn {
  grid-column: 1/2;
  padding: 18px 24px 18px 18px;
  width: fit-content;
}
</style>