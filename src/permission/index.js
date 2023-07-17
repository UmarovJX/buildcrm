import { hasOwnProperty } from "@/util/object";

export default class Permission {
  static permission = null;
  static user = null;

  static initializeUser(user = null) {
    if (this.user === null) {
      this.user = user;
      this.permission = user.role.permissions;
    }
    return this.user;
  }

  static clearUserPermission() {
    this.user = null;
    this.permission = null;
  }

  static getUserPermission(property) {
    if (this.hasAdminRole()) {
      return true;
    }

    const splitProperty = property.split(".");
    const [one, two] = splitProperty;
    if (splitProperty.length > 1) {
      if (
        hasOwnProperty(this.permission, one) &&
        hasOwnProperty(this.permission[one], two)
      ) {
        return this.permission[one][two];
      }
    } else {
      if (hasOwnProperty(this.permission, one)) {
        return this.permission[one];
      }
    }

    return false;
  }

  static hasAdminRole() {
    if (this.user) return this.user.role.id === 1;
    return false;
  }
}
