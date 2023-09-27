import Core from "@/services/core/index";
import { axiosBase } from "@/services/core/base";

class V3Service extends Core {
  constructor(
    axios = axiosBase({
      endpoint: "/api",
    })
  ) {
    super(axios, {
      headers: {
        "Accept-Language": "",
      },
    });
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

  exportModule = {
    orderFile: (b) => this.post("order/export", b),
    orderCheckExport: (b) => this.post("order/checkExport", b),
    orderList: (b) => this.post("order/exportApi", b),
    orderReportFile: (b) => this.post("report/export", b),
    checkExport: (b) => this.post("reports/checkExport", b),
  };

  reports = {
    create: (b) => this.post("reports/create", b),
    checkStatus: (b) => this.post("reports/check_status", b),
    getFilePath: (b) => this.post("reports/getFile", b),
    retryFailedReport: (b) => this.post("reports/retry", b),
    cancel: (b) => this.post("reports/cancel", b),
    findAll: (b) => this.post("reports/findAll", b),
    findAllByUser: (b) => this.post("reports/findAllByUser", b),
  };
}

export const v3ServiceApi = new V3Service();
