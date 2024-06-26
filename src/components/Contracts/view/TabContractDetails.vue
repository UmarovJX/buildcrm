<script>
import { formatDateWithDot, formatToPrice } from "@/util/reusable";
import api from "@/services/api";
import { mapGetters } from "vuex";
import ContractsPermission from "@/permission/contract";
import ContractComments from "@/components/Contracts/view/ContractComments";

export default {
  name: "TabContractDetails",
  components: {
    ContractComments,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      companyDetails: {
        company_name: null,
        full_name: null,
        inn: null,
        mfo: null,
        payment_account: null,
      },
      otherDetails: {
        contract: null,
        contract_date: null,
        created_by: null,
        id: null,
        status: null,
        transaction_price: null,
      },
      compareDetails: {},
      viewCommentPermission:
        ContractsPermission.getContractsViewCommentPermission(),
    };
  },
  emits: ["start-loading", "finish-loading"],

  async created() {
    await this.fetchContractDetails();
    if (this.uniformityPermission) {
      await this.fetchCompareDetails();
    }
  },
  computed: {
    ...mapGetters({
      permission: "getPermission",
    }),
    uniformityPermission() {
      return ContractsPermission.getContractsUniformityPermission();
    },
  },
  methods: {
    datePrettier: (time) => formatDateWithDot(time),
    async fetchCompareDetails() {
      this.startLoading();
      const { id } = this.$route.params;
      await api.contractV2
        .fetchCompareDetails(id)
        .then((response) => {
          this.compareDetails = response.data[0];
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    async fetchContractDetails() {
      this.startLoading();
      const { id } = this.$route.params;
      await api.contractV2
        .fetchContractDetails(id)
        .then((response) => {
          this.companyDetails = response.data["company_details"];
          this.otherDetails = response.data.other_details;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.finishLoading();
        });
    },
    startLoading() {
      this.$emit("start-loading");
    },
    finishLoading() {
      this.$emit("finish-loading");
    },
    pricePrettier(price) {
      return formatToPrice(price) + " " + this.$t("ye");
    },
    prepayPrettier(value) {
      if (value && value.prepay)
        return this.$t("apartments.first_payment") + " " + value.prepay + "%";
      return this.$t("contracts.individual");
    },
    getStatus(status) {
      return this.$t(`contracts.status.${status}`);
    },
    getClientName(status) {
      let language = "kirill";
      if (this.$i18n.locale === "uz") {
        language = "lotin";
      }
      const { last_name, first_name } = client;
      return (
        this.clientName(last_name, language) +
        " " +
        this.clientName(first_name, language)
      );
    },
    clientName(multiName, language) {
      const lastNameByLang = multiName[language];
      if (lastNameByLang) {
        return lastNameByLang;
      } else {
        const lastNameOtherLang =
          language === "kirill" ? multiName["lotin"] : multiName["kirill"];
        if (lastNameOtherLang) return lastNameOtherLang;
      }

      return "";
    },
  },
};
</script>

<template>
  <div>
    <div v-if="uniformityPermission && compareDetails" class="compare__details">
      <h3 class="compare__details-title">
        {{ $t("contract_compare.compare_title") }}
      </h3>

      <div class="row">
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label>{{ $t("contract_compare.course_usd") }}</label>
              <b-form-input
                v-if="compareDetails.currency"
                disabled
                :value="pricePrettier(compareDetails['currency'].usd)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label>{{ $t("contract_compare.tariff") }}</label>
              <b-form-input
                disabled
                :value="prepayPrettier(compareDetails['discount'])"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label>{{ $t("contract_compare.first_price") }}</label>
              <b-form-input
                v-if="compareDetails.prices"
                disabled
                :value="pricePrettier(compareDetails['prices'].sale)"
              />
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label>{{ $t("contract_compare.full_price") }}</label>
              <b-form-input
                v-if="compareDetails.prices"
                disabled
                :value="pricePrettier(compareDetails['prices'].sold)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label>{{ $t("contract_compare.discount") }}</label>
              <b-form-input
                v-if="compareDetails['prices']"
                disabled
                :value="pricePrettier(compareDetails['prices'].discount_amount)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label v-html="$t('contract_compare.first_price_m2')" />
              <b-form-input
                v-if="compareDetails['prices']"
                disabled
                :value="pricePrettier(compareDetails['prices'].sale_m2)"
              />
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label v-html="$t('contract_compare.last_price_m2')" />
              <b-form-input
                v-if="compareDetails['prices']"
                disabled
                :value="pricePrettier(compareDetails['prices'].sold_m2)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="compare__details-item">
            <div class="compare__details-item_card">
              <label v-html="$t('contract_compare.discount_m2')" />
              <b-form-input
                v-if="compareDetails['prices']"
                disabled
                :value="pricePrettier(compareDetails['prices'].discount_m2)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="client__details col-12 px-0">
      <b-form class="client__details_info">
        <div class="d-flex">
          <h3 class="client__details__title mr-5">{{ $t("builder") }}</h3>
          <h3 class="client__details__title">{{ $t("other_details") }}</h3>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>{{ $t("company") }}</label>
            <b-form-input disabled :value="companyDetails['company_name']" />
          </div>
          <div class="client__details_info_card">
            <label>{{ $t("contract_number") }}</label>
            <b-form-input disabled :value="otherDetails.contract" />
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>{{ $t("agent") }}</label>
            <b-form-input disabled :value="companyDetails.full_name" />
          </div>
          <div class="client__details_info_card">
            <label>{{ $t("contract_price") }}</label>
            <b-form-input
              disabled
              :value="pricePrettier(otherDetails.transaction_price)"
            />
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>{{ $t("pc") }}</label>
            <b-form-input disabled :value="companyDetails.payment_account" />
          </div>
          <div class="client__details_info_card">
            <label>{{ $t("date") }}</label>
            <b-form-input
              disabled
              :value="datePrettier(otherDetails.contract_date)"
            />
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>{{ $t("inn") }}</label>
            <b-form-input disabled :value="companyDetails.inn" />
          </div>
          <div class="client__details_info_card">
            <label>{{ $t("formed") }}</label>
            <b-form-input
              disabled
              :value="otherDetails.created_by"
              id="firstname"
            />
          </div>
        </div>

        <div class="d-flex">
          <div class="client__details_info_card mr-5">
            <label>{{ $t("mfo") }}</label>
            <b-form-input disabled :value="companyDetails.mfo" id="firstname" />
          </div>
          <div class="client__details_info_card">
            <label>{{ $t("status") }}</label>
            <b-form-input
              disabled
              :value="getStatus(otherDetails.status)"
              id="firstname"
            />
          </div>
        </div>
      </b-form>
    </div>

    <ContractComments v-if="viewCommentPermission" />
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

.compare__details {
  display: flex;
  flex-direction: column;
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 2rem;
  padding: 2rem;
  margin-top: 2rem;

  .row {
    border-bottom: 2px solid var(--gray-200);
    margin: 0;

    &:last-child {
      border-bottom: none;
    }
  }

  &-title {
    font-family: CraftworkSans, serif;
    font-weight: 900;
    font-size: 1.5rem;
    line-height: 28px;
    color: var(--violet-600);
    margin-bottom: 2rem;
  }

  .form-control:disabled {
    background: #fff;
  }

  &-item {
    &_card {
      display: flex;
      align-items: center;
      width: 100%;
      height: 56px;
      background-color: var(--white);
      border: 2px solid #e5e7eb;
      border-radius: 32px;
      padding: 0 16px;
      position: relative;
      margin: 20px 0 20px;

      & label {
        text-transform: uppercase;
        margin: 0;
        padding-right: 10px;
        color: var(--gray-400);
        white-space: nowrap;
        font-size: 0.8rem;
        letter-spacing: 1px;
      }

      input {
        height: 100%;
        width: 100%;
        border: none;
        text-align: right;
        padding-right: 4px;
        font-size: 1.0125rem;
        color: var(--gray-600);
      }
    }
  }
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
        font-size: 0.8rem;
        letter-spacing: 1px;
      }

      input {
        height: 100%;
        width: 100%;
        border: none;
        text-align: right;
        padding-right: 4px;
        font-size: 1.0125rem;
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
