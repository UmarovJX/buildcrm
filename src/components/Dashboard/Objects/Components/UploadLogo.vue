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
            id="image"
          />
        </div>

        <div class="float-right mt-3">
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

<script>
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

  mounted() {},

  methods: {
    resetModal() {
      this.image = null;

      this.$bvModal.hide("modal-upload-logo");

      this.error = false;
      this.errors = [];
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
        const response = await this.axios.post(
          process.env.VUE_APP_URL + "/objects/" + this.objectId,
          formData,
          this.header
        );

        this.toasted(response.data.message, "success");

        this.$nextTick(() => {
          this.$bvModal.hide("modal-upload-logo");
        });

        this.$emit("UploadLogo");
      } catch (error) {
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          if (error.response.status === 403) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 401) {
            this.toasted(error.response.data, "error");
          } else if (error.response.status === 500) {
            this.toasted(error.response.data.message, "error");
          } else if (error.response.status === 422) {
            this.error = true;
            this.errors = error.response.data;
          } else {
            this.toasted(error.response.data.message, "error");
          }
        }
      }
    },
  },
};
</script>

<style scoped></style>
