<template>
  <div>
    <div class="d-flex justify-content-between mb-4">
      <base-tab-picker
        :options="settingTypes"
        no-all
        :current="current"
        @tab-selected="setTab"
      />
      <x-button
        variant="secondary"
        text="add"
        :bilingual="true"
        @click="createEntry"
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
      :fields="fields"
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

      <template #cell(actions)="{ item }">
        <div class="float-right d-flex x-gap-1 cursor-pointer">
          <div :style="item.loading ? 'opacity: 0.5' : ''" title="save">
            <x-circular-background class="bg-violet-600" @click="edit(item)">
              <x-icon name="edit" class="color-white" />
            </x-circular-background>
          </div>
          <div :style="item.loading ? 'opacity: 0.5' : ''" title="save">
            <x-circular-background class="bg-red-600" @click="deleteItem(item)">
              <x-icon name="delete" class="color-white" />
            </x-circular-background>
          </div>
        </div>
      </template>
    </b-table>
    <div class="pagination__vue">
      <!--   Pagination   -->
      <vue-paginate
        :page-count="table.pagination.totalPage"
        :value="table.pagination.current"
        :container-class="'container'"
        :page-class="'page-item'"
        :page-link-class="'page-link'"
        :next-class="'page-item'"
        :prev-class="'page-item'"
        :prev-link-class="'page-link'"
        :next-link-class="'page-link'"
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
    </div>

    <settings-create-floor
      v-if="showFloorModal"
      :upsert-type="upsertType"
      :edit-item="editItem"
      @close="closeFloorModal"
      @success="handleSuccess"
    />
    <settings-create-apartment-type
      v-if="showApartmentModal"
      :upsert-type="upsertType"
      :edit-item="editItem"
      @close="closeApartmentModal"
      @success="handleSuccess"
      :langs="langs"
    />
  </div>
</template>

<script>
import { computed, getCurrentInstance, ref, watch, onMounted } from "vue";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import BaseTabPicker from "@/components/Reusable/BaseTabPicker.vue";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";
import { XButton } from "@/components/ui-components/button";
import { XIcon } from "@/components/ui-components/material-icons";
import { testApi } from "@/services/v3/test";
import api from "@/services/api";

import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import SettingsCreateFloor from "@/views/settings/components/SettingsCreateFloor.vue";
import SettingsCreateApartmentType from "@/views/settings/components/SettingsCreateApartmentType.vue";

export default {
  components: {
    XButton,
    BaseTabPicker,
    XIcon,
    BaseLoading,
    BaseArrowRightIcon,
    BaseArrowLeftIcon,
    XCircularBackground,
    SettingsCreateFloor,
    SettingsCreateApartmentType,
  },
  data() {
    return {
      table: {
        items: [],
        pagination: {
          current: this.$route.query.page || 1,
          previous: 0,
          next: 0,
          perPage: this.$route.query.limit || 10,
          totalPage: 1,
          totalItem: 0,
        },
        loading: false,
      },
      editItem: {},
      showFloorModal: false,
      showApartmentModal: false,
      upsertType: "create",
      settingTypes: ["floors", "apartmentTypes"],
      current: "floors",
      langs: [],
      fields: [
        {
          key: "id",
          label: "ID",
        },
        {
          key: "name",
          label: "name",
        },
        {
          key: "actions",
          label: "",
        },
      ],
    };
  },
  mounted() {
    this.fetchItems();
    api.languagesV3.getAllLanguages().then((res) => {
      this.langs.push(...res.data.result);
    });
  },
  watch: {
    current() {
      this.fetchItems();
    },
  },
  methods: {
    setTab(e) {
      this.current = e;
    },
    fetchItems() {
      this.table.loading = true;
      testApi[this.current]
        .get(this.query)
        .then((res) => {
          this.table.items = res.data.result;
          this.table.pagination = res.data.pagination;
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.table.loading = false;
        });
    },
    openModal() {
      if (this.current === "floors") this.openFloorModal();
      else this.openApartmentModal();
    },
    openFloorModal() {
      this.showFloorModal = true;
    },
    openApartmentModal() {
      this.showApartmentModal = true;
    },
    closeModal() {
      if (this.current === "floors") this.closeFloorModal();
      else this.closeApartmentModal();
    },
    closeFloorModal() {
      this.showFloorModal = false;
    },
    closeApartmentModal() {
      this.showApartmentModal = false;
    },
    createEntry() {
      this.editItem = {};
      this.upsertType = "create";
      this.openModal();
    },
    handleSuccess() {
      this.$toasted.show("Success!", {
        type: "success",
      });
      this.closeModal();
      this.fetchItems();
    },
    edit(item) {
      this.upsertType = "edit";
      this.editItem = item;
      this.openModal();
    },
  },
  computed: {
    query() {
      return {
        page: this.table.pagination.current || 1,
        limit: this.table.pagination.perPage,
      };
    },
  },
  setup() {
    const vm = getCurrentInstance();
    watch(
      () => {
        vm.proxy.$route.query;
      },
      () => {
        vm.proxy.fetchItems();
      }
    );
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/pagination";

@import "@/assets/scss/utils/b-table-redesign.scss";
@import "@/views/settings/assets/crudTable.scss";
</style>