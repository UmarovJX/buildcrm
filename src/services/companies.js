import Core from "@/services/core";

class Companies extends Core {
    getCompaniesList() {
        return this.get('/companies')
    }

    getCompanyType(){
        return this.get('companies/types')
    }

    createNewCompany(newCompany){
        return this.post('companies',newCompany)
    }
}

export default new Companies()