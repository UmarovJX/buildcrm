import Permission from "@/permission/index";

export default class ObjectsPermission extends Permission {
    static objects() {
        return super.getUserPermission().objects
    }

    static getObjectViewPermission() {
        if (this.hasAdminRole()) return true
        return this.objects().view ?? false
    }
}