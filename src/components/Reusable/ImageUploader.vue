<script>
import BaseCameraIcon from '@/components/icons/BaseCameraIcon'
// import BaseArrowDownIcon from "@/components/icons/BaseArrowDownIcon";
// import BaseButton from "@/components/Reusable/BaseButton";

export default {
  name: 'FileUploader',
  components: {
    BaseCameraIcon,
    // BaseArrowDownIcon,
    // BaseButton
  },
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  beforeRouteLeave(to, from, next) {
    this.excelFile = null
    next()
  },
  data() {
    return {
      excelFile: null,
    }
  },
  computed: {
    size() {
      if (this.excelFile) {
        const kilobyte = this.excelFile.size / 1024
        if (kilobyte > 10) {
          return `${Math.round(kilobyte / 1024)} МБ`
        }

        return `${Math.round(kilobyte)} КБ`
      }
      return 0
    },
  },
  methods: {
    triggerUploadEvent() {
      this.excelFile = this.$refs['file-input'].files
      this.$emit('upload-image', this.excelFile)
      this.excelFile = null
    },
  },
}
</script>

<template>
  <div class="upload__content">
    <!--   FILE NOT UPLOAD YET     -->
    <div class="d-flex flex-column justify-content-center align-items-center">
      <BaseCameraIcon
        :width="30"
        :height="27"
        fill="#A78BFA"
      />
      <p>{{ $t("objects.create.plan.add_image") }}</p>
      {{ excelFile }}
    </div>
    <input
      v-if="!excelFile"
      ref="file-input"
      :value="excelFile"
      type="file"
      :multiple="multiple"
      accept="image/*"
      name="upload-image"
      class="upload__content-input"
      @change="triggerUploadEvent"
    >
  </div>
</template>

<style lang="sass" scoped>
*
    font-family: Inter, serif
    font-style: normal
    color: var(--gray-600)
    font-weight: 600
    font-size: 1rem
    line-height: 22px

.upload__content
    width: 100%
    height: 100%
    min-height: 5rem
    border-radius: .5rem
    display: flex
    justify-content: center
    align-items: center
    text-align: center
    position: relative

    p
        color: var(--gray-600)
        font-weight: 600
        font-size: 12px
        line-height: 16px
        margin-top: .25rem
        margin-bottom: 0

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

.upload__content:hover
    background: #E5E7EB
</style>
