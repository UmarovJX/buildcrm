class Permission {
    constructor(permission) {
        this.permission = permission
    }
}

export class ApartmentPm extends Permission {
    constructor(permission) {
        super(permission)
    }

    editPermission(){
        return this.permission.apartments.edit
    }
}


