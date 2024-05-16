<script>
import { v3ServiceApi } from "@/services/v3/v3.service";
import BaseLoadingContent from "@/components/BaseLoadingContent";
import CreationContent from "@/components/Dashboard/Objects/Promo/components/CreationContent";
import InstallmentTable from "@/components/Dashboard/Objects/Installment/components/Table";
import UpsertModal from "@/components/Dashboard/Objects/Installment/components/Create";
import BaseButton from "@/components/Reusable/BaseButton";
import BasePlusIcon from "@/components/icons/BasePlusIcon";
import AppHeader from "@/components/Header/AppHeader";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import { hasOwnProperty } from "@/util/object";
import ObjectPermission from "@/permission/objects";

export default {
  name: "Promo",
  components: {
    AppBreadcrumb,
    AppHeader,
    BasePlusIcon,
    BaseButton,
    InstallmentTable,
    CreationContent,
    BaseLoadingContent,
    UpsertModal,
  },
  data() {
    return {
      items: [],
      loading: false,
      page: "",
      item: null,
      upsertType: "create",
      showModal: false,
    };
  },
  computed: {
    breadCrumbs() {
      return [
        {
          route: {
            name: "objects",
          },
          content: {
            type: "i18n",
            path: "objects.title",
          },
        },
      ];
    },
  },
  async created() {
    await this.fetchIstallments();
  },
  methods: {
    permission: (v) => ObjectPermission.getObjectsPermission(v),
    async fetchIstallments() {
      const { id } = this.$route.params;
      this.startLoading();
      await v3ServiceApi.installments
        .getAll({ page: 1, limit: 10 })
        .then((response) => {
          this.items = response.data.result;
          if (
            this.items.length &&
            hasOwnProperty(this.items[0], "object_name")
          ) {
            this.page = this.items[0].object_name;
          }
        })
        .catch((error) => {
          this.toastedWithErrorCode(error);
        })
        .finally(() => {
          this.finishLoading();
        });
    },

    handleUpsert() {
      this.showModal = false;
      this.fetchIstallments();
    },

    startLoading() {
      this.loading = true;
    },
    finishLoading() {
      this.loading = false;
    },
    addNewPromo() {
      this.item = null;
      this.upsertType = "create";
      this.showModal = true;
    },
    async editItem(item) {
      this.item = item;
      this.upsertType = "update";
      this.openModal();
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<template>
  <div>
    <app-header>
      <template #header-breadcrumb>
        <app-breadcrumb
          :page="page"
          :breadcrumbs="breadCrumbs"
          page-info="Installment"
        />
      </template>

      <template #header-actions>
        <base-button
          v-if="permission('installment.view')"
          :text="`${$t('add')}`"
          design="violet-gradient"
          @click="addNewPromo"
        >
          <template #left-icon>
            <base-plus-icon fill="var(--white)" />
          </template>
        </base-button>
      </template>
    </app-header>

    <!--  List Of Promos  -->
    <installment-table
      :loading="loading"
      :items="items"
      @update-content="fetchIstallments()"
      @edit-item="editItem"
    />

    <upsert-modal
      v-if="showModal"
      :upsert-type="upsertType"
      :item="item"
      @closed="closeModal"
      @upserted="handleUpsert"
    ></upsert-modal>
  </div>
</template>
