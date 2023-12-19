<script>
import api from '@/services/api'
import SettingsPermission from '@/permission/settings.permission'
import { XButton } from '@/components/ui-components/button'
import BaseLoading from '@/components/Reusable/BaseLoading.vue'
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'
import SettingsCreateVersion from '@/views/settings/components/SettingsCreateVersion.vue'

import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon'
import BaseArrowRightIcon from '@/components/icons/BaseArrowRightIcon'

export default {
  name: 'SettingsVersions',
  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon,

    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
    SettingsCreateVersion,
  },
  data() {
    return {
      showByValue: 10,
      allLangs: [],
      pagination: {},
      currentLang: '',
      upsertType: 'create',
      showCreateModal: false,
      showEditTagModal: false,
      editStorage: {},
      editTags: {},
      table: {
        items: [],
        pagination: {
          current: 1,
          previous: 0,
          next: 0,
          perPage: 10,
          totalPage: 0,
          totalItem: 0,
        },
        loading: false,
      },
      permission: {
        view: SettingsPermission.getPermission('versions.view'),
        create: SettingsPermission.getPermission('versions.create'),
        edit: SettingsPermission.getPermission('versions.edit'),
        delete: SettingsPermission.getPermission('versions.delete'),
      },
    }
  },
  computed: {
    query() {
      return this.$route.query
    },
    tableFields() {
      const fields = [
        {
          key: 'id',
          label: this.$t('id'),
        },
        {
          key: 'version',
          label: this.$t('version'),
        },
        {
          key: 'published',
          label: this.$t('published'),
        },
        {
          key: 'created_at',
          label: this.$t('created_at'),
        },
        // {
        //   key: "tags",
        //   label: "tags",
        //   thStyle: "width: 200px",
        // },
      ]
      if (this.permission.edit) {
        fields.push({
          key: 'actions',
          label: '',
          thStyle: 'width: 100px',
        })
      }
      return fields
    },
  },
  watch: {
    query() {
      this.fetchItems()
    },
  },
  created() {
    api.languagesV3.getAllLanguages().then(res => {
      this.allLangs.push(...res.data.result)
      this.currentLang = this.allLangs[0]
    })
    this.fetchItems()
  },
  methods: {
    changeFetchLimit() {
      const query = {
        ...this.query,
        page: this.query.page || 1,
      }
      const limit = this.showByValue
      this.$router.replace({ query: { ...query, limit } })
    },

    changeCurrentPage(page) {
      const currentPage = this.query.page
      if (page === currentPage) return
      this.$router.replace({ query: { ...this.query, page } })
    },
    setTab(e) {
      this.currentLang = e
    },
    startLoading() {
      this.table.loading = true
    },
    finishLoading() {
      this.table.loading = false
    },
    createVersion() {
      this.setUpsertType('create')
      this.openVersionCreationModal()
    },
    async fetchItems() {
      try {
        this.startLoading()
        const response = await api.settings.getVersionList({
          page: this.query.page || 1,
          limit: this.query.limit || this.showByValue,
        })
        this.table.items = response.data.items.map(el => ({
          ...el,
        }))
        this.table.pagination = response.data.pagination
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.finishLoading()
      }
    },
    setUpsertType(eType) {
      if (['create', 'edit'].includes(eType)) {
        this.upsertType = eType
      }
    },
    openVersionCreationModal() {
      this.showCreateModal = true
    },
    closeVersionCreationModal() {
      this.showCreateModal = false
    },

    translationCreated() {
      this.closeVersionCreationModal()
      this.fetchItems()
    },

    async deleteItem(typeId) {
      this.$swal({
        title: this.$t('sweetAlert.title'),
        text: this.$t('sweetAlert.text'),
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: this.$t('sweetAlert.yes'),
      }).then(async result => {
        if (result.value) {
          try {
            this.startLoading()
            await api.settings.deleteVersion(typeId)
            await this.fetchItems()
          } catch (e) {
            this.toastedWithErrorCode(e)
          } finally {
            this.finishLoading()
          }
        }
      })
    },

    async editVersion(item) {
      try {
        this.editStorage = item
        this.setUpsertType('edit')
        this.openVersionCreationModal()
      } catch (e) {
        this.toastedWithErrorCode(e)
      }
    },
  },
}
</script>

