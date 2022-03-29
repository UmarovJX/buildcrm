import {axiosV2} from '@/services/core/base'
import Core from '@/services/core/index'

class Promo extends Core {
    constructor(axios = axiosV2) {
        super(axios)
    }

    fetchPromoList(id) {
        return this.get(`promo/objects/${id}/promo`)
    }

    fetchObjectBlocks(objectId) {
        return this.get(`promo/objects/${objectId}/blocks`)
    }

    createObjectPromo({id, form}) {
        return this.post(`promo/objects/${id}/promo`, form)
    }

    updateObjectPromo({id, promoId, form}) {
        return this.put(`promo/objects/${id}/promo/${promoId}`, form)
    }

    fetchApartments({objectID, blockID, apartmentNumber}) {
        return this.get(`promo/objects/${objectID}/blocks/${blockID}/apartments/${apartmentNumber}`)
    }

    fetchPlans(objectID, blockID, apartmentNumber) {
        return this.get(`promo/objects/${objectID}/blocks/${blockID}/plans/${apartmentNumber}`)
    }
}

class PromoV2 extends Core {
    constructor(axios = axiosV2) {
        super(axios)
    }

    promoCreate(objectID, body) {
        return this.post(`promo/objects/${objectID}/promo`, body)
    }

    promoUpdate(objectID, promoID, body) {
        return this.put(`promo/objects/${objectID}/promo/${promoID}`, body)
    }

    promoEditContext(objectID, promoId) {
        return this.get(`promo/objects/${objectID}/promo/${promoId}`)
    }

    promoDelete(objectID, promoId) {
        return this.delete(`promo/objects/${objectID}/promo/${promoId}`)
    }

    promoActivate(objectID, promoId) {
        return this.put(`promo/objects/${objectID}/promo/${promoId}/enable`)
    }

    promoDeactivate(objectID, promoId) {
        return this.put(`promo/objects/${objectID}/promo/${promoId}/disable`)
    }
}

export default {
    Promo,
    PromoV2
}
