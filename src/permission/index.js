export default class Permission {
    static permission = null
    static user = null

    static initializeUser(user = null) {
        if (this.user === null) {
            this.userId = user.role.id
            this.permission = user.role.permissions
        }
        return this.user
    }

    static getUserPermission() {
        console.log(this.permission, 'this.permisson');
        return this.permission
    }

    static hasAdminRole() {
        return this.userId === 1
    }
}

