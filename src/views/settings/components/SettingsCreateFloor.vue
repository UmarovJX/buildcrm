<script>
import { makeProp } from "@/util/props";
import { isEmptyObject } from "@/util/inspect";
import { PROP_TYPE_STRING } from "@/constants/props";
import { XFormInput } from "@/components/ui-components/form-input";
import { XModalCenter } from "@/components/ui-components/modal-center";
import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";
import { testApi } from "@/services/v3/test";

export default {
  name: "SettingsCreateFloor",
  components: {
    BaseFormTagInput,
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, "create", (type) =>
      ["create", "edit"].includes(type)
    ),

    editItem: { type: Object, required: true },
  },
  emits: ["success", "close"],
  data() {
    const form = {
      name: "",
    };
    return {
      applyButtonLoading: false,
      form,
      item: {
        ...form,
      },
    };
  },
  created() {
    if (this.upsertType === "edit") {
      this.setEditData();
    }
  },
  methods: {
    setTags(ts) {
      this.item.tags = ts;
    },
    setEditData() {
      if (isEmptyObject(this.editItem)) {
        return;
      }

      this.item.name = this.editItem.name;
    },
    closeCreatingModal() {
      this.clearForm();
      this.$emit("close");
    },
    startLoading() {
      this.applyButtonLoading = true;
    },
    finishLoading() {
      this.applyButtonLoading = false;
    },

    async saveItem() {
      const isSatisfied = await this.$refs["creating-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        const d = {
          name: this.item.name,
        };
        if (this.upsertType === "edit") {
          d.id = this.editItem.id;
        }
        try {
          await testApi.floors[
            this.upsertType === "edit" ? "update" : "create"
          ](d);

          this.clearForm();
          this.$emit("success");
        } catch (e) {
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    clearForm() {
      this.item.name = "";
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
    :apply-button-loading="applyButtonLoading"
    :modal-container-style="{
      'max-width': '960px',
      'max-height': '720px',
      overflowY: 'scroll',
      padding: '36px',
    }"
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="saveItem"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("Добавить Этаж") }}
      </h3>
    </template>

    <template #body>
      <h3 class="mt-4 mb-2 status-pick-color-title">
        {{ $t("Fill data") }}
      </h3>

      <validation-observer
        ref="creating-observer"
        class="client-type-creating-body"
      >
        <!--  ? STATUS TITLE UZ     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          v-slot="{ errors }"
          name="last-name-uz-provider"
          rules="required"
          class="title-uz-provider"
        >
          <x-form-input
            v-model="item.name"
            type="text"
            :placeholder="$t('name')"
            class="w-100"
          />
          <span v-if="errors[0]" class="error__provider">
            {{ errors[0].replace("last-name-uz-provider", $t("title")) }}
          </span>
        </validation-provider>
      </validation-observer>
    </template>
  </x-modal-center>
</template>

<style lang="scss" scoped>
.filter__inputs {
  margin-top: 2rem;
  margin-bottom: 3rem;

  &-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 20rem;
    min-height: 4rem;
    background-color: var(--gray-100);
    border-radius: 2rem;
    padding: 1rem 1.25rem;
    margin-top: 1.5rem;
    width: 100%;
    border: none;
    color: var(--gray-600);
    position: relative;

    ::placeholder {
      color: var(--gray-600);
      opacity: 0.5;
    }

    .placeholder {
      color: var(--gray-600);
      //padding-left: 1rem;
    }

    .input__date {
      margin-left: 0.5rem;
      background-color: transparent;
      border: none;
    }

    .inline {
      background-color: transparent;
      border: none;
      color: var(--gray-600);
      padding: 0;

      .disabled__option {
        color: var(--gray-100) !important;
      }
    }
  }
}

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
