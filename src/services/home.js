import Core from "@/services/core/index";
import { axiosV1CRM } from "@/services/core/base";

class Home extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios);
  }

  fetchHome() {
    return this.get("home");
  }

  fetchMenu() {
    return this.get("menus");
  }

  fetchCashiers() {
    return this.get("api/cashiers");
  }

  fetchCashier(cashierId) {
    return this.get(`api/cashiers/update/${cashierId}`);
  }
}

export default Home;
