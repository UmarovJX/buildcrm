<script>
import { v3ServiceApi } from "@/services/v3/v3.service";
import SettingsPermission from "@/permission/settings.permission";
import { XButton } from "@/components/ui-components/button";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import SettingsCreateStatus from "@/views/settings/components/SettingsCreateStatus.vue";

export default {
  name: "SettingsStatuses",
  components: {
    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
    SettingsCreateStatus,
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
        view: SettingsPermission.getPermission("statuses.view"),
        create: SettingsPermission.getPermission("statuses.create"),
        edit: SettingsPermission.getPermission("statuses.edit"),
        delete: SettingsPermission.getPermission("statuses.delete"),
      },
    };
  },
  computed: {
    tableFields() {
      return [
        {
          key: "title",
          label: this.$t("title"),
          formatter: (name) => name[this.$i18n.locale],
        },
        {
          key: "type",
          label: this.$t("type"),
          formatter: (type) => type,
        },
        {
          key: "color",
          label: this.$t("color"),
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
        const response = await v3ServiceApi.statuses().findAll({
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
            await v3ServiceApi.statuses().remove({
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
        } = await v3ServiceApi.statuses().findOne({ id });
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
        {{ $t("statuses.title") }}
      </h3>
      <x-button
        v-if="permission.create"
        variant="secondary"
        text="statuses.add"
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

      <template #cell(color)="{ item }">
        <span
          style="
            display: inline-flex;
            height: 40px;
            padding: 0 20px;
            justify-content: center;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
            color: white;
            border-radius: 28px;
          "
          :style="{
            'background-color': item.color,
            color: item.color === '#ffffff' ? '#000000' : '#ffffff',
          }"
        >
          {{ item.color }}
        </span>
      </template>

      <template #cell(is_vip)="{ item }">
        <span
          v-if="item['is_vip']"
          class="border-radius-2 background-violet-100 violet-600 vip-status"
          >V.I.P</span
        >
        <span v-else>{{ $t("normal_client") }}</span>
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

    <settings-create-status
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