<template>
  <div class="app-settings-client-type">
    <!-- TODO: CLIENT TYPES TABLE   -->
    <div class="d-flex mb-4 justify-content-end">
      <!-- <h3
        class="x-font-size-1p5 font-craftworksans color-gray-400 d-flex align-items-center"
      >
        {{ $t("translations") }}
      </h3> -->

      <x-button
        v-if="permission.create"
        variant="secondary"
        text="Add Version"
        :bilingual="true"
        @click="createVersion"
      >
        <template #left-icon>
          <x-icon
            name="add"
            class="violet-600"
          />
        </template>
      </x-button>
    </div>

    <b-table
      id="my-table"
      ref="apartment-list-table"
      thead-tr-class="row__head__bottom-border"
      tbody-tr-class="row__body__bottom-border"
      class="table__list mt-5"
      sticky-header
      borderless
      show-empty
      responsive
      sort-icon-left
      :items="table.items"
      :fields="tableFields"
      :busy="table.loading"
      :empty-text="$t('no_data')"
    >
      <template #table-busy>
        <base-loading />
      </template>

      <template #empty="scope">
        <span class="d-flex justify-content-center align-items-center">
          {{ scope["emptyText"] }}
        </span>
      </template>

      <template #cell(published)="{ item }">
        <div
          v-if="item.published"
          class="d-flex x-gap-1 cursor-pointer"
        >
          <x-circular-background class="bg-violet-600">
            <x-icon
              name="check"
              class="color-white"
            />
          </x-circular-background>
        </div>
      </template>
      <template #cell(created_at)="{ item }">
        <div>{{ new Date(item.created_at).toLocaleDateString("ru") }}</div>
        <div>{{ new Date(item.created_at).toLocaleTimeString("ru") }}</div>
        <div />
      </template>

      <template #cell(actions)="{ item }">
        <div class="float-right d-flex x-gap-1 cursor-pointer">
          <div
            :style="item.loading ? 'opacity: 0.5' : ''"
            title="save"
          >
            <x-circular-background
              v-if="permission.delete"
              class="bg-red-600"
              @click="deleteItem(item.id)"
            >
              <x-icon
                name="delete"
                class="color-white"
              />
            </x-circular-background>
          </div>
          <div
            :style="item.loading ? 'opacity: 0.5' : ''"
            title="save"
          >
            <x-circular-background
              v-if="permission.edit"
              class="bg-violet-600"
              @click="editVersion(item)"
            >
              <x-icon
                name="edit"
                class="color-white"
              />
            </x-circular-background>
          </div>
        </div>
      </template>
    </b-table>
    <div class="pagination__vue">
      <!--   Pagination   -->
      <vue-paginate
        v-if="!table.loading && table.pagination.total"
        :page-count="table.pagination.total"
        :value="table.pagination.current"
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
      <!-- <div class="show__by">
        <x-form-select
          :label="false"
          :options="showByOptions"
          v-model="showByValue"
          @change="limitChanged"
        >
          <template #output-prefix>
            <span class="show-by-description">
              {{ $t("contracts.show_by") }}:
            </span>
          </template>
        </x-form-select>
      </div> -->
    </div>

    <settings-create-version
      v-if="showCreateModal"
      :all-langs="allLangs"
      :upsert-type="upsertType"
      :edit-item="editStorage"
      @close-creating-modal="closeVersionCreationModal"
      @client-type-created="translationCreated"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";

@import "@/assets/scss/utils/b-table-redesign.scss";
@import "@/views/settings/assets/crudTable.scss";
.translation-tag {
  padding: 6px 12px;
  &:not(:last-child) {
    margin-right: 5px;
  }
}
.row-opacity {
  opacity: 0.2;
}
.tag:not(:first-child) {
  margin-top: 10px;
}
</style>
