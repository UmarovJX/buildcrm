import Core from "@/services/core/index";
import { axiosBase } from "@/services/core/base";

class V3Service extends Core {
  constructor(
    axios = axiosBase({
      endpoint: "/api",
      headers: {
        "Accept-Language": "",
      },
    })
  ) {
    super(axios);
  }

  base(endpoint = "") {
    return {
      create: (b) => this.post(endpoint + "/create", b),
      update: (b) => this.post(endpoint + "/update", b),
      remove: (b) => this.post(endpoint + "/remove", b),
      findOne: (b) => this.post(endpoint + "/findOne", b),
      findAll: (b) => this.post(endpoint + "/findAll", b),
    };
  }

  holders(endpoint = "holders") {
    return this.base(endpoint);
  }

  statuses(endpoint = "statuses") {
    return this.base(endpoint);
  }

  apartments(endpoint = "apartments") {
    return {
      setStatus: (b) => this.post(endpoint + "/status", b),
      setHolder: (b) => this.post(endpoint + "/holder", b),
    };
  }
}

export const v3ServiceApi = new V3Service();
