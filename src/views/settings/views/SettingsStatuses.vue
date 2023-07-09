<script>
import api from "@/services/api";
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
      clientTypes: {
        items: [],
        loading: false,
      },
    };
  },
  computed: {
    clientTypeFields() {
      return [
        {
          key: "icon",
          label: "",
        },
        {
          key: "name",
          label: this.$t("title"),
          formatter: (name) => name[this.$i18n.locale],
        },
        {
          key: "is_vip",
          label: "V.I.P",
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
    this.fetchClientTypes();
  },
  methods: {
    createStatus() {
      this.setUpsertType("create");
      this.openCreatingStatusModal();
    },
    async fetchClientTypes() {
      try {
        const { data: items } = await api.settingsV2.getClientTypes();
        this.clientTypes.items = items;
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    setUpsertType(eType) {
      if (["create", "edit"].includes(eType)) {
        this.upsertType = eType;
      }
    },
    openCreatingStatusModal() {
      this.showCreateModal = true;
    },
    closeCreatingStatusModal() {
      this.showCreateModal = false;
    },
    statusCreated() {
      this.closeCreatingStatusModal();
      this.fetchClientTypes();
    },
    async deleteStatus(typeId) {
      try {
        await api.settingsV2.deleteClientType(typeId);
        await this.fetchClientTypes();
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    async editStatus(typeId) {
      try {
        const { data } = await api.settingsV2.getClientTypeById(typeId);
        this.editStorage = data;
        this.setUpsertType("edit");
        this.openCreatingStatusModal();
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
    <div class="d-flex justify-content-between">
      <h3 class="x-font-size-1p5 font-craftworksans color-gray-400">
        {{ $t("statuses.title") }}
      </h3>
      <x-button
        variant="secondary"
        text="statuses.add"
        :bilingual="true"
        @click="createStatus"
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
      :items="clientTypes.items"
      :fields="clientTypeFields"
      :busy="clientTypes.loading"
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

      <template #cell(icon)="{ item }">
        <x-icon :name="item.icon" class="gray-400" />
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
            @click="editStatus(item.id)"
            class="bg-violet-600"
          >
            <x-icon name="edit" class="color-white" />
          </x-circular-background>

          <x-circular-background
            @click="deleteStatus(item.id)"
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
      @close-creating-modal="closeCreatingStatusModal"
      @client-type-created="statusCreated"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";
@import "@/views/settings/assets/crudTable.scss";
</style>
