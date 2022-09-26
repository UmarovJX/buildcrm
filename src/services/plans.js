import {axiosV1CRM} from '@/services/core/base'
import Core from '@/services/core/index'

class Plans extends Core {
    constructor(axios = axiosV1CRM) {
        super(axios);
    }

    deletePlanWhenHasApartment(objectId, planId) {
        return this.delete(`objects/${objectId}/plans/${planId}`)
    }

    deletePlan(objectId, planId) {
        return this.delete(`objects/${objectId}/plans/${planId}`)
    }

    deletePlanImage(objectId, planId, imageId) {
        return this.delete(`objects/${objectId}/plans/${planId}/images/${imageId}`)
    }

    updatePositionImage(objectId, planId, body) {
        return this.put(`objects/${objectId}/plans/${planId}/images`, body)
    }

    changePlan(objectId, planId, body) {
        return this.post(`objects/${objectId}/plans/${planId}`, body)
    }

    updatePlan(objectId, planId, body) {
        return this.put(`objects/${objectId}/plans/${planId}`, body)
    }

}

export default Plans