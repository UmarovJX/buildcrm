<script>
import { computed, getCurrentInstance, ref } from 'vue'
import { v3ServiceApi } from '@/services/v3/v3.service'
import { useToastError } from '@/composables/useToastError'
import SettingsPermission from '@/permission/settings.permission'

import { XButton } from '@/components/ui-components/button'
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'
import AppHeader from '@/components/Header/AppHeader.vue'
import BaseLoading from '@/components/Reusable/BaseLoading.vue'
import PlanPagination from '@/views/plan/components/PlanPagination.vue'
import PlanUpsert from '@/views/plan/components/PlanUpsert.vue'
import PlanFilter from '@/views/plan/components/PlanFilter.vue'

import GroupUpsert from '@/views/settings/views/permission-group/components/GroupUpsert.vue'
import GroupTable from '@/views/settings/views/permission-group/components/GroupTable.vue'
import GroupTree from '@/views/settings/views/permission-group/components/GroupTree.vue'
import PermissionUpsert from '@/views/settings/views/permission-group/components/PermissionUpsert.vue'
import XPagination from '@/components/ui-components/pagination/XPagination.vue'
import { usePermissionUpsert } from '@/views/settings/views/permission-group/usePermissionUpsert'

export default {
  name: 'PermissionGroup',
  components: {
    XIcon,
    XButton,
    AppHeader,
    BaseLoading,
    XCircularBackground,
    PlanUpsert,
    PlanPagination,
    PlanFilter,

    GroupTable,
    GroupTree,
    GroupUpsert,
    XPagination,
    PermissionUpsert,
  },
  setup() {
    const vm = getCurrentInstance().proxy
    const { toastError } = useToastError()

    const {
      showModal: pmsShowModal,
      upsertType: pmsUpsertType,
      editItem: pmsEditItem,
      openModal: pmsOpenModal,
      closeModal: pmsCloseModal,
      create: pmsCreate,
      edit: pmsEdit,
      deleteItem: pmsDeleteItem,
    } = usePermissionUpsert()

    const upsertType = ref('create')
    const editStorage = ref(false)
    const showCreateModal = ref(false)
    const pagination = ref({
      current: 1,
      previous: 0,
      next: 0,
      perPage: 200,
      totalPage: 0,
      totalItem: 0,
    })

    const tableData = ref({
      items: [],
      loading: false,
    })
    const tableItems = ref([])
    const permission = {
      view: SettingsPermission.getPermission('plan.view'),
      create: SettingsPermission.getPermission('plan.create'),
      edit: SettingsPermission.getPermission('plan.edit'),
      delete: SettingsPermission.getPermission('plan.delete'),
    }
    const showPagination = computed(() => !tableData.value.loading && pagination.value.totalItem)

    function startLoading() {
      tableData.value.loading = true
    }

    function finishLoading() {
      tableData.value.loading = false
    }

    function findTreeElement(arr, target, path = '') {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        const newPath = `${path}.${i}`
        if (element.id === target) {
          return { element, path: newPath }
        } if (element.children.length) {
          const result = findTreeElement(element.children, target, newPath)
          if (result) return result
        }
      }
      return null
    }

    function activateFirstItem() {
      const result = findTreeElement(tableData.value.items, parseInt(vm.$route.query.tree))
      console.log('result', result)
      if (result) {
        tableItems.value = result.element.permissions
      } else if (tableData.value.items.length) {
        tableItems.value = tableData.value.items[0].permissions
        vm.$router.push({
          query: {
            tree: tableData.value.items[0].id,
          },
        })
      }
    }

    async function findAll({ page = null, perPage = null }) {
      try {
        startLoading()
        const response = await v3ServiceApi.permission.group.index({
          page: page ?? pagination.value.current,
          limit: perPage ?? pagination.value.perPage,
        })
        tableData.value.items = response.data.result
        pagination.value = response.data.pagination
        activateFirstItem()
      } catch (e) {
        toastError(e)
      } finally {
        finishLoading()
      }
    }

    function createClientType() {
      setUpsertType('create')
      openCreatingClientTypeModal()
    }

    function setUpsertType(eType) {
      if (['create', 'edit'].includes(eType)) {
        upsertType.value = eType
      }
    }

    function openCreatingClientTypeModal() {
      showCreateModal.value = true
    }

    function closeCreatingClientTypeModal() {
      showCreateModal.value = false
    }

    function clientTypeCreated() {
      closeCreatingClientTypeModal()
      findAll({})
    }

    async function deleteTrigger() {
      vm.$swal({
        title: vm.$t('sweetAlert.title'),
        text: vm.$t('sweetAlert.text'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: vm.$t('cancel'),
        confirmButtonText: vm.$t('sweetAlert.yes'),
      }).then(async result => {
        if (result.value) {
          try {
            startLoading()
            await v3ServiceApi.permission.group.remove({ id: vm.$route.query.tree })
            await findAll({})
          } catch (e) {
            toastError(e)
          } finally {
            finishLoading()
          }
        }
      })
    }

    async function editTrigger() {
      try {
        startLoading()
        const {
          data: { result },
        } = await v3ServiceApi.permission.group.show({ id: vm.$route.query.tree })
        editStorage.value = result
        setUpsertType('edit')
        openCreatingClientTypeModal()
      } catch (e) {
        toastError(e)
      } finally {
        finishLoading()
      }
    }

    function paginationChange({ page, perPage }) {
      findAll({
        page,
        perPage,
      })
    }

    function showGroupPermission(item) {
      tableItems.value = item.permissions
    }

    function pmsCreated() {
      pmsCloseModal()
      findAll({})
    }

    async function pmsEditTrigger(item) {
      try {
        startLoading()
        await pmsEdit(item)
        await findAll({})
      } finally {
        finishLoading()
      }
    }

    async function pmsDeleteTrigger(item) {
      try {
        startLoading()
        await pmsDeleteItem(item)
        await findAll({})
      } finally {
        finishLoading()
      }
    }

    async function fetchItems() {
      await Promise.allSettled([
        findAll({}),
      ])
    }

    fetchItems()

    return {
      pmsShowModal,
      pmsUpsertType,
      pmsEditItem,
      pmsOpenModal,
      pmsCloseModal,
      pmsCreate,
      pmsCreated,

      upsertType,
      editStorage,
      showCreateModal,
      tableData,
      permission,
      pagination,
      showPagination,
      tableItems,

      findAll,
      editTrigger,
      deleteTrigger,
      setUpsertType,
      paginationChange,
      createClientType,
      clientTypeCreated,
      openCreatingClientTypeModal,
      closeCreatingClientTypeModal,
      showGroupPermission,
      pmsEditTrigger,
      pmsDeleteTrigger,
      findTreeElement,
    }
  },
}
</script>

