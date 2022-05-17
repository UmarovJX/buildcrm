<template>
  <div>
    <b-modal
        id="modal-success-agree"
        ref="modal"
        title="Договор успешно создан!"
        hide-footer
    >
      <div class="my-3">
        <h6>№ договора - {{ contract.contract }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">{{ contract.contract }}.docx</h6>
        <!-- <button @click="goApartment" class="my-download btn btn-link">
          <i class="far fa-download"></i> <span>Скачать</span>
        </button> -->
        <a
            href="#"
            @click="downloadContractLink"
            class="my-download btn btn-link"
        ><i class="far fa-download"></i> <span>Скачать</span></a
        >
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

    <b-overlay :show="getLoading" no-wrap opacity="0.5" style="z-index: 2222">
      <template #overlay>
        <div class="d-flex justify-content-center w-100">
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  data() {
    return {
      getLoading: false
    }
  },
  props: {
    contract: {
      type: Object,
    },
    apartments: {
      type: Number,
    },
  },
  mounted() {
    this.$root.$on("bv::modal::hide");
  },
  methods: {
    downloadContractLink() {
      const {id} = this.$route.params
      api.contract.downloadContract(id)
          .then(({data, headers}) => {
            const filename = headers.hasOwnProperty('x-filename') ? headers['x-filename'] : 'contract'
            const fileURL = window.URL.createObjectURL(new Blob([data]))
            const fileLink = document.createElement('a')
            fileLink.href = fileURL
            fileLink.setAttribute('download', filename)
            document.body.appendChild(fileLink)
            fileLink.click()
            // window.open(process.env.VUE_APP_URL + `/orders/${id}/contract`)
          })
          .catch(() => {
            const message = `${this.$t('contract_file_not_found')}`
            this.$toasted.show(message, {
              type: 'error'
            })
          })
          .finally(() => {
            this.goApartment()
          })
    },
    resetModal() {
      this.$bvModal.hide("modal-success-agree");
      if (this.$route.name === "confirm-apartment") {
        // if (this.apartments === 1) {
        //   this.$router.push({
        //     name: "apartment-view",
        //     params: {id: this.$route.params.id},
        //   });
        // } else {
        //   this.$router.push({
        //     name: "apartments",
        //   });
        // }
        this.$router.push({
          name: "apartments",
        });
      }
    },
    goApartment() {

      this.$bvModal.hide("modal-success-agree");
      if (this.$route.name === "confirm-apartment") {
        // if (this.apartments === 1) {
        //   this.$router.push({
        //     name: "apartment-view",
        //     params: {id: this.$route.params.id},
        //   });
        // } else {
        //   this.$router.push({
        //     name: "apartments",
        //   });
        // }
        this.$router.push({
          name: "apartments",
        });
      }
    },
  },
};
</script>

<style scoped></style>
