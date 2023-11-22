<script>
import api from "@/services/api";
import { v3ServiceApi } from "@/services/v3/v3.service";

import Permission from "@/permission";
import { XButton } from "@/components/ui-components/button";
import BaseLoading from "@/components/Reusable/BaseLoading.vue";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";
import CreateBotPage from "@/views/bot/components/CreateBotPage.vue";
import BaseTabPicker from "@/components/Reusable/BaseTabPicker.vue";
import { XFormInput } from "@/components/ui-components/form-input";

import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowRightIcon from "@/components/icons/BaseArrowRightIcon";

export default {
  name: "BotPage",
  components: {
    BaseArrowLeftIcon,
    BaseArrowRightIcon,
    CreateBotPage,
    XFormInput,
    BaseTabPicker,
    BaseLoading,
    XButton,
    XIcon,
    XCircularBackground,
  },
  data() {
    return {
      allLangs: [],
      currentLang: "",
      upsertType: "create",
      showCreateModal: false,
      editStorage: {},
      editTags: {},
      loadings: {},
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
        create: Permission.getUserPermission("bot.create"),
        update: Permission.getUserPermission("bot.update"),
        delete: Permission.getUserPermission("bot.delete"),
      },
    };
  },
  computed: {
    tableFields() {
      return [
        {
          key: "title",
          label: this.$t("bot.table_title"),
          thStyle: "width: 25%",
        },
        {
          key: "description",
          label: this.$t("bot.description"),
        },
        {
          key: "slug",
          label: this.$t("bot.slug"),
          thStyle: "width: 25%",
        },
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
    create() {
      this.upsertType = "create";
      this.openCreateModal();
    },
    async fetchItems() {
      try {
        this.startLoading();
        const response = await v3ServiceApi.botPages.fetchPages({
          page: this.$route.query.page || 1,
          limit: 20,
        });
        this.table.items = response.data.result;
        this.table.pagination = response.data.pagination;
      } catch (e) {
        this.toastedWithErrorCode(e);
      } finally {
        this.finishLoading();
      }
    },

    openCreateModal() {
      this.showCreateModal = true;
    },
    closeCreateModal() {
      this.showCreateModal = false;
    },

    botPageCreated() {
      this.closeCreateModal();
      this.fetchItems();
    },

    // async deleteItem(typeId) {
    //   this.$swal({
    //     title: this.$t("sweetAlert.title"),
    //     text: this.$t("sweetAlert.text"),
    //     icon: "warning",
    //     showCancelButton: true,
    //     cancelButtonText: this.$t("cancel"),
    //     confirmButtonText: this.$t("sweetAlert.yes"),
    //   }).then(async (result) => {
    //     if (result.value) {
    //       try {
    //         this.startLoading();
    //         await api.translationsV3.removeTranslation({
    //           id: typeId,
    //         });
    //         await this.fetchItems();
    //       } catch (e) {
    //         this.toastedWithErrorCode(e);
    //       } finally {
    //         this.finishLoading();
    //       }
    //     }
    //   });
    // },
    updateTags(item) {
      this.editTags = item;
      this.showEditTagModal = true;
    },
    async update(item) {
      this.editStorage = item;
      this.upsertType = "edit";
      this.openCreateModal();
    },
    async deleteItem(item) {
      console.log(item);
      try {
        this.startLoading();
        await v3ServiceApi.botPages.remove(item);
        await this.fetchItems();
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
      <!-- <h3
        class="x-font-size-1p5 font-craftworksans color-gray-400 d-flex align-items-center"
      >
        {{ $t("translations") }}
      </h3> -->
      <!-- <base-tab-picker
        :options="allLangs"
        noAll
        :current="currentLang"
        @tab-selected="setTab"
      ></base-tab-picker> -->
      <div></div>
      <x-button
        v-if="permission.create"
        variant="secondary"
        text="Add Bot Page"
        :bilingual="true"
        @click="create"
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

      <template #cell(title)="{ item }">
        <div class="" v-html="item.title[$i18n.locale]"></div>
      </template>
      <template #cell(description)="{ item }">
        <div
          class=""
          v-html="item.description[$i18n.locale].replaceAll('\n', '<br>')"
        ></div>
      </template>
      <template #cell(slug)="{ item }">
        <div class="d-flex align-items-center">
          {{ item.slug }}
        </div>
      </template>
      <template #cell(actions)="{ item }">
        <div
          :style="loadings[item.id] ? 'opacity: 0.5' : ''"
          title="save"
          class="ml-1 cursor-pointer d-flex"
        >
          <x-circular-background
            @click="update(item)"
            class="bg-violet-600"
            v-if="permission.update"
          >
            <x-icon name="edit" class="color-white" />
          </x-circular-background>
          <x-circular-background
            @click="deleteItem(item)"
            class="bg-red-600 ml-2"
            v-if="permission.delete"
          >
            <x-icon name="delete" class="color-white" />
          </x-circular-background>
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
    </div>
    <create-bot-page
      :all-languages="allLangs"
      v-if="showCreateModal"
      :upsert-type="upsertType"
      :edit-item="editStorage"
      @bot-page-created="botPageCreated"
      @close-modal="closeCreateModal"
    ></create-bot-page>
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
