import Permission from "@/permission/index";

export default class BranchesPermission extends Permission {
    static branches() {
        return super.getUserPermission('branches')
    }

    static getBranchesPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (this.hasAdminRole()) return true
        if (splitProperty.length > 1) {
            return this.branches()[one][two] ?? false
        } else {
            return this.branches()[one] ?? false
        }
    }

    static getBranchesCreatePermission() {
        return this.getBranchesPermission('create')
    }

    static getBranchesViewPermission() {
        return this.getBranchesPermission('view')
    }

    static getBranchesEditPermission() {
        return this.getBranchesPermission('edit')
    }

    static getBranchesDeletePermission() {
        return this.getBranchesPermission('delete')
    }
}
