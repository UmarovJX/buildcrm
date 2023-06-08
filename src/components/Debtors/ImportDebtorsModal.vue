<script>
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import readExcelFile from "read-excel-file";
import { mapMutations } from "vuex";
// import api from "@/services/api";
import BaseCloseIcon from "@/components/icons/BaseCloseIcon";
import DebtorsFileUploader from "@/components/Reusable/DebtorsFileUploader";

export default {
  name: "ImportDebtorsModal",
  components: {
    BaseCloseIcon,
    BaseModal,
    DebtorsFileUploader,
    BaseButton,
  },
  data() {
    return {
      buttonLoading: false,
      excelFile: null,
    };
  },
  computed: {
    size() {
      if (this.excelFile) {
        const kilobyte = this.excelFile.size / 1024;
        if (kilobyte > 10) {
          return Math.round(kilobyte / 1024) + " МБ";
        }

        return Math.round(kilobyte) + " КБ";
      }
      return 0;
    },
  },
  methods: {
    ...mapMutations({
      updateDebtorsExcel: "updateDebtorsExcel",
    }),
    downloadTemplate() {
      const fileURL = process.env.VUE_APP_URL_V2 + "/debtors/template";
      const fileLink = document.createElement("a");
      fileLink.href = fileURL;
      document.body.appendChild(fileLink);
      fileLink.click();
    },
    openModal() {
      this.$refs["base-modal"].openModal();
    },
    closeModal() {
      this.$refs["base-modal"].closeModal();
    },
    importUploadExcel() {
      const file = this.$refs["file-upload"].excelFile;
      if (file) {
        this.$router.push({
          name: "debtors-import",
        });
      }
    },
    triggerUploadEvent() {
      this.excelFile = this.$refs["file-upload"].excelFile;
      readExcelFile(this.excelFile).then((rows) => {
        const head = rows[0];
        const sortRows = rows.slice(1).map((row) => {
          const loopPackage = {};
          head.forEach((headCell, index) => {
            loopPackage[headCell] = row[index];
          });
          return loopPackage;
        });
        sortRows.unshift(head);
        this.updateDebtorsExcel({
          rows: sortRows,
          file: this.excelFile,
        });
      });
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
        <div class="title">{{ $t("debtors.import_debtors") }}</div>

        <div class="go__back" @click="closeModal">
          <base-close-icon :width="56" :height="56" />
        </div>
      </div>
    </template>

    <template #main>
      <p class="instruction">{{ $t("debtors.import_text") }}</p>

      <debtors-file-uploader ref="file-upload" />

      <base-button
        @click="downloadTemplate"
        :text="$t('payments.download_template')"
        class="download__template"
      />
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
          @click="importUploadExcel"
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
