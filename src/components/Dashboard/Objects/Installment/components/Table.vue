<script>
import XDropdown from "@/components/ui-components/dropdown/XDropdown.vue";
import { v3ServiceApi } from "@/services/v3/v3.service";
import ObjectPermission from "@/permission/objects";
import { XIcon } from "@/components/ui-components/material-icons";
import { XCircularBackground } from "@/components/ui-components/circular-background";

export default {
  name: "ListContent",
  components: { XDropdown, XIcon, XCircularBackground },
  props: {
    items: {
      type: Array,
      required: true,
    },
    loading: Boolean,
  },
  emits: ["update-content", "edit-item"],
  methods: {
    permission: (v) => ObjectPermission.getObjectsPermission(v),
    editPromoItem(item) {
      this.$emit("edit-item", item);
    },
    async deleteItem(item) {
      const result = await this.showWarnBeforeDelete();
      if (result.isConfirmed) {
        const id = item.id;
        await v3ServiceApi.installments
          .remove({ id })
          .then(() => {
            this.showSuccessResponse();
            this.$emit("update-content");
          })
          .catch((error) => {
            this.toastedWithErrorCode(error);
          });
      }
    },
    showWarnBeforeDelete() {
      return this.$swal({
        text: "",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: this.$t("cancel"),
        title: this.$t("Удалить?"),
        confirmButtonText: this.$t("sweetAlert.yes"),
      });
    },
    showSuccessResponse() {
      this.$swal({
        icon: "success",
        showCancelButton: false,
        title: this.$t("Успешно удалено!"),
      });
    },
  },
  computed: {
    fields() {
      return [
        {
          key: "index",
          label: "#",
        },
        {
          key: "months",
          label: this.$t("months"),
        },
        {
          key: "percentage",
          label: this.$t("%"),
          formatter: (v) =>
            Number(v / 100).toLocaleString(undefined, {
              style: "percent",
              minimumFractionDigits: 2,
            }),
        },
        {
          key: "is_active",
          label: this.$t("active"),
        },
        {
          key: "actions",
          label: "",
        },
      ];
    },
  },
};
// v-model:sort-by="sortBy"
//       v-model:sort-desc="sortDesc"
</script>

<template>
  <div class="mt-2">
    <b-table
      sticky-header
      responsive
      show-empty
      borderless
      sort-icon-left
      :items="items"
      :fields="fields"
      :empty-text="$t('no_data')"
      :busy="loading"
      class="custom-table"
    >
      <!-- INDEX COLUMN -->
      <template #cell(index)="data">
        <span>
          {{ data.index + 1 }}
        </span>
      </template>

      <template #cell(is_active)="{ item }">
        <div v-if="item.is_active" class="d-flex x-gap-1">
          <x-circular-background class="bg-violet-600">
            <x-icon name="check" class="color-white" />
          </x-circular-background>
        </div>
      </template>

      <!--   ACTION   -->
      <template #cell(actions)="data">
        <div class="float-right">
          <i
            class="fas fa-edit cursor-pointer mr-4"
            @click="editPromoItem(data.item)"
            v-if="permission('installment.update')"
          />
          <i
            class="fas fa-trash"
            v-if="permission('installment.delete')"
            @click="deleteItem(data.item)"
          />
        </div>
      </template>
    </b-table>
  </div>
</template>

<style lang="scss" scoped>
.active__dot-class {
  color: #20c997;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.not__active__dot-class {
  color: #ffc107;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
</style>
