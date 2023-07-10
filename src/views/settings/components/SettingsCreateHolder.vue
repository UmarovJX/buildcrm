<script>
import { makeProp } from "@/util/props";
import { isEmptyObject } from "@/util/inspect";
import { v3ServiceApi } from "@/services/v3/v3.service";
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from "@/constants/props";
import { XFormInput } from "@/components/ui-components/form-input";
import { XModalCenter } from "@/components/ui-components/modal-center";

export default {
  name: "SettingsCreateClient",
  components: {
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, "create", (type) => {
      return ["create", "edit"].includes(type);
    }),
    editItem: makeProp(PROP_TYPE_OBJECT, {
      id: undefined,
      icon: undefined,
      name: {
        uz: "",
        ru: "",
      },
      comment: "",
      is_vip: false,
    }),
  },
  emits: ["client-type-created", "close-creating-modal"],
  data() {
    const clientForm = {
      name: {
        uz: "",
        ru: "",
      },
      middleName: {
        uz: "",
        ru: "",
      },
      lastName: {
        uz: "",
        ru: "",
      },
      error: {
        active: false,
        message: undefined,
      },
    };
    return {
      applyButtonLoading: false,
      clientForm,
      client: {
        ...clientForm,
      },
    };
  },
  // watch: {
  // "client.name.uz": debounce(function (nameInUz) {
  //   const nameInCyrillic = symbolLatinToCyrillic(nameInUz);
  //   if (this.client.name.ru !== nameInCyrillic) {
  //     this.client.name.ru = nameInCyrillic;
  //   }
  // }, 500),
  // "client.lastName.uz": debounce(function (nameInUz) {
  //   const nameInCyrillic = symbolLatinToCyrillic(nameInUz);
  //   if (this.client.lastName.ru !== nameInCyrillic) {
  //     this.client.lastName.ru = nameInCyrillic;
  //   }
  // }, 500),
  // "client.middleName.uz": debounce(function (nameInUz) {
  //   const nameInCyrillic = symbolLatinToCyrillic(nameInUz);
  //   if (this.client.middleName.ru !== nameInCyrillic) {
  //     this.client.middleName.ru = nameInCyrillic;
  //   }
  // }, 500),
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

      this.client.name.uz = this.editItem.first_name;
      this.client.lastName.uz = this.editItem.last_name;
      this.client.middleName.uz = this.editItem.middle_name;
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
      const isSatisfied = await this.$refs["creating-type-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        try {
          await v3ServiceApi.holders().create({
            first_name: this.client.name.uz,
            last_name: this.client.lastName.uz,
            middle_name: this.client.middleName.uz,
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
      const isSatisfied = await this.$refs["creating-type-observer"].validate();
      if (isSatisfied) {
        this.startLoading();
        try {
          const response = await v3ServiceApi.holders().update({
            id: this.editItem.id,
            first_name: this.client.name.uz,
            last_name: this.client.lastName.uz,
            middle_name: this.client.middleName.uz,
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
      width: '75%',
      height: 'auto',
      overflowY: 'scroll',
    }"
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="submitClientType"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("holders.add") }}
      </h3>
    </template>

    <template #body>
      <validation-observer
        ref="creating-type-observer"
        class="client-type-creating-body"
      >
        <!--   ? HOLDER'S NAME UZ     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          name="name-uz-provider"
          rules="required|min:3"
          v-slot="{ errors }"
          class="name-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`${$t('name')} (${$t('placeholder_uz')})`"
            class="w-100"
            v-model="client.name.uz"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("name-uz-provider", $t("name")) }}
          </span>
        </validation-provider>

        <!--   ? HOLDER'S NAME RU     -->
        <!--        <validation-provider-->
        <!--          ref="clientTypeNameVProvider"-->
        <!--          name="name-ru-provider"-->
        <!--          v-slot="{ errors }"-->
        <!--        >-->
        <!--          <x-form-input-->
        <!--            type="text"-->
        <!--            :placeholder="`${$t('title')} (${$t('placeholder_ru')})`"-->
        <!--            class="w-100"-->
        <!--            v-model="client.name.ru"-->
        <!--          />-->
        <!--          <span class="error__provider" v-if="errors[0]">-->
        <!--            {{ errors[0].replace("name-ru-provider", $t("title")) }}-->
        <!--          </span>-->
        <!--        </validation-provider>-->

        <!--   ? HOLDER'S LAST NAME UZ     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          name="last-name-uz-provider"
          rules=""
          v-slot="{ errors }"
          class="last-name-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`${$t('last_name')} (${$t('placeholder_uz')})`"
            class="w-100"
            v-model="client.lastName.uz"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("last-name-uz-provider", $t("last_name")) }}
          </span>
        </validation-provider>

        <!--   ? HOLDER'S LAST NAME RU     -->
        <!--        <validation-provider-->
        <!--          ref="clientTypeNameVProvider"-->
        <!--          name="last-name-ru-provider"-->
        <!--          rules=""-->
        <!--          v-slot="{ errors }"-->
        <!--        >-->
        <!--          <x-form-input-->
        <!--            type="text"-->
        <!--            :placeholder="`${$t('last_name')} (${$t('placeholder_ru')})`"-->
        <!--            class="w-100"-->
        <!--            v-model="client.lastName.ru"-->
        <!--          />-->
        <!--          <span class="error__provider" v-if="errors[0]">-->
        <!--            {{ errors[0].replace("last-name-ru-provider", $t("last_name")) }}-->
        <!--          </span>-->
        <!--        </validation-provider>-->

        <!--   ? HOLDER'S MIDDLE NAME UZ     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          name="middle-name-uz-provider"
          rules=""
          v-slot="{ errors }"
          class="middle-name-provider"
        >
          <x-form-input
            type="text"
            :placeholder="`${$t('second_name')} (${$t('placeholder_uz')})`"
            class="w-100"
            v-model="client.middleName.uz"
          />
          <span class="error__provider" v-if="errors[0]">
            {{
              errors[0].replace("middle-name-uz-provider", $t("second_name"))
            }}
          </span>
        </validation-provider>

        <!--   ? HOLDER'S MIDDLE NAME RU     -->
        <!--        <validation-provider-->
        <!--          ref="clientTypeNameVProvider"-->
        <!--          name="middle-name-ru-provider"-->
        <!--          v-slot="{ errors }"-->
        <!--        >-->
        <!--          <x-form-input-->
        <!--            type="text"-->
        <!--            :placeholder="`${$t('second_name')} (${$t('placeholder_ru')})`"-->
        <!--            class="w-100"-->
        <!--            v-model="client.middleName.ru"-->
        <!--          />-->
        <!--          <span class="error__provider" v-if="errors[0]">-->
        <!--            {{-->
        <!--              errors[0].replace("middle-name-ru-provider", $t("second_name"))-->
        <!--            }}-->
        <!--          </span>-->
        <!--        </validation-provider>-->
      </validation-observer>
    </template>
  </x-modal-center>
</template>

<style lang="scss" scoped>
.client-type-creating-body {
  margin-top: 3rem;
  margin-bottom: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  font-family: Inter, sans-serif;
  color: var(--gray-600);
  //grid-template-areas:
  //  "lastNameProvider middleNameProvider"
  //  "nameProvider nameProvider";
  //
  //.last-name-provider {
  //  grid-area: lastNameProvider;
  //}
  //
  //.name-provider {
  //  grid-area: nameProvider;
  //}
  //
  //.middle-name-provider {
  //  grid-area: middleNameProvider;
  //}
}

.icons-collection-wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
}

.error__provider {
  color: red;
  font-size: 12px;
}
</style>
