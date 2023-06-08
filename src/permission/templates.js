import BranchesPermission from "@/permission/branches";

export default class TemplatesPermission extends BranchesPermission {
  static templates() {
    return super.branches().templates;
  }

  static getTemplatesPermission(property) {
    const splitProperty = property.split(".");
    const [one, two] = splitProperty;
    if (this.hasAdminRole()) return true;
    if (splitProperty.length > 1) {
      return this.templates()[one][two] ?? false;
    } else {
      return this.templates()[one] ?? false;
    }
  }

  static getTemplatesCreatePermission() {
    return this.getTemplatesPermission("create");
  }

  static getTemplatesViewPermission() {
    return this.getTemplatesPermission("view");
  }

  static getTemplatesEditPermission() {
    return this.getTemplatesPermission("edit");
  }

  static getTemplatesDeletePermission() {
    return this.getTemplatesPermission("delete");
  }

  static getInstructionViewPermission() {
    return this.getTemplatesPermission("instruction");
  }

  static getTemplatesDownloadPermission() {
    return this.getTemplatesPermission("download");
  }

  static getTemplatesPrimaryPermission() {
    return this.getTemplatesPermission("is_primary");
  }
}
