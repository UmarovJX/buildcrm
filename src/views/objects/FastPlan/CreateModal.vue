<script>
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import readExcelFile from "read-excel-file";
import { mapGetters, mapMutations } from "vuex";
// import api from "@/services/api";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import DebtorsFileUploader from "@/components/Reusable/DebtorsFileUploader";

import { XIcon } from "@/components/ui-components/material-icons";
import { XFormInput } from "@/components/ui-components/form-input";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon.vue";

export default {
  name: "CreateModal",
  components: {
    BaseArrowDownIcon,
    BaseCloseIcon,
    BaseModal,
    DebtorsFileUploader,
    BaseButton,
    XIcon,
    XFormInput,
  },
  data() {
    return {
      buttonLoading: false,
      // image: null,
      // name: null
    };
  },
  computed: {
    ...mapGetters(["getFastPlanImage", "getFastPlanName"]),
    size() {
      if (this.image) {
        const kilobyte = this.image.size / 1024;
        if (kilobyte > 1024) {
          return Math.round((kilobyte / 1024) * 100) / 100 + " МБ";
        }
        return Math.round(kilobyte) + " КБ";
      }
      return 0;
    },
    image: {
      set(value) {
        return this.$store.commit("updateFastPlanImage", value);
      },
      get() {
        return this.getFastPlanImage;
      },
    },
    name: {
      set(value) {
        return this.$store.commit("updateFastPlanName", value);
      },
      get() {
        return this.getFastPlanName;
      },
    },
  },
  methods: {
    ...mapMutations({
      updateFastPlanImage: "updateFastPlanImage",
      updateFastPlanName: "updateFastPlanName",
    }),
    openModal() {
      this.$refs["base-modal"].openModal();
    },
    closeModal() {
      this.$refs["base-modal"].closeModal();
    },
    importUploadImage() {
      if (this.image && this.name) {
        this.$router.push({
          name: "fast_plan_add",
        });
      }
    },
    triggerNameEvent(event) {
      this.updateFastPlanName(event);
    },
    triggerUploadEvent() {
      this.image = this.$refs["file-input"].files[0];
      this.updateFastPlanImage(this.image);
    },
  },
};
</script>

<template>
  <base-modal ref="base-modal">
    <template #header>
      <!--   GO BACK     -->
      <div class="d-flex align-items-center justify-content-between">
        <!--    TITLE      -->
        <div class="title">{{ $t("objects.create.fast_plan.add") }}</div>

        <div class="go__back" @click="closeModal">
          <base-close-icon :width="56" :height="56" />
        </div>
      </div>
    </template>

    <template #main>
      <p class="instruction">
        {{ $t("objects.create.fast_plan.import_text") }}
      </p>

      <div class="upload__content" ref="file-upload">
        <!--   IF FILE UPLOAD     -->
        <div
          class="d-flex justify-content-between w-100 mr-4 ml-4"
          v-if="image"
        >
          <div class="d-flex">
            <span class="xls__logo">
              <template v-if="image.type === 'application/pdf'">
                .pdf
              </template>
              <template v-else> .png </template>
            </span>
            <span
              v-if="!(typeof image === 'string')"
              class="d-flex flex-column ml-3"
            >
              <span>{{ image.name }}</span>
              <span class="mt-1">{{ size }}</span>
            </span>
            <div v-else class="d-flex ml-3 align-items-center">
              <span>Link</span>
            </div>
          </div>

          <div class="edit__content">
            <input
              type="file"
              accept=".png, .pdf"
              name="upload-image"
              class="upload__content-input"
              @change="triggerUploadEvent"
              ref="file-input"
            />
            <base-button text="Заменить" class="edit__upload" />
          </div>
        </div>

        <!--   FILE NOT UPLOAD YET     -->
        <span v-else class="d-flex justify-content-center align-items-center">
          <span class="arrow__down">
            <base-arrow-down-icon :width="56" :height="56" fill="#9CA3AF" />
          </span>
          <span class="max-width-16">
            {{ $t("payments.drag_file") }}
            <span class="color-violet-600">
              {{ $t("payments.click_file") }}</span
            >
          </span>
        </span>
        <input
          v-if="!image"
          type="file"
          accept=".png, .pdf"
          name="upload-image"
          class="upload__content-input"
          @change="triggerUploadEvent"
          ref="file-input"
        />
      </div>

      <div class="mt-4">
        <x-form-input
          class="w-100"
          v-model="name"
          :placeholder="$t('objects.create.name')"
          :fixed="true"
          @input="triggerNameEvent"
        />
      </div>
    </template>

    <template #footer>
      <b-overlay
        :show="buttonLoading"
        rounded
        opacity="0.6"
        spinner-small
        spinner-variant="primary"
        class="d-inline-block w-100"
      >
        <base-button
          :text="$t('next')"
          @click="importUploadImage"
          :fixed="true"
          design="violet-gradient"
        />
      </b-overlay>
    </template>
  </base-modal>
</template>

<style lang="sass" scoped>
*
    font-family: Inter, serif
    font-style: normal
    color: var(--gray-600)
    font-weight: 600

.go__back
    width: 56px
    height: 56px
    border-radius: 100%
    background-color: var(--gray-100)
    display: flex
    justify-content: center
    align-items: center
    cursor: pointer

.title
    font-size: 24px
    line-height: 28px

.max-width-16
    max-width: 16rem

.color-violet-600
    color: var(--violet-600)

.upload__content
    width: 100%
    min-height: 12rem
    border-radius: 2rem
    margin-top: 1rem
    border: 3px dashed var(--gray-300)
    background-color: var(--gray-100)
    display: flex
    justify-content: center
    align-items: center
    position: relative

    .arrow__down
        margin-right: 2.5rem


    &-input
        outline: none
        cursor: pointer
        position: absolute
        margin: 0
        padding: 0
        width: 100%
        height: 100%
        opacity: 0

.download__template
    background-color: var(--gray-100)
    margin-top: 1rem
    width: 100%


.edit__upload
    background: var(--gray-200)
    color: var(--gray-600)
    border-radius: 2rem

.xls__logo
    border-radius: 1rem
    background-color: var(--gray-400)
    text-transform: uppercase
    padding: 1rem 0.8rem
    color: white

.edit__content
    position: relative
</style>
