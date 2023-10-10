<script>
import api from "@/services/api";
import SettingsPermission from "@/permission/settings.permission";
import { XButton } from "@/components/ui-components/button";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import SettingsCreateTranslation from "@/views/settings/components/SettingsCreateTranslation.vue";
import BaseTabPicker from "@/components/Reusable/BaseTabPicker.vue";
import { XFormInput } from "@/components/ui-components/form-input";

export default {
  name: "SettingsStatuses",
  components: {
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
      allLangs: [],
      currentLang: "",
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
          key: "key",
          label: this.$t("key"),
          thStyle: "width: 150px",
          class: "wwwww",
        },
        { key: "tags", label: "tags", thStyle: "width: 150px" },
        { key: "value." + this.currentLang, label: "Translation" },
        {
          key: "actions",
          label: "",
          thStyle: "width: 100px",
        },
      ];
    },
  },
  created() {
    api.languagesV3.getAllLanguages().then((res) => {
      this.allLangs.push(...res.data.result);
      this.currentLang = this.allLangs[0];
    });
    this.fetchItems();
  },
  methods: {
    setTab(e) {
      this.currentLang = e;
    },
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
        const response = await api.translationsV3.getTranslations({
          page: 1,
          limit: 100,
        });
        this.table.items = response.data.result.map((el) => ({
          ...el,
          loading: false,
        }));
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
    async deleteItem(typeId) {
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
            await api.translationsV3.removeTranslation({
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
    async saveTranslation(i) {
      const item = this.table.items[i];
      if (item.loading) return console.log("fast");
      const d = {
        id: item.id,
        key: item.key,
        value: item.value,
        tags: item.tags,
      };
      item.loading = true;
      api.translationsV3
        .updateTranslation(d)
        .then(() =>
          this.$toasted.show(
            `Translation for key "${this.table.items[i].key}" succesfully updated`,
            {
              type: "success",
            }
          )
        )
        .catch((err) => this.toastedWithErrorCode(err))
        .finally(() => (item.loading = false));
    },
  },
};
</script>

<template>
  <div class="app-settings-client-type">
    <!-- TODO: CLIENT TYPES TABLE   -->
    <div class="d-flex justify-content-between mb-4">
      <!-- <h3
        class="x-font-size-1p5 font-craftworksans color-gray-400 d-flex align-items-center"
      >
        {{ $t("translations") }}
      </h3> -->
      <base-tab-picker
        :options="allLangs"
        noAll
        :current="currentLang"
        @tab-selected="setTab"
      ></base-tab-picker>
      <x-button
        v-if="permission.create"
        variant="secondary"
        text="Add translation"
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
        <div v-for="tag in item.tags" :key="tag" class="mt-3">
          <span
            class="border-radius-2 background-violet-100 violet-600 translation-tag"
            >{{ tag }}</span
          >
        </div>
      </template>
      <template #[`cell(value.${currentLang})`]="{ item, index }">
        <div class="d-flex align-items-center">
          <x-form-input
            type="text"
            :placeholder="item.key"
            class="w-100"
            v-model="table.items[index].value[currentLang]"
          />
        </div>
      </template>

      <template #cell(actions)="{ item, index }">
        <div class="float-right d-flex x-gap-1 cursor-pointer flex-column">
          <div :style="item.loading ? 'opacity: 0.5' : ''" title="save">
            <x-circular-background
              v-if="permission.edit"
              @click="saveTranslation(index)"
              class="bg-violet-600"
            >
              <x-icon name="edit" class="color-white" />
            </x-circular-background>
          </div>

          <!-- <x-circular-background
            v-if="permission.delete"
            @click="deleteItem(item.id)"
            class="bg-red-600"
          >
            <x-icon name="delete" class="color-white" />
          </x-circular-background> -->
        </div>
      </template>
    </b-table>

    <settings-create-translation
      :all-languages="allLangs"
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
.translation-tag {
  padding: 6px 12px;
  &:not(:last-child) {
    margin-right: 5px;
  }
}
.row-opacity {
  opacity: 0.2;
}
</style>
