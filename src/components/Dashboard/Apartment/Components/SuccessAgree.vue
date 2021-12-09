<template>
  <div>
    <b-modal
      id="modal-success-agree"
      ref="modal"
      title="Договор успешно создан!"
      hide-footer
      @hidden="resetModal"
    >
      <div class="my-3">
        <h6>№ договора - {{ contract.contract }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">{{ contract.contract }}.docx</h6>
        <button @click="goApartment" class="my-download btn btn-link">
          <i class="far fa-download"></i> <span>Скачать</span>
        </button>
      </div>

      <div
        class="
          mt-4
          d-flex
          justify-content-md-start justify-content-center
          float-right
        "
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
  mounted() {
    this.$root.$on("bv::modal::hide");
  },
  methods: {
    resetModal() {
      this.$bvModal.hide("modal-success-agree");
      if (this.$route.name === "confirm-apartment") {
        this.$router.push({
          name: "apartments-view",
          params: {id: this.$route.params.id},
        });
      }
    },
    goApartment() {
      this.$bvModal.hide("modal-success-agree");
      if (this.$route.name === "confirm-apartment") {
        this.$router.push({
          name: "apartments-view",
          params: {id: this.$route.params.id},
        });
      }
    },
  },
};
</script>

<style scoped></style>
