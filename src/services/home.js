import Core from '@/services/core/index'
import { axiosV1CRM, stats } from '@/services/core/base'

class Home extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios)
  }

  fetchHome() {
    return this.get('home')
  }

  fetchMenu() {
    return this.get('menus')
  }

  fetchCashiers() {
    return this.get('api/cashiers')
  }

  fetchCashier(cashierId) {
    return this.get(`api/cashiers/update/${cashierId}`)
  }
}

export class Statistics extends Core {
  constructor(axios = stats) {
    super(axios)
  }

  getWidgets() {
    return this.post('api/statistics/total')
  }

  getSalesData() {
    return this.post('api/statistics/initial-payment/graph')
  }

  getObjectPie() {
    return this.post('/api/statistics/objects')
  }

  getTariffsPie() {
    return this.post('/api/statistics/tariffs')
  }

  getManagersPie() {
    return this.post('/api/statistics/managers')
  }

  getOrdersData(d) {
    return this.post('/api/statistics/orders', d)
  }

  getBranchesData(d) {
    return this.post('/api/statistics/branches', d)
  }
}

export default Home
