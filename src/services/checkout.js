import { axiosV1CRM, axiosV2 } from "@/services/core/base";
import Core from "@/services/core/index";

class CheckoutV1 extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios);
  }

  authenticateApartments({ uuid, body }) {
    return this.post(`checkout/${uuid}`, body);
  }
}

class CheckoutV2 extends Core {
  constructor(axios = axiosV2) {
    super(axios);
  }
}

export const checkoutV1 = new CheckoutV1();
export const checkoutV2 = new CheckoutV2();
