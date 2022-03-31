import {axiosV1CRM, axiosV2} from '@/services/core/base'
import Core from '@/services/core/index'

class Contract extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios)
    }

    downloadContract(id) {
        return this.get('orders/' + id + '/contract')
    }

    fetchContract(id) {
        return this.get(`orders/${id}`)
    }

    fetchDeals(params) {
        return this.get('deals', params)
    }

    cancelContract(id, body) {
        return this.post(`deals/${id}`, body)
    }
}

class ContractV2 extends Core {
    constructor(axios = axiosV2) {
        super(axios)
    }

    fetchContractsList(params) {
        return this.get(`contracts`, {params})
    }
}

export default {
    Contract,
    ContractV2
}