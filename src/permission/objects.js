// import Permission from "@/permission/index";
//
// export default class ObjectsPermission extends Permission {
//     static objects() {
//         return super.getUserPermission().objects
//     }
//
//     static getObjectViewPermission() {
//         if (this.hasAdminRole()) return true
//         return this.objects().view ?? false
//     }
//
//     static getObjectEditPermission() {
//         if (this.hasAdminRole()) return true
//         return this.objects().edit ?? false
//     }
//
//     static getObjectCreatePermission() {
//         if (this.hasAdminRole()) return true
//         return this.objects().create ?? false
//     }
//
//     static getObjectDeletePermission() {
//         if (this.hasAdminRole()) return true
//         return this.objects().delete ?? false
//     }
//
//     static getObjectUploadLogoPermission() {
//         if (this.hasAdminRole()) return true
//         return this.objects().upload_logo ?? false
//     }
// }


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