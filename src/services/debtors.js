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

    getMoreDataAboutDebt(uuid) {
        return this.get(`debtors/${uuid}`)
    }

    checkImportDebtors(body) {
        return this.post(`debtors/import`, body)
    }

    searchContract(params) {
        return this.get('/debtors/import', {params})
    }

    createAliases(body) {
        return this.post('debtors/import/alias', body)
    }

    updateAliases(body) {
        return this.put('debtors/import/alias', body)
    }

    viewImportList(body) {
        return this.post('debtors/import/contracts', body)
    }

    activatePayments(body) {
        return this.post('debtors/import/payments', body)
    } 

    downloadDebtorsTemplate(){
        return this.get('debtors/template')
    }


}


export default {
    DebtorsV1,
    DebtorsV2
}