<script>
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import { XButton } from "@/components/ui-components/button";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import SettingsCreateClient from "@/views/settings/components/SettingsCreateClient.vue";
import api from "@/services/api";

export default {
  name: "SettingsClientTypes",
  components: {
    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
    SettingsCreateClient,
  },
  data() {
    return {
      upsertType: "create",
      shopCreateModal: false,
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
    createClientType() {
      this.setUpsertType("create");
      this.openCreatingClientTypeModal();
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
    openCreatingClientTypeModal() {
      this.shopCreateModal = true;
    },
    closeCreatingClientTypeModal() {
      this.shopCreateModal = false;
    },
    clientTypeCreated() {
      this.closeCreatingClientTypeModal();
      this.fetchClientTypes();
    },
    async deleteClientType(typeId) {
      try {
        await api.settingsV2.deleteClientType(typeId);
        await this.fetchClientTypes();
      } catch (e) {
        this.toastedWithErrorCode(e);
      }
    },
    async editClientType(typeId) {
      try {
        const { data } = await api.settingsV2.getClientTypeById(typeId);
        this.editStorage = data;
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
    <div class="d-flex justify-content-between">
      <h3 class="x-font-size-1p5 font-craftworksans color-gray-400">
        {{ $t("client_types") }}
      </h3>
      <x-button
        variant="secondary"
        text="add_type"
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
            @click="editClientType(item.id)"
            class="bg-violet-600"
          >
            <x-icon name="edit" class="color-white" />
          </x-circular-background>

          <x-circular-background
            @click="deleteClientType(item.id)"
            class="bg-red-600"
          >
            <x-icon name="delete" class="color-white" />
          </x-circular-background>
        </div>
      </template>
    </b-table>

    <settings-create-client
      v-if="shopCreateModal"
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
