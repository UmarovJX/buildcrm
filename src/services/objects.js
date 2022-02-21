import Core from "@/services/core";

class Objects extends Core {
    getDealTemplateList(objectId) {
        return this.get(`objects/${objectId}/contract/`)
    }

    addNewContract({id, form}) {
        return this.post(`objects/${id}/contract/`, form)
    }

    makeContractPrimary({objectId, contractId}) {
        return this.put(`objects/${objectId}/contract/${contractId}/primary`)
    }

    deleteContract({objectId, contractId}) {
        return this.delete(`objects/${objectId}/contract/${contractId}`)
    }

    fetchObjectPromos(objectId) {
        return this.get(`objects/${objectId}/promo`)
    }

    deleteObjectPromo({objectId, uuId}) {
        return this.delete(`objects/${objectId}/promo/${uuId}`)
    }

    fetchObjectBlocks(objectId) {
        return this.get(`objects/${objectId}/blocks`)
    }

    fetchObjectBlockByType({objectId, blockId, type}) {
        return this.get(`objects/${objectId}/blocks/${blockId}/${type}s`)
    }

    createObjectPromo({id, form}) {
        return this.post(`objects/${id}/promo`, form)
    }

    updateObjectPromo({id, promoId, form}) {
        return this.put(`objects/${id}/promo/${promoId}`, form)
    }

    changeObjectPromoActivation({objectId, promoId, type}) {
        return this.put(`objects/${objectId}/promo/${promoId}/${type}`)
    }
}

export default new Objects()