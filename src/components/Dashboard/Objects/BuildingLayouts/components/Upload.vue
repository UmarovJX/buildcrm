<template>
<div class="upload-container font-inter font-weight-600">
  <div class="d-flex">
    <span class="active-uploader uploader" @click="onFileSelect">
      <input ref="fileInput" type="file" multiple :accept="accept" @input="onFileSelected">
      <slot name="asset-icon"></slot>
      <slot name="req-title"></slot>
      <img :src="selectedFiles[0]" alt=""/>
    </span>
    <span class="uploader">
      <input type="file" :accept="accept">
      <slot name="asset-icon"></slot>
    </span>
  </div>
  <div class="d-flex">
    <span class="uploader" v-for="item in 3" :key="item">
      <input :accept="accept" type="file">
      <slot name="asset-icon"></slot>
    </span>
  </div>
</div>
</template>

<script>
export default {
  name: "Upload",
  props: {
   accept: {
    type: String,
    require: true
   }
  },
  data() {
    return {
      selectedFiles: [],
      counter: 0
    }
  },
  methods: {
    hasSlotContent(slotName) {
      return this.$slots[slotName]
    },
    onFileSelected() {
      let input = this.$refs.fileInput
      let file = input.files;
      if (file && file[0]){
        let reader = new FileReader
        reader.onload = () => {
          this.selectedFiles.push(reader.result)
          console.log("shu:", this.selectedFiles)
        }
        for (let i = 0; i < file; i++) {
          reader.readAsDataURL(file[i])
          this.$emit('files-input', file[i])
        }
      }
    },
    onFileSelect() {
      const formData = new FormData();
      let {files} = this.$refs.fileInput
      files.forEach((file) => {
        formData.append("file", file);
      });
      console.log("files", formData)
      // console.log("files:", files)
      // this.$refs.fileInput.click()
    }
  }
}
</script>

<style scoped lang="scss">
*{
  padding: 0;
  margin: 0;
}
.upload-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
  margin-bottom: 20px;
  div {
    display: flex;
    gap: 8px;
    width: 100%;
  }
  .active-uploader > * {
    opacity: 100% !important;
  }
  div:nth-child(1) {
    .uploader {
      width: 50%;
    }
  }
  div:nth-child(2) {
    .uploader {
      width: 33.3%;
    }
  }
  .uploader {
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;
    border: 1px #F3F4F6 solid;
    border-radius: 32px;
    padding: 50px 0;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    img {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      border: 0!important;
    }
    img[src] {
      display: block;
    }
    input {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0!important;
    }
      svg {
        opacity: 20%;
      }
  }
}
</style>