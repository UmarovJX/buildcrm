import { v3ServiceApi } from '@/services/v3/v3.service.js'
import Core from '@/services/core/index'

class LanguagesV3 extends Core {
  constructor(axios = v3ServiceApi) {
    super(axios)
  }

  getLanguages(body) {
    return this.post('language/index', body)
  }

  getAllLanguages() {
    return this.post('language/list')
  }

  createLanguage(body) {
    return this.post('language/create', body)
  }

  updateLanguage(body) {
    return this.post('language/update', body)
  }

  removeLanguage(body) {
    return this.post('language/remove', body)
  }
  // getObjectParkings(body) {
  //   return this.post(`parking/findAll`, body);
  // }

  // createParking(body) {
  //   return this.post(`parking/create`, body);
  // }
  // createParkingMultiple(body) {
  //   return this.post(`parking/createMultiple`, body);
  // }
  // updateParking(body) {
  //   return this.post(`parking/update`, body);
  // }
  // removeParking(body) {
  //   return this.post(`parking/remove`, body);
  // }
  // changeIsSold(body) {
  //   return this.post(`parking/isSold`, body);
  // }
}

export default {
  LanguagesV3,
}
