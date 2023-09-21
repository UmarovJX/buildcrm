<script>
import SectionTitle from "@/views/checkoutV2/elements/SectionTitle";
import ChPaymentResult from "@/views/checkoutV2/components/PaymentResult";
import ChPlanDetails from "@/views/checkoutV2/components/PlanDetails";
import FieldInformation from "@/views/checkoutV2/elements/FieldInformation";
import { mapActions, mapGetters, mapState } from "vuex";
import { formatToPrice } from "@/util/reusable";
import { XBottomClipboard } from "@/components/ui-components/bottom-clipboard";
import { XButton } from "@/components/ui-components/button";
import { isEmptyObject, isNUNEZ } from "@/util/inspect";
import api from "@/services/api";

export default {
  name: "ChReviewSide",
  components: {
    SectionTitle,
    ChPaymentResult,
    ChPlanDetails,
    FieldInformation,
    XBottomClipboard,
    XButton,
  },
  data() {
    return {
      companyTypes: [],
    };
  },
  created() {
    this.fetchCompanyType();
  },
  computed: {
    ...mapState("CheckoutV2", {
      clientInfo: "clientData",
      clientTypeList: "clientTypeList",
      countryList: "countryList",
    }),
    ...mapGetters("CheckoutV2", {
      apartments: "gtsApartments",
      totalForAll: "totalForAll",
      trashCount: "trashCount",
    }),
    clientDetails() {
      if (isEmptyObject(this.clientInfo)) {
        return [];
      }

      let details = [];

      if (this.clientInfo.subject === "legal") {
        const findCompanyType = this.companyTypes.find((typeCtx) => {
          return typeCtx.id === this.clientInfo.attributes.company_type_id;
        });

        let companyType = "";

        if (findCompanyType) {
          companyType = findCompanyType.name[this.$i18n.locale];
        }

        details = [
          {
            title: "person_type",
            content: "legal_entity",
            icon: "business_center",
          },
          {
            title: "bank",
            content: this.clientInfo.attributes.bank_name,
            icon: "account_balance",
          },
          {
            title: "company_type",
            content: companyType,
            icon: "label",
          },
          {
            title: "company_name",
            content: this.clientInfo.attributes.name,
            icon: "apartment",
          },
          {
            title: "account_number",
            content: this.clientInfo.attributes.payment_number,
            icon: "account_balance_wallet",
          },
          {
            title: "mfo",
            content: this.clientInfo.attributes.mfo,
            icon: "numbers",
          },
          {
            title: "inn",
            content: this.clientInfo.attributes.inn,
            icon: "numbers",
          },
          {
            title: "ndc",
            content: this.clientInfo.attributes.nds,
            icon: "numbers",
          },
          {
            title: "fax",
            content: this.clientInfo.attributes.fax,
            icon: "fax",
          },
          {
            title: "legal_address",
            content: this.clientInfo.attributes.legal_address,
            icon: "location_on",
          },
        ];
      } else {
        const { locale } = this.$i18n;
        const typography = locale === "uz" ? "lotin" : "kirill";
        const name = {
          l: this.clientInfo.attributes.last_name[typography],
          f: this.clientInfo.attributes.first_name[typography],
          m: this.clientInfo.attributes.middle_name[typography],
        };

        const fullName = `${name.l} ${name.f} ${name.m}`;

        const country = this.countryList.find(
          (cty) => cty.id === this.clientInfo.attributes.country_id
        );

        details = [
          {
            title: "person_type",
            content: "physical_person",
            icon: "assignment_ind",
          },
          {
            title: "nation",
            content: country.name[locale],
            icon: "flag",
          },
          {
            title: "passport_series_example",
            content: this.clientInfo.attributes.passport_series,
            icon: "contact_page",
          },
          {
            title: "birth_day",
            content: this.clientInfo.attributes.date_of_birth,
            icon: "cake",
          },
          {
            title: "fio_full",
            content: fullName,
            icon: "person",
          },
          {
            title: "communication_language",
            content: this.clientInfo.language,
            icon: "language",
          },
          {
            title: "checkout.address_line",
            content: this.clientInfo.attributes.address_line,
            icon: "home_pin",
          },
        ];
      }

      details.push({
        title: "phone",
        content: this.clientInfo.phones[0].phone,
        icon: "call",
      });

      if (
        this.clientInfo.phones.length > 1 &&
        isNUNEZ(this.clientInfo.phones[1].phone)
      ) {
        details.push({
          title: "additional_phone_number",
          content: this.clientInfo.phones[1].phone,
          icon: "call",
        });
      }

      if (isNUNEZ(this.clientInfo?.email)) {
        details.push({
          title: "email",
          content: this.clientInfo.email,
          icon: "mail",
        });
      }

      if (isNUNEZ(this.clientInfo?.additional_email)) {
        details.push({
          title: "additional_email",
          content: this.clientInfo.additional_email,
          icon: "mail",
        });
      }

      return details;
    },
  },
  methods: {
    prettier: formatToPrice,
    ...mapActions("CheckoutV2", {
      returnRemovedApartments: "returnRemovedApartments",
    }),
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
  },
};
</script>

<template>
  <div>
    <section-title
      v-if="clientDetails.length"
      class="km-b-2"
      :bilingual="true"
      title="client_information"
    />
    <div class="information-block">
      <field-information
        v-for="(client, index) in clientDetails"
        :key="index"
        :bilingual="true"
        :content="client.content"
        :title="client.title"
        :icon-name="client.icon"
      />
    </div>
    <div class="apn-result">
      <div
        class="apn-result__item"
        v-for="apartment in apartments"
        :key="apartment.id"
      >
        <section-title
          :bilingual="true"
          :title="$t('apartment') + ' ' + apartment.number"
          class="km-b-2"
        />
        <div class="apn-result__item-content">
          <ch-plan-details
            :apartment="apartment"
            :remove="apartments.length > 1"
          />
          <ch-payment-result
            :apm="apartment"
            :result="true"
            class="pd-payment-result"
          />
        </div>
      </div>
      <div class="apn-result__total">
        <p>{{ $t("final_total_price") }}</p>
        <p>{{ prettier(totalForAll) }} сум</p>
      </div>
    </div>

    <x-bottom-clipboard v-if="trashCount">
      <p>{{ $t("cleaned_apartments") }} : {{ trashCount }}</p>
      <x-button
        :text="$t('return_all_apartments')"
        @click="returnRemovedApartments"
      />
    </x-bottom-clipboard>
  </div>
</template>

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
