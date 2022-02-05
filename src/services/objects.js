import Core from "@/services/core";

class Objects extends Core {
    getDealTemplateList(objectId) {
        return this.get(`objects/${objectId}/contract/`)
    }

    addNewContract({id, form}) {
        return this.post(`objects/${id}/contract/`, form)
    }

    makeContractPrimary({objectId,contractId}){
        return this.put(`objects/${objectId}/contract/${contractId}/primary`)
    }

    deleteContract({objectId, contractId}) {
        return this.delete(`objects/${objectId}/contract/${contractId}`)
    }
}

export default new Objects()