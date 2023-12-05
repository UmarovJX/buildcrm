<script>
import api from "@/services/api";
import {hasOwnProperty} from "@/util/object";
import {phonePrettier} from "@/util/reusable";

import BaseButton from "@/components/Reusable/BaseButton";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
import InformationField from "@/components/Contracts/elements/InformationField.vue";

export default {
  name: "TabReContractDetails",
  components: {
    BaseArrowDownIcon,
    BaseButton,
    InformationField
  },
  data() {
    return {
      clientDetails: {
        full_name: "",
      },
      assignee: {},
      assignor: {},
      order: {},
      errors: [],
    };
  },
  computed: {
    agreementDetails() {
      let purposeOfTransfer = ''

      if (
          Object.keys(this.order).length &&
          hasOwnProperty(this.order['reorder_type'], 'name')
      ) {
        purposeOfTransfer = this.order['reorder_type'].name[this.$i18n.locale]
      }

      return [
        {
          label: this.$t("date_of_the_agreement"),
          value: this.order.date
        },
        {
          label: this.$t("agreement_number"),
          value: this.order.contract_number
        },
        {
          label: this.$t("reason_for_reissuing"),
          value: purposeOfTransfer
        },
      ]
    },
    ownersDetails() {
      if (!Object.keys(this.order).length) {
        return {
          prev: [],
          current: []
        }
      }

      const {
        phones: prevPhones,
        attributes: prevAttrs
      } = this.assignor

      const {
        phones: currentPhones,
        attributes: currentAttrs
      } = this.assignee

      return {
        current: [
          {
            label: this.$t("fio"),
            value: this.fullName(currentAttrs)
          },
          {
            label: this.$t("series"),
            value: currentAttrs.passport_series
          },
          {
            label: this.$t("apartments.agree.issued_by_whom"),
            value: currentAttrs.passport_issued_by
          },
          {
            label: this.$t("apartments.agree.date_of_issue"),
            value: currentAttrs.passport_issued_date
          },
          {
            label: this.$t("birth_day"),
            value: currentAttrs.date_of_birth
          },
          {
            label: `${this.$t("number")} ${this.$t("main_number")}`,
            value: currentPhones.length ? phonePrettier(currentPhones[0].phone) : ''
          },
          {
            label: `${this.$t("number")} ${this.$t("extra")}`,
            value: currentPhones.length > 1 ? phonePrettier(currentPhones[1].phone) : ''
          }
        ],

        prev: [
          {
            label: this.$t("fio"),
            value: this.fullName(prevAttrs)
          },
          {
            label: this.$t("series"),
            value: prevAttrs.passport_series
          },
          {
            label: this.$t("apartments.agree.issued_by_whom"),
            value: prevAttrs.passport_issued_by
          },
          {
            label: this.$t("apartments.agree.date_of_issue"),
            value: prevAttrs.passport_issued_date
          },
          {
            label: this.$t("birth_day"),
            value: prevAttrs.date_of_birth
          },
          {
            label: `${this.$t("number")} ${this.$t("main_number")}`,
            value: prevPhones.length ? phonePrettier(prevPhones[0].phone) : ''
          },
          {
            label: `${this.$t("number")} ${this.$t("extra")}`,
            value: prevPhones.length > 1 ? phonePrettier(prevPhones[1].phone) : ''
          }
        ],
      }
    }
  },
  async created() {
    await this.getDetails();
  },
  methods: {
    checkLocales(name) {
      if (localStorage.locale) return name[localStorage.locale];
      else return name["ru"];
    },

    phone(value) {
      return phonePrettier(value);
    },

    fullName(value) {
      if (value && value.first_name && value.last_name && value.second_name)
        return (
            value.last_name.lotin +
            " " +
            value.first_name.lotin +
            " " +
            value.second_name.lotin
        );
      return "";
    },

    setFormProperty(property, value) {
      this.form[property] = value;
      this.errors[property] = false;
    },

    async getDetails() {
      const id = this.$route.params.id;
      await api.contractV2
          .getReissue(id)
          .then((res) => {
            this.assignee = res.data.assignee;
            this.assignor = res.data.assignor;
            this.order = res.data.order;
          })
          .catch(() => {
          });
    },

    downloadContact() {
      const id = this.order.uuid;
      api.contractV2
          .downloadReContract(id)
          .then(({data, headers}) => {
            const filename = headers.hasOwnProperty("x-filename")
                ? headers["x-filename"]
                : "contract";
            const fileURL = window.URL.createObjectURL(new Blob([data]));
            const fileLink = document.createElement("a");
            fileLink.href = fileURL;
            fileLink.setAttribute("download", filename);
            document.body.appendChild(fileLink);
            fileLink.click();
          })
          .catch(() => {
            return "#";
          });
    },
  },
};
</script>

