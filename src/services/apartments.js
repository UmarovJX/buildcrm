import Core from "@/services/core";

class Apartments extends Core {
    isAvailableToSold(id,apartment_uuid) {
        return this.put(`/objects/${id}/apartments/${apartment_uuid}/is-sold`)
    }
}

export default new Apartments()