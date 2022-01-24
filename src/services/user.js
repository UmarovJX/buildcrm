import Core from "@/services/core";

class User extends Core {
    getUserData(){
        return this.get('/oauth/me')
    }
}

export default new User()