<template>
  <div class="recontract">
    <div class="assignee-header">
      <p class="assignee-header__title">
        {{ $t("details_of_the_agreement") }}
      </p>
    </div>

    <!--? AGREEMENT DETAILS   -->
    <section class="agreement__details">
      <information-field
          v-for="(detail,dIndex) in agreementDetails"
          :label="detail.label"
          :value="detail.value"
          :key="detail.value + dIndex"
      />

      <base-button
          @click="downloadContact"
          class="download__button"
          :text="`${ $t(`recontract_download`) }`"
      >
        <template #left-icon>
          <BaseArrowDownIcon :width="20" :height="20" fill="#7C3AED"/>
        </template>
      </base-button>
    </section>

    <!--? OWNERS INFORMATION   -->
    <section class="owners">
      <div class="owners__column">
        <!--?  PREV TITLE    -->
        <div class="owners__title prev__owner">
          <span>{{ $t('assignor') }}</span>
          <span class="owners__tooltip__icon" id="previousOwnerInfoTooltip">
            <img
                :src="require('@/assets/icons/icon-questions__circle.svg')"
                alt="icon questions circle"
            />
          </span>
          <b-tooltip
              target="previousOwnerInfoTooltip"
              triggers="hover"
              variant="secondary"
          >
            Цедент – это участник договора цессии, который в рамках договора
            цессии уступает иному лицу свое право требования.
          </b-tooltip>
        </div>

        <!--?  PREV DETAILS    -->
        <information-field
            v-for="(ownerDetail,ownIndex) in ownersDetails.prev"
            :label="ownerDetail.label"
            :value="ownerDetail.value"
            :key="ownerDetail.value + ownIndex"
        />
      </div>

      <div class="owners__column">
        <!--?  CURRENT TITLE    -->
        <div class="owners__title current__owner">
          <span>{{ $t('assignee') }}</span>
          <span id="currentOwnerInfoTooltip" class="owners__tooltip__icon">
            <img
                :src="require('@/assets/icons/icon-questions__circle.svg')"
                alt="icon questions circle"
            />
          </span>
          <b-tooltip
              target="currentOwnerInfoTooltip"
              triggers="hover"
              variant="secondary"
          >
            Цессионарий – участник договора цессии, приобретающий право,
            уступаемое цедентом.
          </b-tooltip>
        </div>

        <!--?  CURRENT DETAILS    -->
        <information-field
            v-for="(ownerDetail,ownIndex) in ownersDetails.current"
            :label="ownerDetail.label"
            :value="ownerDetail.value"
            :key="ownerDetail.value + ownIndex"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.agreement__details {
  display: grid;
  grid-template-columns: repeat(2, minmax(22.5rem, 1fr));
  gap: 1rem 3rem;
}

.owners {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;


  &__column {
    display: flex;
    flex-flow: column;
    row-gap: 1rem;
  }

  &__title {
    font-family: CraftworkSans, serif;
    font-size: 1.5rem;
    line-height: 28px;
    color: var(--gray-400);
    font-style: normal;
    font-weight: 900;
  }

  &__tooltip__icon {
    cursor: pointer;
    margin-left: 0.5rem;

    img {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}

.download__button {
  cursor: pointer;
  width: 100%;
}

.assignee-header {
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  font-family: CraftworkSans, serif;
  font-style: normal;
  font-weight: 900;
  font-size: 24px;
  line-height: 28px;
  color: var(--gray-400);
  margin-bottom: 1rem;
  margin-top: 2rem;

  &__tooltip {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
    }
  }

  &__title {
    //text-transform: uppercase;
    margin: 0;
  }
}

@media (max-width: 53.75rem) {
  .agreement__details,
  .owners {
    grid-template-columns: 1fr;
  }

  .owners {
    margin-top: 0;

    &__title {
      margin-top: 3rem;
    }
  }
}
</style>
