import { axiosV1CRM } from '@/services/core/base'
import Core from '@/services/core/index'

class Accountants extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios)
  }

  fetchAccountant(accountantId) {
    return this.get(`api/accountants/update/${accountantId}`)
  }

  fetchAccountants() {
    return this.get('api/accountants')
  }
}

export default Accountants
