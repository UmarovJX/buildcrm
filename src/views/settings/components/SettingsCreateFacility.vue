<script>
import { makeProp } from '@/util/props'
import { isEmptyObject } from '@/util/inspect'
import { PROP_TYPE_STRING } from '@/constants/props'
import { XFormInput } from '@/components/ui-components/form-input'
import { XModalCenter } from '@/components/ui-components/modal-center'
import api from '@/services/api'
import { v3ServiceApi } from '@/services/v3/v3.service'

import ImageUploader from '@/components/Reusable/ImageUploader'
import BaseDeleteIcon from '@/components/icons/BaseDeleteIcon'

export default {
  name: 'SettingsCreateFacility',
  components: {
    ImageUploader,
    BaseDeleteIcon,
    XFormInput,
    XModalCenter,
  },
  props: {
    upsertType: makeProp(PROP_TYPE_STRING, 'create', type => ['create', 'edit'].includes(type)),
    allLangs: {
      type: Array,
      required: true,
    },
    editItem: { type: Object, required: true },
  },
  emits: ['client-type-created', 'close-creating-modal'],
  data() {
    const form = {
      name: {},
      img: null,
    }
    return {
      applyButtonLoading: false,
      form,
      item: {
        ...form,
      },
      old_upload: null,
      new_upload: null,
    }
  },
  created() {
    if (this.upsertType === 'edit') {
      this.setEditData()
    }
  },
  methods: {
    createImage() {
      if (this.item.img instanceof File) {
        const img = URL.createObjectURL(this.item.img)
        return img || null
      }
      return this.item.img
    },
    deleteImg(img) {
      if (!(img.path instanceof File)) {
        this.old_upload = this.editItem.upload_id
      }
      this.item.img = null
    },
    setImage(img) {
      this.item.img = img[0]
    },

    setEditData() {
      if (isEmptyObject(this.editItem)) {
        return
      }

      this.item.name = this.editItem.name
      this.item.img = this.editItem.img
      this.item.value = { ...this.editItem.value }
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
      if (this.applyButtonLoading) return
      const isSatisfied = await this.$refs['creating-observer'].validate()
      try {
        if (isSatisfied) {
          this.startLoading()
          if (this.old_upload) {
            const d = new FormData()
            d.append('id', this.old_upload)
            await api.uploadsV3.removeUpload(d)
          }

          if (this.item.img instanceof File) {
            const d = new FormData()
            d.append('type', 'file')
            d.append('attachment', this.item.img)
            const res = await api.uploadsV3.createUpload(d)
            this.new_upload = res.data.result.id
          }

          const d = {
            name: this.item.name,
            upload_id: this.new_upload
              ? this.new_upload
              : !this.old_upload
                ? this.editItem.upload_id
                : null,
          }
          if (this.upsertType === 'edit') {
            d.id = this.editItem.id
          }

          await v3ServiceApi.facility[
            this.upsertType === 'edit' ? 'update' : 'create'
          ](d)
          this.clearForm()
          this.$emit('client-type-created')
        }
      } catch (e) {
        this.toastedWithErrorCode(e)
      } finally {
        this.finishLoading()
      }
    },
    clearForm() {
      this.item.key = ''
      this.item.value = {}
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
        {{ $t("Add Facility") }}
      </h3>
    </template>

    <template #body>
      <h3 class="mt-4 mb-2 status-pick-color-title">
        {{ $t("Image") }}
      </h3>
      <div class="uploader-container flex-column">
        <div class="row uploader-row ml-0">
          <div
            v-if="item.img"
            class="col-3"
          >
            <div class="uploader">
              <div class="action-list">
                <div
                  class="delete-plan"
                  @click="deleteImg"
                >
                  <base-delete-icon
                    :width="18"
                    :height="18"
                    fill="var(--white)"
                  />
                </div>
              </div>

              <img
                :src="createImage()"
                alt="img"
              >
            </div>
          </div>
          <div
            v-else
            class="col-3"
          >
            <div class="uploader">
              <image-uploader
                :multiple="false"
                @upload-image="setImage"
              />
            </div>
          </div>
        </div>
      </div>
      <h3 class="mt-4 mb-2 status-pick-color-title">
        {{ $t("Name") }}
      </h3>
      <validation-observer
        ref="creating-observer"
        class="client-type-creating-body"
      >
        <validation-provider
          v-for="lang in allLangs"
          :key="lang"
          :name="`www`"
          class="title-uz-provider"
        >
          <x-form-input
            v-model="item.name[lang]"
            type="text"
            :placeholder="lang"
            class="w-100"
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

.uploader {
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 176px;
  max-height: 132px;
  min-height: 200px;
  border: 2px solid #f3f4f6;
  padding: 0;
  overflow: hidden;
  position: relative;

  .action-list {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    display: flex;
    gap: 0.25rem;
    flex-direction: column;
  }

  .delete-plan {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--red-600);
    cursor: pointer;
  }

  .drag-plan {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--gray-400);
    cursor: pointer;
  }

  img {
    object-fit: cover;
    object-position: center;
    height: 100%;
    //width: 100%;
  }
}

.uploader-row {
  width: 100%;
  row-gap: 0.5rem;

  .col-3 {
    padding: 0 4px !important;

    .uploader {
      max-width: 176px;
      max-height: 132px;
      min-height: 132px;

      p {
        font-weight: 600;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 0;
      }
    }
  }
}

.uploader-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;

  .row-item {
    display: flex;
    gap: 8px;
    height: 100%;
    flex-direction: row;
    justify-content: space-between;

    &-2 {
      height: 75%;
    }
  }

  .active-uploader {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

    p {
      color: #4b5563;
      font-weight: 600;
      font-family: Inter, serif;
      line-height: 22px;
    }
  }
}
</style>
