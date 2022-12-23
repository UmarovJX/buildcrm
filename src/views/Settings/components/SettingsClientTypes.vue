<template>
  <div class="app-settings">
    <div class="d-flex justify-content-between">
      <h3 class="x-font-size-1p5 font-craftworksans color-gray-400">{{ $t('client_types') }}</h3>
      <x-button
          variant="secondary"
          text="add_type"
          :bilingual="true"
          @click="createClientType"
      >
        <template #left-icon>
          <x-icon name="add" class="violet-600"/>
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
        :fields="fields"
        :busy="clientTypes.loading"
        :empty-text="$t('no_data')"
    >
      <template #table-busy>
        <base-loading/>
      </template>

      <template
          #empty="scope"
          class="text-center"
      >
        <span class="d-flex justify-content-center align-items-center">
          {{ scope['emptyText'] }}
        </span>
      </template>

      <template #cell(icon)="{ item }">
        <x-icon :name="item.icon" class="gray-400"/>
      </template>

      <template #cell(is_vip)="{ item }">
        <span v-if="item['is_vip']" class="border-radius-2 background-violet-100 violet-600 vip-status">V.I.P</span>
        <span v-else>{{ $t('normal_client') }}</span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="float-right d-flex x-gap-1 cursor-pointer">
          <x-circular-background @click="editClientType(item.id)" class="bg-violet-600">
            <x-icon name="edit" class="color-white"/>
          </x-circular-background>

          <x-circular-background @click="deleteClientType(item.id)" class="bg-red-600">
            <x-icon name="delete" class="color-white"/>
          </x-circular-background>
        </div>
      </template>
    </b-table>

    <settings-create-client
        v-if="shopCreateModal"
        :engagement-type="engagementType"
        :edit-item="editStorage"
        @close-creating-modal="closeCreatingClientTypeModal"
        @client-type-created="clientTypeCreated"
    />
  </div>
</template>

<script>
import BaseCheckbox from "@/components/Reusable/BaseCheckbox.vue";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import {XButton} from "@/components/ui-components/button";
import {XIcon} from "@/components/ui-components/material-icons";
import {XCircularBackground} from "@/components/ui-components/circular-background";
import SettingsCreateClient from "@/views/Settings/components/SettingsCreateClient.vue";
import BaseModal from "@/components/Reusable/BaseModal.vue";
import api from "@/services/api";

export default {
  name: 'SettingsClientTypes',
  components: {
    BaseCheckbox,
    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
    BaseModal,
    SettingsCreateClient
  },
  data() {
    return {
      engagementType: 'create',
      shopCreateModal: false,
      editStorage: {},
      clientTypes: {
        items: [],
        loading: false
      },
    }
  },
  computed: {
    fields() {
      return [
        {
          key: "icon",
          label: ""
        },
        {
          key: "name",
          label: this.$t('title'),
          formatter: (name) => name[this.$i18n.locale]
        },
        {
          key: "is_vip",
          label: 'V.I.P',
        },
        {
          key: "actions",
          label: this.$t('actions'),
          class: "float-right"
        },
      ]
    },
  },
  created() {
    this.fetchClientTypes()
  },
  methods: {
    createClientType() {
      this.setEngagementType('create')
      this.openCreatingClientTypeModal()
    },
    async fetchClientTypes() {
      try {
        const {data: items} = await api.settingsV2.getClientTypes()
        this.clientTypes.items = items
      } catch (e) {
        this.toastedWithErrorCode(e)
      }
    },
    setEngagementType(eType) {
      if (['create', 'edit'].includes(eType)) {
        this.engagementType = eType
      }
    },
    openCreatingClientTypeModal() {
      this.shopCreateModal = true
    },
    closeCreatingClientTypeModal() {
      this.shopCreateModal = false
    },
    clientTypeCreated() {
      this.closeCreatingClientTypeModal()
      this.fetchClientTypes()
    },
    async deleteClientType(typeId) {
      try {
        await api.settingsV2.deleteClientType(typeId)
        await this.fetchClientTypes()
      } catch (e) {
        this.toastedWithErrorCode(e)
      }
    },
    async editClientType(typeId) {
      try {
        const {data} = await api.settingsV2.getClientTypeById(typeId)
        this.editStorage = data
        this.setEngagementType('edit')
        this.openCreatingClientTypeModal()
      } catch (e) {
        this.toastedWithErrorCode(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/b-table-redesign.scss";

.app-settings {
  font-family: Inter, sans-serif;
}

::v-deep .table.b-table > thead > tr > [aria-sort=ascending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=ascending] {
  background-size: 20px;
  background-position: right calc(2rem / 6) center !important;
  background-image: url('../../../assets/icons/icon-arrow-down.svg') !important;
}

::v-deep .table.b-table > thead > tr > [aria-sort=descending],
::v-deep .table.b-table > tfoot > tr > [aria-sort=descending] {
  background-size: 20px;
  background-position: right calc(2rem / 6) center !important;
  background-image: url('../../../assets/icons/icon-arrow-down.svg') !important;
}

.vip-status {
  padding: 12px 48px;
}
</style>