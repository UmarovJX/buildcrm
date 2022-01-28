import Core from "@/services/core";

class Branches extends Core {
    getBranchesList() {
        return this.get('/branches')
    }

    addNewBranch(body) {
        return this.post('/branches', body)
    }

    editBranch(id, body) {
        return this.put(`/branches/${id}`, body)
    }

    deleteBranch(id) {
        return this.delete(`/branches/${id}`)
    }
}

export default new Branches()