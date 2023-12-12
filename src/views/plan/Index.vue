<script>
import {computed, getCurrentInstance, ref} from "vue";
import {formatToPrice} from "@/util/reusable";
import {v3ServiceApi} from "@/services/v3/v3.service";
import {dateFormatWithDot} from "@/util/date/calendar.util";
import {useToastError} from "@/composables/useToastError";
import SettingsPermission from "@/permission/settings.permission";

import {XButton} from "@/components/ui-components/button";
import {XIcon} from "@/components/ui-components/material-icons";
import {XCircularBackground} from "@/components/ui-components/circular-background";
import AppHeader from "@/components/Header/AppHeader.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import PlanPagination from "@/views/plan/components/PlanPagination.vue";
import PlanUpsert from "@/views/plan/components/PlanUpsert.vue";
import PlanFilter from "@/views/plan/components/PlanFilter.vue";

export default {
  name: "AppPlan",
  components: {
    XIcon,
    XButton,
    AppHeader,
    BaseLoading,
    XCircularBackground,
    PlanUpsert,
    PlanPagination,
    PlanFilter,
  },
  setup() {
    const vm = getCurrentInstance().proxy
    const {toastError} = useToastError()
    const upsertType = ref('create')
    const editStorage = ref(false)
    const showCreateModal = ref(false)
    const pagination = ref({
      current: 1,
      previous: 0,
      next: 0,
      perPage: 10,
      totalPage: 0,
      totalItem: 0,
    })
    const tableData = ref({
      items: [],
      loading: false,
    })
    const planTypes = ref([])
    const permission = {
      view: SettingsPermission.getPermission("plan.view"),
      create: SettingsPermission.getPermission("plan.create"),
      edit: SettingsPermission.getPermission("plan.edit"),
      delete: SettingsPermission.getPermission("plan.delete"),
    }
    const filterParamsList = ref([])

    const tableFields = computed(() => {
      return [
        {
          key: "index",
          label: "#",
        },
        {
          key: "date_from",
          label: vm.$t("from_the_date_of"),
          formatter: dateFormatter
        },
        {
          key: "date_to",
          label: vm.$t("to_the_date_of"),
          formatter: dateFormatter
        },
        {
          key: "amount",
          label: vm.$t("plan_amount"),
          formatter: (price) => formatToPrice(price) + " " + vm.$t("ye"),
        },
        {
          key: "type",
          label: vm.$t("plan_type"),
          formatter: (type) => type.name[vm.$i18n.locale],
        },
        {
          key: "actions",
          label: "",
        },
      ]
    })

    const showPagination = computed(() => {
      return !tableData.value.loading && pagination.value.totalItem
    })

    function dateFormatter(date) {
      return dateFormatWithDot(date, {reverse: false, monthIndex: 1})
    }

    function startLoading() {
      tableData.value.loading = true;
    }

    function finishLoading() {
      tableData.value.loading = false;
    }

    async function findAll({page = null, perPage = null, filter = {}}) {
      try {
        startLoading();
        const response = await v3ServiceApi.plan.findAll({
          ...filter,
          page: page ?? pagination.value.current,
          limit: perPage ?? pagination.value.perPage
        });
        tableData.value.items = response.data.result;
        pagination.value = response.data.pagination;
      } catch (e) {
        toastError(e)
      } finally {
        finishLoading();
      }
    }

    function createClientType() {
      setUpsertType("create");
      openCreatingClientTypeModal();
    }

    function setUpsertType(eType) {
      if (["create", "edit"].includes(eType)) {
        upsertType.value = eType;
      }
    }

    function openCreatingClientTypeModal() {
      showCreateModal.value = true;
    }

    function closeCreatingClientTypeModal() {
      showCreateModal.value = false;
    }

    function clientTypeCreated() {
      closeCreatingClientTypeModal();
      findAll({});
    }

    async function deleteTrigger(id) {
      vm.$swal({
        title: vm.$t("sweetAlert.title"),
        text: vm.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: vm.$t("cancel"),
        confirmButtonText: vm.$t("sweetAlert.yes"),
      }).then(async (result) => {
        if (result.value) {
          try {
            startLoading();
            await v3ServiceApi.plan.remove({id});
            await findAll({})
          } catch (e) {
            toastError(e)
          } finally {
            finishLoading();
          }
        }
      });
    }

    async function editTrigger(id) {
      try {
        startLoading();
        const {
          data: {result},
        } = await v3ServiceApi.plan.findOne({id});
        editStorage.value = result;
        this.setUpsertType("edit");
        this.openCreatingClientTypeModal();
      } catch (e) {
        toastError(e)
      } finally {
        finishLoading();
      }
    }

    async function fetchPlanTypeList() {
      try {
        const response = await v3ServiceApi.plan.types()
        const resultEntries = Object.entries(response.data.result)
        for (let [key, value] of resultEntries) {
          planTypes.value.push({
            value: value.type,
            text: value.name
          })
        }
      } catch (e) {
        toastError(e)
      }
    }

    function paginationChange({page, perPage}) {
      findAll({
        page,
        perPage
      })
    }

    async function fetchFilterParams() {
      try {
        const {data: {result}} = await v3ServiceApi.plan.filterParams({
          page: 1,
          limit: 150
        })

        const monthsInNumber = {
          "Jan": 0,
          "Feb": 1,
          "Mar": 2,
          "Apr": 3,
          "May": 4,
          "Jun": 5,
          "Jul": 6,
          "Aug": 7,
          "Sep": 8,
          "Oct": 9,
          "Nov": 10,
          "Dec": 11,
        }

        filterParamsList.value = result.map((item) => {
          return {
            name: item.name,
            result: item.result.map((month) => ({
              text: monthsInNumber[month],
              value: monthsInNumber[month]
            }))
          }
        })
      } catch (e) {
        toastError(e)
      }
    }

    function filterTable(filterObj) {
      findAll({
        page: 1,
        filter: filterObj,
      })
    }

    async function fetchItems() {
      await Promise.allSettled([
        fetchFilterParams(),
        findAll({}),
        fetchPlanTypeList()
      ])
    }

    fetchItems()

    return {
      upsertType,
      editStorage,
      showCreateModal,
      tableData,
      permission,
      tableFields,
      pagination,
      showPagination,
      planTypes,
      filterParamsList,

      findAll,
      editTrigger,
      deleteTrigger,
      setUpsertType,
      paginationChange,
      createClientType,
      clientTypeCreated,
      filterTable,
      openCreatingClientTypeModal,
      closeCreatingClientTypeModal,
    }
  },
};
</script>

