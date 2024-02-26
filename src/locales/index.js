import Vue from 'vue'
import VueLang from 'vue-i18n'
import ru from './ru/index'
import uz from './uz/index'
import api from '@/services/api'
Vue.use(VueLang)



const language = localStorage.locale

export function initI18n() {
  return api.translationsV3.findAll({ tags: ['main'] }).then(({ data }) => {
    return new VueLang({
      locale: language,
      fallbackLocale: 'ru',
      messages: {
        ru: Object.assign(ru, data.result),
        uz,
      }
    })
  }).catch(() => {
    return new VueLang({
      locale: language,
      fallbackLocale: 'ru',
      messages: {
        ru,
        uz,
      }
    })
  })
}



