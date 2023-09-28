<script>
import BaseButton from "@/components/Reusable/BaseButton.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon.vue";
import { computed, getCurrentInstance, onMounted, ref, watch } from "vue";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon.vue";
import BaseModal from "@/components/Reusable/BaseModal.vue";
import { v3ServiceApi } from "@/services/v3/v3.service";
import { hasOwnProperty } from "@/util/object";
import { isArray } from "@/util/inspect";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import { useToastError } from "@/composables/useToastError";
import { onBeforeRouteLeave } from "vue-router/composables";

export default {
  name: "ExportDropdown",
  components: {
    XCircularBackground,
    BaseLoading,
    BaseModal,
    BaseArrowLeftIcon,
    XIcon,
    BaseButton,
    BaseArrowDownIcon,
  },
  setup() {
    const vm = getCurrentInstance();

    function formatDate(dm) {
      return dm.split("-").reverse().join(".");
    }

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
          key: "actions",
          label: "",
        },
      ];
    });

    const reportForm = ref({
      dateFrom: null,
      dateTo: null,
    });
    const isSubmitting = ref(false);
    const exportButtonBusy = ref(false);
    const retryingFileId = ref(false);
    const loadingFileId = ref(false);
    const list = ref([]);
    const timer = ref(null);
    const pagination = ref({
      current: 1,
      previous: 0,
      next: 0,
      perPage: 10,
      totalPage: 0,
      totalItem: 0,
    });
    const { toastError } = useToastError();

    /*
    * filter: {
            object_id: [],
            contract_number: null,
            date: [],
            date_type: null,
            client_type_id: null,
            contract_price: null,
            price_to: null,
            price_from: null,
            apartment_number: [],
            blocks: [],
            floors: [],
            branch: [],
            manager: [],
            initial_payment_date: null,
            monthly_payment_date: null,
          },
          * */

    const vObserverRef = ref(null);
    const downloadModalRef = ref(null);
    const exportDropdownRef = ref(null);

    const hasUnfinishedReport = computed(() => {
      return list.value.some(({ status }) =>
        ["created", "processing"].includes(status)
      );
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

    function openDropdown() {
      exportDropdownRef.value.show();
    }

    function openModal() {
      downloadModalRef.value.openModal();
    }

    function closeModal() {
      downloadModalRef.value.closeModal();
      vObserverRef.value.reset();
      reportForm.value = {
        dateFrom: null,
        dateTo: null,
      };

      openDropdown();
    }

    async function findAllByUser() {
      const rsp = await v3ServiceApi.reports.findAllByUser({
        page: 1,
        limit: 200,
        type: "orders",
      });

      list.value = rsp.data.result;
      pagination.value = rsp.data.pagination;
    }

    function joinQueries() {
      const form = {};
      const arrayTypes = ["object_id", "blocks", "floors", "branch", "manager"];
      const numberTypes = ["client_type_id"];
      console.log();
      const query = vm.proxy.$route.query;
      for (let property of Object.keys(query)) {
        if (["page", "limit"].includes(property)) {
          continue;
        }

        const value = query[property];

        if (arrayTypes.includes(property)) {
          if (typeof value === "string") {
            if (parseInt(value)) {
              form[property] = [parseInt(value)];
            }
          } else if (isArray(value)) {
            if (!hasOwnProperty(form, property)) {
              form[property] = [];
            }

            value.map((id) => {
              if (parseInt(id)) {
                form[property].push(parseInt(id));
              }
            });
          }
        } else if (numberTypes.includes(property)) {
          if (typeof value === "string") {
            if (parseInt(value)) {
              form[property] = parseInt(value);
            }
          }
        } else {
          form[property] = value;
        }
      }

      return form;
    }

    async function downloadFile(id, $event) {
      $event.stopPropagation();
      try {
        exportButtonBusy.value = true;
        loadingFileId.value = id;
        const filePathRsp = await v3ServiceApi.reports.getFilePath({ id });
        const fileLink = document.createElement("a");
        fileLink.href = filePathRsp.data.result["file_path"];
        const createDropdownItem = document.getElementById(
          "create-dropdown-item"
        );
        createDropdownItem.appendChild(fileLink);
        fileLink.click();
      } finally {
        exportButtonBusy.value = false;
        loadingFileId.value = null;
      }
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
            await findAllByUser();
          });
        } else {
          const isAnyFailed = checkRsp.data.result.some(
            ({ status }) => status === "failed"
          );

          if (isAnyFailed) {
            const isCurrentFailed = checkRsp.data.result.findIndex((item) => {
              return (
                item.id === retryingFileId.value && item.status === "failed"
              );
            });

            if (isCurrentFailed !== -1) {
              retryingFileId.value = false;
              clearInterval(timer.value);
              timer.value = null;
            }

            await findAllByUser();
          }
        }
      }, 3000);
    }

    async function retryToDownloadFile(item, $event) {
      $event.stopPropagation();
      try {
        retryingFileId.value = item.id;
        await v3ServiceApi.reports.retryFailedReport({
          id: item.id,
        });
        await findAllByUser();
      } catch (e) {
        retryingFileId.value = false;
      } finally {
        retryingFileId.value = item.id;
      }
    }

    async function createReportFile() {
      // const hasFormCompleted = await vObserverRef.value.validate();
      // if (hasFormCompleted) {
      try {
        isSubmitting.value = true;
        const query = vm.proxy.$route.query;
        let date_from = null;
        let date_to = null;
        const hasDataTypeQuery =
          hasOwnProperty(query, "date_type") &&
          query.date_type === "created_at";
        const hasDateQuery =
          hasOwnProperty(query, "date") && isArray(query.date);
        if (hasDataTypeQuery && hasDateQuery) {
          date_from = query.date[0];
          date_to = query.date.length > 1 ? query.date[1] : query.date[0];
        }

        await v3ServiceApi.reports.create({
          date_to,
          date_from,
          type: "orders",
          filter_params: joinQueries(),
        });

        // closeModal();
        openDropdown();
        await findAllByUser();
      } catch (e) {
        toastError(e);
        console.error(e);
      } finally {
        isSubmitting.value = false;
      }
      // }
    }

    function beforeHideDropdown() {}

    onMounted(async () => {
      await findAllByUser();
    });

    onBeforeRouteLeave((to, from, next) => {
      clearInterval(timer.value);
      timer.value = null;
      next();
    });

    return {
      list,
      exportButtonBusy,
      loadingFileId,
      pagination,
      reportForm,
      isSubmitting,
      tableFields,
      retryingFileId,

      vObserverRef,
      downloadModalRef,
      exportDropdownRef,

      openModal,
      closeModal,
      downloadFile,
      retryToDownloadFile,
      createReportFile,
      beforeHideDropdown,
    };
  },
};
</script>

