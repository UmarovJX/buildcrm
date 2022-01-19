import Core from "@/services/core";

class Home extends Core {
    getHomeInfo() {
        return this.get('home')
    }
}

export default new Home()