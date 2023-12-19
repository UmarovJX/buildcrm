<script>
import api from '@/services/api'
import { XModalCenter } from '@/components/ui-components/modal-center'
import { XSquareBackground } from '@/components/ui-components/square-background'
import { XIcon } from '@/components/ui-components/material-icons'
import { XFormInput } from '@/components/ui-components/form-input'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { symbolLatinToCyrillic } from '@/util/language-helper'
import { debounce } from '@/util/reusable'
import { makeProp } from '@/util/props'
import { isEmptyObject } from '@/util/inspect'

export default {
  name: 'SettingsCreateClient',
  components: {
    XModalCenter,
    XSquareBackground,
    XIcon,
    XFormInput,
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
  emits: ['client-type-created', 'close-creating-modal'],
  data() {
    const clientForm = {
      icon: undefined,
      is_vip: false,
      name: {
        uz: '',
        ru: '',
      },
      comment: '',
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
      iconsCollection: [
        { name: 'person', active: false },
        { name: 'supervisor_account', active: false },
        { name: 'engineering', active: false },
        { name: 'star', active: false },
        { name: 'verified', active: false },
        { name: 'bookmark', active: false },
        { name: 'sentiment_satisfied', active: false },
        { name: 'rocket_launch', active: false },
        { name: 'lightbulb', active: false },
        { name: 'paid', active: false },
        { name: 'accessible', active: false },
        { name: 'blind', active: false },
      ],
    }
  },
  watch: {
    'client.name.uz': debounce(function (nameInUz) {
      const nameInCyrillic = symbolLatinToCyrillic(nameInUz)
      if (this.client.name.ru !== nameInCyrillic) {
        this.client.name.ru = nameInCyrillic
      }
    }, 500),

    // 'status.name.ru': debounce(function (nameInRu) {
    //   const nameInLatin = symbolCyrillicToLatin(nameInRu)
    //   if (this.status.name.uz === '') {
    //     this.status.name.uz = nameInLatin
    //   }
    // }, 500),
  },
  created() {
    if (this.upsertType === 'edit') {
      this.fulfillIcon()
    } else {
      this.activateIcon()
    }
  },
  methods: {
    fulfillIcon() {
      if (isEmptyObject(this.editItem)) {
        return
      }
      this.client = { ...this.client, ...this.editItem }
      const idx = this.findIconIdx(this.editItem.icon)
      if (this.editItem.icon && idx !== -1) {
        this.iconsCollection[idx].active = true
      } else {
        this.deactivateAllIcons()
        this.iconsCollection[0].active = true
      }
    },
    activateIcon(position = 0) {
      this.iconsCollection[position].active = true
      this.client.icon = this.iconsCollection[position].name
    },
    deactivateAllIcons() {
      this.iconsCollection.forEach(icon => (icon.active = false))
    },
    closeCreatingModal() {
      this.clearForm()
      this.$emit('close-creating-modal')
    },
    findIconIdx(iconCh, matchBy = 'name') {
      return this.iconsCollection.findIndex(icon => icon[matchBy] === iconCh)
    },
    changeIconType(name) {
      const idx = this.iconsCollection.findIndex(icon => icon.name === name)
      if (idx !== -1) {
        this.deactivateAllIcons()
        this.activateIcon(idx)
      }
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
      this.startLoading()
      const isSatisfied = await this.$refs['creating-type-observer'].validate()
      if (isSatisfied) {
        try {
          await api.settingsV2.createClientType({
            name: this.client.name,
            is_vip: this.client.is_vip,
            icon: this.client.icon,
          })
          this.clearForm()
          await this.$emit('client-type-created')
        } catch (e) {
          this.toastedWithErrorCode(e)
        } finally {
          this.finishLoading()
        }
      }
    },
    async editClientType() {
      this.startLoading()
      const isSatisfied = await this.$refs['creating-type-observer'].validate()
      if (isSatisfied) {
        try {
          const response = await api.settingsV2.updateClientType(
            this.editItem.id,
            {
              name: this.client.name,
              is_vip: this.client.is_vip,
              icon: this.client.icon,
            },
          )
          this.clearForm()
          response && this.$emit('client-type-created')
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
    @close="closeCreatingModal"
    @cancel="closeCreatingModal"
    @apply="submitClientType"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("client_types") }}
      </h3>
    </template>

    <template #body>
      <validation-observer
        ref="creating-type-observer"
        class="client-type-creating-body"
      >
        <div class="icons-collection-wrapper">
          <x-square-background
            v-for="clientTypeIcon in iconsCollection"
            :key="clientTypeIcon.name"
            class="bg-gray-100 cursor-pointer"
            :class="{ 'bg-violet-600': clientTypeIcon.active }"
            @click="changeIconType(clientTypeIcon.name)"
          >
            <x-icon
              :name="clientTypeIcon.name"
              class="gray-400"
              :class="{ 'color-white': clientTypeIcon.active }"
            />
          </x-square-background>
        </div>

        <validation-provider
          ref="clientTypeNameVProvider"
          v-slot="{ errors }"
          name="client-type-name-uz-provider"
          rules="required|min:3"
        >
          <x-form-input
            v-model="client.name.uz"
            type="text"
            :placeholder="`${$t('title')} (${$t('placeholder_uz')})`"
            class="w-100"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("status-type-name-uz-provider", $t("title")) }}
          </span>
        </validation-provider>

        <validation-provider
          ref="clientTypeNameVProvider"
          v-slot="{ errors }"
          name="client-type-name-ru-provider"
          rules="required|min:3"
        >
          <x-form-input
            v-model="client.name.ru"
            type="text"
            :placeholder="`${$t('title')} (${$t('placeholder_ru')})`"
            class="w-100"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("status-type-name-ru-provider", $t("title")) }}
          </span>
        </validation-provider>

        <b-form-checkbox
          id="checkbox-1"
          v-model="client.is_vip"
          size="lg"
          name="vip-checkbox"
          :checked="true"
          :unchecked-value="false"
        >
          {{ $t("has_the_powers_of_vip") }}
        </b-form-checkbox>

        <x-form-input
          v-model="client.comment"
          type="text"
          :placeholder="`${$t('comment')}`"
          class="w-100 mt-2"
        />
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
  row-gap: 1rem;
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
