import Permission from '@/permission/index'

export default class ObjectsPermission extends Permission {
  static objects() {
    return super.getUserPermission('objects')
  }

  static getObjectsPermission(property) {
    const splitProperty = property.split('.')
    const [one, two] = splitProperty
    if (this.hasAdminRole()) return true
    if (splitProperty.length > 1) {
      return this.objects()[one][two] ?? false
    }
    return this.objects()[one] ?? false
  }
}
