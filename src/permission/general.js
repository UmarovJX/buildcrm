import Permission from '@/permission/index'

export default class GeneralPermission extends Permission {
  static general() {
    return super.getUserPermission('general')
  }

  static getGeneralPermission(property) {
    const splitProperty = property.split('.')
    const [one, two] = splitProperty
    if (this.hasAdminRole()) return true
    if (splitProperty.length > 1) {
      return this.general()[one][two] ?? false
    }
    return this.general()[one] ?? false
  }

  static getCurrencyPermission() {
    return this.getGeneralPermission('currency')
  }

  static getThemePermission() {
    return this.getGeneralPermission('theme')
  }

  static getLanguagePermission() {
    return this.getGeneralPermission('language')
  }

  static getSettingsPermission() {
    return this.getGeneralPermission('settings')
  }

  static getPasswordSettingsPermission() {
    return this.getGeneralPermission('password_settings')
  }

  static getProfileSettingsPermission() {
    return this.getGeneralPermission('profile_settings')
  }
}
