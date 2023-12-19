import { axiosV1CRM } from '@/services/core/base'
import Core from '@/services/core/index'

class Companies extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios)
  }

  getCompaniesList() {
    return this.get('companies')
  }

  getCompany(companyId) {
    return this.get(`companies/${companyId}`)
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
    return this.post(
      `companies/${company}/payment-details/${detailId}/isPrimary`,
      data,
    )
  }

  getPaymentsList(companyId) {
    return this.get(`companies/${companyId}/payment-details`)
  }

  addPayment(companyId, form) {
    return this.post(`companies/${companyId}/payment-details`, form)
  }

  getPaymentId(companyId, id) {
    return this.get(`companies/${companyId}/payment-details/${id}`)
  }

  deletePayment(companyId, id) {
    return this.delete(`companies/${companyId}/payment-details/${id}`)
  }

  updatePayment(companyId, id, data) {
    return this.put(`companies/${companyId}/payment-details/${id}`, data)
  }

  deleteCompany(id) {
    return this.delete(`companies/${id}`)
  }

  createNewCompany(newCompany) {
    return this.post('companies', newCompany)
  }
}

export default Companies
