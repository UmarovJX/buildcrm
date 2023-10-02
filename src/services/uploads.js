import { v3ServiceApi } from "@/services/v3/v3.service.js";
import Core from "@/services/core/index";

class UploadsV3 extends Core {
  constructor(axios = v3ServiceApi) {
    super(axios);
  }

  createUpload(body) {
    return this.post(`upload/create`, body);
  }
  removeUpload(body) {
    return this.post(`upload/remove`, body);
  }
}

export default {
  UploadsV3,
};
