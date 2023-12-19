import Permission from '@/permission/index'
import { hasOwnProperty } from '@/util/object'
import { isBoolean } from '@/util/inspect'

export default class SettingsPermission extends Permission {
  static getValues() {
    return super.getUserPermission('settings')
  }

  static getPermission(property) {
    if (this.hasAdminRole()) {
      return true
    }

    const splitProperty = property.split('.')
    const [one, two, three] = splitProperty
    const values = this.getValues()

    if (isBoolean(values) && !values) {
      return false
    }

    if (splitProperty.length > 2) {
      if (
        hasOwnProperty(values, one)
        && hasOwnProperty(values[one], two)
        && hasOwnProperty(values[one][two], three)
      ) {
        return this.getValues()[one][two][three]
      }
    } else if (splitProperty.length > 1) {
      if (hasOwnProperty(values, one) && hasOwnProperty(values[one], two)) {
        return values[one][two]
      }
    } else if (hasOwnProperty(values, one)) {
      return values[one]
    }

    return false
  }

  static create() {
    return this.getPermission('create')
  }

  static view() {
    return this.getPermission('view')
  }

  static edit() {
    return this.getPermission('edit')
  }

  static delete() {
    return this.getPermission('delete')
  }
}
