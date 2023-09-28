import { computed, getCurrentInstance, ref, watch } from "vue";
import Permission from "@/permission";
import { isNUNEZ, isObject } from "@/util/inspect";
import { useLoading } from "@/composables/useLoading";
import { v3ServiceApi } from "@/services/v3/v3.service";
import { keys } from "@/util/object";
import { onBeforeRouteLeave } from "vue-router/composables";

export function useReport({ immediate = false } = { immediate: false }) {
  const vm = getCurrentInstance();
  const pm = Permission.getUserPermission("reports");

  const hasViewPermission =
    Permission.hasAdminRole() || (isObject(pm) ? pm.create : false);

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
        key: "created_by",
        label: vm.proxy.$t("the_creator"),
        formatter(createdBy) {
          let name = "";
          if (isNUNEZ(createdBy.last_name)) {
            name += createdBy.last_name;
          }

          if (isNUNEZ(createdBy.first_name)) {
            name += " " + createdBy.first_name;
          }

          if (isNUNEZ(createdBy.second_name)) {
            name += " " + createdBy.second_name;
          }

          return name.trim();
        },
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
  const retryingFileId = ref(null);

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

  function injectObserverRef(objRef) {
    vObserverRef.value = objRef;
  }

  function formatDate(dm) {
    return dm.split("-").reverse().join(".");
  }

  function openModal() {
    if (hasViewPermission) {
      downloadModalRef.value.openModal();
    }
  }

  function closeModal() {
    downloadModalRef.value.closeModal();
    vObserverRef.value.reset();
    reportForm.value = {
      dateFrom: null,
      dateTo: null,
      type: null,
    };
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

        await Promise.allSettled(reportsIds.map((id) => downloadFile(id))).then(
          async () => {
            await findAll({ showLoading: false });
          }
        );
      } else {
        const isAnyFailed = checkRsp.data.result.some(
          ({ status }) => status === "failed"
        );

        if (isAnyFailed) {
          const isCurrentFailed = checkRsp.data.result.findIndex((item) => {
            return item.id === retryingFileId.value && item.status === "failed";
          });

          if (isCurrentFailed !== -1) {
            retryingFileId.value = false;
            clearInterval(timer.value);
            timer.value = null;
          }

          await findAll();
        }
      }
    }, 3000);
  }

  async function findAll(
    { showLoading = true, filterParams = {} } = {
      showLoading: true,
      filterParams: {},
    }
  ) {
    try {
      if (showLoading) {
        startFetching();
      }

      const params = {
        page: pagination.value.current,
        limit: pagination.value.perPage,
      };

      if (keys(filterParams).length) {
        params.filter_params = filterParams;
      }

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

  async function retryToDownloadFile(item) {
    try {
      retryingFileId.value = item.id;
      await v3ServiceApi.reports.retryFailedReport({
        id: item.id,
      });
      await findAll({ showLoading: false });
    } catch (e) {
      retryingFileId.value = false;
    } finally {
      retryingFileId.value = item.id;
    }
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

  if (immediate) {
    findAll({});
  }

  onBeforeRouteLeave((to, from, next) => {
    clearInterval(timer.value);
    timer.value = null;
    next();
  });

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
    retryingFileId,
    hasViewPermission,

    countOfItems,
    showPaginationComp,

    injectObserverRef,
    closeModal,
    openModal,
    findAll,
    downloadReportFile,
    changeCurrentPage,
    downloadFile,
    retryToDownloadFile,
  };
}
