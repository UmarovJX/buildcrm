<script>
import { XButton } from "@/components/ui-components/button";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import SettingsCreateHolder from "@/views/settings/components/SettingsCreateHolder.vue";
import SettingsPermission from "@/permission/settings.permission";
import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "SettingsClientTypes",
  components: {
    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
    SettingsCreateHolder,
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
        view: SettingsPermission.getPermission("holders.view"),
        create: SettingsPermission.getPermission("holders.create"),
        edit: SettingsPermission.getPermission("holders.edit"),
        delete: SettingsPermission.getPermission("holders.delete"),
      },
    };
  },
  computed: {
    tableFields() {
      return [
        {
          key: "icon",
          label: "",
        },
        {
          key: "holder",
          label: this.$t("holders.singular"),
        },
        {
          key: "actions",
          label: this.$t("actions"),
          class: "float-right",
        },
      ];
    },
  },
  created() {
    this.fetchHolders();
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
    async fetchHolders() {
      try {
        this.startLoading();
        const response = await v3ServiceApi.holders().findAll({
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
      this.fetchHolders();
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
            await v3ServiceApi.holders().remove({
              id: typeId,
            });
            await this.fetchHolders();
          } catch (e) {
            this.toastedWithErrorCode(e);
          } finally {
            this.finishLoading();
          }
        }
      });
    },
    async editClientType(id) {
      try {
        this.startLoading();
        const {
          data: { result },
        } = await v3ServiceApi.holders().findOne({ id });
        this.editStorage = result;
        this.setUpsertType("edit");
        this.openCreatingClientTypeModal();
      } catch (e) {
        this.toastedWithErrorCode(e);
      } finally {
        this.finishLoading();
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
        {{ $t("holders.title") }}
      </h3>
      <x-button
        v-if="permission.create"
        variant="secondary"
        text="holders.add"
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

      <template #cell(holder)="{ item }">
        <span>
          {{ item.last_name }}
          {{ item.first_name }}
          {{ item.middle_name }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="float-right d-flex x-gap-1 cursor-pointer">
          <x-circular-background
            v-if="permission.edit"
            @click="editClientType(item.id)"
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

    <settings-create-holder
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
