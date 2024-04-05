<script>
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import BaseDotsIcon from "@/components/icons/BaseDotsIcon";
import BaseEditIcon from "@/components/icons/BaseEditIcon";
import BaseModal from "@/components/Reusable/BaseModal";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import BaseDownIcon from "@/components/icons/BaseDownIcon";
import { v3ServiceApi } from "@/services/v3/v3.service";
import BaseDeleteIcon from "@/components/icons/BaseDeleteIcon";
import AppDropdown from "@/components/Reusable/Dropdown/AppDropdown";
import { formatToPrice, getDateProperty } from "@/util/reusable";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import BaseLoading from "@/components/Reusable/BaseLoading";
import { XFormInput } from "@/components/ui-components/form-input";
import BasePriceInput from "@/views/contracts/subContract/BasePriceInput";

import BaseDatePicker from "@/components/Reusable/BaseDatePicker";

export default {
  name: "WarningsTab",
  components: {
    XCircularBackground,
    XIcon,
    AppDropdown,
    BaseDeleteIcon,
    BaseButton,
    BasePlusIcon,
    BaseDotsIcon,
    BaseEditIcon,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    BaseDownIcon,
    BaseCloseIcon,
    BaseModal,
    BaseLoading,
    XFormInput,
    BasePriceInput,

    BaseDatePicker,
  },
  props: {
    status: {
      type: String,
    },
  },

  data() {
    const showByOptions = [];
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const d2 = new Date(d.getTime() - offset * 60 * 1000);
    const today = d2.toISOString().split("T")[0];

    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number,
      });
    }
    const fields = [
      {
        key: "label",
        label: "Тип",
      },
      {
        key: "date",
        label: "Дата",
      },
      {
        key: "actions",
        label: "",
      },
    ];

    return {
      path: process.env.VUE_APP_URL,
      fields,
      warnings: [],
      isLoading: false,
      loading: false,
      current: null,
      today,
    };
  },

  computed: {
    warningList() {
      if (this.status === "cancelled")
        return [
          ...this.warnings,
          {
            label: "Отменен",
            type: "cancelled",
            date: this.today,
            isLoading: false,
          },
        ];
      return this.warnings;
    },
  },
  async mounted() {
    this.getWarnings();
  },
  methods: {
    async download(item) {
      if (item.isLoading) return;
      item.isLoading = true;
      const d = new FormData();
      d.append("type", item.type);
      d.append("date", item.date);
      await v3ServiceApi.warningOrders
        .download(this.$route.params.id, d)
        .then(({ data, headers }) => {
          const filename = headers.hasOwnProperty("x-filename")
            ? headers["x-filename"]
            : "contract.docx";
          const fileURL = window.URL.createObjectURL(new Blob([data]));
          const fileLink = document.createElement("a");
          fileLink.href = fileURL;
          fileLink.setAttribute("download", filename);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
          this.toastedWithErrorCode(error.response.error);
        })
        .finally(() => {
          item.isLoading = false;
        });
    },
    openModal(item) {
      this.$refs["detail-modal"].openModal();
    },
    closeModal() {
      this.$refs["detail-modal"].closeModal();
    },
    viewDetails(item) {
      this.loading = true;
      this.openModal();
      const d = new FormData();
      d.append("uuid", item.id);
      v3ServiceApi.subOrder
        .view(d)
        .then((res) => {
          this.current = res.data.result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getWarnings() {
      this.isLoading = true;
      v3ServiceApi.warningOrders.getList().then(({ data: { result } }) => {
        this.warnings = Object.keys(result).map((key, i) => ({
          label: result[key][this.$i18n.locale],
          type: key,
          date: this.today,
          isLoading: false,
        }));
        this.isLoading = false;
      });
    },
  },
};
</script>

<template>
  <div class="main">
    <!--  TABLE PAYMENTS LIST -->
    <div>
      <h3 class="title mt-4">Письма-уведомления к контракту</h3>
      <div class="addition__button" />
    </div>
    <b-table
      :items="warningList"
      :fields="fields"
      class="table__list mt-4 border-bottom"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border"
      show-empty
      sticky-header
      responsive
      :busy="isLoading"
    >
      <!--    CELL OF COMMENT      -->
      <template #cell(date)="{ item }">
        <base-date-picker
          v-model="item.date"
          :range="false"
          class="data-picker"
          format="DD.MM.YYYY"
          :placeholder="'Дата оформления'"
          icon-fill="var(--violet-600)"
        />
      </template>

      <template #cell(actions)="{ item }">
        <div class="d-flex x-gap-1">
          <x-circular-background
            class="bg-green cursor-pointer ml-2"
            :class="{ loading: item.isLoading }"
            @click="download(item)"
          >
            <x-icon name="download" class="color-white" />
          </x-circular-background>
        </div>
      </template>

      <!--   CONTENT WHEN EMPTY SCOPE       -->
      <template #empty>
        <div
          class="d-flex justify-content-center align-items-center empty__scope"
        >
          {{ $t("no_data") }}
        </div>
      </template>
      <!--  Busy Animation    -->
      <template #table-busy>
        <base-loading />
      </template>
    </b-table>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../assets/scss/utils/pagination";
.loading {
  cursor: progress;
  opacity: 0.5;
}
.no-pointer {
  pointer-events: none;
}
.section-title {
  color: var(--gray-600);
  font-size: 24px;
}
.apartment {
  font-family: Inter;
  border-radius: 32px;
  background-color: var(--gray-100);
  padding: 20px;
  margin-bottom: 10px;
  & .label {
    font-weight: 600;
    color: #9ca3af;
  }
  & .value {
    font-weight: 600;
    color: var(--gray-600);
  }
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

.title {
  font-family: CraftworkSans, serif;
  font-weight: 900;
  font-size: 1.5rem;
  line-height: 28px;
  color: var(--gray-600);
}
</style>
