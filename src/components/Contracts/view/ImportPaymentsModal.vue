<template>
  <base-modal ref="base-modal">
    <template #header>
      <!--   GO BACK     -->
      <span class="d-flex align-items-center">
          <span class="go__back" @click="closeModal">
            <base-arrow-left-icon :width="32" :height="32"></base-arrow-left-icon>
          </span>
        <!--    TITLE      -->
          <span class="title">{{ $t('payments.payment_add') }}</span>
        </span>
    </template>

    <template #main>
      <p class="instruction">{{ $t('payments.import') }}</p>

      <div class="upload__content">
        <!--   IF FILE UPLOAD     -->
        <div class="d-flex justify-content-between w-100 mr-4 ml-4" v-if="excelFile">
          <div class="d-flex">
            <span class="xls__logo">.XLS</span>
            <span class="d-flex flex-column ml-3">
            <span>{{ excelFile.name }}</span>
            <span class="mt-1">{{ size }}</span>
          </span>
          </div>

          <div class="edit__content">
            <input
                type="file"
                accept=".xlsx, .xls, .csv"
                name="upload-excel"
                class="upload__content-input"
                @change="triggerUploadEvent"
                ref="file-input"
            >
            <base-button text="Заменить" class="edit__upload"/>
          </div>
        </div>

        <!--   FILE NOT UPLOAD YET     -->
        <span v-else class="d-flex justify-content-center align-items-center">
          <span class="arrow__down">
            <base-arrow-down-icon :width="56" :height="56" fill="#9CA3AF"/>
          </span>
          <span class="max-width-16">
            {{ $t('payments.drag_file') }}
            <span class="color-violet-600"> {{ $t('payments.click_file') }}</span>
          </span>
        </span>

        <input
            v-if="!excelFile"
            type="file"
            accept=".xlsx, .xls, .csv"
            name="upload-excel"
            class="upload__content-input"
            @change="triggerUploadEvent"
            ref="file-input"
        >
      </div>

      <base-button @click="downloadTemplate" :text="$t('payments.download_template')" class="download__template"/>

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
            text="Продолжить"
            @click="importUploadExcel"
            class="w-100 add__button"
        />
      </b-overlay>
    </template>

  </base-modal>
</template>

<script>
import BaseModal from "@/components/Reusable/BaseModal";
import BaseButton from "@/components/Reusable/BaseButton";
import BaseArrowLeftIcon from "@/components/icons/BaseArrowLeftIcon";
import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
import readExcelFile from 'read-excel-file'
import {mapMutations} from "vuex";
import api from "@/services/api";

export default {
  name: "ImportPaymentsModal",
  components: {
    BaseModal,
    BaseButton,
    BaseArrowLeftIcon,
    BaseArrowDownIcon
  },
  props: {
    contract: {
      type: Object,
      required: true
    }
  },
  beforeRouteLeave(to, from, next) {
    this.excelFile = null
    next()
  },
  data() {
    return {
      buttonLoading: false,
      excelFile: null
    }
  },
  computed: {
    size() {
      if (this.excelFile) {
        const kilobyte = this.excelFile.size / 1024
        if (kilobyte > 10) {
          return Math.round(kilobyte / 1024) + ' МБ'
        }

        return Math.round(kilobyte) + ' КБ'
      }
      return 0
    }
  },
  methods: {
    ...mapMutations({
      initExcelSheet: 'initExcelSheet'
    }),
    downloadTemplate() {
      api.contractV2.downloadContractTemplate()
          .then(response => {
            const fileURL = window.URL.createObjectURL(new Blob([response.data]))
            const fileLink = document.createElement('a')
            fileLink.href = fileURL
            fileLink.setAttribute('download', 'contract_template.xlsx')
            document.body.appendChild(fileLink)
            fileLink.click()
          })
    },
    openModal() {
      this.$refs['base-modal'].openModal()
    },
    closeModal() {
      this.$refs['base-modal'].closeModal()
    },
    importUploadExcel() {
      if (this.excelFile) {
        this.$router.push({
          name: 'contract-import-payments',
          params: {
            id: this.contract.id
          }
        })
      }
    },
    triggerUploadEvent() {
      this.excelFile = this.$refs['file-input'].files[0]
      readExcelFile(this.excelFile).then((rows) => {
        const head = rows[0]
        const sortRows = rows.slice(1).map(row => {
          const loopPackage = {}
          head.forEach((headCell, index) => {
            loopPackage[headCell] = row[index]
          })
          return loopPackage
        })
        sortRows.unshift(head)
        this.initExcelSheet({
          rows: sortRows,
          file: this.excelFile,
          contract: this.contract
        })
      })
    }
  }
}
</script>

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
  //margin-bottom: 1rem

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

.add__button
  background: linear-gradient(88.25deg, #7C3AED 0%, #818CF8 100%)
  color: #FFFFFF

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