<script>
import api from "@/services/api";
import SettingsPermission from "@/permission/settings.permission";
import { XButton } from "@/components/ui-components/button";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import SettingsCreateLanguage from "@/views/settings/components/SettingsCreateLanguage.vue";

export default {
  name: "SettingsLanguages",
  components: {
    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
    SettingsCreateLanguage,
  },
  data() {
    return {
      upsertType: "create",
      showCreateModal: false,
      editStorage: {},
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
        view: SettingsPermission.getPermission("languages.view"),
        create: SettingsPermission.getPermission("languages.create"),
        edit: SettingsPermission.getPermission("languages.edit"),
        delete: SettingsPermission.getPermission("languages.delete"),
      },
    };
  },
  computed: {
    tableFields() {
      const fields = [
        {
          key: "name",
          label: this.$t("title"),
        },
        {
          key: "is_default",
          label: this.$t("is_default"),
          formatter: (type) => type,
        },
        {
          key: "is_published",
          label: this.$t("is_published"),
        },
      ];
      if (this.permission.edit) {
        fields.push({
          key: "actions",
          label: this.$t("actions"),
          class: "float-right",
        });
      }
      return fields;
    },
  },
  created() {
    this.fetchItems();
  },
  methods: {
    startLoading() {
      this.table.loading = true;
    },
    finishLoading() {
      this.table.loading = false;
    },
    createClientType() {
      this.setUpsertType("create");
      this.openCreatingClientTypeModal();
    },
    async fetchItems() {
      try {
        this.startLoading();
        const response = await api.languagesV3.getLanguages({
          page: 1,
          limit: 100,
        });
        this.table.items = response.data.result;
        this.table.pagination = response.data.pagination;
      } catch (e) {
        this.toastedWithErrorCode(e);
      } finally {
        this.finishLoading();
      }
    },
    setUpsertType(eType) {
      if (["create", "edit"].includes(eType)) {
        this.upsertType = eType;
      }
    },
    openCreatingClientTypeModal() {
      this.showCreateModal = true;
    },
    closeCreatingClientTypeModal() {
      this.showCreateModal = false;
    },
    clientTypeCreated() {
      this.closeCreatingClientTypeModal();
      this.fetchItems();
    },
    async deleteClientType(typeId) {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text"),
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      }).then(async (result) => {
        if (result.value) {
          try {
            this.startLoading();
            await api.languagesV3.removeLanguage({
              id: typeId,
            });
            await this.fetchItems();
          } catch (e) {
            this.toastedWithErrorCode(e);
          } finally {
            this.finishLoading();
          }
        }
      });
    },
    async editLanguage(item) {
      try {
        this.editStorage = item;
        this.setUpsertType("edit");
        this.openCreatingClientTypeModal();
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
  },
};
</script>

<template>
  <div class="app-settings-client-type">
    <!-- TODO: CLIENT TYPES TABLE   -->
    <div class="d-flex justify-content-between mb-4">
      <h3
        class="x-font-size-1p5 font-craftworksans color-gray-400 d-flex align-items-center"
      >
        {{ $t("languages") }}
      </h3>
      <x-button
        v-if="permission.create"
        variant="secondary"
        text="AddLanguage"
        :bilingual="true"
        @click="createClientType"
      >
        <template #left-icon>
          <x-icon name="add" class="violet-600" />
        </template>
      </x-button>
    </div>

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
      <template #cell(is_default)="{ item }">
        <div v-if="item.is_default" class="d-flex x-gap-1 cursor-pointer">
          <x-circular-background class="bg-violet-600">
            <x-icon name="check" class="color-white" />
          </x-circular-background>
        </div>
      </template>
      <template #cell(is_published)="{ item }">
        <div v-if="item.is_published" class="d-flex x-gap-1 cursor-pointer">
          <x-circular-background class="bg-violet-600">
            <x-icon name="check" class="color-white" />
          </x-circular-background>
        </div>
      </template>

      <template #cell(actions)="{ item }">
        <div class="float-right d-flex x-gap-1 cursor-pointer">
          <x-circular-background
            v-if="permission.edit"
            @click="editLanguage(item)"
            class="bg-violet-600"
          >
            <x-icon name="edit" class="color-white" />
          </x-circular-background>

          <x-circular-background
            v-if="permission.delete"
            @click="deleteClientType(item.id)"
            class="bg-red-600"
          >
            <x-icon name="delete" class="color-white" />
          </x-circular-background>
        </div>
      </template>
    </b-table>

    <settings-create-language
      v-if="showCreateModal"
      :upsert-type="upsertType"
      :edit-item="editStorage"
      @close-creating-modal="closeCreatingClientTypeModal"
      @client-type-created="clientTypeCreated"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";
@import "@/views/settings/assets/crudTable.scss";
</style>
