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
    fetchTypeOptions: () => this.post("reports/types"),
  };

  botObjects = {
    create: (b) => this.post("bot-object/create", b),
    fetchObjects: (b) => this.post("bot-object/index", b),
    update: (b) => this.post("bot-object/update", b),
    remove: (b) => this.post("bot-object/remove", b),
  };
  botPages = {
    create: (b) => this.post("bot-page/create", b),
    fetchPages: (b) => this.post("bot-page/index", b),
    update: (b) => this.post("bot-page/update", b),
    remove: (b) => this.post("bot-page/remove", b),
  };
  facility = {
    create: (b) => this.post("facility/create", b),
    fetch: (b) => this.post("facility/index", b),
    update: (b) => this.post("facility/update", b),
    remove: (b) => this.post("facility/remove", b),
  };

  orders = {
    getPaymentHistoryStatusCount: () =>
      this.post("orders/payment-history/statusCount"),
    findAll: (b) => this.post("orders/payment-history/findAll", b),
    findByContract: (b) =>
      this.post("orders/payment-history/findByContract", b),
    contractFilterList: (b) => this.post("orders/contractFilterList", b),
    bulkUpdate: (c, id) =>
      this.put(
        `orders/payment-history/bulkUpdate?contract=${c}&order_uuid=${id}`
      ),
    statisticsTotal: () => this.post("orders/payment-history/statisticsTotal"),
  };
  clients = {
    getCount: () => this.post("clients/getCount"),
    findAll: (b) => this.post("clients", b),
    findOne: (b) => this.post("clients/findOne", b),
    orders: (b) => this.post("clients/orders", b),
    telegramAccounts: (b) => this.post("clients/telegramAccounts", b),
  };
  stats = {
    getWidgets: (b) => this.post("statistics/total", b),
    getSalesData: (b) => this.post("statistics/sales", b),
    getObjectPie: (b) => this.post("statistics/objects", b),
    getTariffsPie: (b) => this.post("statistics/tariffs", b),
    getManagersPie: (b) => this.post("statistics/managers", b),
    getOrdersData: (b) => this.post("statistics/orders", b),
    getBranchesData: (b) => this.post("statistics/branches", b),
  };
  managerStats = {
    getTotal: (b) => this.post("statistics/manager/total", b),
    getSales: (b) => this.post("statistics/manager/orders", b),
    getSalesPie: (b) => this.post("statistics/manager/objects", b),
    getStatusPie: (b) => this.post("statistics/manager/orders/pie", b),
  };
}

export const v3ServiceApi = new V3Service();
