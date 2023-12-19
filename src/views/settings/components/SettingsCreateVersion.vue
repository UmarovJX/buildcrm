<script>
import api from '@/services/api'
import { makeProp } from '@/util/props'
import { isEmptyObject } from '@/util/inspect'
import { PROP_TYPE_OBJECT, PROP_TYPE_STRING } from '@/constants/props'
import { XFormInput } from '@/components/ui-components/form-input'
import { XModalCenter } from '@/components/ui-components/modal-center'
import BaseTabPicker from '@/components/Reusable/BaseTabPicker.vue'
import BaseCheckbox from '@/components/Reusable/BaseCheckbox2'

import { VueEditor } from 'vue2-editor'

export default {
  name: 'SettingsCreateVersion',
  components: {
    BaseCheckbox,
    BaseTabPicker,
    VueEditor,
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, 'create', type => ['create', 'edit'].includes(type)),
    editItem: makeProp(PROP_TYPE_OBJECT, {
      id: undefined,
      version: '',
      published: false,
      latest: {},
      fixed: {},
    }),
    allLangs: {
      type: Array,
      required: true,
    },
  },
  emits: ['client-type-created', 'close-creating-modal'],
  data() {
    const clientForm = {
      version: '',
      latest: {},
      fixed: {},
      published: false,
      error: {
        active: false,
        message: undefined,
      },
    }
    return {
      currentLang: this.allLangs[0],
      applyButtonLoading: false,
      clientForm,
      item: {
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
    setTab(e) {
      this.currentLang = e
    },
    setEditData() {
      if (isEmptyObject(this.editItem)) {
        return
      }

      this.item.version = this.editItem.version
      this.item.latest = { ...this.editItem.latest }
      this.item.fixed = { ...this.editItem.fixed }
      this.item.published = +this.editItem.published
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
          version: this.item.version,
          latest: this.item.latest,
          fixed: this.item.fixed,
          published: this.item.published,
        }

        try {
          let response
          if (this.upsertType === 'edit') {
            response = await api.settings.updateVersion(this.editItem.id, d)
          } else {
            response = await api.settings.createVersion(d)
          }

          this.clearForm()
          this.$emit('client-type-created')
        } catch (e) {
          console.log(e.message)
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
        {{ upsertType === "create" ? $t("Add version") : $t("Edit Version") }}
      </h3>
    </template>

    <template #body>
      <h3 class="mt-4 mb-2 status-pick-color-title">
        {{ $t("Version") }}
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
            v-model="item.version"
            type="text"
            :placeholder="$t('version')"
            class="w-100"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("last-name-uz-provider", $t("Version")) }}
          </span>
        </validation-provider>
      </validation-observer>
      <div class="mt-4 mb-4">
        <base-checkbox
          v-model="item.published"
          :label="$t('published')"
        />
      </div>

      <base-tab-picker
        :options="allLangs"
        no-all
        :current="currentLang"
        @tab-selected="setTab"
      />

      <h3 class="mt-4 mb-2 status-pick-color-title">
        {{ $t("Latest") }}
      </h3>

      <VueEditor v-model="item.latest[currentLang]" />

      <h3 class="mt-4 mb-2 status-pick-color-title">
        {{ $t("Fixed") }}
      </h3>
      <VueEditor v-model="item.fixed[currentLang]" />
      <div class="mb-4" />
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
