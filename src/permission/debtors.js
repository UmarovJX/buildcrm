import Permission from "@/permission/index";

export default class DebtorsPermission extends Permission {
    static debtors() {
        return super.getUserPermission('debtors')
    }

    static getDebtorsPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (this.hasAdminRole()) return true
        if (splitProperty.length > 1) {
            return this.debtors()[one][two] ?? false
        } else {
            return this.debtors()[one] ?? false
        }
    }

    static getDebtorsViewPermission() {
        return this.getDebtorsPermission('view')
    }
}