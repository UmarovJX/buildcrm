import { ref } from "vue";

const showPrice = ref(true);
export function useHideM2() {
  const changeHide = function () {
    showPrice.value = !showPrice.value;
  };

  return {
    showPrice,
    changeHide,
  };
}
