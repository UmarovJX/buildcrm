import { v3ServiceApi } from "@/services/v3/v3.service.js";
import Core from "@/services/core/index";

class TranslationsV3 extends Core {
  constructor(axios = v3ServiceApi) {
    super(axios);
  }

  getTranslations(body) {
    return this.post(`translation/index`, body);
  }
  createTranslation(body) {
    return this.post(`translation/create`, body);
  }
  updateTranslation(body) {
    return this.post(`translation/update`, body);
  }
  bulkSave(body) {
    return this.post("translation/bulkSave", body);
  }
  removeTranslation(body) {
    return this.post(`translation/remove`, body);
  }
}

export default {
  TranslationsV3,
};
