// import Permission from "@/permission/index";
//
// export default class CheckoutPermission extends Permission {
//     static checkout() {
//         return super.getUserPermission().checkout
//     }
//
//     static getBookPermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().book ?? false
//     }
//
//     static getCheckoutPermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().checkout ?? false
//     }
//
//     static getMarkFriendPermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().mark_friends ?? false
//     }
//
//     static getMarkPricePermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().mark_price ?? false
//     }
//
//     static getEditDatePermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().edit_date ?? false
//     }
//
//     static getMonthlyPaymentPermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().monthly_payment ?? false
//     }
//
//     static getRootPermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().root ?? false
//     }
//
//     static getApartPlanPermission() {
//         if (this.hasAdminRole()) return true
//         return this.checkout().lists?.plan ?? false
//     }
//
// }


import Permission from "@/permission/index";

export default class CheckoutPermission extends Permission {
    static checkout() {
        return super.getUserPermission('checkout')
    }

    static getCheckoutPermission(property) {
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (this.hasAdminRole()) return true
        if (splitProperty.length > 1) {
            return this.checkout()[one][two] ?? false
        } else {
            return this.checkout()[one] ?? false
        }

    }

}