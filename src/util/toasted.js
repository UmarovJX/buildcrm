export default {
  methods: {
    toasted(message, type) {
      return this.$toasted.show(message, { type: type });
    },

    toastedWithErrorCode(error) {
      console.error("toastedWithErrorCode", error);
      if (!error.response) {
        this.toasted(`Error: ${error}`, "error");
      } else {
        const status = error?.response?.status;
        const message = error.response.data.message;

        /* CLIENT AND SERVER ERROR */
        if (status && status >= 400 && status <= 511) {
          this.toasted(message, "error");
        }
      }
    },
  },
};


