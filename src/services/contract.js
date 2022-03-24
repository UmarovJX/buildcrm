import {axiosV1CRM} from '@/services/core/base'
import Core from '@/services/core/index'

class Companies extends Core {
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

export default Companies