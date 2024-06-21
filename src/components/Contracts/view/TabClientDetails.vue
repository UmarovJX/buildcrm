<script>
import { formatDateWithDot, phonePrettier } from "@/util/reusable";
import api from "@/services/api";
import { mapGetters } from "vuex";
import ContractsPermission from "@/permission/contract";
import {
  XFormSelect,
  XFormSelectOption,
} from "@/components/ui-components/form-select";
import {
  isNotUndefinedNullEmptyZero,
  isNUNEZ,
  isUndefinedOrNullOrEmpty,
} from "@/util/inspect";
import PassportCopies from "@/views/checkoutV3/components/PassportCopies";
import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "TabClientDetails",
  components: {
    XFormSelect,
    // eslint-disable-next-line vue/no-unused-components
    XFormSelectOption,
    PassportCopies,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  emits: ["start-loading", "finish-loading"],
  data() {
    return {
      selected: null,
      client: {},
      clientTypeOptions: [],
      contractId: this.$route.params.id,
      clientTypeId: null,

      scans: [],
      scansLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      permission: "getPermission",
    }),
    haveClient() {
      return Object.keys(this.client).length;
    },
    permissionClientType() {
      return ContractsPermission.getContractsClientTypePermission();
    },
    isLegalClient() {
      return this.client.subject === "legal";
    },
    cAttrs() {
      return this.client?.attributes;
    },
    legalClientDetails() {
      if (this.isLegalClient) {
        const companyType = this.cAttrs.company.name[this.$i18n.locale];
        const companyName = this.cAttrs.name;
        return {
          companyName: `${companyType} ${companyName}`,
        };
      }

      return null;
    },
  },
  created() {
    Promise.allSettled([this.getClientInformation(), this.fetchClientTypes()]);
  },
  methods: {
    async openExistingScans() {
      this.scansLoading = true;
      const scans = await v3ServiceApi.scannedContracts.getAll({
        page: 1,
        limit: 99,
        type: "passport_front",
        model_id: this.client.id,
      });
      this.scans = scans.data.result;
      this.scansLoading = false;
    },
    isNUNEZ,
    datePrettier: (time) => formatDateWithDot(time),
    getClientMajorPhone(phones) {
      if (!phones.length) {
        return "";
      }

      phones = phones.filter(
        (p) =>
          isNotUndefinedNullEmptyZero(p.phone) && p.phone.toString().length > 3
      );

      if (phones.length > 0) {
        return this.formattingPhone(phones[0].phone);
      }
    },
    getExtraPhone(phones) {
      if (!phones.length) {
        return "";
      }

      phones = phones.filter(
        (p) =>
          isNotUndefinedNullEmptyZero(p.phone) && p.phone.toString().length > 3
      );

      if (phones.length > 1) {
        return this.formattingPhone(phones[1].phone);
      }
      return "";
    },
    async getClientInformation() {
      this.startLoading();
      await api.contractV2
        .fetchClientInfo(this.contractId)
        .then((response) => {
          this.client = response.data;
          this.clientTypeId = this.client.client_type.id;
          this.openExistingScans();
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    async fetchClientTypes() {
      try {
        const { data: options } = await api.settingsV2.getClientTypes();
        this.clientTypeOptions = options.map((option) => ({
          text: option.name,
          value: option.id,
        }));
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    startLoading() {
      this.$emit("start-loading");
    },
    finishLoading() {
      this.$emit("finish-loading");
    },
    formattingPhone: (phone) => phonePrettier(phone),
    dateReverser: (time) => formatDateWithDot(time),
    getClientName(client) {
      if (isUndefinedOrNullOrEmpty(client.attributes)) {
        return "";
      }

      let language = "kirill";
      if (this.$i18n.locale === "uz") {
        language = "lotin";
      }
      const { first_name, last_name, middle_name } = client.attributes;
      return `${this.clientName(last_name, language)} ${this.clientName(
        first_name,
        language
      )} ${this.clientName(middle_name, language)}`;
    },

    clientName(multiName, language) {
      if (multiName) {
        const lastNameByLang = multiName[language];
        if (lastNameByLang) {
          return lastNameByLang;
        }
        const lastNameOtherLang =
          language === "kirill" ? multiName.lotin : multiName.kirill;
        if (lastNameOtherLang) return lastNameOtherLang;
      }
      return "";
    },
    async changeClientType() {
      if (this.client.client_type.id !== this.clientTypeId) {
        this.startLoading();
        await api.contractV2
          .toggleClientType(this.contractId, this.clientTypeId)
          .finally(() => {
            this.finishLoading();
          });
      }
    },
  },
};
</script>

<template>
  <div v-if="haveClient">
    <!--  ? LEGAL CLIENT    -->
    <div v-if="isLegalClient" class="client__details col-12 px-0">
      <div class="d-flex">
        <h3 class="client__details__title mr-5">
          {{ $t("main") }}
        </h3>
      </div>

      <div class="d-flex">
        <div class="client__details_info_card mr-5">
          <label for="companyName">{{ $t("company_name") }}</label>
          <b-form-input
            id="companyName"
            disabled
            :value="legalClientDetails.companyName"
          />
        </div>
        <div class="client__details_info_card">
          <label for="birthdate">{{ $t("companies.bank_name") }}</label>
          <b-form-input id="birthdate" disabled :value="cAttrs.bank_name" />
        </div>
      </div>
      <!--  -->
      <div class="d-flex">
        <div class="client__details_info_card mr-5">
          <label for="FIO">{{ $t("fio") }}</label>
          <b-form-input
            id="companyName"
            disabled
            :value="getClientName(client)"
          />
        </div>

        <div class="client__details_info_card" style="padding-right: 0">
          <label for="client_type">{{ $t("client_type") }}</label>
          <x-form-select
            v-if="permissionClientType && clientTypeOptions.length"
            v-model="clientTypeId"
            :label="false"
            :disabled="!permissionClientType"
            :options="clientTypeOptions"
            :multilingual="true"
            @change="changeClientType"
          />
        </div>
      </div>
      <!--  -->
      <div class="d-flex">
        <div class="client__details_info_card mr-5">
          <label for="payment_number">{{ $t("account_number") }}</label>
          <b-form-input
            id="payment_number"
            disabled
            :value="cAttrs.payment_number"
          />
        </div>
        <div class="client__details_info_card">
          <label for="birthdate">{{ $t("mfo") }}</label>
          <b-form-input id="birthdate" disabled :value="cAttrs.mfo" />
        </div>
      </div>

      <div class="d-flex">
        <div class="client__details_info_card mr-5">
          <label for="ndc">{{ $t("ndc") }}</label>
          <b-form-input id="ndc" disabled :value="cAttrs.nds" />
        </div>
        <div class="client__details_info_card">
          <label for="inn">{{ $t("inn") }}</label>
          <b-form-input id="inn" disabled :value="cAttrs.inn" />
        </div>
      </div>

      <div class="d-flex">
        <div class="client__details_info_card mr-5">
          <label for="legal_address">{{ $t("legal_address") }}</label>
          <b-form-input
            id="legal_address"
            disabled
            :value="cAttrs.legal_address"
          />
        </div>
        <div class="client__details_info_card">
          <label for="fax">{{ $t("fax") }}</label>
          <b-form-input id="fax" disabled :value="cAttrs.fax" />
        </div>
      </div>

      <div class="d-flex">
        <div class="client__details_info_card mr-5">
          <label for="email">{{ $t("email") }}</label>
          <b-form-input id="email" disabled :value="client.email" />
        </div>
        <div class="client__details_info_card">
          <label for="additional_email">{{ $t("additional_email") }}</label>
          <b-form-input
            id="additional_email"
            disabled
            :value="client.additional_email"
          />
        </div>
      </div>

      <div class="phones-section">
        <div class="client__details_info_card mr-5">
          <label for="fax">{{ $t("oked") }}</label>
          <b-form-input id="fax" disabled :value="cAttrs.oked" />
        </div>
        <div v-if="client.phones.length" class="client__details_info_card mr-5">
          <label for="phone">{{ $t("phone") }}</label>
          <b-form-input
            id="phone"
            disabled
            :value="formattingPhone(client.phones[0].phone)"
          />
        </div>

        <template v-if="client.phones.length > 1">
          <div
            v-for="(extraPhone, index) in client.phones.slice(1)"
            :key="extraPhone.id + extraPhone.phone"
            class="client__details_info_card mr-5"
          >
            <label :for="'additional_phone_number' + index">
              {{ $t("additional_phone_number") }}
            </label>
            <b-form-input
              v-if="isNUNEZ(extraPhone.phone)"
              :id="'additional_phone_number' + index"
              disabled
              :value="formattingPhone(client.phones[index + 1].phone)"
            />
          </div>
        </template>
      </div>
    </div>

    <!--  ? PHYSICAL CLIENT    -->
    <div v-else class="client__details col-12 px-0">
      <b-form class="client__details_info">
        <div class="d-flex">
          <h3 class="client__details__title mr-5">
            {{ $t("main") }}
          </h3>
          <h3 class="client__details__title">
            {{ $t("passport") }}
          </h3>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="firstname">{{ $t("fio") }}</label>
            <b-form-input
              id="firstname"
              disabled
              :value="getClientName(client)"
            />
          </div>
          <div class="client__details_info_card">
            <label for="birthdate">{{ $t("birth_day") }}</label>
            <b-form-input
              id="birthdate"
              disabled
              :value="datePrettier(client.attributes.date_of_birth)"
            />
          </div>
        </div>

        <div class="phones-section">
          <div
            v-if="client.phones.length"
            class="client__details_info_card mr-5"
          >
            <label for="phone">{{ $t("phone") }}</label>
            <b-form-input
              id="phone"
              disabled
              :value="formattingPhone(client.phones[0].phone)"
            />
          </div>

          <template v-if="client.phones.length > 1">
            <div
              v-for="(extraPhone, index) in client.phones.slice(1)"
              :key="extraPhone.id + extraPhone.phone"
              class="client__details_info_card mr-5"
            >
              <label :for="'additional_phone_number' + index">
                {{ $t("additional_phone_number") }}
              </label>
              <b-form-input
                v-if="isNUNEZ(extraPhone.phone)"
                :id="'additional_phone_number' + index"
                disabled
                :value="formattingPhone(client.phones[index + 1].phone)"
              />
            </div>
          </template>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="place_of_issue">{{
              $t("apartments.agree.passport_series")
            }}</label>
            <b-form-input
              id="place_of_issue"
              disabled
              :value="client.attributes.passport_series"
            />
          </div>
          <div class="client__details_info_card" style="margin-left: -2px">
            <label for="passport_issued_by">{{
              $t("apartments.agree.issued_by_whom")
            }}</label>
            <b-form-input
              id="passport_issued_by"
              disabled
              :value="client.attributes.passport_issued_by"
            />
          </div>
        </div>
        <div class="d-flex">
          <div class="client__details_info_card mr-5" style="padding-right: 0">
            <label for="client_type">{{ $t("client_type") }}</label>
            <x-form-select
              v-if="permissionClientType && clientTypeOptions.length"
              v-model="clientTypeId"
              :label="false"
              :disabled="!permissionClientType"
              :options="clientTypeOptions"
              :multilingual="true"
              @change="changeClientType"
            />
          </div>
          <div class="client__details_info_card">
            <label for="date_of_issue">{{ $t("given_date") }}</label>
            <b-form-input
              id="date_of_issue"
              disabled
              :value="datePrettier(client.attributes.passport_issued_date)"
            />
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="language">{{ $t("language") }}</label>
            <b-form-input id="language" disabled :value="client.language" />
          </div>
          <div
            class="client__details_info_card"
            v-if="client.attributes.passport_expiry_date"
          >
            <label for="passport_expiry_date">{{
              $t("passport_expiry_date")
            }}</label>
            <b-form-input
              id="passport_expiry_date"
              disabled
              :value="datePrettier(client.attributes.passport_expiry_date)"
            />
          </div>
          <div v-else class="client__details_info_card opacity-0"></div>
        </div>
        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="address_line">{{ $t("checkout.address_line") }}</label>
            <b-form-input
              id="address_line"
              disabled
              :value="cAttrs.address_line"
            />
          </div>
          <div class="client__details_info_card">
            <label for="country">{{ $t("country") }}</label>
            <b-form-input
              id="country"
              disabled
              :value="cAttrs.country.name[$i18n.locale]"
            />
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label for="email">{{ $t("email") }}</label>
            <b-form-input id="email" disabled :value="client.email" />
          </div>
          <div class="client__details_info_card">
            <label for="additional_email">{{ $t("additional_email") }}</label>
            <b-form-input
              id="additional_email"
              disabled
              :value="client.additional_email"
            />
          </div>
        </div>
        <div class="d-flex mt-3" v-if="client.subject === 'physical'">
          <div class="mr-5" style="width: 100%">
            <passport-copies
              :list="scans"
              :loading="scansLoading"
              :id="client.id"
              type="passport_front"
              @start-loading="scansLoading = true"
              @stop-loading="scansLoading = false"
              @add-item="(d) => scans.push(...d)"
              @delete-item="(i) => scans.splice(i, 1)"
              @update-list="openExistingScans"
            ></passport-copies>
          </div>
          <div style="width: 100%"></div>
        </div>
      </b-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: CraftworkSans, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}

.custom__container {
  margin: 32px 90px;
  background: #fff;
  height: 80vh;
}

.client__details {
  display: flex;
  flex-direction: column;

  &__title {
    font-size: 1.5rem;
    line-height: 28px;
    color: var(--gray-400);
    margin: 2rem 0 1rem 0;
    width: 100%;
    //max-width: 40rem;
  }

  &_info {
    //display: grid;
    //grid-template-columns: 1fr 1fr;
    //column-gap: 3rem;

    &_card {
      display: flex;
      align-items: center;
      width: 100%;
      //max-width: 40rem;
      height: 56px;
      border: 2px solid #e5e7eb;
      border-radius: 32px;
      padding: 0 16px;
      position: relative;
      margin-top: 1rem;

      & svg {
        position: absolute;
        right: 20px;
        //z-index: 100;
      }

      & label {
        text-transform: uppercase;
        margin: 0;
        padding-right: 10px;
        color: var(--gray-400);
        white-space: nowrap;
        font-size: 0.75rem;
        letter-spacing: 1px;
      }

      input {
        height: 100%;
        width: 100%;
        border: none;
        text-align: right;
        padding-right: 4px;
        color: var(--gray-600);
      }

      select {
        width: 140px;
        height: 24px;
        padding: 0;
        margin-top: 0 !important;
        position: absolute;
        top: 45%;
        transform: translateY(-50%);
        right: 20px;
        border: none;

        option {
          padding: 20px;
          border: none;
        }
      }
    }
  }

  .form-control:disabled {
    background: #fff;
  }
}

.selection__content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 1rem;
}

//.selection__content .client__type {
//-webkit-appearance: none;
//-moz-appearance: none;
//top: auto;
//right: auto;
//background: transparent;
//background-image: url('../../../../assets/img/edit-button.png');

//}

//.edit__icon {
//  width: 1.5rem;
//  height: 1.5rem;
//  padding: 0.25rem;
//  border-radius: 50%;
//  background-color: var(--violet-600);
//  display: block;
//  margin-bottom: 1.6rem;
//  margin-right: 1.5rem;
//}

.client__details_info_card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.opacity-0 {
  opacity: 0;
}
.phones-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;
}

@media screen and (max-width: 1100px) {
  .client__details_info_card {
    label,
    input {
      font-size: 0.75rem;
    }
  }
}

@media screen and (max-width: 950px) {
  .client__details_info_card {
    label {
      font-size: 0.6rem;
      white-space: normal;
    }
  }
}
</style>
