import Vue from 'vue';
import VueLang from 'vue-i18n';
import Message from './messages';

Vue.use(VueLang);

const language = document.documentElement.lang;

const i18n = new VueLang({
    locale: language,
    messages: Message,
});

export default i18n;