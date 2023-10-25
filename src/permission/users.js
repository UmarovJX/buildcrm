import Permission from "@/permission/index";

export default class UsersPermission extends Permission {
  static users() {
    return super.getUserPermission("users");
  }

  static getUsersPermission(property) {
    const splitProperty = property.split(".");
    const [one, two] = splitProperty;
    if (this.hasAdminRole()) return true;
    if (splitProperty.length > 1) {
      return this.users()[one][two] ?? false;
    } else {
      return this.users()[one] ?? false;
    }
  }

  static getUsersCreatePermission() {
    return this.getUsersPermission("create");
  }

  static getUsersViewPermission() {
    return this.getUsersPermission("view");
  }

  static getUsersEditPermission() {
    return this.getUsersPermission("edit");
  }

  static getUsersDeletePermission() {
    return this.getUsersPermission("delete");
  }
  static getUsersUnblockPermission() {
    return this.getUsersPermission("unblock");
  }
}
