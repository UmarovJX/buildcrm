import Permission from '@/permission/index'

export default class CheckoutPermission extends Permission {
  static checkout() {
    return super.getUserPermission('checkout')
  }

  static getCheckoutPermission(property) {
    const splitProperty = property.split('.')
    const [one, two] = splitProperty
    if (this.hasAdminRole()) return true
    if (splitProperty.length > 1) {
      return this.checkout()[one][two] ?? false
    }
    return this.checkout()[one] ?? false
  }

  static getBookPermission() {
    return this.getCheckoutPermission('book')
  }

  static getCheckoutCheckPermission() {
    return this.getCheckoutPermission('checkout')
  }

  static getMarkFriendPermission() {
    return this.getCheckoutPermission('mark_friends')
  }

  static getMarkPricePermission() {
    return this.getCheckoutPermission('mark_price')
  }

  static getEditDatePermission() {
    return this.getCheckoutPermission('edit_date')
  }

  static getMonthlyPaymentPermission() {
    return this.getCheckoutPermission('monthly_payment')
  }

  static getRootPermission() {
    return this.getCheckoutPermission('root')
  }
}
