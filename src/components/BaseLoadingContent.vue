<script>
export default {
  name: 'BaseLoadingContent',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <b-overlay
    :show="loading"
    no-wrap
    opacity="0.5"
    style="z-index: 2222"
  >
    <template #overlay>
      <div class="d-flex justify-content-center w-100">
        <div class="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    </template>
  </b-overlay>
</template>

<style scoped></style>
