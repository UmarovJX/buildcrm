<template>
  <div class="multiple form-group">
    <label for class="text-sm-center font-weight-bold text-primary">
      hello world
    </label>
    <div class="d-flex">
      <div>
        <input type="file"
          ref="uploadInput"
          @change="handleChange()"
          class="form-control"/>
        <div class="d-flex uploader-mask justify-content-center align-items-center">
          <img src="@/assets/outbox.png" class="uploader-icon img-fluid" alt></img>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MultipleUploader"
}
</script>

<style scoped>

</style>