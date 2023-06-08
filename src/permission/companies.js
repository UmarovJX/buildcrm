import Permission from "@/permission/index";

export default class CompaniesPermission extends Permission {
  static companies() {
    return super.getUserPermission("companies");
  }

  static getCompaniesPermission(property) {
    const splitProperty = property.split(".");
    const [one, two] = splitProperty;
    if (this.hasAdminRole()) return true;
    if (splitProperty.length > 1) {
      return this.companies()[one][two] ?? false;
    } else {
      return this.companies()[one] ?? false;
    }
  }

  static getCompaniesCreatePermission() {
    return this.getCompaniesPermission("create");
  }

  static getCompaniesViewPermission() {
    const { view: paymentAccountView } =
      this.getUserPermission("payment_account");
    return paymentAccountView;
  }

  static getCompaniesEditPermission() {
    return this.getCompaniesPermission("edit");
  }

  static getCompaniesDeletePermission() {
    return this.getCompaniesPermission("delete");
  }
}
