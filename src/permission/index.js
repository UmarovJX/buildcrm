export default class Permission {
    static permission = null
    static user = null

    static initializeUser(user = null) {
        if (this.user === null) {
            this.user = user
            this.permission = user.role.permission
        }
        return this.user
    }

    static getUserPermission() {
        return this.permission
    }

    static hasAdminRole() {
        return this.user.role.id === 1
    }
}

