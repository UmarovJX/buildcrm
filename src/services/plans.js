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

    changePlan(objectId, planId, body) {
        return this.put(`objects/${objectId}/plans/${planId}`, body)
    }
}

export default Plans