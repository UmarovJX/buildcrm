<script>
import { makeProp } from "@/util/props";
import { isEmptyObject } from "@/util/inspect";
import { PROP_TYPE_STRING } from "@/constants/props";
import { XFormInput } from "@/components/ui-components/form-input";
import { XModalCenter } from "@/components/ui-components/modal-center";
import api from "@/services/api";
import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";

export default {
  name: "SettingsCreateLanguage",
  components: {
    BaseFormTagInput,
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, "create", (type) => {
      return ["create", "edit"].includes(type);
    }),
    allLanguages: {
      type: Array,
      required: true,
    },
    editItem: { type: Object, required: true },
  },
  emits: ["client-type-created", "close-creating-modal"],
  data() {
    const form = {
      key: "",
      tags: [],
      value: {},
    };
    return {
      applyButtonLoading: false,
      form,
      item: {
        ...form,
      },
    };
  },
  // watch: {
  //   "status.title.uz": debounce(function (nameInUz) {
  //     const nameInCyrillic = symbolLatinToCyrillic(nameInUz);
  //     if (this.status.title.ru !== nameInCyrillic) {
  //       this.status.title.ru = nameInCyrillic;
  //     }
  //   }, 500),
  // },
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

      this.item.key = this.editItem.key;
      this.item.tags = [...this.editItem.tags];
      this.item.value = { ...this.editItem.value };
    },
    closeCreatingModal() {
      this.clearForm();
      this.$emit("close-creating-modal");
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
          key: this.item.key,
          value: this.item.value,
          tags: this.item.tags,
        };
        if (this.upsertType === "edit") {
          d.id = this.editItem.id;
        }
        try {
          await api.translationsV3[
            this.upsertType === "edit"
              ? "updateTranslation"
              : "createTranslation"
          ](d);

          this.clearForm();
          this.$emit("client-type-created");
        } catch (e) {
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    clearForm() {
      this.item.key = "";
      this.item.value = {};
      this.item.tags = [];
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
      width: '75%',
      height: '100%',
      overflowY: 'scroll',
    }"
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="saveItem"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("AddTranslation") }}
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
          name="last-name-uz-provider"
          rules="required"
          v-slot="{ errors }"
          class="title-uz-provider"
        >
          <x-form-input
            type="text"
            :placeholder="$t('key')"
            class="w-100"
            v-model="item.key"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("last-name-uz-provider", $t("title")) }}
          </span>
        </validation-provider>
        <validation-provider
          name="tag-input"
          rules="requred"
          class="filter__inputs-input"
        >
          <base-form-tag-input
            @set-tags="setTags"
            :default-tags="item.tags"
            ref="base-form-tag-input"
            :placeholder="`${$t('tags')}`"
          >
            <template #delete-content>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#9CA3AF" />
                <path
                  d="M13.125 6.875L6.875 13.125"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.875 6.875L13.125 13.125"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </template>
          </base-form-tag-input>
        </validation-provider>

        <validation-provider
          v-for="lang in allLanguages"
          :key="lang"
          :name="`www`"
          class="title-uz-provider"
        >
          <x-form-input
            type="text"
            :placeholder="lang"
            class="w-100"
            v-model="item.value[lang]"
          />
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
