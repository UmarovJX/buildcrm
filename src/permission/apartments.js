import Permission from "@/permission/index";

export default class ApartmentsPermission extends Permission {
    static apartments() {
        return super.getUserPermission('apartments')
    }

    static getApartmentsPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (this.hasAdminRole()) return true
        if (splitProperty.length > 1) {
            return this.apartments()[one][two] ?? false
        } else {
            if (this.hasAdminRole()) return true
            return this.apartments()[one] ?? false
        }
    }

    static getApartmentListPermission() {
        return this.getApartmentsPermission('lists.list')
    }

    static getApartmentGridPermission() {
        return this.getApartmentsPermission('lists.grid')
    }

    static getApartmentChessPermission() {
        return this.getApartmentsPermission('lists.grid_sm')
    }

    static getApartmentPlanPermission() {
        return this.getApartmentsPermission('lists.plan')
    }


    static getApartmentViewPermission() {
        return this.getApartmentsPermission('view')
    }

    static getApartmentEditPermission() {
        return this.getApartmentsPermission('edit')
    }

    static getApartmentIsSoldPermission() {
        return this.getApartmentsPermission('is_sold')
    }


    static getApartmentFilterPermission() {
        return this.getApartmentsPermission('filter')
    }
}