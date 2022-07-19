import Permission from "@/permission/index";

export default class ObjectsPermission extends Permission {
    static objects() {
        return super.getUserPermission('objects')
    }

    static getObjectsPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (splitProperty.length > 1) {
            if (this.hasAdminRole()) return true
            return this.objects()[one][two] ?? false
        } else {
            if (this.hasAdminRole()) return true
            return this.objects()[one] ?? false
        }

    }
}