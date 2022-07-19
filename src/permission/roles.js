import Permission from "@/permission/index";

export default class RolesPermission extends Permission {
    static roles() {
        return super.getUserPermission('roles')
    }

    static getRolesPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (this.hasAdminRole()) return true
        if (splitProperty.length > 1) {
            return this.roles()[one][two] ?? false
        } else {
            return this.roles()[one] ?? false
        }
    }

    static getRolesCreatePermission() {
        return this.getRolesPermission('create')
    }

    static getRolesViewPermission() {
        return this.getRolesPermission('view')
    }

    static getRolesEditPermission() {
        return this.getRolesPermission('edit')
    }

    static getRolesDeletePermission() {
        return this.getRolesPermission('delete')
    }
}