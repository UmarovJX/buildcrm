import { ref } from "vue";

const showPrice = ref(!!+localStorage.getItem("showPrice"));
export function useShowPrice() {
  const changeHide = function () {
    showPrice.value = !showPrice.value;
    localStorage.setItem("showPrice", +showPrice.value);
  };

  return {
    showPrice,
    changeHide,
  };
}
