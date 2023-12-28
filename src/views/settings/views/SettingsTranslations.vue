<script>
import api from '@/services/api'
import SettingsPermission from '@/permission/settings.permission'
import { XButton } from '@/components/ui-components/button'
import BaseLoading from '@/components/Reusable/BaseLoading.vue'
import { XIcon } from '@/components/ui-components/material-icons'
import { XCircularBackground } from '@/components/ui-components/circular-background'
import SettingsCreateTranslation from '@/views/settings/components/SettingsCreateTranslation.vue'
import BaseTabPicker from '@/components/Reusable/BaseTabPicker.vue'
import { XFormInput } from '@/components/ui-components/form-input'
import SettingsUpdateTranslationTags from '@/views/settings/components/SettingsUpdateTranslationTags.vue'
import BaseButton from '@/components/Reusable/BaseButton'
import BaseArrowLeftIcon from '@/components/icons/BaseArrowLeftIcon'
import BaseArrowRightIcon from '@/components/icons/BaseArrowRightIcon'

export default {
  name: 'SettingsStatuses',
  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    BaseButton,
    SettingsUpdateTranslationTags,
    XFormInput,
    BaseTabPicker,
    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
    SettingsCreateTranslation,
  },
  data() {
    return {
      showByValue: 100,
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
        view: SettingsPermission.getPermission('translations.view'),
        create: SettingsPermission.getPermission('translations.create'),
        edit: SettingsPermission.getPermission('translations.edit'),
        delete: SettingsPermission.getPermission('translations.delete'),
      },
    }
  },
  computed: {
    tableFields() {
      const fields = [
        {
          key: 'key',
          label: this.$t('key'),
          class: 'wwwww',
        },
        {
          key: 'tags',
          label: 'tags',
          thStyle: 'width: 200px',
        },
        { key: `value.${this.currentLang}`, label: 'Translation' },
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
  created() {
    api.languagesV3.getAllLanguages().then(res => {
      this.allLangs.push(...res.data.result)
      this.currentLang = this.allLangs[0]
    })
    this.fetchItems()
  },
  methods: {
    saveAllTranslations() {
      this.table.loading = true
      api.translationsV3
        .bulkSave({ items: this.table.items })
        .then(() => {
          this.$toasted.show('All translations were succesfully updated', {
            type: 'success',
          })
          this.fetchItems()
        })
        .catch(() => {
          this.toastedWithErrorCode(
            'Somewthing went wrong on updating records',
          )
          this.table.loading = false
        })
    },
    changeFetchLimit() {
      const query = {
        ...this.query,
        page: this.query.page || 1,
      }
      const limit = this.showByValue
      this.pushRouter({ ...query, limit })
    },

    changeCurrentPage(page) {
      const currentPage = this.query.page
      if (page === currentPage) return
      this.replaceRouter({ ...this.query, page })
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
    createTranslation() {
      this.setUpsertType('create')
      this.openTranslationCreationModal()
    },
    async fetchItems() {
      try {
        this.startLoading()
        const response = await api.translationsV3.getTranslations({
          page: 1,
          limit: this.showByValue,
        })
        this.table.items = response.data.result.map(el => ({
          ...el,
          loading: false,
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
    openTranslationCreationModal() {
      this.showCreateModal = true
    },
    closeTranslationCreationModal() {
      this.showCreateModal = false
    },
    openEditTagsModal() {
      this.showEditTagModal = true
    },
    closeEditTagsModal() {
      this.showEditTagModal = false
    },

    translationCreated() {
      this.closeTranslationCreationModal()
      this.fetchItems()
    },
    tagsUpdated() {
      this.closeEditTagsModal()
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
            await api.translationsV3.removeTranslation({
              id: typeId,
            })
            await this.fetchItems()
          } catch (e) {
            this.toastedWithErrorCode(e)
          } finally {
            this.finishLoading()
          }
        }
      })
    },
    updateTags(item) {
      this.editTags = item
      this.showEditTagModal = true
    },
    async saveTranslation(i) {
      const item = this.table.items[i]
      if (item.loading) return console.log('fast')
      const d = {
        id: item.id,
        key: item.key,
        value: item.value,
        tags: item.tags,
      }
      item.loading = true
      api.translationsV3
        .updateTranslation(d)
        .then(() => this.$toasted.show(
          `Translation for key "${this.table.items[i].key}" succesfully updated`,
          {
            type: 'success',
          },
        ))
        .catch(err => this.toastedWithErrorCode(err))
        .finally(() => (item.loading = false))
    },
  },
}
</script>

<template>
  <div
    v-if="permission.view"
    class="app-settings-client-type"
  >
    <!-- TODO: CLIENT TYPES TABLE   -->
    <div class="d-flex justify-content-between mb-4">
      <!-- <h3
        class="x-font-size-1p5 font-craftworksans color-gray-400 d-flex align-items-center"
      >
        {{ $t("translations") }}
      </h3> -->
      <base-tab-picker
        :options="allLangs"
        no-all
        :current="currentLang"
        @tab-selected="setTab"
      />
      <x-button
        v-if="permission.create"
        variant="secondary"
        text="Add translation"
        :bilingual="true"
        @click="createTranslation"
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

      <template #cell(tags)="{ item }">
        <div
          class="d-flex align-items-center"
          title="Edit Tags"
        >
          <div class="mr-1 cursor-pointer">
            <x-circular-background
              v-if="permission.edit"
              class="bg-violet-600"
              @click="updateTags(item)"
            >
              <x-icon
                name="edit"
                class="color-white"
              />
            </x-circular-background>
          </div>
          <div>
            <div
              v-for="tag in item.tags"
              :key="tag"
              class="tag"
            >
              <span
                class="border-radius-2 background-violet-100 violet-600 translation-tag"
              >{{ tag }}</span>
            </div>
          </div>
        </div>
      </template>
      <template #[`cell(value.${currentLang})`]="{ item, index }">
        <div class="d-flex align-items-center">
          <x-form-input
            v-model="table.items[index].value[currentLang]"
            :readonly="!permission.edit"
            type="text"
            :placeholder="item.key"
            class="w-100"
          />
        </div>
      </template>

      <template #cell(actions)="{ item, index }">
        <div class="float-right d-flex x-gap-1 cursor-pointer flex-column">
          <div
            :style="item.loading ? 'opacity: 0.5' : ''"
            title="save"
          >
            <x-circular-background
              v-if="permission.edit"
              class="bg-violet-600"
              @click="saveTranslation(index)"
            >
              <x-icon
                name="save"
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
        v-if="!table.loading && table.pagination.totalPage"
        :page-count="table.pagination.totalPage"
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
      <base-button
        v-if="permission.edit"
        class="float-right"
        design="violet-gradient px-5"
        :text="$t('Save All')"
        @click="saveAllTranslations"
      />
    </div>
    <settings-update-translation-tags
      v-if="showEditTagModal"
      :edit-item="editTags"
      @close-modal="closeEditTagsModal"
      @tags-updated="tagsUpdated"
    />

    <settings-create-translation
      v-if="showCreateModal"
      :all-languages="allLangs"
      :upsert-type="upsertType"
      :edit-item="editStorage"
      @close-creating-modal="closeTranslationCreationModal"
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
