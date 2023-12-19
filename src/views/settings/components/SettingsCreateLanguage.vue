<script>
import { makeProp } from '@/util/props'
import { isEmptyObject } from '@/util/inspect'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { XFormInput } from '@/components/ui-components/form-input'
import { XModalCenter } from '@/components/ui-components/modal-center'
import api from '@/services/api'

export default {
  name: 'SettingsCreateLanguage',
  components: {
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, 'create', type => ['create', 'edit'].includes(type)),
    editItem: makeProp(PROP_TYPE_OBJECT, {
      id: undefined,
      name: '',
      is_default: false,
      is_published: false,
    }),
  },
  emits: ['client-type-created', 'close-creating-modal'],
  data() {
    const clientForm = {
      name: '',
      is_default: false,
      is_published: false,
      error: {
        active: false,
        message: undefined,
      },
    }
    return {
      applyButtonLoading: false,
      clientForm,
      item: {
        ...clientForm,
      },
    }
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
    if (this.upsertType === 'edit') {
      this.setEditData()
    }
  },
  methods: {
    setEditData() {
      if (isEmptyObject(this.editItem)) {
        return
      }

      this.item.name = this.editItem.name
      this.item.is_default = this.editItem.is_default
      this.item.is_published = this.editItem.is_published
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

    async saveItem() {
      const isSatisfied = await this.$refs['creating-observer'].validate()
      if (isSatisfied) {
        this.startLoading()
        const d = {
          name: this.item.name,
          is_default: this.item.is_default,
          is_published: this.item.is_published,
        }
        if (this.upsertType === 'edit') {
          d.id = this.editItem.id
        }
        try {
          await api.languagesV3[
            this.upsertType === 'edit' ? 'updateLanguage' : 'createLanguage'
          ](d)

          this.clearForm()
          this.$emit('client-type-created')
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
        {{ $t("AddLanguage") }}
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
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("last-name-uz-provider", $t("title")) }}
          </span>
        </validation-provider>

        <div class="mb-3">
          <b-form-checkbox
            v-model="item.is_default"
            switch
          >
            {{ $t("is_default") }}
          </b-form-checkbox>
        </div>
        <div class="mb-3">
          <b-form-checkbox
            v-model="item.is_published"
            switch
          >
            {{ $t("is_published") }}
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
