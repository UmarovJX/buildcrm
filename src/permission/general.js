
import Permission from "@/permission/index";

export default class GeneralPermission extends Permission {
    static general() {
        return super.getUserPermission('general')
    }

    static getGeneralPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (splitProperty.length > 1) {
            if (this.hasAdminRole()) return true
            return this.general()[one][two] ?? false
        } else {
            if (this.hasAdminRole()) return true
            return this.general()[one] ?? false
        }

    }

}