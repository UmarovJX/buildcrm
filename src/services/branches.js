import { axiosV1CRM } from '@/services/core/base'
import Core from '@/services/core/index'

class Branches extends Core {
  constructor(axios = axiosV1CRM) {
    super(axios)
  }

  getBranchesList() {
    return this.get('branches')
  }

  getDeletedBranchesList() {
    return this.get('branches/trashed')
  }

  addNewBranch(body) {
    return this.post('branches', body)
  }

  editBranch(id, body) {
    return this.put(`branches/${id}`, body)
  }

  deleteBranch(id) {
    return this.delete(`branches/${id}`)
  }
}

export default Branches
