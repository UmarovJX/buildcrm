import Vue from "vue";
import VueLang from "vue-i18n";
import ru from "./ru/index";
import uz from "./uz/index";
Vue.use(VueLang);
const language = localStorage.locale;
const i18n = new VueLang({
  locale: language,
  fallbackLocale: "ru",
  messages: {
    ru,
    uz,
  },
});

export default i18n;