<template>
  <div class="app-settings-client-type">
    <app-header>
      <template #header-title>
        {{ $t('plan.title') }}
      </template>

      <template #header-actions>
        <x-button
            v-if="permission.create"
            variant="secondary"
            text="add"
            :bilingual="true"
            @click="createClientType"
        >
          <template #left-icon>
            <x-icon name="add" class="violet-600"/>
          </template>
        </x-button>
      </template>
    </app-header>

    <plan-filter
        :plan-types="planTypes"
        :params-list="filterParamsList"
        @filter="filterTable"
    />

    <b-table
        id="my-table"
        ref="apartment-list-table"
        thead-tr-class="row__head__bottom-border"
        tbody-tr-class="row__body__bottom-border"
        class="table__list"
        sticky-header
        borderless
        show-empty
        responsive
        sort-icon-left
        :items="tableData.items"
        :fields="tableFields"
        :busy="tableData.loading"
        :empty-text="$t('no_data')"
    >
      <template #table-busy>
        <base-loading/>
      </template>

      <template #empty="scope">
        <span class="d-flex justify-content-center align-items-center">
          {{ scope["emptyText"] }}
        </span>
      </template>

      <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

      <template #cell(actions)="{ item }">
        <div class="float-right d-flex x-gap-1 cursor-pointer">
          <x-circular-background
              v-if="permission.edit"
              @click="editTrigger(item.id)"
              class="bg-violet-600"
          >
            <x-icon name="edit" class="color-white"/>
          </x-circular-background>

          <x-circular-background
              v-if="permission.delete"
              @click="deleteTrigger(item.id)"
              class="bg-red-600"
          >
            <x-icon name="delete" class="color-white"/>
          </x-circular-background>
        </div>
      </template>
    </b-table>

    <plan-pagination
        v-if="showPagination"
        :current="pagination.current"
        :total="pagination.totalPage"
        :per-page="pagination.perPage"
        @change="paginationChange"
    />

    <plan-upsert
        v-if="showCreateModal"
        :upsert-type="upsertType"
        :edit-item="editStorage"
        :plan-types="planTypes"
        @created="clientTypeCreated"
        @close-creating-modal="closeCreatingClientTypeModal"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";
</style>
