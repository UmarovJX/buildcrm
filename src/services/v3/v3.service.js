import Core from '@/services/core/index'
import { axiosBase } from '@/services/core/base'

class V3Service extends Core {
  constructor(
    axios = axiosBase({
      endpoint: '/api',
    }),
  ) {
    super(axios, {
      headers: {
        'Accept-Language': '',
      },
    })
  }

  base(endpoint = '') {
    return {
      show: b => this.post(`${endpoint}/show`, b),
      create: b => this.post(`${endpoint}/create`, b),
      update: b => this.post(`${endpoint}/update`, b),
      remove: b => this.post(`${endpoint}/remove`, b),
      index: b => this.post(`${endpoint}/index`, b),
      findOne: b => this.post(`${endpoint}/findOne`, b),
      findAll: b => this.post(`${endpoint}/findAll`, b),
    }
  }

  holders(endpoint = 'holders') {
    return this.base(endpoint)
  }

  statuses(endpoint = 'statuses') {
    return this.base(endpoint)
  }

  apartments(endpoint = 'apartments') {
    return {
      setStatus: b => this.post(`${endpoint}/status`, b),
      setHolder: b => this.post(`${endpoint}/holder`, b),
    }
  }

    exportModule = {
      orderFile: b => this.post('order/export', b),
      orderCheckExport: b => this.post('order/checkExport', b),
      orderList: b => this.post('order/exportApi', b),
      orderReportFile: b => this.post('report/export', b),
      checkExport: b => this.post('reports/checkExport', b),
    };

    reports = {
      create: b => this.post('reports/create', b),
      checkStatus: b => this.post('reports/check_status', b),
      getFilePath: b => this.post('reports/getFile', b),
      retryFailedReport: b => this.post('reports/retry', b),
      cancel: b => this.post('reports/cancel', b),
      findAll: b => this.post('reports/findAll', b),
      findAllByUser: b => this.post('reports/findAllByUser', b),
      fetchTypeOptions: () => this.post('reports/types'),
    };

    botObjects = {
      create: b => this.post('bot-object/create', b),
      fetchObjects: b => this.post('bot-object/index', b),
      update: b => this.post('bot-object/update', b),
      remove: b => this.post('bot-object/remove', b),
    };

    botPages = {
      create: b => this.post('bot-page/create', b),
      fetchPages: b => this.post('bot-page/index', b),
      update: b => this.post('bot-page/update', b),
      remove: b => this.post('bot-page/remove', b),
    };

    facility = {
      create: b => this.post('facility/create', b),
      fetch: b => this.post('facility/index', b),
      update: b => this.post('facility/update', b),
      remove: b => this.post('facility/remove', b),
    };

    orders = {
      getPaymentHistoryStatusCount: () => this.post('orders/payment-history/statusCount'),
      findAll: b => this.post('orders/payment-history/findAll', b),
      findByContract: b => this.post('orders/payment-history/findByContract', b),
      contractFilterList: b => this.post('orders/contractFilterList', b),
      bulkUpdate: (c, id) => this.put(
        `orders/payment-history/bulkUpdate?contract=${c}&order_uuid=${id}`,
      ),
      statisticsTotal: () => this.post('orders/payment-history/statisticsTotal'),
    };

    clients = {
      getCount: () => this.post('clients/getCount'),
      findAll: b => this.post('clients', b),
      findOne: b => this.post('clients/findOne', b),
      orders: b => this.post('clients/orders', b),
      telegramAccounts: b => this.post('clients/telegramAccounts', b),
    };

    stats = {
      getWidgets: b => this.post('statistics/total', b),//owner
      getSalesData: b => this.post('statistics/sales', b),//owner
      getObjectPie: b => this.post('statistics/objects', b),//owner
      getTariffsPie: b => this.post('statistics/tariffs', b),//owner
      getManagersPie: b => this.post('statistics/managers', b),//owner
      getOrdersData: b => this.post('statistics/orders', b),//owner
      getBranchesData: b => this.post('statistics/branches', b),//owner
      objectsByPeriod: b => this.post('statistics/objects-by-period', b),
      objectPayments: b => this.post('statistics/object-payments', b),
      main: b => this.post('statistics/main', b),
      total: b => this.post('statistics/total', b),
    };

    managerStats = {
      getManagersPie: b => this.post('statistics/managers', b),
      getTotal: b => this.post('statistics/manager/total', b),
      getSales: b => this.post('statistics/manager/orders', b),
      getSalesPie: b => this.post('statistics/manager/objects', b),
      getStatusPie: b => this.post('statistics/manager/orders/pie', b),
    };

    reissueTypes = {
      create: b => this.post('reorder/types/create', b),
      update: b => this.post('reorder/types/update', b),
      remove: b => this.post('reorder/types/remove', b),
      findOne: b => this.post('reorder/types/show', b),
      findAll: b => this.post('reorder/types/index', b),
    }

    plan = {
      create: b => this.post('plan/create', b),
      update: b => this.post('plan/update', b),
      remove: b => this.post('plan/remove', b),
      findOne: b => this.post('plan/show', b),
      findAll: b => this.post('plan/index', b),
      types: b => this.post('plan/types', b),
      filterParams: b => this.post('plan/filter-params', b),
    }

    permission = {
      ...this.base('permission'),
      group: this.base('permission-group'),
    }

    role = this.base('role')

    templates = {
      getDealTemplateList: objectId => this.get(`v2/templates/branch/${objectId}`),
      addNewContract: ({ id, form }) => this.post(`v2/templates/branch/${id}`, form),
      makeContractPrimary: ({ objectId, contractId }) => this.put(
        `v2/templates/branch/${objectId}/contract/${contractId}/primary`,
      ),
      deleteContract: ({ objectId, contractId }) => this.delete(`v2/templates/branch/${objectId}/contract/${contractId}`),
    }

    home = {
      stat: {
        initialPayments: b => this.post('statistics/home/initial-payments', b),
        debtors: b => this.post('statistics/home/debtors', b),
        sales: b => this.post('statistics/home/sales', b),
      },
    }
}

// eslint-disable-next-line import/prefer-default-export
export const v3ServiceApi = new V3Service()
