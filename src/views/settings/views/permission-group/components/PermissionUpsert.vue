<script>
import {getCurrentInstance, ref} from "vue";
import {makeProp} from "@/util/props";
import {isEmptyObject, isNull} from "@/util/inspect";
import {v3ServiceApi} from "@/services/v3/v3.service";
import {useToastError} from "@/composables/useToastError";
import {PROP_TYPE_OBJECT, PROP_TYPE_STRING} from "@/constants/props";

import {XFormInput} from "@/components/ui-components/form-input";
import {XModalCenter} from "@/components/ui-components/modal-center";
import GroupParentSelect from "@/views/settings/views/permission-group/components/GroupParentSelect.vue";

export default {
  name: "PermissionUpsert",
  components: {
    XFormInput,
    XModalCenter,
    GroupParentSelect,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, "create", (type) => {
      return ["create", "edit"].includes(type);
    }),
    editItem: makeProp(PROP_TYPE_OBJECT),
  },
  emits: ["created", "close-creating-modal"],
  setup(props, {emit}) {
    const vm = getCurrentInstance().proxy
    const {toastError} = useToastError()
    const formObserverRef = ref(null)
    const applyButtonLoading = ref(false)
    const form = ref({
      uz: null,
      ru: null,
      en: null,
      name: null,
      group_id: null
    })

    function setEditData() {
      if (isEmptyObject(props.editItem)) {
        return;
      }

      form.value.uz = props.editItem.name.uz;
      form.value.ru = props.editItem.name.ru;
      form.value.en = props.editItem.name.en;
      form.value.name = props.editItem.slug;
    }

    function closeCreatingModal() {
      clearForm();
      emit("close-creating-modal");
    }

    function startLoading() {
      applyButtonLoading.value = true;
    }

    function finishLoading() {
      applyButtonLoading.value = false;
    }

    async function submit() {
      const isSatisfied = await formObserverRef.value.validate();
      if (isSatisfied) {
        if (props.upsertType === "edit") {
          await edit();
        } else {
          await create();
        }
      }
    }

    function makeBody() {
      return {
        name: form.value.name,
        translation: {
          uz: form.value.uz,
          ru: form.value.ru,
          en: form.value.en,
        },
        group_id: parseInt(vm.$route.query.tree)
      }
    }

    async function create() {
      startLoading();
      try {
        await v3ServiceApi.permission.create(
            makeBody()
        );
        clearForm();
        await emit("created");
      } catch (e) {
        toastError(e)
      } finally {
        finishLoading();
      }
    }

    async function edit() {
      startLoading();
      try {
        const response = await v3ServiceApi.permission.update({
          id: props.editItem.id,
          ...makeBody(),
        });
        clearForm();
        response && emit("created");
      } catch (e) {
        toastError(e)
      } finally {
        finishLoading();
      }
    }

    function clearForm() {
      form.value.uz = null
      form.value.ru = null
      form.value.en = null
      form.value.name = null
      form.value.group_id = null
    }

    if (props.upsertType === "edit") {
      setEditData();
    }

    return {
      form,
      formObserverRef,
      applyButtonLoading,

      closeCreatingModal,
      submit
    }
  }
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
      @apply="submit"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ upsertType === 'create' ? $t("common.add_permission") : $t("common.edit_permission") }}
      </h3>
    </template>

    <template #body>
      <validation-observer
          ref="formObserverRef"
          class="client-type-creating-body"
      >
        <!--   ? NAME UZ     -->
        <validation-provider
            ref="slugProvider"
            name="slugProvider"
            rules="required|min:3"
            v-slot="{ errors }"
        >
          <x-form-input
              type="text"
              :placeholder="`${$t('title')}`"
              class="w-100"
              v-model="form.name"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("slugProvider", $t("title")) }}
          </span>
        </validation-provider>


        <!--   ? NAME UZ     -->
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
              v-model="form.uz"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("name-uz-provider", $t("name")) }}
          </span>
        </validation-provider>

        <!--   ? NAME RU     -->
        <validation-provider
            ref="clientTypeNameVProvider"
            name="name-ru-provider"
            rules="required|min:3"
            v-slot="{ errors }"
            class="name-provider"
        >
          <x-form-input
              type="text"
              :placeholder="`${$t('name')} (${$t('placeholder_ru')})`"
              class="w-100"
              v-model="form.ru"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("name-ru-provider", $t("name")) }}
          </span>
        </validation-provider>

        <!--   ? NAME EN     -->
        <validation-provider
            ref="clientTypeNameVProvider"
            name="name-en-provider"
            rules="required|min:3"
            v-slot="{ errors }"
            class="name-provider"
        >
          <x-form-input
              type="text"
              :placeholder="`${$t('name')} (${$t('placeholder_eng')})`"
              class="w-100"
              v-model="form.en"
          />
          <span class="error__provider" v-if="errors[0]">
            {{ errors[0].replace("name-en-provider", $t("name")) }}
          </span>
        </validation-provider>
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
