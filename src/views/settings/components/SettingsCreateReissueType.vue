<script>
import { makeProp } from '@/util/props'
import { isEmptyObject } from '@/util/inspect'
import { v3ServiceApi } from '@/services/v3/v3.service'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { XFormInput } from '@/components/ui-components/form-input'
import { XModalCenter } from '@/components/ui-components/modal-center'

export default {
  name: 'SettingsCreateReissueType',
  components: {
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, 'create', type => ['create', 'edit'].includes(type)),
    editItem: makeProp(PROP_TYPE_OBJECT, {
      id: undefined,
      icon: undefined,
      name: {
        uz: '',
        ru: '',
      },
      comment: '',
      is_vip: false,
    }),
  },
  emits: ['created', 'close-creating-modal'],
  data() {
    const clientForm = {
      name: {
        uz: '',
        ru: '',
        en: '',
      },
      error: {
        active: false,
        message: undefined,
      },
    }
    return {
      applyButtonLoading: false,
      clientForm,
      client: {
        ...clientForm,
      },
    }
  },
  created() {
    if (this.upsertType === 'edit') {
      this.setEditData()
    }
  },
  methods: {
    setEditData() {
      if (isEmptyObject(this.editItem)) {
        return
      }

      this.client.name.uz = this.editItem.name.uz
      this.client.name.ru = this.editItem.name.ru
      this.client.name.en = this.editItem.name.en
    },
    closeCreatingModal() {
      this.clearForm()
      this.$emit('close-creating-modal')
    },
    startLoading() {
      this.applyButtonLoading = true
    },
    finishLoading() {
      this.applyButtonLoading = false
    },
    submitClientType() {
      if (this.upsertType === 'edit') {
        this.editClientType()
      } else {
        this.applyNewClientType()
      }
    },
    async applyNewClientType() {
      const isSatisfied = await this.$refs['creating-type-observer'].validate()
      if (isSatisfied) {
        this.startLoading()
        try {
          await v3ServiceApi.reissueTypes.create({
            name: this.client.name,
          })
          this.clearForm()
          await this.$emit('created')
        } catch (e) {
          this.toastedWithErrorCode(e)
        } finally {
          this.finishLoading()
        }
      }
    },
    async editClientType() {
      const isSatisfied = await this.$refs['creating-type-observer'].validate()
      if (isSatisfied) {
        this.startLoading()
        try {
          const response = await v3ServiceApi.reissueTypes.update({
            id: this.editItem.id,
            name: this.client.name,
          })
          this.clearForm()
          response && this.$emit('created')
        } catch (e) {
          this.toastedWithErrorCode(e)
        } finally {
          this.finishLoading()
        }
      }
    },
    clearForm() {
      this.client = { ...this.clientForm }
    },
  },
}
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
        {{ $t("reissue.add") }}
      </h3>
    </template>

    <template #body>
      <validation-observer
        ref="creating-type-observer"
        class="client-type-creating-body"
      >
        <!--   ? NAME UZ     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          v-slot="{ errors }"
          name="name-uz-provider"
          rules="required|min:3"
          class="name-provider"
        >
          <x-form-input
            v-model="client.name.uz"
            type="text"
            :placeholder="`${$t('name')} (${$t('placeholder_uz')})`"
            class="w-100"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("name-uz-provider", $t("name")) }}
          </span>
        </validation-provider>

        <!--   ? NAME RU     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          v-slot="{ errors }"
          name="name-ru-provider"
          rules="required|min:3"
          class="name-provider"
        >
          <x-form-input
            v-model="client.name.ru"
            type="text"
            :placeholder="`${$t('name')} (${$t('placeholder_ru')})`"
            class="w-100"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("name-ru-provider", $t("name")) }}
          </span>
        </validation-provider>

        <!--   ? NAME EN     -->
        <validation-provider
          ref="clientTypeNameVProvider"
          v-slot="{ errors }"
          name="name-en-provider"
          rules="required|min:3"
          class="name-provider"
        >
          <x-form-input
            v-model="client.name.en"
            type="text"
            :placeholder="`${$t('name')} (${$t('placeholder_eng')})`"
            class="w-100"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
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
