<script>
import { makeProp } from "@/util/props";
import { isEmptyObject } from "@/util/inspect";
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from "@/constants/props";
import { XFormInput } from "@/components/ui-components/form-input";
import { XModalCenter } from "@/components/ui-components/modal-center";
import ColorPickerSwatches from "@/components/Elements/color-picker/ColorPickerSwatches.vue";
import { v3ServiceApi } from "@/services/v3/v3.service";

export default {
  name: "SettingsCreateStatus",
  components: {
    XFormInput,
    XModalCenter,
    ColorPickerSwatches,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, "create", (type) => {
      return ["create", "edit"].includes(type);
    }),
    editItem: makeProp(PROP_TYPE_OBJECT, {
      id: undefined,
      title: {
        uz: "",
        ru: "",
      },
      type: "",
      color: "",
    }),
  },
  emits: ["client-type-created", "close-creating-modal"],
  data() {
    const clientForm = {
      title: {
        uz: "",
        ru: "",
      },
      type: "",
      color: {
        hsl: { h: 4.724409448818895, s: 1, l: 0.7509803921568627, a: 1 },
        hex: "#FF8A80",
        hex8: "#FF8A80FF",
        rgba: { r: 255, g: 138, b: 128, a: 1 },
        hsv: { h: 4.724409448818895, s: 0.4980392156862745, v: 1, a: 1 },
        oldHue: 277.3228346456693,
        source: "hex",
        a: 1,
      },
      error: {
        active: false,
        message: undefined,
      },
    };
    return {
      applyButtonLoading: false,
      clientForm,
      status: {
        ...clientForm,
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
    } else {
      this.activateIcon();
    }
  },
  methods: {
    setEditData() {
      if (isEmptyObject(this.editItem)) {
        return;
      }

      this.status.title = this.editItem.title;
      this.status.type = this.editItem.type;
      this.status.color = this.editItem.color;
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
    submitClientType() {
      if (this.upsertType === "edit") {
        this.editClientType();
      } else {
        this.applyNewClientType();
      }
    },
    async applyNewClientType() {
      const isSatisfied = await this.$refs["creating-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        try {
          await v3ServiceApi.statuses().create({
            type: this.status.type,
            title: this.status.title,
            color: this.status.color.hex,
          });
          this.clearForm();
          await this.$emit("client-type-created");
        } catch (e) {
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    async editClientType() {
      const isSatisfied = await this.$refs["creating-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        try {
          const response = await v3ServiceApi.statuses().update({
            id: this.editItem.id,
            type: this.status.type,
            title: this.status.title,
            color: this.status.color.hex,
          });
          this.clearForm();
          response && this.$emit("client-type-created");
        } catch (e) {
          this.toastedWithErrorCode(e);
        } finally {
          this.finishLoading();
        }
      }
    },
    clearForm() {
      this.client = { ...this.clientForm };
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
    @apply="submitClientType"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("statuses.add") }}
      </h3>
    </template>

    <template #body>
      <h3 class="mt-4 mb-2 status-pick-color-title">
        {{ $t("statuses.pick_color_for_status") }}
      </h3>

      <color-picker-swatches v-model="status.color" class="w-100" />

      <validation-observer
        ref="creating-observer"
        class="client-type-creating-body"
      >
        <!--  ? STATUS TITLE UZ     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          name="last-name-uz-provider"
          rules="required|min:3"
          v-slot="{ errors }"
          class="title-uz-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`${$t('title')} (${$t('placeholder_uz')})`"
            class="w-100"
            v-model="status.title.uz"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("last-name-uz-provider", $t("title")) }}
          </span>
        </validation-provider>

        <!--  ? STATUS TITLE RU     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          name="last-name-ru-provider"
          rules="required|min:3"
          v-slot="{ errors }"
          class="title-ru-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`${$t('title')} (${$t('placeholder_ru')})`"
            class="w-100"
            v-model="status.title.ru"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("last-name-ru-provider", $t("title")) }}
          </span>
        </validation-provider>

        <!--        &lt;!&ndash;  ? STATUS TITLE ENG     &ndash;&gt;-->
        <!--        <validation-provider-->
        <!--          ref="clientTypeNameVProvider"-->
        <!--          name="name-uz-provider"-->
        <!--          rules="required|min:3"-->
        <!--          v-slot="{ errors }"-->
        <!--        >-->
        <!--          <x-form-input-->
        <!--            type="text"-->
        <!--            :placeholder="`${$t('title')} (${$t('placeholder_eng')})`"-->
        <!--            class="w-100"-->
        <!--            v-model="status.title.en"-->
        <!--          />-->
        <!--          <span class="error__provider" v-if="errors[0]">-->
        <!--            {{ errors[0].replace("name-uz-provider", $t("title")) }}-->
        <!--          </span>-->
        <!--        </validation-provider>-->

        <!--  ? STATUS TYPE    -->
        <validation-provider
          ref="statusTypeVProvider"
          name="status_type_provider"
          rules="required|min:3"
          v-slot="{ errors }"
          class="status-type-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`${$t('type')}`"
            class="w-100"
            v-model="status.type"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("status_type_provider", $t("type")) }}
          </span>
        </validation-provider>
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
