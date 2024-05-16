<script>
import { makeProp } from "@/util/props";
import { isEmptyObject } from "@/util/inspect";
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from "@/constants/props";
import { XFormInput } from "@/components/ui-components/form-input";
import { XModalCenter } from "@/components/ui-components/modal-center";
import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "SettingsCreateLanguage",
  components: {
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: String,
    item: makeProp(PROP_TYPE_OBJECT, {
      months: null,
      percentage: null,
      object_id: null,
      is_active: false,
    }),
  },
  emits: ["upserted", "closed"],
  data() {
    const initForm = {
      months: null,
      percentage: null,
      is_active: false,
    };
    return {
      loading: false,
      form: {
        ...initForm,
      },
    };
  },
  created() {
    if (this.upsertType === "update") {
      this.setEditData();
    }
  },
  methods: {
    setEditData() {
      if (isEmptyObject(this.item)) {
        return;
      }
      this.form.months = this.item.months;
      this.form.percentage = this.item.percentage;
      this.form.is_active = this.item.is_active;
    },
    closeCreatingModal() {
      this.clearForm();
      this.$emit("closed");
    },
    startLoading() {
      this.loading = true;
    },
    finishLoading() {
      this.loading = false;
    },

    async saveItem() {
      const isSatisfied = await this.$refs["creating-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        let d;
        if (this.upsertType === "create") {
          d = {
            ...this.form,
            object_id: this.$route.params.id,
          };
        } else {
          d = {
            ...this.form,
            id: this.item.id,
          };
        }
        try {
          await v3ServiceApi.installments[this.upsertType](d);
          this.clearForm();
          this.$emit("upserted");
        } catch (e) {
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    clearForm() {
      this.client = { ...this.initForm };
    },
  },
};
</script>

<template>
  <x-modal-center
    :bilingual="true"
    apply-button-text="save"
    cancel-button-text="cancel"
    footer-class="d-flex justify-content-between x-gap-1"
    apply-button-class="w-100"
    cancel-button-class="w-100"
    :apply-button-loading="loading"
    :modal-container-style="{
      overflowY: 'scroll',
    }"
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="saveItem"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{
          upsertType === "create"
            ? $t("Add Installment")
            : $t("Update Installment")
        }}
      </h3>
    </template>

    <template #body>
      <validation-observer
        ref="creating-observer"
        class="client-type-creating-body"
      >
        <div>
          <div class="status-pick-color-title mb-1">
            {{ $t("months") }}
          </div>
          <validation-provider
            v-slot="{ errors }"
            :name="$t('months')"
            rules="required"
            class="title-uz-provider"
          >
            <x-form-input
              v-model="form.months"
              type="text"
              :placeholder="$t('months')"
              class="w-100"
            />
            <span v-if="errors[0]" class="error__provider">
              {{ errors[0].replace("last-name-uz-provider", $t("months")) }}
            </span>
          </validation-provider>
        </div>

        <div>
          <div class="status-pick-color-title mb-1">
            {{ $t("Проценты") }}
          </div>
          <validation-provider
            v-slot="{ errors }"
            :name="$t('Проценты')"
            rules="required"
            class="title-uz-provider"
          >
            <x-form-input
              v-model="form.percentage"
              type="text"
              :placeholder="$t('Проценты')"
              class="w-100"
            />
            <span v-if="errors[0]" class="error__provider">
              {{ errors[0].replace("last-name-uz-provider", $t("Проценты")) }}
            </span>
          </validation-provider>
        </div>

        <div class="mb-3">
          <b-form-checkbox v-model="form.is_active" switch>
            {{ $t("tab_status.active") }}
          </b-form-checkbox>
        </div>
      </validation-observer>
    </template>
  </x-modal-center>
</template>

<style lang="scss" scoped>
.client-type-creating-body {
  margin-top: 1rem;
  margin-bottom: 1em;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  font-family: Inter, sans-serif;
  color: var(--gray-600);
  //grid-template-areas:
  //  "titleUz titleRu"
  //  "statusType statusType";
  //
  //.title-uz-provider {
  //  grid-area: titleUz;
  //}
  //
  //.title-ru-provider {
  //  grid-area: titleRu;
  //}
  //
  //.status-type-provider {
  //  grid-area: statusType;
  //}
}

.icons-collection-wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.status-pick-color-title {
  font-size: 18px;
  color: var(--gray-400);
  font-weight: 500;
  font-family: Inter, serif;
}

.error__provider {
  color: red;
  font-size: 12px;
}
</style>
