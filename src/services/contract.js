import Core from "@/services/core";

class Companies extends Core {
    downloadContract(id) {
        return this.get( '/orders/' + id + '/contract')
    }

    fetchContract(id){
        return this.get(`orders/${id}`)
    }
}

export default new Companies()