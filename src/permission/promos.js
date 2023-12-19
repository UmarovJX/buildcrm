import Permission from '@/permission/index'

export default class PromosPermission extends Permission {
  static promos() {
    return super.getUserPermission('promos')
  }

  static getPromosPermission(property) {
    const splitProperty = property.split('.')
    const [one, two] = splitProperty
    if (this.hasAdminRole()) return true
    if (splitProperty.length > 1) {
      return this.promos()[one][two] ?? false
    }
    return this.promos()[one] ?? false
  }

  static getPromosCreatePermission() {
    return this.getPromosPermission('create')
  }

  static getPromosViewPermission() {
    return this.getPromosPermission('view')
  }

  static getPromosEditPermission() {
    return this.getPromosPermission('edit')
  }

  static getPromosDeletePermission() {
    return this.getPromosPermission('delete')
  }
}
