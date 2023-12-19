<script>
import api from '@/services/api'

export default {
  props: {
    contract: {
      type: Object,
    },
    apartments: {
      type: Array,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      getLoading: false,
    }
  },
  emits: ['redirect-to-main-page'],
  mounted() {
    this.$root.$on('bv::modal::hide')
  },
  methods: {
    downloadContractLink() {
      api.contract
        .downloadContract(this.uuid)
        .then(({ data, headers }) => {
          const filename = headers.hasOwnProperty('x-filename')
            ? headers['x-filename']
            : 'contract'
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
            type: 'error',
          })
        })
        .finally(() => {
          this.goApartment()
        })
    },
    resetModal() {
      this.$bvModal.hide('modal-success-agree')
      if (this.$route.name === 'confirm-apartment') {
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
          name: 'apartments',
        })
      } else {
        this.$emit('redirect-to-main-page')
      }
    },
    goApartment() {
      this.$bvModal.hide('modal-success-agree')
      if (
        this.$route.name === 'confirm-apartment'
        || this.$route.name === 'edit-apartment'
      ) {
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
          name: 'apartments',
        })
      } else {
        this.$router.push({
          name: 'apartments',
          params: {
            object: this.apartments[0].object.id,
            id: this.$route.params.id,
          },
        })
      }
    },
    closeSuccessModal() {
      this.$emit('redirect-to-main-page')
    },
  },
}
</script>

<template>
  <div>
    <b-modal
      id="modal-success-agree"
      ref="modal"
      title="Договор успешно создан!"
      hide-footer
      @hide="closeSuccessModal"
    >
      <div class="my-3">
        <h6>№ договора - {{ contract.contract }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <h6 class="mb-0">
          {{ contract.contract }}.docx
        </h6>
        <!-- <button @click="goApartment" class="my-download btn btn-link">
          <i class="far fa-download"></i> <span>Скачать</span>
        </button> -->
        <a
          href="#"
          class="my-download btn btn-link"
          @click="downloadContractLink"
        ><i class="far fa-download" /> <span>Скачать</span></a>
      </div>

      <div
        class="mt-4 d-flex justify-content-md-start justify-content-center float-right"
      >
        <button
          type="button"
          class="btn btn-default mr-2"
          @click="goApartment"
        >
          {{ $t("close") }}
        </button>
      </div>
    </b-modal>

    <b-overlay
      :show="getLoading"
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
  </div>
</template>

<style scoped></style>