<template>
  <div>
    <b-overlay :show="false" rounded="sm" variant="transparent">
      <b-dropdown
        @hide="beforeHideDropdown"
        right
        variant="link"
        toggle-class="text-decoration-none m-0 p-0"
        ref="exportDropdownRef"
        no-caret
      >
        <template #button-content>
          <base-button :text="`${$t('export')}`">
            <template #left-icon>
              <span class="arrow__down-violet" v-if="exportButtonBusy">
                <b-spinner variant="light" small></b-spinner>
              </span>
              <x-icon
                v-else
                name="download"
                :size="24"
                class="violet-600"
                color="var(--violet-600)"
              />
            </template>
          </base-button>
        </template>

        <b-dropdown-text id="create-dropdown-item">
          <span class="d-flex justify-content-end">
            <span
              @click="createReportFile"
              class="d-flex align-items-center x-gap-1 bg-gray-200 px-4 py-2 border-radius-1 cursor-pointer"
            >
              <span class="d-flex align-items-center color-gray-700">
                {{ $t("download_report") }}
              </span>
              <span class="arrow__down-violet download-csv-icon">
                <span class="arrow__down-violet" v-if="isSubmitting">
                  <b-spinner variant="light" small></b-spinner>
                </span>
                <x-icon
                  v-else
                  name="add_circle"
                  :size="24"
                  class="violet-600"
                  color="var(--violet-600)"
                />
              </span>
            </span>
          </span>
        </b-dropdown-text>

        <b-dropdown-divider />

        <b-dropdown-text id="b-table-container" class="export-form">
          <b-table
            sticky-header
            borderless
            responsive
            :items="list"
            :fields="tableFields"
            class="table__list"
            :empty-text="$t('no_data')"
            thead-tr-class="row__head__bottom-border"
            tbody-tr-class="row__body__bottom-border cursor-pointer"
            show-empty
            sort-icon-left
          >
            <template #cell(type)="data">
              <span class="text-capitalize">
                {{ $t(`report.${data.item.type}`) }}
              </span>
            </template>

            <template #cell(status)="{ item }">
              <span
                class="current__status text-capitalize"
                :class="item.status"
              >
                {{ $t(`report.statuses.${item.status}`) }}
              </span>
            </template>

            <!--  Actions    -->
            <template #cell(actions)="data">
              <span
                id="action-download"
                v-if="data.item.status === 'successful'"
                class="arrow__down-violet"
                @click="downloadFile(data.item.id, $event)"
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
                v-if="
                  ['created', 'processing'].includes(data.item.status) ||
                  data.item.id === retryingFileId
                "
                :variant="
                  data.item.id === retryingFileId
                    ? 'danger'
                    : data.item.status === 'processing'
                    ? 'warning'
                    : 'primary'
                "
              ></b-spinner>

              <x-circular-background
                v-else-if="['cancelled', 'failed'].includes(data.item.status)"
                bg-color="var(--red-600)"
                size="2rem"
                @click="retryToDownloadFile(data.item, $event)"
              >
                <x-icon name="refresh" color="var(--white)" class="red-600" />
              </x-circular-background>
            </template>

            <!--  Busy Animation    -->
            <template #table-busy>
              <base-loading />
            </template>

            <template #empty>
              <div
                class="d-flex justify-content-center align-items-center flex-column not__found"
              >
                <p class="head">{{ $t("reports.not_found") }}</p>
                <p>{{ $t("contracts_not_found.description") }}</p>
              </div>
            </template>
          </b-table>
        </b-dropdown-text>
      </b-dropdown>
    </b-overlay>

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
            @click="createReportFile"
          />
        </b-overlay>
      </template>
    </base-modal>
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

.download-csv-icon {
  background-color: transparent;

  &:hover {
    background-color: transparent;
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

.current__status {
  display: inline-flex;
  justify-content: center;
  //justify-content: flex-start;
  align-items: center;
  min-width: 11rem;
  border-radius: 2rem;
  padding: 0.5rem 1.5rem;

  &.sold {
    background-color: var(--green-100);
    color: var(--green-600);
  }

  &.waiting {
    background-color: var(--violet-100);
    color: var(--violet-600);
  }

  &.contract {
    background-color: var(--blue-100);
    color: var(--blue-600);
  }

  &.booked {
    background-color: var(--yellow-100);
    color: var(--yellow-600);
  }

  &.closed,
  &.cancelled {
    background-color: var(--red-100);
    color: var(--red-600);
  }
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

  &:hover {
    background-color: var(--gray-200);
  }
}

.export-form {
  max-height: 36rem;
  min-width: 40rem;
  overflow-y: auto;
}
</style>
