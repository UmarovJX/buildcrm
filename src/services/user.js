import Core from "@/services/core";

class User extends Core {
    getUserData() {
        return this.get('/oauth/me')
    }

    updateUserAvatar(data,config) {
        return this.post('users/me', data,config)
    }

    updateUserPassword(data){
        return this.put('users/me',data)
    }
}

export default new User()