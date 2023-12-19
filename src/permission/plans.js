import Permission from '@/permission/index'

export default class PlansPermission extends Permission {
  static plans() {
    return super.getUserPermission('plans')
  }

  static getPlansPermission(property) {
    const splitProperty = property.split('.')
    const [one, two] = splitProperty
    if (this.hasAdminRole()) return true
    if (splitProperty.length > 1) {
      return this.plans()[one][two] ?? false
    }
    return this.plans()[one] ?? false
  }

  static getPlansCreatePermission() {
    return this.getPlansPermission('create')
  }

  static getPlansViewPermission() {
    return this.getPlansPermission('view')
  }

  static getPlansEditPermission() {
    return this.getPlansPermission('edit')
  }

  static getPlansDeletePermission() {
    return this.getPlansPermission('delete')
  }
}
