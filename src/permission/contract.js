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
      return this.contracts()[one][two][three] ?? false
    }
    if (splitProperty.length === 2) {
      return this.contracts()[one][two] ?? false
    }
    return this.contracts()[one] ?? false
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
    return this.getContractsPermission('payments.list')
  }

  static getContractsPaymentsImportPermission() {
    return this.getContractsPermission('payments.import')
  }

  static getContractsInitialCreatePermission() {
    return this.getContractsPermission('payments.initial_type.create')
  }

  static getContractsInitialEditPermission() {
    return this.getContractsPermission('payments.initial_type.edit')
  }

  static getContractsInitialDeletePermission() {
    return this.getContractsPermission('payments.initial_type.delete')
  }

  static getContractsMonthlyCreatePermission() {
    return this.getContractsPermission('payments.monthly_type.create')
  }

  static getContractsMonthlyEditPermission() {
    return this.getContractsPermission('payments.monthly_type.edit')
  }

  static getContractsMonthlyDeletePermission() {
    return this.getContractsPermission('payments.monthly_type.delete')
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
