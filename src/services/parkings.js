import { v3ServiceApi } from "@/services/v3/v3.service.js";
import Core from "@/services/core/index";

class ParkingsV3 extends Core {
  constructor(axios = v3ServiceApi) {
    super(axios);
  }

  getObjectParkings(body) {
    return this.post(`parking/findAll`, body);
  }

  createParking(body) {
    return this.post(`parking/create`, body);
  }
  updateParking(body) {
    return this.post(`parking/update`, body);
  }
  removeParking(body) {
    return this.post(`parking/remove`, body);
  }
}

export default {
  ParkingsV3,
};
