import Core from "@/services/core";

class Companies extends Core {
    downloadContract(id) {
        return this.get( '/orders/' + id + '/contract')
    }
}

export default new Companies()