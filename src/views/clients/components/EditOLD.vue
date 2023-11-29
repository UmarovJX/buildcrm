<script>
import api from "@/services/api";
import {
  symbolLatinToCyrillic,
  symbolCyrillicToLatin,
} from "@/util/language-helper";

import { formatDateToYMD } from "@/util/calendar";

import { XFormInput } from "@/components/ui-components/form-input";
import { XFormSelect } from "@/components/ui-components/form-select";

import { XModalCenter } from "@/components/ui-components/modal-center";
import BaseDatePicker from "@/components/Reusable/BaseDatePicker";

export default {
  name: "ClientEdit",
  components: {
    BaseDatePicker,
    XFormSelect,
    XFormInput,
    XModalCenter,
  },
  props: {
    editItem: Object,
    clientOptions: Array,
    countryOptions: Array,
  },
  emits: ["client-type-created", "close-creating-modal"],
  data() {
    return {
      applyButtonLoading: false,
      subject: "",
      client_type_id: "",
      language: "",
      email: "",
      additional_email: "",
      phones: [],
      physical_attributes: {
        first_name: {
          lotin: "",
          kirill: "",
        },
        last_name: {
          lotin: "",
          kirill: "",
        },
        middle_name: {
          lotin: "",
          kirill: "",
        },
        date_of_birth: "",
        passport_issued_date: "",
        passport_issued_by: "",
        passport_series: "",
        country_id: 1,
        address_line: "",
      },
      legal_attributes: {
        name: "",
        payment_number: "",
        bank_name: "",
        mfo: "",
        inn: "",
        nds: "",
        legal_address: "",
        fax: "",
      },

      languageOptions: [
        { text: "UZ", value: "uz" },
        { text: "RU", value: "ru" },
      ],
      subjectOptions: [
        { text: "physical_person", value: 1 },
        { text: "legal_entity", value: 2 },
      ],
      datePickerIconFill: "var(--violet-600)",
    };
  },

  created() {
    this.setEditData();
  },

  methods: {
    setTab(e) {
      this.currentLang = e;
    },
    setEditData() {
      this.subject = (this.editItem.subject === "legal") + 1;
      this.client_type_id = this.editItem.client_type.id;
      this.language = this.editItem.language;
      this.email = this.editItem.email;
      this.additional_email = this.editItem.additional_email;
      this.phones = JSON.parse(JSON.stringify(this.editItem.phones));
      if (this.editItem.subject === "legal") {
        this.legal_attributes = JSON.parse(
          JSON.stringify(this.editItem.attributes)
        );
      } else {
        const d = this.physical_attributes;
        const s = this.editItem.attributes;
        d.country_id = s.country.id;
        d.date_of_birth = formatDateToYMD(s.date_of_birth);
        d.passport_issued_date = formatDateToYMD(s.passport_issued_date);
        d.passport_issued_by = s.passport_issued_by;
        d.passport_series = s.passport_series;
        d.address_line = s.address_line;
        d.first_name = JSON.parse(JSON.stringify(s.first_name));
        d.last_name = JSON.parse(JSON.stringify(s.last_name));
        d.middle_name = JSON.parse(JSON.stringify(s.middle_name));
      }
    },
    closeCreatingModal() {
      this.clearForm();
      this.$emit("close-creating-modal");
    },
    startLoading() {
      this.applyButtonLoading = true;
    },
    finishLoading() {
      this.applyButtonLoading = false;
    },

    async saveItem() {
      const isSatisfied = await this.$refs["creating-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        const d = {
          version: this.item.version,
          latest: this.item.latest,
          fixed: this.item.fixed,
          published: this.item.published,
        };

        try {
          let response;
          if (this.upsertType === "edit") {
            response = await api.settings.updateVersion(this.editItem.id, d);
          } else {
            response = await api.settings.createVersion(d);
          }

          this.clearForm();
          this.$emit("client-type-created");
        } catch (e) {
          console.log(e.message);
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    clearForm() {
      this.client = { ...this.clientForm };
    },
    translateLatin(type, event) {
      if (this.timeoutId !== null) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        switch (type) {
          case "first_name":
            if (!this.physical_attributes.first_name.lotin) {
              this.physical_attributes.first_name.lotin =
                symbolCyrillicToLatin(event);
            }
            break;
          case "last_name":
            if (!this.physical_attributes.last_name.lotin) {
              this.physical_attributes.last_name.lotin =
                symbolCyrillicToLatin(event);
            }
            break;
          case "second_name":
            if (!this.physical_attributes.middle_name.lotin) {
              this.physical_attributes.middle_name.lotin =
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
            if (!this.physical_attributes.first_name.kirill) {
              this.physical_attributes.first_name.kirill =
                symbolLatinToCyrillic(event);
            }
            break;
          case "last_name":
            if (!this.physical_attributes.last_name.kirill) {
              this.physical_attributes.last_name.kirill =
                symbolLatinToCyrillic(event);
            }
            break;
          case "second_name":
            if (!this.physical_attributes.middle_name.kirill) {
              this.physical_attributes.middle_name.kirill =
                symbolLatinToCyrillic(event);
            }
            break;
        }
      }, 1000);
    },
  },
};
</script>

<template>
  <x-modal-center
    :bilingual="true"
    apply-button-text="save"
    cancel-button-text="cancel"
    footer-class="d-flex justify-content-between x-gap-1"
    apply-button-class="w-100"
    cancel-button-class="w-100"
    :apply-button-loading="applyButtonLoading"
    :modal-container-style="{
      'max-width': '960px',
      'max-height': '720px',
      width: '75%',
      height: '100%',
      overflowY: 'scroll',
    }"
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="saveItem"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        Редактировать данные клиента
      </h3>
    </template>

    <template #body>
      <validation-observer
        ref="creating-observer"
        class="client-type-creating-body"
      >
        <!-- ROW   -->
        <div class="row">
          <!-- SUBJECT -->
          <validation-provider
            ref="clientTypeNameVProvider"
            name="last-name-uz-provider"
            rules="required"
            v-slot="{ errors }"
            class="title-uz-provider col-6"
          >
            <x-form-select
              :bilingual="true"
              :error="!!errors[0]"
              :placeholder="$t('person_type')"
              :options="subjectOptions"
              v-model="subject"
            />
            <span class="error__provider" v-if="errors[0]">
              {{
                errors[0].replace("last-name-uz-provider", $t("person_type"))
              }}
            </span>
          </validation-provider>
          <!-- PASSPORT -->
          <validation-provider
            v-if="subject === 1"
            v-slot="{ errors }"
            rules="required|min:5"
            :name="`${$t('passport_series_example')}`"
            class="col-6"
          >
            <x-form-input
              :label="true"
              class="w-100"
              :error="!!errors[0]"
              :placeholder="`${$t('passport_series_example')}`"
              v-model="physical_attributes.passport_series"
            />
          </validation-provider>
          <!-- INN -->
          <validation-provider
            v-else
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${$t('inn')}`"
            class="col-6"
          >
            <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :placeholder="`${$t('inn')}`"
              :error="!!errors[0]"
              v-model="legal_attributes.inn"
            />
          </validation-provider>
        </div>
        <!-- PHYSICAL ATTRIBUTES -->
        <!-- ROW -->
        <div class="row">
          <!--? COUNTRY  -->
          <validation-provider
            v-slot="{ errors }"
            rules="required"
            :name="`${$t('nation')}`"
            class="col-6"
          >
            <x-form-select
              :bilingual="true"
              :error="!!errors[0]"
              :options="countryOptions"
              :placeholder="$t('nation')"
              v-model="physical_attributes.country_id"
            />
          </validation-provider>
          <!-- PASSPORT ISSUE PLACE -->
          <validation-provider
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${$t('place_of_issue__of_passport_id')}`"
            class="col-6"
          >
            <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="physical_attributes.passport_issued_by"
              :placeholder="`${$t('place_of_issue__of_passport_id')}`"
            />
          </validation-provider>
        </div>
        <!-- ROW -->
        <div class="row">
          <!--? CLIENT_ISSUE_DATE  -->
          <validation-provider
            :name="`${$t('passport_issue_date')}`"
            rules="required"
            v-slot="{ errors }"
            class="col-6"
          >
            <base-date-picker
              v-model="physical_attributes.passport_issued_date"
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
            class="col-6"
          >
            <base-date-picker
              v-model="physical_attributes.date_of_birth"
              class="w-100"
              :range="false"
              :error="!!errors[0]"
              format="DD.MM.YYYY"
              :placeholder="`${$t('birth_day')}`"
              :icon-fill="datePickerIconFill"
            />
          </validation-provider>
        </div>
        <div class=""></div>
        <template v-if="subject === 1">
          <div class="row">
            <!--? CLIENT_LAST_NAME_CYRILLIC  -->
            <validation-provider
              :name="`${$t('last_name')} (${$t('cyrillic_shortcut')}.)`"
              rules="required|min:1"
              v-slot="{ errors }"
              class="col-6"
            >
              <x-form-input
                :label="true"
                class="w-100"
                :error="!!errors[0]"
                v-model="physical_attributes.last_name.kirill"
                @input="translateLatin('last_name', $event)"
                :placeholder="`${$t('last_name')} (${$t(
                  'cyrillic_shortcut'
                )}.)`"
              />
            </validation-provider>

            <!--? CLIENT_LAST_NAME_LATIN  -->
            <validation-provider
              :name="`${$t('last_name')} (${$t('latin_shortcut')}.)`"
              rules="required|min:1"
              v-slot="{ errors }"
              class="col-6"
            >
              <x-form-input
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                v-model="physical_attributes.last_name.lotin"
                @input="translateCyrillic('last_name', $event)"
                :placeholder="`${$t('last_name')} (${$t('latin_shortcut')}.)`"
              />
            </validation-provider>
          </div>
          <div class="row">
            <!--? CLIENT_FIRST_NAME_CYRILLIC  -->
            <validation-provider
              :name="`${$t('name')} (${$t('cyrillic_shortcut')}.)`"
              rules="required|min:1"
              v-slot="{ errors }"
              class="col-6"
            >
              <x-form-input
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                v-model="physical_attributes.first_name.kirill"
                @input="translateLatin('first_name', $event)"
                :placeholder="`${$t('name')} (${$t('cyrillic_shortcut')}.)`"
              />
            </validation-provider>

            <!--? CLIENT_FIRST_NAME_CYRILLIC  -->
            <validation-provider
              :name="`${$t('name')} (${$t('latin_shortcut')}.)`"
              rules="required|min:1"
              v-slot="{ errors }"
              class="col-6"
            >
              <x-form-input
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                v-model="physical_attributes.first_name.lotin"
                @input="translateCyrillic('first_name', $event)"
                :placeholder="`${$t('name')} (${$t('latin_shortcut')}.)`"
              />
            </validation-provider>
          </div>
          <div class="row">
            <!--? CLIENT_SECOND_NAME_LATIN -->
            <validation-provider
              :name="`${$t('second_name')} (${$t('cyrillic_shortcut')}.)`"
              rules="required|min:1"
              v-slot="{ errors }"
              class="col-6"
            >
              <x-form-input
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                v-model="physical_attributes.middle_name.kirill"
                @input="translateLatin('second_name', $event)"
                :placeholder="`${$t('second_name')} (${$t(
                  'cyrillic_shortcut'
                )}.)`"
              />
            </validation-provider>

            <!--? CLIENT_SECOND_NAME_LATIN  -->
            <validation-provider
              :name="`${$t('second_name')} (${$t('latin_shortcut')}.)`"
              rules="required|min:1"
              v-slot="{ errors }"
              class="col-6"
            >
              <x-form-input
                class="w-100"
                :label="true"
                :error="!!errors[0]"
                v-model="physical_attributes.middle_name.lotin"
                @input="translateCyrillic('second_name', $event)"
                :placeholder="`${$t('second_name')} (${$t('latin_shortcut')}.)`"
              />
            </validation-provider>
          </div>
        </template>
        <div></div>
        <!-- ROW -->
        <div class="row">
          <!-- CLIENT TYPE -->
          <validation-provider
            ref="clientTypeNameVProvider"
            name="last-name-uz-provider"
            rules="required"
            v-slot="{ errors }"
            class="title-uz-provider col-6"
          >
            <x-form-select
              :bilingual="true"
              :error="!!errors[0]"
              :placeholder="$t('client_type')"
              :options="clientOptions"
              v-model="client_type_id"
            />

            <span class="error__provider" v-if="errors[0]">
              {{
                errors[0].replace("last-name-uz-provider", $t("client_type"))
              }}
            </span>
          </validation-provider>
          <!-- LANGUAGE -->
          <validation-provider
            ref="clientTypeNameVProvider"
            name="last-name-uz-provider"
            rules="required"
            v-slot="{ errors }"
            class="title-uz-provider col-6"
          >
            <x-form-select
              :bilingual="true"
              :error="!!errors[0]"
              :placeholder="$t('language')"
              :options="languageOptions"
              v-model="language"
            />

            <span class="error__provider" v-if="errors[0]">
              {{ errors[0].replace("last-name-uz-provider", $t("language")) }}
            </span>
          </validation-provider>
        </div>
        <!-- ROW -->
        <div class="row">
          <!-- EMAIL -->
          <div class="col-6">
            <x-form-input
              class="w-100 ch-client-email"
              :label="true"
              type="email"
              v-model="email"
              :placeholder="`${$t('email')}`"
            />
          </div>
          <!--? LEGAL ADDRESS  -->
          <validation-provider
            v-if="subject === 2"
            v-slot="{ errors }"
            rules="required|min:3"
            :name="`${$t('legal_address')}`"
            class="col-6"
          >
            <x-form-input
              :label="true"
              type="text"
              class="w-100"
              :error="!!errors[0]"
              v-model="legal_attributes.legal_address"
              :placeholder="`${$t('legal_address')}`"
            />
          </validation-provider>
          <!--? CLIENT_ADDRESS_LINE  -->
          <validation-provider
            v-else
            :name="`${$t('checkout.address_line')}`"
            rules="required"
            v-slot="{ errors }"
            class="col-6"
          >
            <x-form-input
              class="w-100"
              :label="true"
              :error="!!errors[0]"
              v-model="physical_attributes.address_line"
              :placeholder="`${$t('checkout.address_line')}`"
            />
          </validation-provider>
        </div>
        <div class="mt-4"></div>
        <template v-if="subject === 2">
          <div class="row"></div>
        </template>
        <!-- PERSON NAME -->
      </validation-observer>
      <!-- <div class="mt-4 mb-4">
        <base-checkbox v-model="item.published" :label="$t('published')">
        </base-checkbox>
      </div> -->

      <!-- <VueEditor v-model="item.latest[currentLang]" /> -->

      <!-- <VueEditor v-model="item.fixed[currentLang]" /> -->
    </template>
  </x-modal-center>
</template>

<style lang="scss" scoped>
.client-type-creating-body {
  margin-top: 1rem;
  margin-bottom: 1em;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  font-family: Inter, sans-serif;
  color: var(--gray-600);
  //grid-template-areas:
  //  "titleUz titleRu"
  //  "statusType statusType";
  //
  //.title-uz-provider {
  //  grid-area: titleUz;
  //}
  //
  //.title-ru-provider {
  //  grid-area: titleRu;
  //}
  //
  //.status-type-provider {
  //  grid-area: statusType;
  //}
}

.icons-collection-wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.status-pick-color-title {
  font-size: 18px;
  color: var(--gray-400);
  font-weight: 500;
  font-family: Inter, serif;
}

.error__provider {
  color: red;
  font-size: 12px;
}
</style>
