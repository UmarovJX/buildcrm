<template>
    <div class="new-object p-3">
      <!-- Комментария -->
      <div class="">
        <label>Комментария</label>
        <textarea
            rows="3"
            cols="3"
            v-model="contract.comment"
            class="form-control"
        ></textarea>
      </div>

      <!-- error msg -->
      <div class="alert alert-danger mt-3" v-if="error">
        <ul>
          <li v-for="(error, index) in errors" :key="index">
            <span v-for="msg in error" :key="msg">
              {{ msg }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Btns -->
      <div class="sidebar-btns">
        <div class="row justify-content-center">

          <button
              type="button"
              class="btn text-dark mx-md-2"
              @click="removeBlock"
          >
            {{ $t("cancel") }}
          </button>

          <button
              type="button"
              class="btn btn-secondary ml-2"
              @click="[(contract.step = 1), (buttons.next = true), (buttons.confirm = false)]"
          >
            <i class="fa fa-chevron-circle-left"></i>
            {{ $t("back") }}
          </button>


          <button
              type="submit"
              class="btn btn-success mr-0"
              v-if="!buttons.loading && buttons.confirm"
          >
            {{ $t("create_agree") }}
            <i class="fa fa-file-contract"></i>
          </button>
          <button
              v-if="buttons.loading && buttons.confirm"
              type="button"
              class="btn btn-success mr-0"
          >
            {{ $t("create_agree") }}
            <i class="fas fa-spinner fa-spin"></i>
          </button>
        </div>

      </div>
    </div>
</template>

<script>
export default {
  name: "Confirm",

  props: {
    client: {},
    apartments: {},
    contract: {},
    discounts: {},
    buttons: {},
    order: {}
  },

  data() {
    return {
      header: {
        headers: {
          Authorization: "Bearer " + localStorage.token,
        },
      },
    }
  },

  methods: {
    removeBlock() {
      this.$swal({
        title: this.$t("sweetAlert.title"),
        text: this.$t("sweetAlert.text_cancel_agree"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: this.$t("sweetAlert.yes_close"),
      }).then((result) => {
        if (result.value) {
          this.expiredConfirm();
        }
      });
    },

    async expiredConfirm() {
      try {
        this.loading = true;
        await this.axios
            .delete(
                process.env.VUE_APP_URL +
                `/orders/${this.order.uuid}/hold/`,
                this.header
            )
            .then(() => {
              this.$router.push({
                name: "apartments",
              });
            })
            .catch();
      } catch (error) {
        if (!error.response) {
          this.toasted("Error: Network Error", "error");
        } else {
          const status = error.response.status
          const message = error.response.data.message

          /* CLIENT AND SERVER ERROR */
          if (status && status >= 400 && status <= 511) {
            this.toasted(message, 'error')
          }
        }
      } finally {
        this.loading = false;
      }
    },

  }
}
</script>

<style scoped>

</style>