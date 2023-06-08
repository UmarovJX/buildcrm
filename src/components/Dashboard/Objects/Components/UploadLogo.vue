<script>
import api from "@/services/api";
import Compressor from "compressorjs";

export default {
  props: {
    objectId: {},
  },

  data: () => ({
    object_id: 0,
    image: null,

    error: false,
    errors: [],

    header: {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    },
  }),

  methods: {
    resetModal() {
      this.image = null;

      this.$bvModal.hide("modal-upload-logo");

      this.error = false;
      this.errors = [];
    },

    compressImage(file) {
      const fileUpl = file.target.files ? file.target.files[0] : null;
      if (!fileUpl) {
        return;
      }

      new Compressor(fileUpl, {
        maxWidth: 1200,
        quality: 0.8,
        convertSize: 5000000,
        success: (result) => {
          this.output = new File([result], result.name, {
            type: result.type,
            lastModified: Date.now(),
          });
          this.image = URL.createObjectURL(this.output);
        },
      });
    },

    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },

    posterFile(event) {
      this.image = event.target.files[0];
    },

    async handleSubmit() {
      const formData = new FormData();
      formData.append("image", this.image);

      try {
        const response = await api.objects.updateLogo(this.objectId, formData);
        this.toasted(response.data.message, "success");

        this.$nextTick(() => {
          this.$bvModal.hide("modal-upload-logo");
        });

        this.$emit("UploadLogo");
      } catch (error) {
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 422) {
            this.error = true;
            this.errors = error.response.data;
          } else if (error.response.status) {
            console.log("lol");
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <b-modal
      id="modal-upload-logo"
      ref="modal"
      :title="$t('upload_logo')"
      hide-footer
      @show="resetModal"
    >
      <b-alert show variant="danger" v-if="error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ msg }}
            </span>
          </li>
        </ul>
      </b-alert>

      <form ref="form" @submit.stop.prevent="handleSubmit">
        <div class="mb-3">
          <label for="image" class="form-label">
            {{ $t("image") }}
          </label>
          <input
            type="file"
            @change="posterFile($event)"
            class="form-control"
            accept="image/*"
            id="image"
          />
        </div>

        <div class="d-flex justify-content-center mt-3">
          <b-button variant="light" @click="resetModal">
            {{ $t("cancel") }}
          </b-button>

          <b-button type="submit" class="ml-1" variant="success">
            <i class="fas fa-save"></i> {{ $t("save") }}
          </b-button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<style scoped></style>
