import Core from "@/services/core";

class Plans extends Core {
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

export default new Plans()