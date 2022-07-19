export default class Permission {
    static permission = null
    static user = null

    static initializeUser(user = null) {
        if (this.user === null) {
            this.user = user
            this.permission = user.role.permissions
        }
        return this.user
    }

    static getUserPermission(property) {
        return this.permission[property]
    }

    static hasAdminRole() {
        return this.user.role.id === 1
    }
}
