import Permission from "@/permission/index";

export default class Promos extends Permission {
    static promos() {
        return super.getUserPermission('promos')
    }

    static getPromosPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (splitProperty.length > 1) {
            if (this.hasAdminRole()) return true
            return this.promos()[one][two] ?? false
        } else {
            if (this.hasAdminRole()) return true
            return this.promos()[one] ?? false
        }

    }

    static getPromosCreatePermission(){
        return this.getPromosPermission('create')
    }

    static getPromosViewPermission() {
        return this.getPromosPermission('view')
    }

    static getPromosEditPermission(){
        return this.getPromosPermission('edit')
    }

    static getPromosDeletePermission(){
        return this.getPromosPermission('delete')
    }
}