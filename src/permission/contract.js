import Permission from '@/permission/index'

export default class ContractsPermission extends Permission {
  static contracts() {
    return super.getUserPermission('contracts')
  }

  static getContractsPermission(property) {
    const splitProperty = property.split('.')
    const [one, two, three] = splitProperty
    if (this.hasAdminRole()) return true

    if (splitProperty.length === 3) {
      if (
        this.contracts().hasOwnProperty(one)
          && this.contracts()[one].hasOwnProperty(two)
          && this.contracts()[one][two].hasOwnProperty(three)
      ) {
        return this.contracts()[one][two][three]
      }
      return false
    }
    if (splitProperty.length === 2) {
      if (
        this.contracts().hasOwnProperty(one)
          && this.contracts()[one].hasOwnProperty(two)
      ) {
        return this.contracts()[one][two]
      }
      return false
    }

    if (this.contracts().hasOwnProperty(one)) {
      return this.contracts()[one]
    }

    return false
  }

  static getContractsFilterPermission() {
    return this.getContractsPermission('filter')
  }

  static getContractsDownloadPermission() {
    return this.getContractsPermission('download')
  }

  static getContractsCancelPermission() {
    return this.getContractsPermission('cancel')
  }

  static getContractsClientTypePermission() {
    return this.getContractsPermission('client_type')
  }

  static getContractsRootPermission() {
    return this.getContractsPermission('root')
  }

  static getContractsReissueViewPermission() {
    return this.getContractsPermission('reissue.view')
  }

  static getContractsReissueCreatePermission() {
    return this.getContractsPermission('reissue.create')
  }

  static getContractsUniformityPermission() {
    return this.getContractsPermission('uniformity')
  }

  static getContractsCommentsPermission() {
    return this.getContractsPermission('comments')
  }

  static getContractsEditPermission() {
    return this.getContractsPermission('edit')
  }

  static getContractsPaymentsCreatePermission() {
    return this.getContractsPermission('payments.create')
  }

  static getContractsPaymentsListPermission() {
    return this.getContractsPermission('payments.view')
  }

  static getContractsPaymentsImportPermission() {
    return this.getContractsPermission('payments.import')
  }

  static getContractsInitialCreatePermission() {
    return this.getContractsPermission('payments.create')
  }

  static getContractsInitialEditPermission() {
    return this.getContractsPermission('payments.edit')
  }

  static getContractsInitialDeletePermission() {
    return this.getContractsPermission('payments.delete')
  }

  static getContractsMonthlyCreatePermission() {
    return this.getContractsPermission('payments.create')
  }

  static getContractsMonthlyEditPermission() {
    return this.getContractsPermission('payments.edit')
  }

  static getContractsMonthlyDeletePermission() {
    return this.getContractsPermission('payments.delete')
  }

  static getContractsViewCommentPermission() {
    return this.getContractsPermission('comments.view')
  }

  static getContractsCreateCommentPermission() {
    return this.getContractsPermission('comments.create')
  }

  static getContractsEditCommentPermission() {
    return this.getContractsPermission('comments.edit')
  }

  static getContractsDeleteCommentPermission() {
    return this.getContractsPermission('comments.delete')
  }
}
