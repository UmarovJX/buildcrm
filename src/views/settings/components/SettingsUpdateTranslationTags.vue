<script>
import { XFormInput } from '@/components/ui-components/form-input'
import { XModalCenter } from '@/components/ui-components/modal-center'
import api from '@/services/api'
import BaseFormTagInput from '@/components/Reusable/BaseFormTagInput'

export default {
  name: 'SettingsCreateLanguage',
  components: {
    BaseFormTagInput,
    XFormInput,
    XModalCenter,
  },
  props: {
    editItem: { type: Object, required: true },
  },
  emits: ['tags-updated', 'close-modal'],
  data() {
    return {
      applyButtonLoading: false,
      item: {
        tags: [],
      },
    }
  },

  created() {
    this.setEditData()
  },
  methods: {
    setTags(ts) {
      this.item.tags = ts
    },
    setEditData() {
      this.item.tags = [...this.editItem.tags]
    },
    closeModal() {
      this.clearForm()
      this.$emit('close-modal')
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
          key: this.editItem.key,
          value: this.editItem.value,
          tags: this.item.tags,
          id: this.editItem.id,
        }
        try {
          await api.translationsV3.updateTranslation(d)
          this.clearForm()
          this.$emit('tags-updated')
        } catch (e) {
          this.toastedWithErrorCode(e)
        } finally {
          this.finishLoading()
        }
      }
    },
    clearForm() {
      this.item.tags = []
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
      // width: '75%',
      // height: '100%',
      overflowY: 'scroll',
    }"
    @close="closeModal"
    @cancel="closeModal"
    @apply="saveItem"
  >
    <template #header>
      <h3 class="x-font-size-36px font-craftworksans color-gray-600">
        {{ $t("settings_translations_edit_tags") }}
      </h3>
    </template>

    <template #body>
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
            disable
            type="text"
            :placeholder="$t('key')"
            class="w-100"
            :value="editItem.key"
          />
          <span
            v-if="errors[0]"
            class="error__provider"
          >
            {{ errors[0].replace("last-name-uz-provider", $t("title")) }}
          </span>
        </validation-provider>
        <validation-provider
          name="tag-input"
          rules="requred"
          class="filter__inputs-input"
        >
          <base-form-tag-input
            ref="base-form-tag-input"
            :default-tags="item.tags"
            :placeholder="`${$t('tags')}`"
            @set-tags="setTags"
          >
            <template #delete-content>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="10"
                  fill="#9CA3AF"
                />
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
