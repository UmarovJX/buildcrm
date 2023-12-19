import Permission from '@/permission/index'

export default class PaymentAccount extends Permission {
  static paymentAccount() {
    return super.getUserPermission('payment_account')
  }

  static getPaymentAccountPermission(property) {
    const splitProperty = property.split('.')
    const [one, two] = splitProperty
    if (this.hasAdminRole()) return true
    if (splitProperty.length > 1) {
      return this.paymentAccount()[one][two] ?? false
    }
    return this.paymentAccount()[one] ?? false
  }

  static getPaymentAccountCreatePermission() {
    return this.getPaymentAccountPermission('create')
  }

  static getPaymentAccountViewPermission() {
    return this.getPaymentAccountPermission('view')
  }

  static getPaymentAccountEditPermission() {
    return this.getPaymentAccountPermission('edit')
  }

  static getPaymentAccountDeletePermission() {
    return this.getPaymentAccountPermission('delete')
  }
}
