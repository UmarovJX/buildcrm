<template>
  <div>
    <b-modal
      id="modal-success-agree"
      ref="modal"
      title="Договор успешно создан!"
      hide-footer
      @show="resetModal"
    >
      <div class="my-3">
        <h6>№ договора - {{ contract.contract }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">{{ contract.contract }}.docx</h6>
        <a :href="contract.contract_path" class="my-download"
          ><i class="far fa-download"></i> <span>Скачать</span></a
        >
      </div>

      <div
        class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
      >
        <button type="button" class="btn btn-default mr-2" @click="resetModal">
          {{ $t("close") }}
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: ["contract"],

  data: () => ({}),

  methods: {
    resetModal() {
      this.$bvModal.hide("modal-success-agree");
    },
  },
};
</script>

<style scoped></style>
