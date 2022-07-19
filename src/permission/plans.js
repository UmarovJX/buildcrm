import Permission from "@/permission/index";

export default class Plans extends Permission {
    static plans() {
        return super.getUserPermission('plans')
    }

    static getPromosPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (splitProperty.length > 1) {
            if (this.hasAdminRole()) return true
            return this.plans()[one][two] ?? false
        } else {
            if (this.hasAdminRole()) return true
            return this.plans()[one] ?? false
        }

    }

    static getPlansCreatePermission(){
        return this.getPromosPermission('create')
    }

    static getPlansViewPermission() {
        return this.getPromosPermission('view')
    }

    static getPlansEditPermission(){
        return this.getPromosPermission('edit')
    }

    static getPlansDeletePermission(){
        return this.getPromosPermission('delete')
    }
}