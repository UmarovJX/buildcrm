<script>
import AppHeader from "@/components/Header/AppHeader.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import BaseStarIcon from "@/components/icons/BaseStarIcon.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XButton } from "@/components/ui-components/button";
import { mapActions } from "vuex";
import api from "@/services/api";
import { isNotUndefinedNullEmptyZero, isObject } from "@/util/inspect";
import ContractsPermission from "@/permission/contract";
import {
  formatDateWithDot,
  formatToPrice,
  phonePrettier,
} from "@/util/reusable";

export default {
  name: "ContractReview",
  components: {
    AppHeader,
    BaseLoading,
    BaseStarIcon,
    XIcon,
    XButton,
  },
  data() {
    return {
      tableData: {
        busy: false,
        items: [],
        pagination: {},
      },
      contractsDownloading: false,
      downloadPermission: ContractsPermission.getContractsDownloadPermission(),
    };
  },
  computed: {
    tableFields() {
      return [
        {
          key: "contract",
          label: this.$t("contracts.table.contract"),
        },
        {
          key: "client",
          label: this.$t("contracts.table.client"),
        },
        {
          key: "phone",
          label: this.$t("contracts.table.phone_number"),
        },
        {
          key: "status",
          label: this.$t("contracts.table.status"),
        },
        {
          key: "payments.transaction_price",
          label: this.$t("contracts.table.cost"),
          formatter: (price) => formatToPrice(price) + " " + this.$t("ye"),
        },
        {
          key: "object",
          label: this.$t("contracts.table.object"),
          formatter: (object) => object.name,
        },
        {
          key: "date",
          label: this.$t("contracts.table.date"),
        },
        {
          key: "actions",
          label: "",
        },
      ];
    },
  },
  created() {
    this.checkNotification();
    this.fetchContractList();
  },
  methods: {
    ...mapActions("notify", ["openNotify"]),
    formattingPhone: (phone) => phonePrettier(phone),
    getClientMajorPhone(phones) {
      phones = phones.filter((p) => {
        return (
          isNotUndefinedNullEmptyZero(p.phone) && p.phone.toString().length > 3
        );
      });

      if (phones.length > 0) {
        return this.formattingPhone(phones[0].phone);
      }

      return "";
    },
    dateReverser: (time) => formatDateWithDot(time),
    checkNotification() {
      if (this.$route.query.hasOwnProperty("success")) {
        this.openNotify({
          type: "success",
          message: this.$t("contract_completed_successfully"),
        });
      }
    },

    async fetchContractList() {
      this.startLoading();
      const filterParams = {
        object_id: [this.$route.params.object],
        contract_number: this.$route.params.ids.split(","),
        limit: 50,
      };

      await api.contractV2
        .fetchContractsList(filterParams)
        .then((response) => {
          this.tableData.items = response.data.items;
          this.tableData.pagination = response.data.pagination;
        })
        .catch((e) => {
          this.openNotify({
            type: "error",
            message: e.response.data.message ?? e.message,
          });
        })
        .finally(() => this.finishLoading());
    },
    startLoading() {
      this.tableData.busy = true;
    },
    finishLoading() {
      this.tableData.busy = false;
    },
    clientName(multiName, language) {
      if (!isObject(multiName)) {
        return "";
      }

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
    getClientName(client) {
      let language = "kirill";
      if (this.$i18n.locale === "uz") {
        language = "lotin";
      }
      const { last_name, first_name, second_name } = client.attributes;
      return (
        this.clientName(last_name, language) +
        " " +
        this.clientName(first_name, language) +
        " " +
        this.clientName(second_name, language)
      );
    },
    contractView({ id }, index, event) {
      const clickedDownloadBtn =
        event.target.classList.contains("download__icon");
      if (clickedDownloadBtn) {
        if (this.downloadPermission) {
          this.downloadContractLink(id);
        }
      } else {
        this.$router.push({
          name: "contracts-view",
          params: {
            id,
          },
        });
      }
    },
    async downloadContractLink(id) {
      await api.contract
        .downloadContract(id)
        .then(({ data, headers }) => {
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
        .catch((e) => {
          this.openNotify({
            type: "error",
            message: e.response.data.message ?? e.message,
          });
        });
    },
    downloadAllContracts() {
      this.toggleContractDownloading(true);
      Promise.allSettled(
        this.tableData.items.map(({ id }) => this.downloadContractLink(id))
      ).then(() => this.toggleContractDownloading(false));
    },
    toggleContractDownloading(process = false) {
      this.contractsDownloading = process;
      return 1;
    },
    goToContractsPage() {
      this.$router.push({
        name: "contracts",
      });
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title>
        {{ $t("completion_of_registration") }}
      </template>
    </app-header>

    <b-table
      sticky-header
      borderless
      responsive
      :busy="tableData.busy"
      :items="tableData.items"
      :fields="tableFields"
      class="table__list"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border cursor-pointer"
      show-empty
      sort-icon-left
      @row-clicked="contractView"
    >
      <!--   Phone Number   -->
      <template #cell(phone)="data">
        <span class="phone-col">{{
          getClientMajorPhone(data.item.client.phones)
        }}</span>
      </template>

      <!--   Date   -->
      <template #cell(date)="data">
        <span>{{ dateReverser(data.item.created_at) }}</span>
      </template>

      <!--   Client LFP   -->
      <template #cell(client)="{ item }">
        <span class="d-flex">
          <span v-if="item.client.friends" class="friends__mark">
            <base-star-icon :width="14" :height="14" fill="#7C3AED" />
          </span>
          <span>{{ getClientName(item.client) }}</span>
        </span>
      </template>

      <!--   Status   -->
      <template #cell(status)="{ item }">
        <span class="current__status" :class="item.status">
          {{ $t(`contracts.status.${item.status}`) }}
        </span>
      </template>

      <!--  Actions    -->
      <template #cell(actions)="data">
        <span v-if="downloadPermission" class="arrow__down-violet">
          <x-icon name="download" class="color-white download__icon" />
        </span>
      </template>

      <!--  Busy Animation    -->
      <template #table-busy>
        <base-loading />
      </template>

      <template #empty="scope" class="text-center">
        <div
          class="d-flex justify-content-center align-items-center flex-column not__found"
        >
          <p class="head">Договоры не были найдены</p>
          <p>Попробуйте ввести другие данные для поиска</p>
        </div>
      </template>
    </b-table>

    <div
      class="d-flex justify-content-end align-items-center bottom-actions-wrapper"
    >
      <x-button
        v-if="tableData.items.length > 1"
        :bilingual="true"
        :loading="contractsDownloading"
        text="download_all_contract"
        @click="downloadAllContracts"
      >
        <template #left-icon>
          <x-icon name="download" class="color-white" />
        </template>
      </x-button>

      <x-button
        :bilingual="true"
        text="list_of_agreements"
        variant="secondary"
        @click="goToContractsPage"
      >
        <template #right-icon>
          <x-icon name="arrow_forward" class="gray-400" />
        </template>
      </x-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}

::v-deep .table__list {
  max-height: none;

  table {
    color: var(--gray-600);

    thead tr th {
      font-family: CraftworkSans, serif;
      font-weight: 600;
      line-height: 14px;
      letter-spacing: 1px;
      color: var(--gray-400) !important;
      padding: 1.25rem 1rem;
    }

    td {
      vertical-align: middle;
    }
  }

  .table.b-table[aria-busy="true"] {
    opacity: 1 !important;
  }
}

.current__status {
  display: inline-flex;
  justify-content: center;
  //justify-content: flex-start;
  align-items: center;
  min-width: 11rem;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;

  &.sold {
    background-color: var(--blue-100);
    color: var(--blue-600);
  }

  &.waiting {
    background-color: var(--violet-100);
    color: var(--violet-600);
  }

  &.contract {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &.booked {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &.closed {
    background-color: var(--red-100);
    color: var(--red-600);
  }
}

::v-deep .row__head__bottom-border {
  border-bottom: 2px solid var(--gray-200) !important;
}

::v-deep .row__body__bottom-border:not(:last-child) {
  border-bottom: 2px solid var(--gray-200) !important;
}

.arrow__down-violet {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  padding: 8px;
  background-color: var(--violet-600);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: var(--violet-800);

    svg {
      transform: scale(1.5);
      transition: all 500ms ease-in-out;
    }
  }
}

.phone-col {
  display: flex;
  width: max-content;
}

.not__found {
  min-height: 30rem;

  p {
    color: var(--gray-400);
    line-height: 1.75rem;
  }

  p.head {
    font-size: 2rem;
  }
}

.download__arrow__button {
  position: absolute;
  top: 50%;
  right: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
}

.bottom-actions-wrapper {
  margin-top: 2rem;
  column-gap: 1rem;
}
</style>
