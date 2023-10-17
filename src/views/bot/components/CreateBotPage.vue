<script>
import { XFormInput } from "@/components/ui-components/form-input";
import { XModalCenter } from "@/components/ui-components/modal-center";
import api from "@/services/api";
import { v3ServiceApi } from "@/services/v3/v3.service";

import BaseFormTagInput from "@/components/Reusable/BaseFormTagInput";

export default {
  name: "CreateBotPage",
  components: {
    BaseFormTagInput,
    XFormInput,
    XModalCenter,
  },
  props: {
    allLanguages: {
      type: Array,
      required: true,
    },
  },
  emits: ["bot-page-created", "close-modal"],
  data() {
    const form = {
      slug: "",
      title: {},
      description: {},
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
  created() {},
  methods: {
    closeCreatingModal() {
      this.clearForm();
      this.$emit("close-modal");
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
        try {
          await v3ServiceApi.botPages.create(this.item);
          this.clearForm();
          this.$emit("bot-page-created");
        } catch (e) {
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    clearForm() {
      this.item.slug = "";
      this.item.title = {};
      this.item.description = {};
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
        {{ $t("Add Bot Page") }}
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
          name="slug"
          rules="required"
          v-slot="{ errors }"
          class="title-uz-provider"
        >
          <x-form-input
            type="text"
            :placeholder="$t('slug')"
            class="w-100"
            v-model="item.slug"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("slug", $t("title")) }}
          </span>
        </validation-provider>

        <h3 class="mt-4 mb-2 status-pick-color-title">
          {{ $t("Title") }}
        </h3>
        <validation-provider
          v-for="lang in allLanguages"
          :key="lang"
          :name="`title_` + lang"
          class="title-uz-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`title ${lang}`"
            class="w-100"
            v-model="item.title[lang]"
          />
        </validation-provider>

        <h3 class="mt-4 mb-2 status-pick-color-title">
          {{ $t("Description") }}
        </h3>
        <validation-provider
          v-for="lang in allLanguages"
          :key="lang"
          :name="`title_` + lang"
          class="title-uz-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`title ${lang}`"
            class="w-100"
            v-model="item.description[lang]"
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
