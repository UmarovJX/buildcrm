<script>
import { XFormSelect } from "@/components/ui-components/form-select";
import { XFormInput } from "@/components/ui-components/form-input";
import { XIcon } from "@/components/ui-components/material-icons";
import SectionTitle from "@/views/CheckoutV2/elements/SectionTitle";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";
import BaseButton from "@/components/Reusable/BaseButton";
import {
  symbolLatinToCyrillic,
  symbolCyrillicToLatin,
} from "@/util/language-helper";
import api from "@/services/api";
import { formatDateToYMD } from "@/util/calendar";
import { mapGetters, mapMutations } from "vuex";
import { isNotUndefinedNullEmptyZero } from "@/util/inspect";

export default {
  name: "CheckoutClientDetails",
  components: {
    XIcon,
    XFormSelect: XFormSelect,
    XFormInput,
    SectionTitle,
    BaseDatePicker,
    BaseButton,
  },

  data() {
    const emptyClientProperties = {
      subject: 1,
      passport_series: null,
      place_of_issue: null,
      date_of_issue: null,
      birth_day: null,
      phone: null,
      other_phone: null,
      email: null,
      other_email: null,
      language: "uz",
      first_name: { kirill: null, lotin: null },
      last_name: { kirill: null, lotin: null },
      middle_name: { kirill: null, lotin: null },
      extra_phones: [],
      legal_entity: {
        company_name: null,
        bank: null,
        account_number: null,
        mfo: null,
        inn: null,
        ndc: null,
        legal_address: null,
        fax: null,
      },
      client_type_id: null,
      company_type_id: null,
      country_id: null,
    };

    return {
      companyTypes: [],
      autoFill: false,
      countriesList: [],
      clientTypesList: [],
      emptyClientProperties,
      personalData: { ...emptyClientProperties },
      languageOptions: [
        { text: "UZ", value: "uz" },
        { text: "RU", value: "ru" },
      ],
      subjectOptions: [
        { text: "physical_person", value: 1 },
        { text: "legal_entity", value: 2 },
      ],
      datePickerIconFill: "var(--violet-600)",
      timeoutId: null,
    };
  },

  computed: {
    ...mapGetters("CheckoutV2", ["isUpdateMode"]),
    companyTypeOptions() {
      return this.companyTypes.map(({ id, name }) => {
        return {
          value: id,
          text: name[this.$i18n.locale],
        };
      });
    },
    showLegalEntityFields() {
      return this.personalData.subject === 2;
    },
    clientTypeOptions() {
      return this.clientTypesList.map(({ name, id }) => ({
        text: name[this.$i18n.locale],
        value: id,
      }));
    },
  },

  async created() {
    await this.getCountriesList();
    await this.getClientTypesList();
    await this.fetchCompanyType();
  },

  methods: {
    ...mapMutations("CheckoutV2", ["setCountryList", "setClientTypeList"]),
    clientDebounce() {
      if (this.personalData.passport_series) {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          this.getClientByPassport();
        }, 500);
      } else {
        if (this.autoFill) {
          this.resetClientContext();
          this.turnedOffAutoFill();
        }
      }
    },
    fetchLegalDadaByInn() {
      if (this.personalData.legal_entity.inn) {
        if (this.timeoutId !== null) {
          clearTimeout(this.timeoutId);
        }
        this.timeoutId = setTimeout(() => {
          this.getLegalClientByInn();
        }, 500);
      } else {
        if (this.autoFill) {
          this.resetClientContext();
          this.turnedOffAutoFill();
        }
      }
    },
    async fetchCompanyType() {
      await api.companies
        .getCompanyType()
        .then((response) => {
          this.companyTypes = response.data;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        });
    },
    turnedOnAutoFill() {
      this.autoFill = true;
    },
    turnedOffAutoFill() {
      this.autoFill = false;
    },
    async getLegalClientByInn() {
      if (this.personalData.legal_entity.inn.length > 3) {
        try {
          const { data } = await api.clientsV2.getClientBySearch({
            params: {
              field: this.personalData.legal_entity.inn,
              subject: "legal",
            },
          });
          this.autoFillFieldsByInn(data);
          this.turnedOnAutoFill();
        } catch (e) {
          this.resetClientContext();
          this.turnedOffAutoFill();
        }
      }
    },
    autoFillFieldsByInn(data) {
      this.personalData.legal_entity.fax = data.attributes.fax;
      this.personalData.legal_entity.mfo = data.attributes.mfo;
      this.personalData.legal_entity.ndc = data.attributes.nds;
      this.personalData.legal_entity.bank = data.attributes.bank_name;
      this.personalData.legal_entity.account_number =
        data.attributes.payment_number;
      this.personalData.legal_entity.legal_address =
        data.attributes.legal_address;
      this.personalData.legal_entity.company_name = data.attributes.name;
      this.personalData.company_type_id = data.attributes.company.id;
      this.personalData.email = data.email;
      this.personalData.other_email = data.additional_email;
      this.personalData.client_type_id = data.client_type.id;
      this.autoFillPhones(data.phones);
    },
    async getClientByPassport() {
      if (this.personalData.passport_series.length === 9) {
        try {
          const { data } = await api.clientsV2.getClientBySearch({
            params: {
              field: this.personalData.passport_series,
              subject: "physical",
            },
          });
          this.autoFillFieldsByPassportSeries(data);
          this.turnedOnAutoFill();
        } catch (e) {
          this.resetClientContext();
          this.turnedOffAutoFill();
        }
      }
    },
    autoFillFieldsByPassportSeries(data) {
      this.personalData.country_id = data.attributes.country.id;
      this.personalData.place_of_issue = data.attributes.passport_issued_by;
      this.personalData.date_of_issue = formatDateToYMD(
        data.attributes.passport_issued_date
      );
      this.personalData.birth_day = formatDateToYMD(
        data.attributes.date_of_birth
      );
      this.personalData.email = data.email;
      this.personalData.other_email = data.additional_email;
      this.personalData.language = data.language.toLowerCase();
      this.personalData.first_name = data.attributes.first_name;
      this.personalData.last_name = data.attributes.last_name;
      this.personalData.middle_name = data.attributes.middle_name;
      this.personalData.client_type_id = data.client_type.id;
      this.personalData.country_id = data.attributes.country.id;
      this.autoFillPhones(data.phones);
    },

    autoFillPhones(phones) {
      phones = phones.filter((p) => {
        return (
          isNotUndefinedNullEmptyZero(p.phone) && p.phone.toString().length > 3
        );
      });

      if (phones.length > 0) {
        this.personalData.phone = phones[0].phone;
      }

      if (phones.length > 1) {
        this.personalData.other_phone = phones[1].phone;
      }

      if (phones.length > 2) {
        for (let i = 2; i < phones.length; i++) {
          this.personalData.extra_phones.push({
            idx: phones[i].id,
            value: phones[i].phone,
          });
        }
      }
    },

    resetClientContext() {
      this.personalData = {
        ...this.emptyClientProperties,
        subject: this.personalData.subject,
        passport_series: this.personalData.passport_series,
        extra_phones: [],
      };
    },
    translateLatin(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case "first_name":
            if (!this.personalData.first_name.lotin) {
              this.personalData.first_name.lotin = symbolCyrillicToLatin(event);
            }
            break;
          case "last_name":
            if (!this.personalData.last_name.lotin) {
              this.personalData.last_name.lotin = symbolCyrillicToLatin(event);
            }
            break;
          case "second_name":
            if (!this.personalData.middle_name.lotin) {
              this.personalData.middle_name.lotin =
                symbolCyrillicToLatin(event);
            }
            break;
        }
      }, 1000);
    },
    translateCyrillic(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case "first_name":
            if (!this.personalData.first_name.kirill) {
              this.personalData.first_name.kirill =
                symbolLatinToCyrillic(event);
            }
            break;
          case "last_name":
            if (!this.personalData.last_name.kirill) {
              this.personalData.last_name.kirill = symbolLatinToCyrillic(event);
            }
            break;
          case "second_name":
            if (!this.personalData.middle_name.kirill) {
              this.personalData.middle_name.kirill =
                symbolLatinToCyrillic(event);
            }
            break;
        }
      }, 1000);
    },
    createExtraPhoneField() {
      const lengthOfExtra = this.personalData.extra_phones.length;
      this.personalData.extra_phones.push({
        value: null,
        idx: lengthOfExtra + 1 + "_idx",
      });
    },
    removePhoneField({ idx: rIdx }) {
      this.personalData.extra_phones = this.personalData.extra_phones.filter(
        ({ idx }) => idx !== rIdx
      );
    },
    getObserverFlags() {
      return this.$refs["clients-data-observer"].flags;
    },
    async validateFields() {
      return await this.$refs["clients-data-observer"].validate();
    },
    async getCountriesList() {
      try {
        const { data: countriesList } = await api.settingsV2.fetchCountries();
        this.setCountryList(countriesList);
        this.countriesList = countriesList.map((cty) => ({
          value: cty.id,
          text: cty.name.uz,
        }));
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    async getClientTypesList() {
      try {
        const { data: clientTypesList } = await api.settingsV2.getClientTypes();
        this.setClientTypeList(clientTypesList);
        this.clientTypesList = clientTypesList;
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    isPhysicalClient: (clientSubject) => clientSubject === "physical",
    isLegalClient: (clientSubject) => clientSubject === "legal",
    sendForm() {
      const p = this.personalData;

      const phones = p.extra_phones.map(({ idx, value }) => {
        if (isNotUndefinedNullEmptyZero(idx)) {
          return {
            id: idx,
            phone: value,
          };
        }

        return {
          id: null,
          phone: value,
        };
      });

      phones.unshift({ id: null, phone: p.other_phone });
      phones.unshift({ id: null, phone: p.phone });

      const common = {
        phones,
        email: p.email,
        language: p.language,
        client_type_id: p.client_type_id,
        additional_email: p.other_email,
      };
      if (p.subject === 1) {
        return {
          subject: "physical",
          ...common,
          attributes: {
            first_name: p.first_name,
            last_name: p.last_name,
            middle_name: p.middle_name,
            date_of_birth: p.birth_day,
            passport_issued_date: p.date_of_issue,
            passport_issued_by: p.place_of_issue,
            passport_series: p.passport_series,
            country_id: p.country_id,
          },
        };
      } else {
        return {
          subject: "legal",
          ...common,
          attributes: {
            name: p.legal_entity.company_name,
            payment_number: p.legal_entity.account_number,
            bank_name: p.legal_entity.bank,
            mfo: p.legal_entity.mfo,
            inn: p.legal_entity.inn,
            nds: p.legal_entity.ndc,
            legal_address: p.legal_entity.legal_address,
            fax: p.legal_entity.fax,
            company_type_id: p.company_type_id,
          },
        };
      }
    },
    fillFormInUpdateMode({ client }) {
      if (this.isPhysicalClient(client.subject)) {
        this.personalData.subject = 1;
        this.personalData.passport_series = client.attributes.passport_series;
        this.autoFillFieldsByPassportSeries(client);
      }

      if (this.isLegalClient(client.subject)) {
        this.personalData.subject = 2;
        this.personalData.legal_entity.company_name = client.attributes.name;
        this.personalData.legal_entity.bank = client.attributes.bank_name;
        this.personalData.legal_entity.account_number =
          client.attributes.payment_number;
        this.personalData.legal_entity.mfo = client.attributes.mfo;
        this.personalData.legal_entity.inn = client.attributes.inn;
        this.personalData.legal_entity.ndc = client.attributes.nds;
        this.personalData.legal_entity.legal_address =
          client.attributes.legal_address;
        this.personalData.legal_entity.fax = client.attributes.fax;
      }
    },
  },
};
</script>

<template>
  <validation-observer tag="div" ref="clients-data-observer">
    <!--! CLIENTS_PERSONAL_DATA  -->
    <section-title
      title="clients_personal_data"
      :bilingual="true"
      class="km-b-2"
    />
    <div class="clients-data-wrapper">
      <!--? CLIENT_PERSON_TYPE  -->
      <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${$t('person_type')}`"
      >
        <x-form-select
          :bilingual="true"
          :error="!!errors[0]"
          :placeholder="$t('person_type')"
          :options="subjectOptions"
          v-model="personalData.subject"
        />
      </validation-provider>

      <!--!  START OF THE LEGAL ENTITY FIELDS    -->
      <template v-if="showLegalEntityFields">
        <!--? INN  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('inn')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :placeholder="`${$t('inn')}`"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.inn"
            @input="fetchLegalDadaByInn"
          />
        </validation-provider>

        <!--? COMPANY_TYPE  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          :name="`${$t('company_type')}`"
        >
          <x-form-select
            v-if="companyTypeOptions.length"
            :error="!!errors[0]"
            :options="companyTypeOptions"
            value-field="value"
            text-field="text"
            :placeholder="$t('company_type')"
            v-model="personalData.company_type_id"
          />
        </validation-provider>

        <!--? COMPANY_NAME  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('company_name')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.company_name"
            :placeholder="`${$t('company_name')}`"
          />
        </validation-provider>

        <!--? BANK  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('bank')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.bank"
            :placeholder="`${$t('bank')}`"
          />
        </validation-provider>

        <!--? ACCOUNT_NUMBER  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('account_number')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.account_number"
            :placeholder="`${$t('account_number')}`"
          />
        </validation-provider>

        <!--? MFO  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('mfo')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.mfo"
            :placeholder="`${$t('mfo')}`"
          />
        </validation-provider>

        <!--? NDC  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('ndc')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.ndc"
            :placeholder="`${$t('ndc')}`"
          />
        </validation-provider>
      </template>
      <!--!  END OF THE LEGAL ENTITY FIELDS    -->

      <template v-if="!showLegalEntityFields">
        <!--? CLIENT_PASSPORT_ID  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:5"
          :name="`${$t('passport_series_example')}`"
        >
          <x-form-input
            :label="true"
            class="w-100"
            :error="!!errors[0]"
            :placeholder="`${$t('passport_series_example')}`"
            v-model="personalData.passport_series"
            @input="clientDebounce"
          />
        </validation-provider>

        <!--? CLIENT_NATION  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required"
          :name="`${$t('nation')}`"
        >
          <x-form-select
            :bilingual="true"
            :error="!!errors[0]"
            :options="countriesList"
            :placeholder="$t('nation')"
            v-model="personalData.country_id"
          />
        </validation-provider>

        <!--? CLIENT_PLACE_OF_ISSUE  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('place_of_issue__of_passport_id')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.place_of_issue"
            :placeholder="`${$t('place_of_issue__of_passport_id')}`"
          />
        </validation-provider>

        <!--? CLIENT_ISSUE_DATE  -->
        <validation-provider
          :name="`${$t('passport_issue_date')}`"
          rules="required"
          v-slot="{ errors }"
        >
          <base-date-picker
            v-model="personalData.date_of_issue"
            :range="false"
            :error="!!errors[0]"
            class="data-picker"
            format="DD.MM.YYYY"
            :placeholder="`${$t('passport_issue_date')}`"
            :icon-fill="datePickerIconFill"
          />
        </validation-provider>

        <!--? CLIENT_BIRTHDAY  -->
        <validation-provider
          :name="`${$t('birth_day')}`"
          rules="required"
          v-slot="{ errors }"
        >
          <base-date-picker
            v-model="personalData.birth_day"
            class="w-100"
            :range="false"
            :error="!!errors[0]"
            format="DD.MM.YYYY"
            :placeholder="`${$t('birth_day')}`"
            :icon-fill="datePickerIconFill"
          />
        </validation-provider>

        <!--? CLIENT_LAST_NAME_CYRILLIC  -->
        <validation-provider
          :name="`${$t('last_name')} (${$t('cyrillic_shortcut')}.)`"
          rules="required|min:1"
          v-slot="{ errors }"
        >
          <x-form-input
            :label="true"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.last_name.kirill"
            @input="translateLatin('last_name', $event)"
            :placeholder="`${$t('last_name')} (${$t('cyrillic_shortcut')}.)`"
          />
        </validation-provider>

        <!--? CLIENT_LAST_NAME_LATIN  -->
        <validation-provider
          :name="`${$t('last_name')} (${$t('latin_shortcut')}.)`"
          rules="required|min:1"
          v-slot="{ errors }"
        >
          <x-form-input
            class="w-100"
            :label="true"
            :error="!!errors[0]"
            v-model="personalData.last_name.lotin"
            @input="translateCyrillic('last_name', $event)"
            :placeholder="`${$t('last_name')} (${$t('latin_shortcut')}.)`"
          />
        </validation-provider>

        <!--? CLIENT_FIRST_NAME_CYRILLIC  -->
        <validation-provider
          :name="`${$t('name')} (${$t('cyrillic_shortcut')}.)`"
          rules="required|min:1"
          v-slot="{ errors }"
        >
          <x-form-input
            class="w-100"
            :label="true"
            :error="!!errors[0]"
            v-model="personalData.first_name.kirill"
            @input="translateLatin('first_name', $event)"
            :placeholder="`${$t('name')} (${$t('cyrillic_shortcut')}.)`"
          />
        </validation-provider>

        <!--? CLIENT_FIRST_NAME_CYRILLIC  -->
        <validation-provider
          :name="`${$t('name')} (${$t('latin_shortcut')}.)`"
          rules="required|min:1"
          v-slot="{ errors }"
        >
          <x-form-input
            class="w-100"
            :label="true"
            :error="!!errors[0]"
            v-model="personalData.first_name.lotin"
            @input="translateCyrillic('first_name', $event)"
            :placeholder="`${$t('name')} (${$t('latin_shortcut')}.)`"
          />
        </validation-provider>

        <!--? CLIENT_SECOND_NAME_LATIN  -->
        <validation-provider
          :name="`${$t('second_name')} (${$t('cyrillic_shortcut')}.)`"
          rules="required|min:1"
          v-slot="{ errors }"
        >
          <x-form-input
            class="w-100"
            :label="true"
            :error="!!errors[0]"
            v-model="personalData.middle_name.kirill"
            @input="translateLatin('second_name', $event)"
            :placeholder="`${$t('second_name')} (${$t('cyrillic_shortcut')}.)`"
          />
        </validation-provider>

        <!--? CLIENT_SECOND_NAME_LATIN  -->
        <validation-provider
          :name="`${$t('second_name')} (${$t('latin_shortcut')}.)`"
          rules="required|min:1"
          v-slot="{ errors }"
        >
          <x-form-input
            class="w-100"
            :label="true"
            :error="!!errors[0]"
            v-model="personalData.middle_name.lotin"
            @input="translateCyrillic('second_name', $event)"
            :placeholder="`${$t('second_name')} (${$t('latin_shortcut')}.)`"
          />
        </validation-provider>
      </template>

      <!--? CLIENT_TYPE  -->
      <validation-provider
        v-slot="{ errors }"
        rules="required"
        :name="`${$t('client_type')}`"
      >
        <x-form-select
          v-if="clientTypesList.length"
          :error="!!errors[0]"
          :options="clientTypesList"
          :multilingual="true"
          value-field="id"
          text-field="name"
          :placeholder="$t('client_type')"
          v-model="personalData.client_type_id"
        />
      </validation-provider>

      <!--? CLIENT_COMMUNICATION_LANGUAGE  -->
      <validation-provider
        :name="`${$t('language')}`"
        rules="required"
        v-slot="{ errors }"
      >
        <x-form-select
          v-model="personalData.language"
          :error="!!errors[0]"
          :options="languageOptions"
          :placeholder="`${$t('communication_language')}`"
        />
      </validation-provider>
    </div>

    <!--! CLIENT_CONTACT_DETAILS  -->
    <section-title
      title="client_contact_details"
      :bilingual="true"
      class="km-b-2"
    />
    <div class="clients-contact-details">
      <!--? CLIENT_PHONE  -->
      <validation-provider
        :name="`${$t('phone')}`"
        rules="required|min:4"
        v-slot="{ errors }"
      >
        <x-form-input
          class="w-100"
          :label="true"
          :error="!!errors[0]"
          v-model="personalData.phone"
          mask="+### ## ### ## ##"
          :placeholder="`${$t('phone')}`"
        />
      </validation-provider>

      <!--? CLIENT_ADDITIONAL_PHONE  -->
      <x-form-input
        class="w-100"
        :label="true"
        v-model="personalData.other_phone"
        mask="+### ## ### ## ##"
        :placeholder="`${$t('additional_phone_number')}`"
      />

      <!--!  THE CONTINUATION OF THE LEGAL ENTITY FIELDS   -->
      <template v-if="showLegalEntityFields">
        <!--? LEGAL ADDRESS  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('legal_address')}`"
          class="ch-legal-address"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.legal_address"
            :placeholder="`${$t('legal_address')}`"
          />
        </validation-provider>

        <!--? FAX  -->
        <validation-provider
          v-slot="{ errors }"
          rules="required|min:3"
          :name="`${$t('fax')}`"
        >
          <x-form-input
            :label="true"
            type="text"
            class="w-100"
            :error="!!errors[0]"
            v-model="personalData.legal_entity.fax"
            :placeholder="`${$t('fax')}`"
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
          :placeholder="`${$t('email')}`"
        />

        <!--? CLIENT_ADDITIONAL_EMAIL  -->
        <x-form-input
          class="w-100"
          :label="true"
          v-model="personalData.other_email"
          :placeholder="`${$t('additional_email')}`"
        />
      </template>

      <!--? CLIENT_EXTRA_PHONES_FIELD  -->
      <div
        v-for="(extraPhone, idx) in personalData.extra_phones"
        :key="extraPhone + idx"
        class="extra-phones-wrapper"
      >
        <x-form-input
          :label="true"
          class="w-100"
          mask="+### ## ### ## ##"
          :placeholder="`${$t('additional_phone_number')}`"
          v-model="personalData.extra_phones[idx].value"
        />
        <base-button
          @click="removePhoneField(extraPhone)"
          class="remove-extra-phone-btn"
        >
          <x-icon name="remove" class="gray-400" />
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
          <x-icon name="add" class="violet-600" />
        </template>
      </base-button>
    </div>
  </validation-observer>
</template>

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
