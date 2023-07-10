import Permission from "@/permission/index";

export default class SettingsPermission extends Permission {
  static getValues() {
    return super.getUserPermission("settings");
  }

  static getPermission(property) {
    const splitProperty = property.split(".");
    const [one, two, three] = splitProperty;
    if (this.hasAdminRole()) return true;
    if (splitProperty.length > 2) {
      return this.getValues()[one][two][three] ?? false;
    } else if (splitProperty.length > 1) {
      return this.getValues()[one][two] ?? false;
    } else {
      return this.getValues()[one] ?? false;
    }
  }

  static create() {
    return this.getPermission("create");
  }

  static view() {
    return this.getPermission("view");
  }

  static edit() {
    return this.getPermission("edit");
  }

  static delete() {
    return this.getPermission("delete");
  }
}
