import Core from "@/services/core";

class Companies extends Core {
    getCompaniesList() {
        return this.get('/companies')
    }

    getCompanyType() {
        return this.get('companies/types')
    }

    updateCompany(company) {
        return this.put(`companies/${company.id}`, company)
    }

    deleteCompany(id){
        return this.delete(`companies/${id}`)
    }

    createNewCompany(newCompany) {
        return this.post('companies', newCompany)
    }
}

export default new Companies()