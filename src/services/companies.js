import {axiosV1CRM} from '@/services/core/base'
import Core from '@/services/core/index'

class Companies extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios)
    }

    getCompaniesList() {
        return this.get('companies')
    }

    getCompanyBranch(branchId) {
        return this.get(`companies/${branchId}`)
    }

    getCompanyType() {
        return this.get('companies/types')
    }

    updateCompany(company) {
        return this.put(`companies/${company.id}`, company)
    }

    changeStatusCompany(company, detailId, data) {
        return this.post(`companies/${company}/payment-details/${detailId}`, data)
    }

    getPaymentsList(companyId) {
        return this.get(`companies/${companyId}/payment-details`)
    }

    addPayment(companyId, form) {
        return this.post(`companies/${companyId}/payment-details`, form)
    }

    deleteCompany(id) {
        return this.delete(`companies/${id}`)
    }

    createNewCompany(newCompany) {
        return this.post('companies', newCompany)
    }
}

export default Companies