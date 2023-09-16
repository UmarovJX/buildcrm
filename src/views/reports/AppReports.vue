<script>
import { computed, getCurrentInstance, ref, watch } from "vue";
import { useLoading } from "@/composables/useLoading";
import { v3ServiceApi } from "@/services/v3/v3.service";
import BaseModal from "@/components/Reusable/BaseModal.vue";
import BaseButton from "@/components/Reusable/BaseButton.vue";
import { XFormSelect } from "@/components/ui-components/form-select";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon.vue";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { dateFormatWithDot } from "@/util/date/calendar.util";
import AppHeader from "@/components/Header/AppHeader.vue";

export default {
  components: {
    AppHeader,
    XIcon,
    BaseArrowRightIcon,
    BaseArrowDownIcon,
    BaseLoading,
    BaseArrowLeftIcon,
    BaseButton,
    BaseModal,
    XFormSelect,
  },
  setup() {
    const vm = getCurrentInstance();

    const vObserverRef = ref(null);
    const downloadModalRef = ref(null);
    const list = ref([]);
    const pagination = ref({
      current: 1,
      previous: 0,
      next: 0,
      perPage: 10,
      totalPage: 0,
      totalItem: 0,
    });

    const tableFields = computed(() => {
      return [
        {
          key: "id",
          label: "#",
        },
        {
          key: "date_from",
          label: vm.proxy.$t("from_the_date_of"),
          formatter: formatDate,
        },
        {
          key: "date_to",
          label: vm.proxy.$t("to_the_date_of"),
          formatter: formatDate,
        },
        {
          key: "status",
          label: vm.proxy.$t("report.status"),
        },
        {
          key: "type",
          label: vm.proxy.$t("type"),
        },
        {
          key: "actions",
          label: "",
        },
      ];
    });
    const isSubmitting = ref(false);
    const reportForm = ref({
      dateFrom: null,
      dateTo: null,
      type: null,
    });
    const { isFetching, startFetching, finishFetching } = useLoading();
    const typeOptions = computed(() => {
      return [
        {
          value: "orders",
          text: vm.proxy.$t("report.orders"),
        },
        {
          value: "clients",
          text: vm.proxy.$t("report.clients"),
        },
      ];
    });
    const timer = ref(null);
    const filterBy = ref(null);
    const loadingFileId = ref(null);

    const showByOptions = [];
    for (let number = 10; number <= 50; number += 10) {
      showByOptions.push({
        value: number,
        text: number,
      });
    }

    const countOfItems = computed(() => list.value.length);
    const hasUnfinishedReport = computed(() => {
      return list.value.some(({ status }) =>
        ["created", "processing"].includes(status)
      );
    });
    const showPaginationComp = computed(() => {
      if (pagination.value.current === 1) {
        return countOfItems.value;
      } else {
        return true;
      }
    });

    watch(hasUnfinishedReport, (hUnReport) => {
      if (hUnReport) {
        const unfinishedIds = list.value
          .filter(({ status }) => ["created", "processing"].includes(status))
          .map(({ id }) => id);
        checking({
          ids: unfinishedIds,
        });
      }
    });

    watch([filterBy, () => pagination.value.perPage], ([filterBy]) => {
      if (filterBy) {
        pagination.value.current = 1;
      }
      findAll();
    });

    function formatDate(dm) {
      return dateFormatWithDot(dm, { reverse: false });
    }

    function openModal() {
      downloadModalRef.value.openModal();
    }

    function closeModal() {
      downloadModalRef.value.closeModal();
    }

    function checking({ ids }) {
      timer.value = setInterval(async () => {
        const checkRsp = await v3ServiceApi.reports.checkStatus({
          report_ids: ids,
        });

        const isAnyFinished = checkRsp.data.result.some(
          ({ status }) => status === "successful"
        );

        if (isAnyFinished) {
          clearInterval(timer.value);
          timer.value = null;

          const reportsIds = checkRsp.data.result
            .filter(({ status }) => status === "successful")
            .map(({ id }) => id);

          await Promise.allSettled(
            reportsIds.map((id) => downloadFile(id))
          ).then(async () => {
            await findAll({ showLoading: false });
          });
        }
      }, 3000);
    }

    async function findAll({ showLoading = true } = { showLoading: true }) {
      try {
        if (showLoading) {
          startFetching();
        }

        const params = {
          page: pagination.value.current,
          limit: pagination.value.perPage,
        };

        if (filterBy.value) {
          params.type = filterBy.value;
        }

        const response = await v3ServiceApi.reports.findAll(params);

        list.value = response.data.result;
        pagination.value = response.data.pagination;
      } finally {
        if (showLoading) {
          finishFetching();
        }
      }
    }

    async function downloadFile(id) {
      try {
        loadingFileId.value = id;
        const filePathRsp = await v3ServiceApi.reports.getFilePath({ id });
        const fileLink = document.createElement("a");
        fileLink.href = filePathRsp.data.result["file_path"];
        document.body.appendChild(fileLink);
        fileLink.click();
      } finally {
        loadingFileId.value = null;
      }
    }

    function changeCurrentPage(page) {
      pagination.value.current = page;
      findAll({});
    }

    async function downloadReportFile() {
      const hasFormCompleted = await vObserverRef.value.validate();
      if (hasFormCompleted) {
        try {
          isSubmitting.value = true;

          await v3ServiceApi.reports.create({
            date_from: reportForm.value.dateFrom,
            date_to: reportForm.value.dateTo,
            type: reportForm.value.type,
          });

          closeModal();
          await findAll();
        } catch (e) {
          console.error(e);
        } finally {
          isSubmitting.value = false;
        }
      }
    }

    findAll();

    return {
      list,
      pagination,
      tableFields,
      isSubmitting,
      reportForm,
      typeOptions,
      vObserverRef,
      downloadModalRef,
      isFetching,
      showByOptions,
      loadingFileId,
      filterBy,

      countOfItems,
      showPaginationComp,

      closeModal,
      openModal,
      findAll,
      downloadReportFile,
      changeCurrentPage,
      downloadFile,
    };
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-title> {{ $t("report.list") }} </template>

      <template #header-actions>
        <div class="content__form__select">
          <x-form-select
            class="w-100"
            id="selectType"
            v-model="filterBy"
            :options="typeOptions"
            :placeholder="`${$t('report.filter_by')}`"
          />
        </div>

        <base-button @click="openModal" :text="`${$t('download_report')}`">
          <template #left-icon>
            <x-icon
              name="add_circle"
              :size="24"
              class="violet-600"
              color="var(--violet-600)"
            />
          </template>
        </base-button>
      </template>
    </app-header>

    <b-table
      sticky-header
      borderless
      responsive
      :busy="isFetching"
      :items="list"
      :fields="tableFields"
      class="table__list"
      :empty-text="$t('no_data')"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border cursor-pointer"
      show-empty
      sort-icon-left
    >
      <!--      <template #cell(index)="data">-->
      <!--        {{ data.index + 1 }}-->
      <!--      </template>-->

      <template #cell(type)="data">
        <span class="text-capitalize">
          {{ $t(`report.${data.item.type}`) }}
        </span>
      </template>

      <template #cell(status)="{ item }">
        <span class="current__status text-capitalize" :class="item.status">
          {{ $t(`report.statuses.${item.status}`) }}
        </span>
      </template>

      <!--  Actions    -->
      <template #cell(actions)="data">
        <span
          v-if="data.item.status === 'successful'"
          class="arrow__down-violet"
          @click="downloadFile(data.item.id)"
        >
          <b-spinner
            v-if="data.item.id === loadingFileId"
            variant="light"
            small
          ></b-spinner>
          <base-arrow-down-icon
            v-else
            class="download__icon"
            :width="20"
            :height="20"
            fill="#fff"
          />
        </span>
        <b-spinner
          v-if="['created', 'processing'].includes(data.item.status)"
          variant="primary"
          label="Spinning"
        ></b-spinner>
      </template>

      <!--  Busy Animation    -->
      <template #table-busy>
        <base-loading />
      </template>

      <template #empty>
        <div
          class="d-flex justify-content-center align-items-center flex-column not__found"
        >
          <p class="head">{{ $t("contracts_not_found.title") }}</p>
          <p>{{ $t("contracts_not_found.description") }}</p>
        </div>
      </template>
    </b-table>

    <div v-if="!isFetching && showPaginationComp" class="pagination__vue">
      <!--   Pagination   -->
      <vue-paginate
        :page-count="pagination.totalPage"
        :value="pagination.current"
        :container-class="'container'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :next-class="'page-item'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
        @change-page="changeCurrentPage"
      >
        <template #next-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-right-icon />
          </span>
        </template>

        <template #prev-content>
          <span class="d-flex align-items-center justify-content-center">
            <base-arrow-left-icon />
          </span>
        </template>
      </vue-paginate>

      <!--  Show By Select    -->
      <div class="show__by">
        <x-form-select
          :label="false"
          :options="showByOptions"
          v-model="pagination.perPage"
        >
          <template #output-prefix>
            <span class="show-by-description">
              {{ $t("contracts.show_by") }}:
            </span>
          </template>
        </x-form-select>
      </div>
    </div>

    <base-modal
      design="payment-modal"
      ref="downloadModalRef"
      wrapper-style="width:30rem"
    >
      <template #header>
        <!--   GO BACK     -->
        <span class="d-flex align-items-center">
          <span class="go__back" @click="closeModal">
            <base-arrow-left-icon
              :width="32"
              :height="32"
            ></base-arrow-left-icon>
          </span>
          <!--    TITLE      -->
          <span class="title ml-3">{{ $t("download_report") }}</span>
        </span>
      </template>

      <template #main>
        <ValidationObserver ref="vObserverRef" style="overflow-y: auto">
          <div class="payment-addition-fields">
            <ValidationProvider
              :name="`${$t('report.select_report_type')}`"
              rules="required"
              v-slot="{ errors }"
              tag="div"
            >
              <label for="selectType" class="gray-600">
                {{ $t("report.select_report_type") }}:
              </label>

              <div class="content__form__select">
                <x-form-select
                  class="w-100"
                  id="selectType"
                  v-model="reportForm.type"
                  :options="typeOptions"
                  :placeholder="`${$t('select_type')}`"
                />
              </div>
              <span class="error__provider">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              :name="`${$t('from_the_date_of')}`"
              rules="required"
              id="selectFromDate"
              v-slot="{ errors }"
              tag="div"
            >
              <label for="selectFromDate" class="gray-600 mt-4">
                {{ $t("from_the_date_of") }}:
              </label>

              <div class="content__form__select">
                <input
                  v-model="reportForm.dateFrom"
                  type="date"
                  class="w-100"
                />
              </div>
              <span class="error__provider">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              :name="`${$t('to_the_date_of')}`"
              tag="div"
              rules="required"
              id="selectToDate"
              v-slot="{ errors }"
            >
              <label for="selectToDate" class="gray-600 mt-4 d-block">
                {{ $t("to_the_date_of") }}:
              </label>
              <div class="content__form__select">
                <input v-model="reportForm.dateTo" type="date" class="w-100" />
              </div>
              <span class="error__provider">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </ValidationObserver>
      </template>

      <template #footer>
        <b-overlay
          :show="isSubmitting"
          rounded
          opacity="0.6"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block w-100"
        >
          <base-button
            :text="`${$t('apply')}`"
            :fixed="true"
            design="violet-gradient"
            @click="downloadReportFile"
          />
        </b-overlay>
      </template>
    </base-modal>
  </div>
</template>

<style lang="scss" scoped>
input[type="date"]::-webkit-datetime-edit-text,
input[type="date"]::-webkit-datetime-edit-month-field,
input[type="date"]::-webkit-datetime-edit-day-field,
input[type="date"]::-webkit-datetime-edit-year-field {
  color: var(--gray-600);
}

.go__back {
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background-color: var(--gray-100);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.payment-modal {
  .content__form__select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--gray-100);
    border-radius: 2rem !important;
    border: none;
    color: var(--gray-600);
    position: relative;

    .form__select {
      background-color: transparent;
      border: none;
      color: var(--gray-600);
      margin: 0 1rem;
      width: 100%;
    }

    ::v-deep .x-form-select-main .x-form-select-options {
      max-height: 200px !important;
    }
  }

  input {
    border-radius: 2rem !important;
  }
}

.error__provider {
  display: block;
  margin-top: 8px;
  color: red;
}

@import "../../assets/scss/utils/pagination";

* {
  font-family: Inter, serif;
  font-style: normal;
  line-height: 22px;
  color: var(--gray-600);
  font-weight: 600;
}

.main__content {
  background-color: #ffffff;
  padding-bottom: 20rem;
  padding-top: 1rem;
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

.phone-col {
  display: flex;
  width: max-content;
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

//.friends__mark {
//    background-color: var(--violet-100);
//    min-width: 1.5rem;
//    width: 1.5rem;
//    height: 1.5rem;
//    border-radius: 50%;
//    display: flex;
//    justify-content: center;
//    align-items: center;
//    margin-right: 0.25rem;
//}

.current__status {
  display: inline-flex;
  justify-content: center;
  //justify-content: flex-start;
  align-items: center;
  min-width: 11rem;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;

  /*
    created, processing, successful, failed, cancelled
  */
  &.created {
    background-color: var(--blue-100);
    color: var(--blue-600);
  }

  &.processing {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &.successful {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &.cancelled,
  &.failed {
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

.show__by {
  width: 100%;
  display: flex;
  justify-content: center;

  &__content {
    display: flex;
    align-items: center;
    border-radius: 2rem;
    background-color: var(--gray-100);
    padding: 0.75rem 1.5rem;
    width: auto;
    position: relative;

    .custom-select {
      width: auto;
      border: none;
      background: none;
      cursor: pointer;
      font-weight: 600;
      color: var(--gray-600);
    }

    .description {
      color: var(--gray-400);
    }

    .arrow__down {
      position: absolute;
      right: 1.75rem;
    }
  }
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

.show-by-description {
  color: var(--gray-400);
}
</style>