<template>
  <div class="app-settings-client-type">
    <section>
      <x-button
        variant="secondary"
        text="common.add_group"
        :bilingual="true"
        @click="createClientType"
      >
        <template #left-icon>
          <x-icon
            name="add"
            class="violet-600"
          />
        </template>
      </x-button>
    </section>

    <section class="d-flex x-gap-2">
      <div class="group__tree__section mt-4">
        <b-skeleton-wrapper
          :loading="tableData.loading"
          class="w-100"
        >
          <template #loading>
            <b-skeleton width="85%" />
            <b-skeleton width="55%" />
            <b-skeleton width="70%" />
            <b-skeleton width="35%" />
            <b-skeleton width="75%" />
            <b-skeleton width="95%" />
            <b-skeleton width="75%" />
            <b-skeleton width="55%" />
            <b-skeleton width="85%" />
            <b-skeleton width="85%" />
            <b-skeleton width="55%" />
            <b-skeleton width="70%" />
            <b-skeleton width="35%" />
            <b-skeleton width="75%" />
            <b-skeleton width="95%" />
            <b-skeleton width="75%" />
            <b-skeleton width="55%" />
            <b-skeleton width="85%" />
          </template>

          <group-tree
            v-for="item in tableData.items"
            :key="item.id"
            :item="item"
            @show="showGroupPermission"
          />
        </b-skeleton-wrapper>
      </div>

      <div class="mt-4 w-100">
        <div class="d-flex justify-content-end x-gap-1">
          <x-button
            variant="secondary"
            text="edit"
            :bilingual="true"
            @click="editTrigger"
          >
            <template #left-icon>
              <x-icon
                name="draw"
                class="violet-600"
              />
            </template>
          </x-button>
          <x-button
            variant="secondary"
            text="delete"
            :bilingual="true"
            class="red-600"
            @click="deleteTrigger"
          >
            <template #left-icon>
              <x-icon
                name="delete"
                class="red-600"
              />
            </template>
          </x-button>
          <x-button
            variant="secondary"
            text="common.add_permission"
            :bilingual="true"
            @click="pmsCreate"
          >
            <template #left-icon>
              <x-icon
                name="add"
                class="violet-600"
              />
            </template>
          </x-button>
        </div>
        <group-table
          class="mt-2"
          :busy="tableData.loading"
          :items="tableItems"
          @edit="pmsEditTrigger"
          @delete="pmsDeleteTrigger"
        />
      </div>
    </section>

    <group-upsert
      v-if="showCreateModal"
      :upsert-type="upsertType"
      :edit-item="editStorage"
      @created="clientTypeCreated"
      @close-creating-modal="closeCreatingClientTypeModal"
    />

    <permission-upsert
      v-if="pmsShowModal"
      :upsert-type="pmsUpsertType"
      :edit-item="pmsEditItem"
      @created="pmsCreated"
      @close-creating-modal="pmsCloseModal"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign";

.group__tree__section {
  background-color: var(--gray-200);
  width: fit-content;
  border-radius: 2rem;
  padding: 1rem 2rem;
  min-width: 20rem;
}
</style>
