import {axiosV1CRM, axiosV2} from '@/services/core/base'
import Core from '@/services/core/index'

class DebtorsV1 extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios)
    }

    fetchDebtors(page) {
        return this.get(`debtors?page=${page}`)
    }

    filterDebtors(page, body) {
        return this.get(`debtors?page=${page}`, {params: body})
    }

    createPayment(id, body) {
        return this.post(`debtors/payment/${id}/store`, body)
    }

    deleteMonthlyDebt(id) {
        return this.delete(`debtors/${id}`)
    }

    updateMonthlyDebt(id, body) {
        return this.put(`debtors/${id}`, body)
    }

    createMonthlyPayment(id, body) {
        return this.post(`debtors/${id}`, body)
    }
}

class DebtorsV2 extends Core {
    constructor(axios = axiosV2) {
        super(axios)
    }

    fetchDebtorsList(params) {
        return this.get('debtors', {params})
    }

}


export default {
    DebtorsV1,
    DebtorsV2
}