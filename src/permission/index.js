import { hasOwnProperty } from "@/util/object";
import { joinRolesRows } from "@/views/roles/data/_index.data";

export default class Permission {
  static permission = null;
  static user = null;

  static initializeUser(user = null) {
    if (this.user === null) {
      this.user = user;
      const { form } = joinRolesRows("");
      this.permission = {
        ...form,
        ...JSON.parse(user.role['permission_list']),
      };

      console.log('permission',this.permission)
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

  static isMainManager() {
    if (this.user) return this.user.role.id === 19;
    return false;
  }
}
