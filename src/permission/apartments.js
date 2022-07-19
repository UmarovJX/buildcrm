// import Permission from "@/permission/index";
//
// export default class ApartmentsPermission extends Permission {
//     static apartments() {
//         return super.getUserPermission().apartments
//     }
//
//     static getApartViewPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().view ?? false
//     }
//
//     static getApartFilterPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().filter ?? false
//     }
//
//     static getApartEditPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().is_sold ?? false
//     }
//
//     static getApartSoldPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().is_sold ?? false
//     }
//
//     static getApartListPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().lists?.list ?? false
//     }
//
//     static getApartGridPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().lists?.grid ?? false
//     }
//
//     static getApartChessPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().lists?.grid_sm ?? false
//     }
//
//     static getApartPlanPermission() {
//         if (this.hasAdminRole()) return true
//         return this.apartments().lists?.plan ?? false
//     }
//
// }


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

}