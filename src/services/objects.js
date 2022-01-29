import Core from "@/services/core";

class Objects extends Core {
    getDealTemplateList(objectId) {
        return this.get(`objects/${objectId}/contract/`)
    }

    addNewContract({id, form}) {
        return this.post(`objects/${id}/contract/`, form)
    }
}

export default new Objects()