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
        const splitProperty = property.split('.')
        const [one, two] = splitProperty
        if (splitProperty.length > 1) {
            return this.permission[one][two] ?? false
        } else {
            return this.permission[one] ?? false
        }
    }

    static hasAdminRole() {
        if (this.user)
            return this.user.role.id === 1
        return false
    }
}
