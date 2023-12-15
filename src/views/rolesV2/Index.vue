<script>
import {computed, getCurrentInstance, ref} from "vue";
import {v3ServiceApi} from "@/services/v3/v3.service";
import {useLoading} from "@/composables/useLoading";
import {useToastError} from "@/composables/useToastError";


import {XButton} from "@/components/ui-components/button";
import {XIcon} from "@/components/ui-components/material-icons";
import {XCircularBackground} from "@/components/ui-components/circular-background";
import AppHeader from "@/components/Header/AppHeader.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import XPagination from "@/components/ui-components/pagination/XPagination.vue";
import RoleTable from "@/views/rolesV2/components/RoleTable.vue";

export default {
  name: "RolesV2",
  components: {
    XIcon,
    XButton,
    AppHeader,
    BaseLoading,
    XCircularBackground,
    XPagination,
    RoleTable
  },
  setup() {
    const vm = getCurrentInstance().proxy
    const {toastError} = useToastError()
    const {isFetching, startFetching, finishFetching} = useLoading()
    const pagination = ref({
      current: 1,
      previous: 0,
      next: 0,
      perPage: 10,
      totalPage: 0,
      totalItem: 0,
    })
    const items = ref([])
    const permission = {
      view: true,
      create: true,
      edit: true,
      delete: true,
    }

    const showPagination = computed(() => {
      return !isFetching.value && pagination.value.totalItem
    })

    async function findAll({page = null, perPage = null}) {
      try {
        startFetching()
        const response = await v3ServiceApi.role.index({
          page: page ?? pagination.value.current,
          limit: perPage ?? pagination.value.perPage
        });
        items.value = response.data.result;
        pagination.value = response.data.pagination;
      } catch (e) {
        toastError(e)
      } finally {
        finishFetching()
      }
    }

    async function editTrigger(id) {
      try {
        startFetching();
        const {
          data: {result},
        } = await v3ServiceApi.role.show({id});
        console.log(result)
      } catch (e) {
        toastError(e)
      } finally {
        finishFetching();
      }
    }

    function paginationChange({page, perPage}) {
      findAll({
        page,
        perPage
      })
    }

    function deleteItem(id) {
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
            startFetching();
            await v3ServiceApi.role.remove({id});
            await findAll({})
          } catch (e) {
            toastError(e)
          } finally {
            finishFetching();
          }
        }
      });
    }

    async function fetchItems() {
      await Promise.allSettled([
        findAll({}),
      ])
    }

    fetchItems()

    return {
      isFetching,
      items,
      permission,
      pagination,
      showPagination,

      findAll,
      editTrigger,
      deleteItem,
      paginationChange,
    }
  },
};
</script>

<template>
  <div class="app-settings-client-type">
    <app-header>
      <template #header-title>
        {{ $t('roles.title') }}
      </template>

      <template #header-actions>
        <x-button
            v-if="permission.create"
            variant="secondary"
            text="add"
            :bilingual="true"
            @click="$router.push({ name:'role-v2-create' })"
        >
          <template #left-icon>
            <x-icon name="add" class="violet-600"/>
          </template>
        </x-button>
      </template>
    </app-header>

    <role-table
        :items="items"
        :busy="isFetching"
        @delete="deleteItem"
    />

    <x-pagination
        v-if="showPagination"
        :current="pagination.current"
        :total="pagination.totalPage"
        :per-page="pagination.perPage"
        @change="paginationChange"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";
</style>
