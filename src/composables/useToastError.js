import { getCurrentInstance } from "vue";

export function useToastError() {
  const vm = getCurrentInstance();
  function toastError(error) {
    if (!error.response) {
      vm.proxy.toasted(`Error: ${error}`, "error");
    } else {
      const status = error?.response?.status;
      const message = error.response.data.message;

      /* CLIENT AND SERVER ERROR */
      if (status && status >= 400 && status <= 511) {
        vm.proxy.toasted(message, "error");
      }
    }
  }

  return {
    toastError,
  };
}
