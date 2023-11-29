<script>
import "@fancyapps/ui/dist/fancybox.css";
import { mapGetters, mapMutations } from "vuex";

import AppHeader from "@/components/Header/AppHeader";
import BaseArrowLeft from "@/components/icons/BaseArrowLeftIcon";

import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "BadContractDetails",
  components: {
    BaseArrowLeft,

    AppHeader,
  },
  data() {
    return {
      showLoading: false,
      items: [],

      manager: {},
      manager_id: null,
      header: {
        modalProperties: {
          position: "create",
          title: this.$t("add"),
        },
      },
      fields: [
        {
          key: "id",
          label: this.$t("ID"),
        },
        {
          key: "status",
          label: this.$t("Статус"),
          formatter: (el) => this.getTranslations(el),
        },
        {
          key: "amount",
          label: this.$t("Сумма"),
        },
        {
          key: "date_paid",
          label: this.$t("Дата оплаты"),
          formatter: (date_paid) =>
            new Date(date_paid).toLocaleDateString(this.$i18n.locale),
        },
        {
          key: "type",
          label: this.$t("Тип"),
          formatter: (el) => this.getTranslations(el),
        },
        {
          key: "payment_method",
          label: this.$t("Метод оплаты"),
          formatter: (el) => this.getTranslations(el),
        },
      ],
      deletePlan: {
        plans: [],
        message: "",
        removePlan: {},
      },

      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getLoading", "getPermission"]),
  },
  watch: {},
  mounted() {
    this.fetchItems();
  },
  methods: {
    getTranslations(el) {
      const d = {
        paid: "Оплачено",

        initial_payment: "1 взнос",
        monthly: "Eжемесячный",
        all: "Общий",

        transfer: "Перечисление",
        cash: "Наличные",
        plastic_card: "Пластиковая карта",
        recalculation: "Перерасчет",
        to_khurshidaka: "К Хуршидака",
      };
      return d[el];
    },
    ...mapMutations(["updateLoading"]),
    async fetchItems() {
      const contract = this.$route.params.contract;
      this.showLoading = true;
      v3ServiceApi.orders
        .findByContract({ contract })
        .then((res) => {
          this.items = res.data.result;
        })
        .catch((e) => {
          this.toastedWithErrorCode(e);
        })
        .finally(() => (this.showLoading = false));
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        <div class="go__back" @click="$router.go(-1)">
          <BaseArrowLeft :width="32" :height="32"></BaseArrowLeft>
        </div>
        {{ $t("Оплаты по договору: ") }} {{ $route.params.contract }}
      </template>
    </app-header>

    <div>
      <div class="mt-4">
        <b-table
          thead-tr-class="row__head__bottom-border"
          tbody-tr-class="row__body__bottom-border cursor-pointer"
          class="table__list"
          sticky-header
          show-empty
          borderless
          responsive
          :items="items"
          :empty-text="$t('no_data')"
          :fields="fields"
          :busy="showLoading"
        >
          <template #empty="scope" class="text-center">
            <div class="d-flex justify-content-center align-items-center">
              {{ scope.emptyText }}
            </div>
          </template>
          <template #table-busy>
            <div class="d-flex justify-content-center w-100">
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </template>

          <template #cell(amount)="{ item }">
            <div class="">
              {{ item.amount.toLocaleString("en-GB") }}
            </div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination.scss";

.label {
  color: #7c3aed;
  margin-right: 3px;
  font-weight: 500;
}

.fal {
  font-weight: 500;
}

.text {
  font-weight: 600;
}

.button {
  height: auto;
  background-color: #7c3aed;
  width: auto;
  padding: 8px;

  ::v-deep span {
    margin-left: 0 !important;
  }
}

.actions {
  display: flex;
  gap: 16px;
}

.search__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .table__list {
  min-height: 250px;
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 900;
      font-size: 14px;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.125rem 1rem;
      vertical-align: middle;

      //&.b-table-sort-icon-left {
      //display: flex;
      //align-items: center;
      //}
    }

    td {
      font-family: Inter, sans-serif;
      font-size: 1rem;
      line-height: 22px;
      font-weight: 600;
      vertical-align: middle;
    }
  }

  .table.b-table[aria-busy="true"] {
    opacity: 1 !important;
  }
}

::v-deep .table.b-table > thead > tr > [aria-sort="none"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="none"] {
  background-position: right calc(2rem / 2) center !important;
  //background-position: right !important;
  padding-right: 20px;
}

::v-deep .table.b-table > thead > tr > [aria-sort="ascending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="ascending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-down.svg") !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort="descending"],
::v-deep .table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-position: right calc(2rem / 2) center !important;
  background-size: 20px;
  background-image: url("../../assets/icons/icon-arrow-up.svg") !important;
}
</style>
