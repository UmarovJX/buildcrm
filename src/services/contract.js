import {axiosV1CRM, axiosV2} from '@/services/core/base'
import Core from '@/services/core/index'

class Contract extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios)
    }

    fetchDeals(params) {
        return this.get('deals', params)
    }

    cancelContract(id, body) {
        return this.post(`deals/${id}`, body)
    }

    downloadContract(id) {
        return this.get('orders/' + id + '/contract', {
            responseType: 'blob'
        })
    }
}

class ContractV2 extends Core {
    constructor(axios = axiosV2) {
        super(axios)
    }

    fetchContractsList(params) {
        return this.get(`contracts`, {params})
    }

    fetchObjectsOption() {
        return this.get(`contracts/filter-fields`)
    }

    fetchContractView(id) {
        return this.get(`contracts/${id}`)
    }

    getUpdateContractView(id) {
        return this.get(`contracts/${id}/update`)
    }

    orderUpdate(id, body) {
        return this.put(`contracts/${id}`, body)
    }

    fetchClientInfo(id) {
        return this.get('contracts/' + id + '/client')
    }

    fetchContractDetails(id) {
        return this.get('contracts/' + id + '/details')
    }

    getContractApartments(id) {
        return this.get('contracts/' + id + '/apartments')
    }

    fetchPaymentSchedule(id, params) {
        return this.get('contracts/' + id + '/payment-schedule', {params})
    }

    fetchPayments(id, params) {
        return this.get('contracts/' + id + '/payments', {params})
    }

    toggleClientType(id) {
        return this.put('contracts/' + id + '/client')
    }

    appendPayment(id, body) {
        return this.post(`contracts/${id}/payments`, body)
    }

    importPaymentTransaction(id, payments) {
        return this.post(`contracts/${id}/payments/import`, {payments})
    }

    removePaymentTransaction(contractId, transactionId) {
        return this.delete(`contracts/${contractId}/payments/${transactionId}`)
    }

    editPaymentTransaction({contractId, transactionId, params}) {
        return this.put(`contracts/${contractId}/payments/${transactionId}`, params)
    }

    downloadContractTemplate() {
        return this.get('contracts/template', {
            responseType: 'blob'
        })
    }

    deleteContract(contractId, body) {
        return this.post(`contracts/${contractId}`, body)
    }
}

export default {
    Contract,
    ContractV2
}