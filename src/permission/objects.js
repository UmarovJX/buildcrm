import Permission from "@/permission/index";

export default class ObjectsPermission extends Permission {
    static objects() {
        console.log(super.getUserPermission(), 'super.getUserPermission()');
        return super.getUserPermission()?.objects
    }

    static getObjectViewPermission() {
        // if (this.hasAdminRole()) return true
        console.log(this.objects()?.view, 'this.objects()?.view');
        return this.objects()?.view
    }

    static getObjectEditPermission() {
        if (this.hasAdminRole()) return true
        return this.objects().edit
    }

    static getObjectDeletePermission() {
        if (this.hasAdminRole()) return true
        return this.objects().delete
    }

}